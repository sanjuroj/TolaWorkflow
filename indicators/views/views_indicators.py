import json
import logging
import re
from datetime import datetime, timedelta
from urlparse import urlparse

import dateparser
import requests
from dateutil.relativedelta import relativedelta
from django.contrib import messages
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse_lazy
from django.db import connection
from django.db.models import (
    Count, Min, Q, Sum, Avg, Max
)
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, render_to_response, get_object_or_404, redirect, reverse
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.translation import gettext as _
from django.views.generic import TemplateView
from django.views.generic.detail import View
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from django.views.generic.list import ListView
from weasyprint import HTML, CSS

from feed.serializers import FlatJsonSerializer
from util import getCountry, group_excluded, get_table

from indicators.serializers import IndicatorSerializer, ProgramSerializer
from workflow.mixins import AjaxableResponseMixin
from workflow.models import (
    Program, Sector, TolaSites, FormGuidance
)
from ..export import IndicatorResource, ResultResource
from ..forms import IndicatorForm, ResultForm
from ..models import (
    Indicator, PeriodicTarget, DisaggregationLabel, DisaggregationValue,
    Result, IndicatorType, Level, ExternalServiceRecord,
    ExternalService, TolaTable, PinnedReport
)
from indicators.queries import ProgramWithMetrics, ResultsIndicator
from .views_reports import IPTT_ReportView
import indicators.indicator_plan as ip

logger = logging.getLogger(__name__)


def generate_periodic_target_single(tf, start_date, nthTargetPeriod, event_name='', num_existing_targets=0):
    i = nthTargetPeriod
    j = i + 1
    target_period = ''
    period_num = num_existing_targets
    if period_num == 0:
        period_num = j

    if tf == Indicator.LOP:
        return {'period': PeriodicTarget.LOP_PERIOD, 'period_name': PeriodicTarget.generate_lop_period_name()}
    elif tf == Indicator.MID_END:
        return [{'period': PeriodicTarget.MIDLINE, 'period_name': PeriodicTarget.generate_midline_period_name()},
                {'period': PeriodicTarget.ENDLINE, 'period_name': PeriodicTarget.generate_endline_period_name()}]
    elif tf == Indicator.EVENT:
        if i == 0:
            return {'period': event_name, 'period_name': PeriodicTarget.generate_event_period_name(event_name)}
        else:
            return {'period': ''}

    if tf == Indicator.ANNUAL:
        start = ((start_date + relativedelta(years=+i)).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(years=+j)) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.ANNUAL_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end, 'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.SEMI_ANNUAL:
        start = ((start_date + relativedelta(months=+(i * 6))).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+(j * 6))) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.SEMI_ANNUAL_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end, 'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.TRI_ANNUAL:
        start = ((start_date + relativedelta(months=+(i * 4))).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+(j * 4))) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.TRI_ANNUAL_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end, 'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.QUARTERLY:
        start = ((start_date + relativedelta(months=+(i * 3))).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+(j * 3))) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        period_label = '{period} {period_num}'.format(
            period=PeriodicTarget.QUARTERLY_PERIOD, period_num=period_num
        )
        target_period = {'period': period_label, 'start_date': start, 'end_date': end, 'period_name': PeriodicTarget.generate_annual_quarterly_period_name(tf, period_num)}

    elif tf == Indicator.MONTHLY:
        target_period_start_date = start_date + relativedelta(months=+i)
        name = PeriodicTarget.generate_monthly_period_name(target_period_start_date)

        start = ((start_date + relativedelta(months=+i)).replace(day=1)).strftime('%Y-%m-%d')
        end = ((start_date + relativedelta(months=+j)) + relativedelta(days=-1)).strftime('%Y-%m-%d')
        target_period = {'period': name, 'start_date': start, 'end_date': end, 'period_name': name}

    return target_period


def generate_periodic_targets(tf, start_date, numTargets, event_name='', num_existing_targets=0):
    gentargets = []

    if tf == Indicator.LOP or tf == Indicator.MID_END:
        target_period = generate_periodic_target_single(tf, start_date, numTargets)
        return target_period

    for i in range(numTargets):
        num_existing_targets += 1
        target_period = generate_periodic_target_single(tf, start_date, i, event_name, num_existing_targets)

        gentargets.append(target_period)
    return gentargets


def import_indicator(service=1):
    """
    Imports an indicator from a web service (the dig only for now)
    """
    service = ExternalService.objects.get(id=service)

    try:
        response = requests.get(service.feed_url)
    except requests.exceptions.RequestException as e:
        logger.exception('Error reaching DIG service')
        return []

    return response.json()


def indicator_create(request, id=0):
    """
    Step one in Indicator creation.
    Passed on to IndicatorCreate to do the creation [or  not]
    """
    get_indicator_types = IndicatorType.objects.all()
    program = Program.objects.get(pk=id)
    countries = ', '.join(program.country.all().order_by('country').values_list('country', flat=True))
    get_services = ExternalService.objects.all()

    if request.method == 'POST':
        indicator_type = IndicatorType.objects.get(indicator_type="custom")
        program = Program.objects.get(id=request.POST['program'])
        service = request.POST['services']
        level = None
        node_id = request.POST.get('service_indicator')
        sector = None
        # add a temp name for custom indicators
        name = request.POST.get('name', _("Temporary"))
        source = None
        definition = None
        external_service_record = None

        # check for service indicator and update based on values
        if node_id is not None and node_id != "" and int(node_id) != 0:
            get_imported_indicators = import_indicator(service)
            for item in get_imported_indicators:
                if item['nid'] == node_id:
                    sector, created = Sector.objects.get_or_create(sector=item['sector']) if item['sector'] is not None else (None, False)
                    level, created = Level.objects.get_or_create(name=item['level'].title()) if item['level'] is not None else (None, False)
                    name = item['title']
                    source = item['source']
                    definition = item['definition']
                    # replace HTML tags if they are in the string
                    definition = re.sub("<.*?>", "", definition)
                    getService = ExternalService.objects.get(id=service)
                    full_url = getService.url + "/" + item['nid']
                    external_service_record = ExternalServiceRecord(
                        record_id=item['nid'], external_service=getService, full_url=full_url
                    )
                    external_service_record.save()
                    indicator_type, created = IndicatorType.objects.get_or_create(indicator_type=item['type'].title())
        # save form
        new_indicator = Indicator(
            sector=sector, name=name, source=source, definition=definition,
            external_service_record=external_service_record,
            program=program,
            level=level
        )
        new_indicator.save()
        new_indicator.indicator_type.add(indicator_type)

        latest = new_indicator.id

        # redirect to update page
        messages.success(request, _('Success, Basic Indicator Created!'))
        redirect_url = reverse_lazy('indicator_update', kwargs={'pk': latest})
        return HttpResponseRedirect(redirect_url)

    # send the keys and vars from the json data to the template along with
    # submitted feed info and silos for new form
    return render(request, "indicators/indicator_create.html",
                  {'country': countries, 'program': program,
                   'getIndicatorTypes': get_indicator_types,
                   'getServices': get_services})


class IndicatorCreate(CreateView):
    """
    Indicator Form not using a template or service indicator first as well as
    the post reciever for creating an indicator.
    Then redirect back to edit view in IndicatorUpdate.
    """

    # DELETE THIS CLASS?  UNUSED? #

    model = Indicator
    template_name = 'indicators/indicator_form.html'
    form_class = IndicatorForm

    # pre-populate parts of the form
    def get_initial(self):
        # user_profile = TolaUser.objects.get(user=self.request.user)
        initial = {
            'program': self.kwargs['id'],
            'unit_of_measure_type': 1
        }
        return initial

    def get_context_data(self, **kwargs):
        context = super(IndicatorCreate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['id']})
        return context

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(IndicatorCreate, self).dispatch(request, *args, **kwargs)

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(IndicatorCreate, self).get_form_kwargs()
        kwargs['request'] = self.request
        program = Indicator.objects.all().filter(id=self.kwargs['pk']) \
            .values("program__id")
        kwargs['program'] = program
        return kwargs

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)

        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, _('Success, Indicator Created!'))
        form = ""
        return self.render_to_response(self.get_context_data(form=form))


class PeriodicTargetView(View):
    """
    This view generates periodic targets or deleting them (via POST)
    """
    model = PeriodicTarget

    def get(self, request, *args, **kwargs):
        indicator = Indicator.objects.get(
            pk=self.kwargs.get('indicator', None))

        if request.GET.get('existingTargetsOnly'):
            pts = FlatJsonSerializer().serialize(
                indicator.periodictargets.all()
                .order_by('customsort', 'create_date', 'period'))

            return HttpResponse(pts)
        try:
            numTargets = int(request.GET.get('numTargets', None))
        except Exception:
            numTargets = PeriodicTarget.objects.filter(
                indicator=indicator).count() + 1

        pt_generated = generate_periodic_target_single(
            indicator.target_frequency, indicator.target_frequency_start,
            (numTargets - 1), ''
        )

        pt_generated_json = json.dumps(pt_generated, cls=DjangoJSONEncoder)
        return HttpResponse(pt_generated_json)

    def post(self, request, *args, **kwargs):
        indicator = Indicator.objects.get(
            pk=self.kwargs.get('indicator', None))

        deleteall = self.kwargs.get('deleteall', None)
        if deleteall == 'true':
            periodic_targets = PeriodicTarget.objects.filter(
                indicator=indicator)

            for pt in periodic_targets:
                pt.result_set.all().update(periodic_target=None)
                pt.delete()
            indicator.target_frequency = None
            indicator.target_frequency_num_periods = 1
            indicator.target_frequency_start = None
            indicator.target_frequency_custom = None
            indicator.save()
        return HttpResponse('{"status": "success", \
                            "message": "Request processed successfully!"}')


def handleDataCollectedRecords(indicatr, lop, existing_target_frequency,
                               new_target_frequency, generated_pt_ids=[]):
    """
    If the target_frequency is changed from LOP to something else then
    disassociate all results from the LOP periodic_target and then
    delete the LOP periodic_target
    if existing_target_frequency == Indicator.LOP
    and new_target_frequency != Indicator.LOP:
    """
    if existing_target_frequency != new_target_frequency:
        Result.objects.filter(indicator=indicatr) \
            .update(periodic_target=None)

        PeriodicTarget.objects.filter(indicator=indicatr).delete()

    # If the user sets target_frequency to LOP then create a LOP
    # periodic_target and associate all results for this indicator with
    # this single LOP periodic_target
    if existing_target_frequency != Indicator.LOP and \
            new_target_frequency == Indicator.LOP:

        lop_pt = PeriodicTarget.objects.create(
            indicator=indicatr, period=Indicator.TARGET_FREQUENCIES[0][1],
            target=lop, create_date=timezone.now()
        )
        Result.objects.filter(indicator=indicatr) \
            .update(periodic_target=lop_pt)

    if generated_pt_ids:
        pts = PeriodicTarget.objects.filter(indicator=indicatr,
                                            pk__in=generated_pt_ids)
        for pt in pts:
            Result.objects.filter(
                indicator=indicatr,
                date_collected__range=[pt.start_date, pt.end_date]) \
                .update(periodic_target=pt)


def reset_indicator_target_frequency(ind):
    if ind.target_frequency and ind.target_frequency != 1 and \
        not ind.periodictargets.count():
            ind.target_frequency = None
            ind.target_frequency_start = None
            ind.target_frequency_num_periods = 1
            ind.save()
            return True
    return False


class IndicatorUpdate(UpdateView):
    """
    Update and Edit Indicators.
    """
    model = Indicator
    form_class = IndicatorForm

    def get_template_names(self):
        if self.request.GET.get('modal'):
            return 'indicators/indicator_form_modal.html'
        return 'indicators/indicator_form.html'

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):

        if request.method == 'GET':
            # If target_frequency is set but not targets are saved then
            # unset target_frequency too.
            indicator = self.get_object()
            reset_indicator_target_frequency(indicator)
        try:
            self.guidance = FormGuidance.objects.get(form="Indicator")
        except FormGuidance.DoesNotExist:
            self.guidance = None
        return super(IndicatorUpdate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(IndicatorUpdate, self).get_context_data(**kwargs)
        context.update({'id': self.kwargs['pk']})
        getIndicator = Indicator.objects.get(id=self.kwargs['pk'])
        program = getIndicator.program

        context.update({'i_name': getIndicator.name})
        context['programId'] = program.id

        pts = PeriodicTarget.objects.filter(indicator=getIndicator) \
            .annotate(num_data=Count('result')).order_by('customsort', 'create_date', 'period')

        ptargets = []
        # context['periodic_targets']
        for pt in pts:
            ptargets.append({
                'id': pt.pk,
                'num_data': pt.num_data,
                'start_date': pt.start_date,
                'end_date': pt.end_date,
                'period': pt.period, # period is deprecated, this should move to .period_name
                'period_name': pt.period_name,
                'target': pt.target
            })

        # if the modal is loaded (not submitted) and the indicator frequency is a periodic
        if self.request.method == 'GET' and getIndicator.target_frequency in [
                Indicator.ANNUAL, Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL,
                Indicator.QUARTERLY, Indicator.MONTHLY]:

            latest_pt_end_date = getIndicator.periodictargets.aggregate(lastpt=Max('end_date'))['lastpt']
            if latest_pt_end_date is None or latest_pt_end_date == 'None':
                latest_pt_end_date = program.reporting_period_start
            else:
                latest_pt_end_date += timedelta(days=1)

            target_frequency_num_periods = IPTT_ReportView._get_num_periods(
                latest_pt_end_date, program.reporting_period_end, getIndicator.target_frequency)

            num_existing_targets = pts.count()
            event_name = ''

            generatedTargets = generate_periodic_targets(
                getIndicator.target_frequency, latest_pt_end_date, target_frequency_num_periods, event_name,
                num_existing_targets)

            # combine the list of existing periodic_targets with the newly generated placeholder for missing targets
            ptargets += generatedTargets

        context['periodic_targets'] = ptargets
        context['targets_sum'] = PeriodicTarget.objects \
            .filter(indicator=getIndicator).aggregate(Sum('target'))['target__sum']

        context['targets_avg'] = PeriodicTarget.objects \
            .filter(indicator=getIndicator).aggregate(Avg('target'))['target__avg']

        # get external service data if any
        try:
            getExternalServiceRecord = ExternalServiceRecord.objects \
                .filter(indicator__id=self.kwargs['pk'])
        except ExternalServiceRecord.DoesNotExist:
            getExternalServiceRecord = None

        context.update({'getExternalServiceRecord': getExternalServiceRecord})
        if self.request.GET.get('targetsonly') == 'true':
            context['targetsonly'] = True
        elif self.request.GET.get('targetsactive') == 'true':
            context['targetsactive'] = True
        return context

    def get_initial(self):
        target_frequency_num_periods = self.get_object().target_frequency_num_periods
        if not target_frequency_num_periods:
            target_frequency_num_periods = 1

        initial = {
            'target_frequency_num_periods': target_frequency_num_periods
        }
        return initial

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(IndicatorUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        program = self.object.program
        kwargs['program'] = program
        return kwargs

    def form_invalid(self, form):
        if self.request.is_ajax():
            print("...............%s.........................." % form.errors)
            return HttpResponse(status=400)
        else:
            messages.error(self.request, _('Invalid Form'), fail_silently=False)
            print("...............%s.........................." % form.errors)
            return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form, **kwargs):
        periodic_targets = self.request.POST.get('periodic_targets', None)
        indicatr = Indicator.objects.get(pk=self.kwargs.get('pk'))
        generatedTargets = []
        existing_target_frequency = indicatr.target_frequency
        new_target_frequency = form.cleaned_data.get('target_frequency', None)
        lop = form.cleaned_data.get('lop_target', None)
        program = pk=form.cleaned_data.get('program')

        if periodic_targets == 'generateTargets':
            # handle (delete) association of colelctedData records if necessary
            handleDataCollectedRecords(indicatr, lop, existing_target_frequency, new_target_frequency)

            event_name = form.cleaned_data.get('target_frequency_custom', '')
            start_date = ''
            target_frequency_num_periods = 1
            target_frequency_type = form.cleaned_data.get('target_frequency', 1)

            if target_frequency_type in [
                    Indicator.ANNUAL, Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL,
                    Indicator.QUARTERLY, Indicator.MONTHLY]:
                start_date = program.reporting_period_start
                target_frequency_num_periods = IPTT_ReportView._get_num_periods(
                    start_date, program.reporting_period_end, target_frequency_type)
            elif target_frequency_type == Indicator.EVENT:
                # This is only case in which target fequency comes from the form
                target_frequency_num_periods = form.cleaned_data.get('target_frequency_num_periods', 1)

            generatedTargets = generate_periodic_targets(
                new_target_frequency, start_date, target_frequency_num_periods, event_name)

        if periodic_targets and periodic_targets != 'generateTargets':
            # now create/update periodic targets
            pt_json = json.loads(periodic_targets)
            generated_pt_ids = []
            for i, pt in enumerate(pt_json):
                pk = int(pt.get('id'))
                if pk == 0:
                    pk = None

                try:
                    start_date = dateparser.parse(pt.get('start_date', None))
                    start_date = datetime.strftime(start_date, '%Y-%m-%d')
                except (ValueError, TypeError):
                    # raise ValueError("Incorrect data value")
                    start_date = None

                try:
                    end_date = dateparser.parse(pt.get('end_date', None))
                    end_date = datetime.strftime(end_date, '%Y-%m-%d')
                except (ValueError, TypeError):
                    # raise ValueError("Incorrect data value")
                    end_date = None

                defaults = {
                    'period': pt.get('period', ''),
                    'target': pt.get('target', 0), 'customsort': i,
                    'start_date': start_date, 'end_date': end_date,
                    'edit_date': timezone.now()
                }

                # Validate PeriodicTarget target field is > 0... throws with ValidationError
                # Needed to be done here since the form itself does not check
                # Front-end validation exists which is why we are not bothering with UI feedback
                PeriodicTarget(indicator=indicatr, **defaults).clean_fields()

                periodic_target, created = PeriodicTarget.objects \
                    .update_or_create(indicator=indicatr, id=pk, defaults=defaults)

                if created:
                    periodic_target.create_date = timezone.now()
                    periodic_target.save()
                    generated_pt_ids.append(periodic_target.id)

            # handle related result objects for new periodic targets
            handleDataCollectedRecords(indicatr, lop, existing_target_frequency, new_target_frequency,
                                       generated_pt_ids)

        # check to see if values of any of these fields have changed.
        fields_to_watch = set(['indicator_type', 'level', 'name', 'number', 'sector'])
        changed_fields = set(form.changed_data)
        if fields_to_watch.intersection(changed_fields):
            update_indicator_row = '1'
        else:
            # for  now do not care about which fields have changed. just indicate that some fields have changed
            update_indicator_row = '1'

        # save the indicator form
        self.object = form.save()

        # fetch all existing periodic_targets for this indicator
        periodic_targets = PeriodicTarget.objects.filter(indicator=indicatr) \
            .annotate(num_data=Count('result')) \
            .order_by('customsort', 'create_date', 'period')

        if self.request.is_ajax():
            indicatorjson = serializers.serialize('json', [self.object])
            # pts = FlatJsonSerializer().serialize(periodic_targets)

            try:
                last_targetperiod_enddate = indicatr.periodictargets.aggregate(lastpt=Max('end_date'))['lastpt']
                if program.reporting_period_end > last_targetperiod_enddate:
                    remove_missing_targts_link = False
                else:
                    remove_missing_targts_link = True
            except TypeError:
                remove_missing_targts_link = True

            if generatedTargets:
                params = {'indicator': self.object, 'periodic_targets': generatedTargets}
                content = render_to_string('indicators/indicatortargets.html', params)
            else:
                params = {'indicator': self.object, 'periodic_targets': periodic_targets}
                content = render_to_string('indicators/indicatortargets.html', params)

            targets_sum = self.get_context_data().get('targets_sum')
            if targets_sum is None:
                targets_sum = "0"

            targets_avg = self.get_context_data().get('targets_avg')
            if targets_avg is None:
                targets_avg = "0"

            data = {
                "indicatorjson": str(indicatorjson),
                "targets_sum": str(targets_sum),
                "targets_avg": str(targets_avg),
                "update_indicator_row": str(update_indicator_row),
                "content": content,
                "remove_missing_targts_link": remove_missing_targts_link
            }
            return HttpResponse(json.dumps(data))
        else:
            messages.success(self.request, _('Success, Indicator Updated!'))
        return self.render_to_response(self.get_context_data(form=form))


class IndicatorDelete(DeleteView):
    model = Indicator
    form_class = IndicatorForm

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(IndicatorDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, _('Success, Indicator Deleted!'))
        return self.render_to_response(self.get_context_data(form=form))

    def get_success_url(self):
        return self.object.program.program_page_url


class PeriodicTargetDeleteView(DeleteView):
    model = PeriodicTarget

    def delete(self, request, *args, **kwargs):
        result_count = self.get_object().result_set.count()
        if result_count > 0:
            self.get_object().result_set.all().update(
                periodic_target=None)

        # super(PeriodicTargetDeleteView).delete(request, args, kwargs)
        indicator = self.get_object().indicator
        self.get_object().delete()
        if indicator.periodictargets.count() == 0:
            indicator.target_frequency = None
            indicator.target_frequency_num_periods = 1
            indicator.target_frequency_start = None
            indicator.target_frequency_custom = None
            indicator.save()

        targets_sum = PeriodicTarget.objects.filter(indicator=indicator) \
            .aggregate(Sum('target'))['target__sum']

        indicator = None
        return JsonResponse(
            {"status": "success", "msg": "Periodic Target deleted\
             successfully.", "targets_sum": targets_sum}
            )


class ResultFormMixin(object):
    def get_template_names(self):
        return 'indicators/result_form_modal.html'

    def form_invalid(self, form):
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))


class ResultCreate(ResultFormMixin, CreateView):
    """Create new Result called by result_add as modal"""
    model = Result
    form_class = ResultForm

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.indicator = get_object_or_404(Indicator, pk=self.kwargs['indicator'])
        return super(ResultCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        custom_disaggregation_labels = DisaggregationLabel.objects.filter(disaggregation_type__indicator=self.indicator.id)
        standard_disaggregation_labels = DisaggregationLabel.get_standard_labels()

        context = super(ResultCreate, self).get_context_data(**kwargs)
        context['indicator'] = self.indicator
        context['custom_disaggregation_labels'] = custom_disaggregation_labels
        context['standard_disaggregation_labels'] = standard_disaggregation_labels
        return context

    def get_form_kwargs(self):
        kwargs = super(ResultCreate, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        kwargs['indicator'] = self.indicator
        kwargs['program'] = self.indicator.program
        return kwargs

    def form_valid(self, form):
        indicator = self.request.POST['indicator']
        disaggregation_labels = DisaggregationLabel.objects.filter(
            Q(disaggregation_type__indicator__id=indicator) |
            Q(disaggregation_type__standard=True))

        # update the count with the value of Table unique count
        if form.instance.update_count_tola_table and form.instance.tola_table:
            try:
                tola_table_id = self.request.POST['tola_table']
                table = TolaTable.objects.get(id=tola_table_id)
            except DisaggregationLabel.DoesNotExist:
                table = None

            if table:
                # remove trailing slash since TT api does not like it.
                url = table.url if table.url[-1:] != "/" else table.url[:-1]
                url = url if url[-5:] != "/data" else url[:-5]
                count = getTableCount(url, table.table_id)
            else:
                count = 0
            form.instance.achieved = count

        new = form.save()
        process_disaggregation = False

        for label in disaggregation_labels:
            if process_disaggregation is True:
                break
            for k, v in self.request.POST.iteritems():
                if k == str(label.id) and len(v) > 0:
                    process_disaggregation = True
                    break

        if process_disaggregation is True:
            for label in disaggregation_labels:
                for k, v in self.request.POST.iteritems():
                    if k == str(label.id):
                        save = new.disaggregation_value.create(
                            disaggregation_label=label, value=v)
                        new.disaggregation_value.add(save.id)
            process_disaggregation = False

        if self.request.is_ajax():
            #data = serializers.serialize('json', [new])
            data = {
                'pk' : new.pk,
                'url': reverse('result_update', kwargs={'pk': new.pk})
            }
            return JsonResponse(data)

        messages.success(self.request, _('Success, Data Created!'))
        redirect_url = new.indicator.program.program_page_url
        return HttpResponseRedirect(redirect_url)


class ResultUpdate(ResultFormMixin, UpdateView):
    """Update Result view called by result_update as modal"""
    model = Result
    form_class = ResultForm

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        self.result = get_object_or_404(Result, pk=self.kwargs.get('pk'))
        self.indicator = self.result.indicator
        return super(ResultUpdate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        custom_disaggregation_values = DisaggregationValue.objects.filter(
            result=self.result).exclude(
            disaggregation_label__disaggregation_type__standard=True)

        standard_disaggregation_values = DisaggregationValue.objects.filter(
            result=self.result).filter(
            disaggregation_label__disaggregation_type__standard=True)
        standard_disaggregation_labels = DisaggregationLabel.get_standard_labels()
        custom_disaggregation_labels = DisaggregationLabel.objects.filter(
            disaggregation_type__indicator=self.indicator.id)
        context = super(ResultUpdate, self).get_context_data(**kwargs)
        context['indicator'] = self.indicator
        context['custom_disaggregation_labels'] = custom_disaggregation_labels
        context['custom_disaggregation_values'] = custom_disaggregation_values
        context['standard_disaggregation_labels'] = standard_disaggregation_labels
        context['standard_disaggregation_values'] = standard_disaggregation_values
        return context

    def get_form_kwargs(self):
        kwargs = super(ResultUpdate, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        kwargs['indicator'] = self.indicator
        kwargs['program'] = self.indicator.program
        return kwargs

    def form_valid(self, form):
        getResult = Result.objects.get(id=self.kwargs['pk'])
        indicator = self.request.POST['indicator']

        getDisaggregationLabel = DisaggregationLabel.objects.filter(
            Q(disaggregation_type__indicator__id=indicator) |
            Q(disaggregation_type__standard=True)).distinct()

        getIndicator = Result.objects.get(id=self.kwargs['pk'])

        # update the count with the value of Table unique count
        if form.instance.update_count_tola_table and form.instance.tola_table:
            try:
                table = TolaTable.objects.get(
                    id=self.request.POST['tola_table'])

            except TolaTable.DoesNotExist:
                table = None
            if table:
                # remove trainling slash since TT api does not like it.
                url = table.url if table.url[-1:] != "/" else table.url[:-1]
                url = url if url[-5:] != "/data" else url[:-5]
                count = getTableCount(url, table.table_id)
            else:
                count = 0
            form.instance.achieved = count
        # save the form then update manytomany relationships
        form.save()

        # Insert or update disagg values
        for label in getDisaggregationLabel:
            for key, value in self.request.POST.iteritems():
                if key == str(label.id):
                    value_to_insert = value
                    save = getResult.disaggregation_value.create(
                        disaggregation_label=label, value=value_to_insert)

                    getResult.disaggregation_value.add(save.id)

        if self.request.is_ajax():
            data = serializers.serialize('json', [self.object])
            return HttpResponse(data)

        messages.success(self.request, _('Success, Data Updated!'))
        redirect_url = getIndicator.program.program_page_url

        return HttpResponseRedirect(redirect_url)


class ResultDelete(DeleteView):
    model = Result

    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    def dispatch(self, request, *args, **kwargs):
        return super(ResultDelete, self).dispatch(
            request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.get_object().delete()
        payload = {'delete': 'ok'}
        return JsonResponse(payload)

    def get_success_url(self):
        return self.object.program.program_page_url


def getTableCount(url, table_id):
    """
    Count the number of rowns in a TolaTable
    """
    token = TolaSites.objects.get(site_id=1)
    if token.tola_tables_token:
        headers = {
            'content-type': 'application/json',
            'Authorization': 'Token %s' % token.tola_tables_token
        }
    else:
        headers = {
            'content-type': 'application/json'
        }
        print "Token Not Found"

    response = requests.get(url, headers=headers, verify=True)
    data = json.loads(response.content)
    count = None

    try:
        count = data['data_count']
        TolaTable.objects.filter(table_id=table_id).update(unique_count=count)
    except KeyError:
        pass

    return count


def merge_two_dicts(x, y):
    """
    merges two dictionaries -- shallow
    """
    z = x.copy()
    z.update(y)
    return z


def service_json(request, service):
    """
    For populating service indicators in dropdown
    :param service: The remote data service
    :return: JSON object of the indicators from the service
    """
    if service == 0:
        # no service (this is selecting a custom indicator)
        return HttpResponse(status=204)
    service_indicators = import_indicator(service)
    return JsonResponse(service_indicators, safe=False)


def result_view(request, indicator, program):
    """Returns the results table for an indicator - used to expand rows on the Program Page"""
    indicator = ResultsIndicator.results_view.get(pk=indicator)
    reset_indicator_target_frequency(indicator)
    template_name = 'indicators/result_table.html'
    program_obj = indicator.program
    program = program_obj.id
    periodictargets = indicator.annotated_targets
    on_track_lower = 100 - 100 * Indicator.ONSCOPE_MARGIN
    on_track_upper = 100 + 100 * Indicator.ONSCOPE_MARGIN
    on_track = True if (on_track_lower <= indicator.lop_percent_met <= on_track_upper) else False
    is_editable = False if request.GET.get('edit') == 'false' else True

    return render_to_response(
        template_name, {
            'indicator': indicator,
            'periodictargets': periodictargets,
            'program_id': program,
            'program': program_obj,
            'is_editable': is_editable,
            'on_track': on_track,
        }
    )


def program_indicators_json(request, program, indicator, type):
    template_name = 'indicators/program_indicators_table.html'

    program_obj = Program.objects.get(pk=program)
    q = {'program__id__isnull': False, 'program__id': program_obj.pk}

    if int(type) != 0:
        q['indicator_type__id'] = type

    if int(indicator) != 0:
        q['id'] = indicator

    indicators = Indicator.objects \
        .select_related('sector') \
        .prefetch_related('result_set', 'indicator_type', 'level',
                          'periodictargets') \
        .filter(**q) \
        .annotate(data_count=Count('result'),
                  levelmin=Min('level__customsort'),
                  target_period_last_end_date=Max('periodictargets__end_date')) \
        .order_by('levelmin', 'number', 'name')

    return render_to_response(
        template_name,
        {'indicators': indicators, 'program': program_obj}
    )


class IndicatorReport(View, AjaxableResponseMixin):
    def get(self, request, *args, **kwargs):
        countries = getCountry(request.user)
        program = int(self.kwargs['program'])
        indicator = int(self.kwargs['indicator'])
        type = int(self.kwargs['type'])

        filters = {}
        if program != 0:
            filters['program__id'] = program
        if type != 0:
            filters['indicator_type'] = type
        if indicator != 0:
            filters['id'] = indicator
        if program == 0 and type == 0:
            filters['program__country__in'] = countries

        getIndicators = Indicator.objects.filter(**filters) \
            .prefetch_related('sector') \
            .select_related('program', 'external_service_record',
                            'indicator_type', 'disaggregation',
                            'reporting_frequency') \
            .values('id', 'program__name', 'baseline', 'level__name',
                    'lop_target', 'program__id',
                    'external_service_record__external_service__name',
                    'key_performance_indicator', 'name',
                    'indicator_type__indicator_type', 'sector__sector',
                    'disaggregation__disaggregation_type',
                    'means_of_verification', 'data_collection_method',
                    'reporting_frequency__frequency', 'create_date',
                    'edit_date', 'source', 'method_of_analysis')

        q = request.GET.get('search', None)
        if q:
            getIndicators = getIndicators.filter(
                Q(indicator_type__indicator_type__contains=q) |
                Q(name__contains=q) |
                Q(number__contains=q) |
                Q(number__contains=q) |
                Q(sector__sector__contains=q) |
                Q(definition__contains=q)
            )
        get_indicators = json.dumps(list(getIndicators), cls=DjangoJSONEncoder)
        return JsonResponse(get_indicators, safe=False)


def indicator_plan(request, program_id):
    """
    This is the GRID report or indicator plan for a program.
    Shows a simple list of indicators sorted by level
    and number. Lives in the "Indicator" home page as a link.
    """
    program = get_object_or_404(Program, id=program_id)

    indicators = ip.indicator_queryset(program_id)

    return render(request, "indicators/indicator_plan.html", {
        'program': program,
        'column_names': ip.column_names(),
        'rows': [ip.row(i) for i in indicators]
    })


class IndicatorReportData(View, AjaxableResponseMixin):
    """
    This is the Indicator Visual report data, returns a json object of
    report data to be displayed in the table report
    """

    def get(self, request, program, type, id):
        q = {'program__id__isnull': False}

        # if we have a program filter active
        if int(program) != 0:
            q = {'program__id': program}
        # if we have an indicator type active
        if int(type) != 0:
            r = {'indicator_type__id': type}
            q.update(r)

        # if we have an indicator id append it to the query filter
        if int(id) != 0:
            s = {'id': id}
            q.update(s)

        countries = getCountry(request.user)

        indicator = Indicator.objects.filter(program__country__in=countries) \
            .filter(**q).values(
                'id', 'program__name', 'baseline', 'level__name', 'lop_target',
                'program__id',
                'external_service_record__external_service__name',
                'key_performance_indicator', 'name', 'indicator_type__id',
                'indicator_type__indicator_type', 'sector__sector')\
            .order_by('create_date')

        indicator_count = Indicator.objects \
            .filter(program__country__in=countries) \
            .filter(**q) \
            .filter(result__isnull=True) \
            .distinct() \
            .count()

        indicator_data_count = Indicator.objects \
            .filter(program__country__in=countries) \
            .filter(**q).filter(result__isnull=False) \
            .distinct() \
            .count()

        indicator_serialized = json.dumps(list(indicator))

        final_dict = {
            'indicator': indicator_serialized,
            'indicator_count': indicator_count,
            'data_count': indicator_data_count
        }

        if request.GET.get('export'):
            indicator_export = Indicator.objects.all().filter(**q)
            dataset = IndicatorResource().export(indicator_export)
            response = HttpResponse(dataset.csv,
                                    content_type='application/ms-excel')

            response['Content-Disposition'] = 'attachment; \
                filename=indicator_data.csv'

            return response

        return JsonResponse(final_dict, safe=False)


class ResultReportData(View, AjaxableResponseMixin):
    """
    This is the Result reports data in JSON format for a specific
    indicator
    """

    def get(self, request, *args, **kwargs):
        countries = getCountry(request.user)
        program = kwargs['program']
        indicator = kwargs['indicator']
        type = kwargs['type']

        q = {'program__id__isnull': False}
        # if we have a program filter active
        if int(program) != 0:
            q = {
                'indicator__program__id': program,
            }
        # if we have an indicator type active
        if int(type) != 0:
            r = {
                'indicator__indicator_type__id': type,
            }
            q.update(r)
        # if we have an indicator id append it to the query filter
        if int(indicator) != 0:
            s = {
                'indicator__id': indicator,
            }
            q.update(s)

        getResult = Result.objects \
            .select_related('periodic_target') \
            .prefetch_related('evidence', 'indicator', 'program',
                              'indicator__objectives',
                              'indicator__strategic_objectives') \
            .filter(program__country__in=countries) \
            .filter(**q) \
            .order_by('indicator__program__name', 'indicator__number') \
            .values(
                'id', 'indicator__id', 'indicator__name',
                'indicator__program__id', 'indicator__program__name',
                'indicator__indicator_type__indicator_type',
                'indicator__indicator_type__id', 'indicator__level__name',
                'indicator__sector__sector', 'date_collected',
                'indicator__baseline', 'indicator__lop_target',
                'indicator__key_performance_indicator',
                'indicator__external_service_record__external_service__name',
                'evidence', 'tola_table', 'periodic_target', 'achieved')

        result_sum = Result.objects \
            .select_related('periodic_target') \
            .filter(program__country__in=countries) \
            .filter(**q) \
            .aggregate(Sum('periodic_target__target'), Sum('achieved'))

        # datetime encoding breaks without using this
        from django.core.serializers.json import DjangoJSONEncoder
        result_serialized = json.dumps(list(getResult),
                                          cls=DjangoJSONEncoder)
        final_dict = {
            'result': result_serialized,
            'result_sum': result_sum
        }
        return JsonResponse(final_dict, safe=False)


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def old_program_page(request, program_id, indicator_id, indicator_type_id):
    """ redirect for old /program/<program_id>/<indicator_id>/<indicator_type_id>/ urls to new program page url"""
    program = get_object_or_404(Program, pk=program_id)
    if indicator_id != 0 or indicator_type_id != 0:
        logger.warn('attempt to access program page with filters indicator id {0} and indicator type id {1}'.format(
            indicator_id, indicator_type_id))
    return redirect(program.program_page_url, permanent=True)

class ProgramPage(ListView):
    model = Indicator
    template_name = 'indicators/program_page.html'
    metrics = False

    def get(self, request, *args, **kwargs):
        # countries = request.user.tola_user.countries.all()
        program_id = int(self.kwargs['program_id'])
        if request.user.is_anonymous or not request.user.tola_user.has_access(program_id=program_id):
            return HttpResponseRedirect('/')
        unannotated_program = Program.objects.only(
            'reporting_period_start', 'reporting_period_end',
            'start_date', 'end_date'
            ).get(pk=program_id)
        if unannotated_program.reporting_period_start is None or unannotated_program.reporting_period_end is None:
            context = {
                'program': unannotated_program,
                'redirect_url': request.path
            }
            return render(
                request, 'indicators/program_setup_incomplete.html', context
                )
        program = ProgramWithMetrics.program_page.get(pk=program_id)
        program.indicator_filters = {}
        if self.metrics:
            json_context = {
                'metrics': program.metrics,
                'scope_counts': program.scope_counts
            }
            return JsonResponse(json_context)

        indicators = program.annotated_indicators\
            .annotate(target_period_last_end_date=Max('periodictargets__end_date')).select_related('level')
        site_count = len(program.get_sites())

        pinned_reports = list(program.pinned_reports.filter(tola_user=request.user.tola_user)) + \
                         [PinnedReport.default_report(program.id)]
        js_context = {
            'delete_pinned_report_url': str(reverse_lazy('delete_pinned_report')),
            'program': ProgramSerializer(program).data,
            'indicators': IndicatorSerializer(indicators, many=True).data,
            'indicator_on_scope_margin': Indicator.ONSCOPE_MARGIN,
        }
        #program.set_metrics(indicators)
        c_data = {
            'program': program,
            'site_count': site_count,
            'percent_complete': program.percent_complete,
            'pinned_reports': pinned_reports,
            'js_context': js_context,
        }
        return render(request, self.template_name, c_data)


class DisaggregationReportMixin(object):
    def get_context_data(self, **kwargs):
        context = super(DisaggregationReportMixin, self) \
            .get_context_data(**kwargs)

        countries = getCountry(self.request.user)
        programs = Program.objects.filter(funding_status="Funded",
                                          country__in=countries).distinct()

        indicators = Indicator.objects.filter(program__country__in=countries)

        programId = int(kwargs.get('program', 0))
        program_selected = None
        if programId:
            program_selected = Program.objects.filter(id=programId).first()
            if program_selected.indicator_set.count() > 0:
                indicators = indicators.filter(program=programId)

        disagg_query = "SELECT \
                i.id AS IndicatorID, \
                dt.disaggregation_type AS DType,\
                l.customsort AS customsort, \
                l.label AS Disaggregation, \
                SUM(dv.value) AS Actuals \
            FROM indicators_result_disaggregation_value AS cdv \
            INNER JOIN indicators_result AS c \
                ON c.id = cdv.result_id \
            INNER JOIN indicators_indicator AS i ON i.id = c.indicator_id\
            INNER JOIN workflow_program AS p ON p.id = i.program_id \
            INNER JOIN indicators_disaggregationvalue AS dv \
                ON dv.id = cdv.disaggregationvalue_id \
            INNER JOIN indicators_disaggregationlabel AS l \
                ON l.id = dv.disaggregation_label_id \
            INNER JOIN indicators_disaggregationtype AS dt \
                ON dt.id = l.disaggregation_type_id \
            WHERE p.id = %s \
            GROUP BY IndicatorID, DType, customsort, Disaggregation \
            ORDER BY IndicatorID, DType, customsort, Disaggregation;" \
                % programId

        cursor = connection.cursor()
        cursor.execute(disagg_query)
        disdata = dictfetchall(cursor)

        indicator_query = "SELECT DISTINCT \
                p.id as PID, \
                i.id AS IndicatorID, \
                i.number AS INumber, \
                i.name AS Indicator, \
                i.lop_target AS LOP_Target, \
                SUM(cd.achieved) AS Overall \
            FROM indicators_indicator AS i \
            INNER JOIN workflow_program AS p ON p.id = i.program_id \
            LEFT OUTER JOIN indicators_result AS cd \
                ON i.id = cd.indicator_id \
            WHERE p.id = %s \
            GROUP BY PID, IndicatorID \
            ORDER BY Indicator; " % programId

        cursor.execute(indicator_query)
        idata = dictfetchall(cursor)

        for indicator in idata:
            indicator["disdata"] = []
            for i, dis in enumerate(disdata):
                if dis['IndicatorID'] == indicator['IndicatorID']:
                    indicator["disdata"].append(disdata[i])

        context['program_id'] = programId
        context['data'] = idata
        context['getPrograms'] = programs
        context['getIndicators'] = indicators
        context['program_selected'] = program_selected
        if program_selected:
            context['program_name'] = program_selected.name

        return context


class DisaggregationReport(DisaggregationReportMixin, TemplateView):
    template_name = 'indicators/disaggregation_report.html'

    def get_context_data(self, **kwargs):
        context = super(DisaggregationReport, self).get_context_data(**kwargs)
        context['disaggregationprint_button'] = True
        return context


class DisaggregationPrint(DisaggregationReportMixin, TemplateView):
    template_name = 'indicators/disaggregation_print.html'

    def get(self, request, *args, **kwargs):
        context = super(DisaggregationPrint, self).get_context_data(**kwargs)
        hmtl_string = render(request, self.template_name,
                             {'data': context['data'],
                              'program_selected': context['program_selected']
                              })
        pdffile = HTML(string=hmtl_string.content)

        result = pdffile.write_pdf(stylesheets=[CSS(
            string='@page {\
                size: letter; margin: 1cm;\
                @bottom-right{\
                    content: "Page " counter(page) " of " counter(pages);\
                };\
            }'
        )])
        res = HttpResponse(result, content_type='application/pdf')
        res['Content-Disposition'] = 'attachment; \
            filename=indicators_disaggregation_report.pdf'

        res['Content-Transfer-Encoding'] = 'binary'
        # return super(DisaggregationReport, self).get(
        #   request, *args, **kwargs)
        return res


class IndicatorExport(View):
    """
    Export all indicators to an XLS file
    """
    def get(self, request, *args, **kwargs):
        queryset = ip.indicator_queryset(kwargs['program'])
        wb = ip.create_workbook(queryset)

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format('indicator_plan.xlsx')
        wb.save(response)
        return response


def api_indicator_view(request, indicator_id):
    """
    API call for viewing an indicator for the program page
    """
    indicator = Indicator.objects.only('program_id', 'sector_id').get(id=indicator_id)
    program = ProgramWithMetrics.program_page.get(pk=indicator.program_id)
    program.indicator_filters = {}

    indicator = program.annotated_indicators \
        .annotate(target_period_last_end_date=Max('periodictargets__end_date')).get(id=indicator_id)

    return JsonResponse(IndicatorSerializer(indicator).data)



"""
class CountryExport(View):
    def get(self, *args, **kwargs):
        country = CountryResource().export()
        response = HttpResponse(country.csv, content_type="csv")
        response['Content-Disposition'] = 'attachment; filename=country.csv'
        return response
"""


def const_table_det_url(url):
    url_data = urlparse(url)
    root = url_data.scheme
    org_host = url_data.netloc
    path = url_data.path
    components = re.split('/', path)

    s = []
    for c in components:
        s.append(c)

    new_url = str(root) + '://' + str(org_host) + '/silo_detail/' + str(
        s[3]) + '/'

    return new_url
