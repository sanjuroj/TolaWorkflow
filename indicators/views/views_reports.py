import bisect
from collections import OrderedDict
from dateutil import rrule
from dateutil.relativedelta import relativedelta
from datetime import datetime
import datetime as dt
from django.core.urlresolvers import reverse_lazy
from django.db.models import Sum, Avg, Subquery, OuterRef, Case, When, Q, F, Min, Max, DecimalField, Value
from django.views.generic import TemplateView, FormView
from django.utils.translation import ugettext_lazy as _
from django.http import HttpResponseRedirect
from django.contrib import messages
from workflow.models import Program
from ..models import Indicator, CollectedData, Level, PeriodicTarget
from ..forms import IPTTReportQuickstartForm, IPTTReportFilterForm


class IPTTReportQuickstartView(FormView):
    template_name = 'indicators/iptt_quickstart.html'
    form_class = IPTTReportQuickstartForm
    FORM_PREFIX_TIME = 'timeperiods'
    FORM_PREFIX_TARGET = 'targetperiods'

    def get_context_data(self, **kwargs):
        context = super(IPTTReportQuickstartView, self).get_context_data(**kwargs)

        # Add two instances of the same form to context if they're not present
        if 'form' not in context:
            context['form'] = self.form_class(request=self.request, prefix=self.FORM_PREFIX_TIME)
        if 'form2' not in context:
            context['form2'] = self.form_class(request=self.request, prefix=self.FORM_PREFIX_TARGET)
        return context

    def get_form_kwargs(self):
        kwargs = super(IPTTReportQuickstartView, self).get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def post(self, request, *args, **kwargs):
        targetprefix = request.POST.get('%s-formprefix' % self.FORM_PREFIX_TARGET)
        timeprefix = request.POST.get('%s-formprefix' % self.FORM_PREFIX_TIME)

        # set prefix to the current form
        if targetprefix is not None:
            prefix = targetprefix
        else:
            prefix = timeprefix

        form = IPTTReportQuickstartForm(self.request.POST, prefix=prefix, request=self.request)

        # call the form_valid/invalid with the correct prefix and form
        if form.is_valid():
            return self.form_valid(**{'form': form, 'prefix': prefix})
        else:
            return self.form_invalid(**{'form': form, 'prefix': prefix})

    def form_valid(self, **kwargs):
        context = self.get_context_data()
        form = kwargs.get('form')
        prefix = kwargs.get('prefix')

        if prefix == self.FORM_PREFIX_TARGET:
            period = form.cleaned_data.get('targetperiods')
            context['form2'] = form
            context['form'] = self.form_class(request=self.request,
                                              prefix=self.FORM_PREFIX_TIME)
        else:
            prefix = self.FORM_PREFIX_TIME
            period = form.cleaned_data.get('timeperiods')
            context['form'] = form
            context['form2'] = self.form_class(request=self.request,
                                               prefix=self.FORM_PREFIX_TARGET)

        program = form.cleaned_data.get('program')
        num_recents = form.cleaned_data.get('numrecentperiods')
        timeframe = form.cleaned_data.get('timeframe')
        redirect_url = reverse_lazy('iptt_report', kwargs={'program_id': program.id, 'reporttype': prefix})

        redirect_url = "{}?period={}&timeframe={}&numrecentperiods={}".format(
            redirect_url, period, timeframe, num_recents)
        return HttpResponseRedirect(redirect_url)

    def form_invalid(self, form, **kwargs):
        context = self.get_context_data()
        form = kwargs.get('form')
        if kwargs.get('prefix') == self.FORM_PREFIX_TARGET:
            context['form2'] = form
            context['form'] = self.form_class(request=self.request, prefix=self.FORM_PREFIX_TIME)
        else:
            context['form'] = form
            context['form2'] = self.form_class(request=self.request, prefix=self.FORM_PREFIX_TARGET)
        return self.render_to_response(context)


class IPTT_ReportView(TemplateView):
    template_name = 'indicators/iptt_report.html'
    REPORT_TYPE_TIMEPERIODS = 'timeperiods'
    REPORT_TYPE_TARGETPERIODS = 'targetperiods'

    MONTHS_PER_MONTH = 1
    MONTHS_PER_QUARTER = 3
    MONTHS_PER_TRIANNUAL = 4
    MONTHS_PER_SEMIANNUAL = 6
    MONTHS_PER_YEAR = 12

    def __init__(self, **kwars):
        self.annotations = {}
        self.reporttype = None

    @staticmethod
    def _get_num_months(period):
        """
        Returns the number of months for a given time-period
        """
        try:
            return {
                Indicator.ANNUAL: IPTT_ReportView.MONTHS_PER_YEAR,
                Indicator.SEMI_ANNUAL: IPTT_ReportView.MONTHS_PER_SEMIANNUAL,
                Indicator.TRI_ANNUAL: IPTT_ReportView.MONTHS_PER_TRIANNUAL,
                Indicator.QUARTERLY: IPTT_ReportView.MONTHS_PER_QUARTER,
                Indicator.MONTHLY: IPTT_ReportView.MONTHS_PER_MONTH
                }[period]
        except KeyError:
            return 0

    @staticmethod
    def _get_period_name(period):
        """
        Returns the name of the period
        """
        try:
            return {
                Indicator.ANNUAL: 'Year',
                Indicator.SEMI_ANNUAL: 'Semi-annual',
                Indicator.TRI_ANNUAL: 'Tri-annual',
                Indicator.QUARTERLY: 'Quarter',
                Indicator.MONTHLY: 'Month'
            }[period]
        except KeyError:
            return 0

    def _get_first_period(self, start_date, num_months_in_period):
        if start_date is None:
            num_months_in_period = 0

        if num_months_in_period == IPTT_ReportView.MONTHS_PER_MONTH:
            # if interval is monthly, set the start_date to the first of the month
            period_start_date = start_date.replace(day=1)
        elif num_months_in_period == IPTT_ReportView.MONTHS_PER_QUARTER:
            # if interval is quarterly, set period_start_date to first calendar quarter
            quarter_start = [start_date.replace(month=month, day=1) for month in (1, 4, 7, 10)]
            index = bisect.bisect(quarter_start, start_date)
            period_start_date = quarter_start[index-1]
        elif num_months_in_period == IPTT_ReportView.MONTHS_PER_TRIANNUAL:
            # if interval is tri-annual, set period_start_date to first calendar tri-annual
            tri_annual_start = [start_date.replace(month=month, day=1) for month in (1, 5, 9)]
            index = bisect.bisect(tri_annual_start, start_date)
            period_start_date = tri_annual_start[index-1]
        elif num_months_in_period == IPTT_ReportView.MONTHS_PER_SEMIANNUAL:
            # if interval is semi-annual, set period_start_date to first calendar semi-annual
            semi_annual = [start_date.replace(month=month, day=1) for month in (1, 7)]
            index = bisect.bisect(semi_annual, start_date)
            period_start_date = semi_annual[index-1]
        elif num_months_in_period == IPTT_ReportView.MONTHS_PER_YEAR:
            # if interval is annual, set period_start_date to first calendar year
            period_start_date = start_date.replace(month=1, day=1)
        else:
            period_start_date = None

        return period_start_date

    def _generate_annotations(self, timeperiods, period, reporttype):
        """
        Generates queryset annotation(sum, avg, last data record). All three annotations are calculated
        because one of these three values will be used depending on how an indicator is configured.
        """
        if period == Indicator.LOP:
            self.annotations = {}
        elif period == Indicator.MID_END:
            # Create annotations for MIDLINE TargetPeriod
            last_data_record = CollectedData.objects.filter(
                indicator=OuterRef('pk'),
                periodic_target__period=PeriodicTarget.MIDLINE)\
                .order_by('-id')
            midline_sum = Sum(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.NUMBER) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.MIDLINE),
                        then=F('collecteddata__achieved')
                    )
                )
            )
            midline_avg = Avg(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        Q(is_cumulative=False) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.MIDLINE),
                        then=F('collecteddata__achieved')
                    )
                )
            )
            midline_last = Max(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        Q(is_cumulative=True) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.MIDLINE),
                        then=Subquery(last_data_record.values('achieved')[:1])
                    )
                )
            )
            # Get the midline target value
            midline_target = Max(
                Case(
                    When(
                        Q(collecteddata__periodic_target__period=PeriodicTarget.MIDLINE),
                        then=Subquery(last_data_record.values('periodic_target__target')[:1])
                    )
                )
            )

            # Create annotations for ENDLINE TargetPeriod
            last_data_record = CollectedData.objects.filter(
                indicator=OuterRef('pk'),
                periodic_target__period=PeriodicTarget.ENDLINE)\
                .order_by('-id')
            endline_sum = Sum(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.NUMBER) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.ENDLINE),
                        then=F('collecteddata__achieved')
                    )
                )
            )
            endline_avg = Avg(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        Q(is_cumulative=False) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.ENDLINE),
                        then=F('collecteddata__achieved')
                    )
                )
            )
            endline_last = Max(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        Q(is_cumulative=True) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.ENDLINE),
                        then=Subquery(last_data_record.values('achieved')[:1])
                    )
                )
            )
            # Get the endline target value
            endline_target = Max(
                Case(
                    When(
                        Q(collecteddata__periodic_target__period=PeriodicTarget.ENDLINE),
                        then=Subquery(last_data_record.values('periodic_target__target')[:1])
                    )
                )
            )
            self.annotations["Midline_target"] = midline_target
            self.annotations["Endline_target"] = endline_target
            self.annotations['Midline_sum'] = midline_sum
            self.annotations['Midline_avg'] = midline_avg
            self.annotations['Midline_last'] = midline_last
            self.annotations['Endline_sum'] = endline_sum
            self.annotations['Endline_avg'] = endline_avg
            self.annotations['Endline_last'] = endline_last
        else:
            for k, v in timeperiods.items():
                start_date = datetime.strftime(v[0], '%Y-%m-%d')
                end_date = datetime.strftime(v[1], '%Y-%m-%d')

                last_data_record = CollectedData.objects.filter(
                    indicator=OuterRef('pk'),
                    date_collected__gte=start_date,
                    date_collected__lte=end_date)\
                    .order_by('-pk')

                annotation_sum = Sum(
                    Case(
                        When(
                            Q(unit_of_measure_type=Indicator.NUMBER) &
                            Q(collecteddata__date_collected__gte=start_date) &
                            Q(collecteddata__date_collected__lte=end_date),
                            then=F('collecteddata__achieved')
                        )
                    )
                )

                annotation_avg = Avg(
                    Case(
                        When(
                            Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                            Q(is_cumulative=False) &
                            Q(collecteddata__date_collected__gte=start_date) &
                            Q(collecteddata__date_collected__lte=end_date),
                            then=F('collecteddata__achieved')
                        )
                    )
                )
                annotation_last = Max(
                    Case(
                        When(
                            Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                            Q(is_cumulative=True) &
                            Q(collecteddata__date_collected__gte=start_date) &
                            Q(collecteddata__date_collected__lte=end_date),
                            then=Subquery(last_data_record.values('achieved')[:1])
                        )
                    )
                )

                # if this is targetperiods IPTT report then get the target value for each period
                if reporttype == self.REPORT_TYPE_TARGETPERIODS:
                    annotation_target = Max(
                        Case(
                            When(
                                Q(collecteddata__date_collected__gte=start_date) &
                                Q(collecteddata__date_collected__lte=end_date),
                                then=Subquery(last_data_record.values('periodic_target__target')[:1])
                            )
                        )
                    )
                    self.annotations["{}_target".format(k)] = annotation_target

                # the following becomes annotations for the queryset
                # e.g.
                # Year 1_sum=..., Year 2_sum=..., etc.
                # Year 1_avg=..., Year 2_avg=..., etc.
                # Year 1_last=..., Year 2_last=..., etc.
                #
                self.annotations["{}_sum".format(k)] = annotation_sum
                self.annotations["{}_avg".format(k)] = annotation_avg
                self.annotations["{}_last".format(k)] = annotation_last
        return self.annotations

    def _get_num_periods(self, start_date, end_date, period):
        """
        Returns the number of periods depending on the period is in terms of months
        """
        num_months_in_period = self._get_num_months(period)
        total_num_months = len(list(rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date)))
        try:
            num_periods = total_num_months / num_months_in_period
            remainder_months = total_num_months % num_months_in_period
            if remainder_months > 0:
                num_periods += 1
        except ZeroDivisionError:
            num_periods = 0
        return num_periods

    def _generate_targetperiods(self, program_id, period, num_recents):
        targetperiods = OrderedDict()
        today = datetime.today().date()
        # today = datetime.strptime('2020-02-23', '%Y-%m-%d').date()

        # All indicators within a program that have the same target_frequency (annual, monthly, etc)
        # have the same number of target periods with the same start and end dates, thus we can just
        # get the first indicator that is within this program and have the same target_frequency(period)
        # and fetch the related set of periodic_targets
        ind = Indicator.objects.filter(program__in=[program_id], target_frequency=period).first()
        periodic_targets = PeriodicTarget.objects.filter(indicator=ind)\
            .values("id", "period", "target", "start_date", "end_date")

        for pt in periodic_targets:
            # if it is LOP Target then do not show any target periods becaseu there are none.
            if pt['period'] == Indicator.TARGET_FREQUENCIES[0][1]:
                continue
            targetperiods[pt['period']] = [pt['start_date'], pt['end_date'], pt['target'], pt['id']]

        if num_recents is not None and num_recents > 0 and period not in [Indicator.LOP, Indicator.MID_END]:
            # filter out those timeperiods whose end_dates are larger than today's date
            targetperiods_less_than_today = filter(lambda v: v[1][0] <= today, targetperiods.items())

            # filter out dates that are outside of the most_recent index specified by user
            most_recent_targetperiods = targetperiods_less_than_today[(
                len(targetperiods_less_than_today)-num_recents):]

            # convert to oredered dictionary to preserve order (IMPORTANT!)
            targetperiods = OrderedDict((k, v) for k, v in most_recent_targetperiods)
        return targetperiods

    def _generate_timeperiods(self, period_start_date, period, num_periods, num_recents):
        """
        Create date ranges for time-periods.
        """
        timeperiods = OrderedDict()
        today_date = datetime.today().date()
        # today_date = datetime.strptime('2020-02-23', '%Y-%m-%d').date()
        if period_start_date is None:
            return timeperiods

        period_name = self._get_period_name(period)
        num_months_in_period = self._get_num_months(period)

        # Get the first day of the period that encomposses today's date
        today = self._get_first_period(today_date, num_months_in_period)

        # Now calculate the last day of the current period that encompasses today's date
        today = today + relativedelta(months=+num_months_in_period)

        # bump up num_periods by 1 because the loop starts from 1 instead of 0
        num_periods += 1

        # calculate each period's start and end date
        for i in range(1, num_periods):
            if i > 1:
                # if it is not the first period then advance the
                # period_start_date by the correct number of months.
                period_start_date = period_start_date + relativedelta(months=+num_months_in_period)

            period_end_date = period_start_date + \
                relativedelta(months=+num_months_in_period) + relativedelta(days=-1)

            timeperiods["{} {}".format(period_name, i)] = [period_start_date, period_end_date]

        if (num_recents is not None and num_recents > 0):
            # filter out those timeperiods whose end_dates are larger than today's date
            timeperiods_less_than_today = filter(lambda v: v[1][1] < today, timeperiods.items())

            # filter out dates that are outside of the most_recent index specified by user
            most_recent_timeperiods = timeperiods_less_than_today[(len(timeperiods_less_than_today)-num_recents):]

            # convert to oredered dictionary to preserve order (IMPORTANT!)
            timeperiods = OrderedDict((k, v) for k, v in most_recent_timeperiods)
        return timeperiods

    def _get_date_range_n_numperiods(self, reporttype, program_id, period):
        if period == Indicator.LOP or period == Indicator.MID_END:
            return (None, None, None)

        indicators = Indicator.objects.filter(program__in=[program_id]).values('id')
        if reporttype == self.REPORT_TYPE_TIMEPERIODS:
            # determine the full date range of data collection for this program
            data_date_range = indicators\
                .aggregate(sdate=Min('collecteddata__date_collected'), edate=Max('collecteddata__date_collected'))

            start_date = data_date_range['sdate']

            # get the number of months in this period
            num_months_in_period = self._get_num_months(period)

            # Find out the start date based on the calendar period (year, semi-annual, etc)
            start_date = self._get_first_period(start_date, num_months_in_period)
            end_date = data_date_range['edate']

            # get the number of periods in this date range
            num_periods = self._get_num_periods(start_date, end_date, period)
        elif reporttype == self.REPORT_TYPE_TARGETPERIODS:
            # filter the set of indicators further by the period (annual, semi-annual, etc.)
            # and only get the first indicator since indicators that share the same period
            # have the same set of periodic targets
            indicators = indicators.filter(target_frequency=period)[:1]

            periodic_targets = PeriodicTarget.objects.filter(indicator=indicators[0].get('id'))\
                .values('id', 'start_date', 'end_date')
            start_date = periodic_targets.first()['start_date']
            end_date = periodic_targets.last()['end_date']
            num_periods = periodic_targets.count()

        if isinstance(start_date, dt.datetime):
            start_date = start_date.date()

        if isinstance(end_date, dt.datetime):
            end_date = end_date.date()

        return (start_date, end_date, num_periods)

    def get_context_data(self, **kwargs):
        context = super(IPTT_ReportView, self).get_context_data(**kwargs)
        reporttype = kwargs.get('reporttype')
        program_id = kwargs.get('program_id')

        try:
            period = int(self.request.GET.get('period', Indicator.ANNUAL))
        except ValueError:
            period = Indicator.ANNUAL  # default to annual interval

        try:
            num_recents = int(self.request.GET.get('numrecentperiods', 0))
        except ValueError:
            num_recents = 0  # default to 0, which is all periods or targets

        try:
            program = Program.objects.get(pk=program_id)
        except Program.DoesNotExist:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid program."))
            return context

        # calculate aggregated actuals (sum, avg, last) per reporting period
        # (monthly, quarterly, tri-annually, seminu-annualy, and yearly) for each indicator
        lastlevel = Level.objects.filter(indicator__id=OuterRef('pk')).order_by('-id')
        last_data_record = CollectedData.objects.filter(indicator=OuterRef('pk')).order_by('-id')
        indicators = Indicator.objects.filter(program__in=[program_id])\
            .annotate(actualsum=Sum('collecteddata__achieved'),
                      actualavg=Avg('collecteddata__achieved'),
                      lastlevel=Subquery(lastlevel.values('name')[:1]),
                      lastdata=Subquery(last_data_record.values('achieved')[:1]))\
            .values(
                'id', 'number', 'name', 'program', 'lastlevel', 'unit_of_measure', 'direction_of_change',
                'unit_of_measure_type', 'is_cumulative', 'baseline', 'lop_target', 'actualsum', 'actualavg',
                'lastdata')

        report_start_date, report_end_date, num_periods = self._get_date_range_n_numperiods(
            reporttype, program_id, period)

        if reporttype == self.REPORT_TYPE_TIMEPERIODS:
            report_date_ranges = self._generate_timeperiods(report_start_date, period, num_periods, num_recents)
            try:
                report_end_date = report_date_ranges[report_date_ranges.keys()[-1]][1]
            except IndexError:
                report_end_date = None
        elif reporttype == self.REPORT_TYPE_TARGETPERIODS:
            report_date_ranges = self._generate_targetperiods(program_id, period, num_recents)
            indicators = indicators.filter(target_frequency=period)
        else:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid report type."))
            return context

        self.annotations = self._generate_annotations(report_date_ranges, period, reporttype)
        # update the queryset with annotations for timeperiods
        indicators = indicators.annotate(**self.annotations).order_by('number', 'name')

        # Calculate the cumulative sum across timeperiods for indicators that are NUMBER and CUMULATIVE
        for i, ind in enumerate(indicators):
            running_total = 0

            if period in [Indicator.ANNUAL, Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.QUARTERLY,
                          Indicator.MONTHLY, Indicator.MID_END]:
                # if the frequency (period) is periodic, i.e., time-aware then go through each period
                # and calculate the cumulative total achieved across date ranges (periods)
                for k, v in report_date_ranges.items():
                    if ind['unit_of_measure_type'] == Indicator.NUMBER and ind['is_cumulative'] is True:
                        current_sum = ind["{}_sum".format(k)]
                        if current_sum > 0:
                            key = "{}_rsum".format(k)
                            running_total = running_total + current_sum
                            ind[key] = running_total

                    # if it is targetperiods IPTT report then calculate percent_met vaue for each targetperiod
                    if reporttype == self.REPORT_TYPE_TARGETPERIODS:
                        try:
                            percent_met = '{}_percent_met'.format(k)
                            target = float(ind["{}_target".format(k)])
                            if ind['unit_of_measure_type'] == Indicator.NUMBER:
                                if ind['is_cumulative'] is True:
                                    rsum = float(ind["{}_rsum".format(k)])
                                    ind[percent_met] = rsum / target * 100
                                else:
                                    ind[percent_met] = float(ind["{}_sum".format(k)]) / target * 100
                            elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                                if ind['is_cumulative'] is True:
                                    ind[percent_met] = float(ind["{}_last".format(k)]) / target * 100
                                elif ind['is_cumulative'] is False:
                                    avg = float(ind["{}_avg".format(k)])
                                    ind[percent_met] = (avg/target) * 100
                        except TypeError as e:
                            ind[percent_met] = None
            # elif period == Indicator.MID_END:
            #     if ind['unit_of_measure_type'] == Indicator.NUMBER and ind['is_cumulative'] is True:
            #         ind['midend_sum'] = ind['Midline_sum'] + ind['Endline_sum']

        context['period'] = period
        context['start_date'] = report_start_date
        context['end_date'] = report_end_date
        context['report_date_ranges'] = report_date_ranges
        context['indicators'] = indicators
        context['program'] = program
        context['reporttype'] = reporttype
        return context

    def get(self, request, *args, **kwargs):
        # reporttype = kwargs.get('reporttype')
        context = self.get_context_data(**kwargs)
        initial_data = {
            'program': context['program'],
            'start_date': context['start_date'],
            'end_date': context['end_date'],
            'timeframe': request.GET.get('timeframe'),
            'numrecentperiods': request.GET.get('numrecentperiods'),
            'targetperiods': request.GET.get('period'),
            'timeperiods': request.GET.get('period'),
        }
        # print(initial_data)

        context['form'] = IPTTReportFilterForm(initial=initial_data, request=request)
        context['report_wide'] = True
        if context.get('redirect', None):
            return HttpResponseRedirect(reverse_lazy('iptt_quickstart'))
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        form = IPTTReportFilterForm(request.POST, request=request)
        if form.is_valid():
            return self.form_valid(form, request, **kwargs)
        elif not form.is_valid():
            return self.form_invalid(form, request, **kwargs)

    def form_valid(self, form, request, **kwargs):
        context = self._generate_context(request, **kwargs)
        context['form'] = form
        context['report_wide'] = True
        return self.render_to_response(context=context)

    def form_invalid(self, form, request, **kwargs):
        context = self._generate_context(request, **kwargs)
        context['form'] = form
        context['report_wide'] = True
        return self.render_to_response(context=context)
