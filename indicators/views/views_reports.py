# -*- coding: utf-8 -*-
""" View functions for generating IPTT Reports (HTML and Excel)"""

import bisect
import csv
from datetime import date
from dateutil import rrule, parser
from django.utils import timezone
from django.core.urlresolvers import reverse_lazy, reverse
from django.db.models import Sum, Avg, Subquery, OuterRef, Case, When, Q, F, Max, Value, IntegerField, Count, Prefetch
from django.views.decorators.http import require_POST
from django.views.generic import TemplateView, FormView, View
from django.utils.translation import (
    ugettext,
    ugettext_lazy as _
)
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.cell_range import CellRange

from tola.util import formatFloat
from tola.l10n_utils import l10n_date_medium, l10n_date_long, l10n_number, l10n_monthname
from workflow.models import Program
from indicators.models import Indicator, Result, Level, PeriodicTarget, PinnedReport
from indicators.forms import IPTTReportQuickstartForm, IPTTReportFilterForm, PinnedReportForm
from indicators.templatetags.mytags import symbolize_change, symbolize_measuretype
from indicators.queries import IPTTIndicator


class IPTT_Mixin(object):
    """
    A mixin that abstracts all of the common functionality for IPTT reports
    """
    template_name = 'indicators/iptt_report.html'
    REPORT_TYPE_TIMEPERIODS = 'timeperiods'
    REPORT_TYPE_TARGETPERIODS = 'targetperiods'

    MONTHS_PER_MONTH = 1
    MONTHS_PER_QUARTER = 3
    MONTHS_PER_TRIANNUAL = 4
    MONTHS_PER_SEMIANNUAL = 6
    MONTHS_PER_YEAR = 12

    FROM = 'from'
    TO = 'to'

    def __init__(self, **kwargs):
        self.program = None
        self.annotations = {}
        self.filter_form_initial_data = {}

    @staticmethod
    def _get_num_months(period):
        """
        Returns the number of months for a given time-period
        """
        try:
            return {
                Indicator.ANNUAL: IPTT_Mixin.MONTHS_PER_YEAR,
                Indicator.SEMI_ANNUAL: IPTT_Mixin.MONTHS_PER_SEMIANNUAL,
                Indicator.TRI_ANNUAL: IPTT_Mixin.MONTHS_PER_TRIANNUAL,
                Indicator.QUARTERLY: IPTT_Mixin.MONTHS_PER_QUARTER,
                Indicator.MONTHLY: IPTT_Mixin.MONTHS_PER_MONTH
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
                Indicator.ANNUAL: _('Year'),
                Indicator.SEMI_ANNUAL: _('Semi-annual'),
                Indicator.TRI_ANNUAL: _('Tri-annual'),
                Indicator.QUARTERLY: _('Quarter'),
                Indicator.MONTHLY: _('Month')
            }[period]
        except KeyError:
            return 0

    def _get_first_period(self, start_date, num_months_in_period):
        # TODO: Delete it
        if start_date is None:
            num_months_in_period = 0

        if num_months_in_period == IPTT_Mixin.MONTHS_PER_MONTH:
            # if interval is monthly, set the start_date to the first of the month
            period_start_date = start_date.replace(day=1)
        elif num_months_in_period == IPTT_Mixin.MONTHS_PER_QUARTER:
            # if interval is quarterly, set period_start_date to first calendar quarter
            quarter_start = [start_date.replace(month=month, day=1) for month in (1, 4, 7, 10)]
            index = bisect.bisect(quarter_start, start_date)
            period_start_date = quarter_start[index - 1]
        elif num_months_in_period == IPTT_Mixin.MONTHS_PER_TRIANNUAL:
            # if interval is tri-annual, set period_start_date to first calendar tri-annual
            tri_annual_start = [start_date.replace(month=month, day=1) for month in (1, 5, 9)]
            index = bisect.bisect(tri_annual_start, start_date)
            period_start_date = tri_annual_start[index - 1]
        elif num_months_in_period == IPTT_Mixin.MONTHS_PER_SEMIANNUAL:
            # if interval is semi-annual, set period_start_date to first calendar semi-annual
            semi_annual = [start_date.replace(month=month, day=1) for month in (1, 7)]
            index = bisect.bisect(semi_annual, start_date)
            period_start_date = semi_annual[index - 1]
        elif num_months_in_period == IPTT_Mixin.MONTHS_PER_YEAR:
            # if interval is annual, set period_start_date to first calendar year
            period_start_date = start_date.replace(month=1, day=1)
        else:
            period_start_date = None

        return period_start_date

    def _generate_annotations(self, timeperiods, period, reporttype):
        """
        Generates queryset annotation(sum, avg, last data record). All three annotations are calculated
        because one of these three values will be used depending on how an indicator is configured.
        timeperiods = [{start, end, customsort},], period = frequency (int), reporttype = targetperiods/timeperiods
        """
        i = 0
        if period == Indicator.LOP:
            self.annotations = {}
        elif period == Indicator.MID_END:
            # Create annotations for MIDLINE TargetPeriod
            last_data_record = Result.objects.filter(
                indicator=OuterRef('pk'),
                periodic_target__customsort=0) \
                .order_by('-date_collected', '-pk')
            midline_sum = Sum(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.NUMBER) &
                        Q(result__periodic_target__customsort=0),
                        then=F('result__achieved')
                    )
                )
            )

            midline_last = Max(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        # Q(is_cumulative=True) &
                        Q(result__periodic_target__customsort=0),
                        then=Subquery(last_data_record.values('achieved')[:1])
                    )
                )
            )
            # Get the midline target value
            midline_target = Max(
                Case(
                    When(
                        Q(result__periodic_target__customsort=0),
                        then=Subquery(last_data_record.values('periodic_target__target')[:1])
                    )
                )
            )

            # Create annotations for ENDLINE TargetPeriod
            last_data_record = Result.objects.filter(
                indicator=OuterRef('pk'),
                periodic_target__customsort=1) \
                .order_by('-date_collected', '-pk')
            endline_sum = Sum(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.NUMBER) &
                        Q(result__periodic_target__customsort=1),
                        then=F('result__achieved')
                    )
                )
            )
            endline_last = Max(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        # Q(is_cumulative=True) &
                        Q(result__periodic_target__customsort=1),
                        then=Subquery(last_data_record.values('achieved')[:1])
                    )
                )
            )
            # Get the endline target value
            endline_target = Max(
                Case(
                    When(
                        Q(result__periodic_target__customsort=1),
                        then=Subquery(last_data_record.values('periodic_target__target')[:1])
                        # Q(periodictargets__period=PeriodicTarget.ENDLINE),
                        # then=F('periodictargets__target')
                    )
                )
            )
            self.annotations["0_target"] = midline_target
            self.annotations["1_target"] = endline_target
            self.annotations['0_sum'] = midline_sum
            # self.annotations['Midline_avg'] = midline_avg
            self.annotations['0_last'] = midline_last
            self.annotations['1_sum'] = endline_sum
            # self.annotations['Endline_avg'] = endline_avg
            self.annotations['1_last'] = endline_last
        else:
            #for k, v in timeperiods.items():
            for sequence_count, date_range in enumerate(timeperiods):
                start_date = date_range['start']
                end_date = date_range['end']

                last_data_record = Result.objects.filter(
                    indicator=OuterRef('pk'),
                    date_collected__gte=start_date,
                    date_collected__lte=end_date) \
                    .order_by('-date_collected', '-pk')

                # 1.) If the indicator is NUMBER and CUMULATIVE then do include all data
                # for the first period up to the first period's end_date. In other words,
                # do not limit data records by the current period's start date because if a
                # user selected most_recent=2 then we want the first most_recent period to include
                # all of the data from the periods that the user excluded by specifying num_recents=2
                # since it is a cumulative indicator.
                # 2.) If it is not a cumulative indicator then restrict it both by start_date and end_date
                # 3.) If it is not the first target_period then still restrict it by both start_date and
                # end_date otherwise it will double count the data prior to the first_period's start_date
                # for cumulative indicators
                if i == 0:
                    annotation_sum = Sum(
                        Case(
                            When(
                                Q(unit_of_measure_type=Indicator.NUMBER) &
                                Q(is_cumulative=True) &
                                Q(result__date_collected__lte=end_date),
                                then=F('result__achieved')
                            ),
                            When(
                                Q(unit_of_measure_type=Indicator.NUMBER) &
                                Q(result__date_collected__gte=start_date) &
                                Q(result__date_collected__lte=end_date),
                                then=F('result__achieved')
                            )
                        )
                    )
                else:
                    annotation_sum = Sum(
                        Case(
                            When(
                                Q(unit_of_measure_type=Indicator.NUMBER) &
                                Q(result__date_collected__gte=start_date) &
                                Q(result__date_collected__lte=end_date),
                                then=F('result__achieved')
                            )
                        )
                    )
                i += 1
                annotation_result_count = Sum(
                    Case(
                        When(
                            Q(result__date_collected__gte=start_date) &
                            Q(result__date_collected__lte=end_date),
                            then=Value(1)
                        ),
                        default=Value(0),
                        output_field=IntegerField()
                    )
                )
                annotation_last = Max(
                    Case(
                        When(
                            Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                            # Q(is_cumulative=True) &
                            Q(result__date_collected__gte=start_date) &
                            Q(result__date_collected__lte=end_date),
                            then=Subquery(last_data_record.values('achieved')[:1])
                        )
                    )
                )

                # if this is targetperiods IPTT report then get the target value for each period
                if reporttype == self.REPORT_TYPE_TARGETPERIODS:
                    annotation_target = Max(
                        Case(
                            When(
                                Q(result__date_collected__gte=start_date) &
                                Q(result__date_collected__lte=end_date),
                                then=Subquery(last_data_record.values('periodic_target__target')[:1])
                                # Q(periodictargets__start_date__gte=start_date) &
                                # Q(periodictargets__end_date__lte=end_date),
                                # then=F('periodictargets__target')
                            )
                        )
                    )
                    self.annotations[u"{}_target".format(sequence_count)] = annotation_target

                # the following becomes annotations for the queryset
                # e.g.
                # 0_sum=..., 1_sum=..., etc.
                # 0_last=..., 1_last=..., etc.
                #
                self.annotations[u"{}_sum".format(sequence_count)] = annotation_sum
                # self.annotations[u"{}_avg".format(k)] = annotation_avg
                self.annotations[u"{}_count".format(sequence_count)] = annotation_result_count
                self.annotations[u"{}_last".format(sequence_count)] = annotation_last
        return self.annotations

    @staticmethod
    def _get_num_periods(start_date, end_date, period):
        """
        Returns the number of periods, in months, depending on the period
        """
        num_months_in_period = IPTT_Mixin._get_num_months(period)
        total_num_months = len(list(rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date)))
        try:
            num_periods = total_num_months / num_months_in_period
            remainder_months = total_num_months % num_months_in_period
            if remainder_months > 0:
                num_periods += 1
        except ZeroDivisionError:
            num_periods = 0
        return num_periods

    def _generate_targetperiods(self, period):
        num_recents = self.filter_form_initial_data.get('numrecentperiods', 0)
        show_all = self.filter_form_initial_data.get('timeframe', 0)
        all_date_ranges = [date_range for date_range in self.program.get_periods_for_frequency(period)]
        if show_all == 0:
            try:
                start_date = parser.parse(self.filter_form_initial_data.get('start_period')).date()
            except TypeError, ValueError:
                start_date = self.program.reporting_period_start
            try:
                end_date = parser.parse(self.filter_form_initial_data.get('end_period')).date()
            except TypeError, ValueError:
                end_date = self.program.reporting_period_end
            filtered_date_ranges = [
                date_range for date_range in all_date_ranges
                if date_range['start'] >= start_date and date_range['start'] <= end_date
                ]
        elif show_all == 2 and num_recents is not None and num_recents > 0 and num_recents <= len(all_date_ranges):
            start_date = self.program.reporting_period_start
            end_date = date.today()
            if end_date > self.program.reporting_period_end:
                end_date = self.program.reporting_period_end
            filtered_date_ranges = [
                date_range for date_range in all_date_ranges
                if date_range['start'] >= start_date and date_range['start'] <= end_date
            ]

            if filtered_date_ranges:
                filtered_date_ranges = filtered_date_ranges[-num_recents:]
            else:
                # in case of reporting period in the future, don't crash
                filtered_date_ranges = all_date_ranges
        else:
            filtered_date_ranges = all_date_ranges
        if period == Indicator.MID_END:
            all_date_ranges = self.program.get_periods_for_frequency(Indicator.LOP)
        # for x in range(filtered_date_ranges):
        #     filtered_date_ranges[x]['targets'] = [target for target in periodic_targets if start_date < ]
        report_end_date = filtered_date_ranges[-1]['end']
        return (report_end_date, all_date_ranges, filtered_date_ranges)


    def _update_filter_form_initial(self, formdata):
        """ updates self.filter_form_initial_data dict with reqeust.GET values """
        for k in formdata:
            v = formdata.getlist(k)
            if k == 'csrfmiddlewaretoken' or k == 'program':
                continue
            if isinstance(v, list) and len(v) == 1:
                v = v[0]
            if k == self.REPORT_TYPE_TIMEPERIODS or k == self.REPORT_TYPE_TARGETPERIODS:
                try:
                    v = int(v)
                except ValueError:
                    v = int(Indicator.ANNUAL)  # defaults to annual

            if k in ['numrecentperiods', 'timeframe']:
                try:
                    v = int(v)
                except ValueError:
                    continue
            self.filter_form_initial_data[k] = v

    def _get_filters(self, data):
        filters = {}
        try:
            filters['level__in'] = data['level'] if isinstance(data['level'], list) else [data['level']]
        except KeyError:
            pass

        try:
            filters['sector__in'] = data['sector'] if isinstance(data['sector'], list) else [data['sector']]
        except KeyError:
            pass

        try:
            filters['indicator_type__in'] = data['ind_type'] if isinstance(data['ind_type'], list) else [
                data['ind_type']]
        except KeyError:
            pass

        try:
            filters['result__site__in'] = data['site'] if isinstance(data['site'], list) else [data['site']]
        except KeyError:
            pass

        try:
            filters['id__in'] = data['indicators'] if isinstance(data['indicators'], list) else [data['indicators']]
        except KeyError:
            pass

        return filters

    def prepare_indicators(self, reporttype, period, periods_date_ranges, indicators):
        # Calculate the cumulative sum across timeperiods for indicators that are NUMBER and CUMULATIVE
        for i, ind in enumerate(indicators):
            running_total = 0
            # process indicator number
            if ind['number'] is None:
                ind['number'] = u''

            # process level
            if ind['lastlevel'] is None:
                ind['lastlevel'] = u''

            # process unit_of_measure
            if ind['unit_of_measure'] is None:
                ind['unit_of_measure'] = u''

            # process direction_of_change
            ind['direction_of_change'] = symbolize_change(ind['direction_of_change'])

            # process indicator is_cumulative status
            if ind['target_frequency'] == Indicator.LOP:
                ind['cumulative'] = _("N/A")
            elif ind['is_cumulative'] is True:
                ind['cumulative'] = _("Cumulative")
            elif ind['is_cumulative'] is False:
                ind['cumulative'] = _("Non-cumulative")

            # process indicator_unit_type
            ind['unittype'] = symbolize_measuretype(ind['unit_of_measure_type'])

            # process baseline
            if ind['baseline_na'] is True:
                ind['baseline'] = _("N/A")
            elif ind['baseline'] is None:
                ind['baseline'] = u''
            elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                ind['baseline'] = u"{0}%".format(ind['baseline'])
            # process lop_target
            try:
                lop_target = float(ind['lop_target'])
                if ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                    ind['lop_target'] = u"{}%".format(formatFloat(lop_target))
                else:
                    ind['lop_target'] = formatFloat(lop_target)
            except (ValueError, TypeError):
                lop_target = u'—'
                ind['lop_target'] = lop_target

            # process lop_actual
            lop_actual = u'—'
            percent = u''
            if ind['unit_of_measure_type'] == Indicator.NUMBER:
                if ind['actualsum'] is not None:
                    lop_actual = float(ind['actualsum'])
            elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                if ind['lastdata'] is not None:
                    lop_actual = float(ind['lastdata'])
                    percent = u"%"
            try:
                ind['lop_actual'] = u"{}{}".format(formatFloat(lop_actual), percent)
            except TypeError:
                ind['lop_actual'] = u'—'

            # process lop_percent_met
            try:
                ind['lop_percent_met'] = lop_actual / lop_target * 100
            except TypeError:
                ind['lop_percent_met'] = _('N/A')
            except ZeroDivisionError:
                ind['lop_percent_met'] = _('N/A')

            if period in [Indicator.ANNUAL, Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.QUARTERLY,
                          Indicator.MONTHLY, Indicator.MID_END]:
                # if the frequency (period) is periodic, i.e., time-aware then go through each period
                # and calculate the cumulative total achieved across date ranges (periods)
                #for k, v in periods_date_ranges.items():
                for sequence_count, date_range in enumerate(periods_date_ranges):
                    if ind['unit_of_measure_type'] == Indicator.NUMBER and ind['is_cumulative'] is True:
                        current_sum = ind[u"{}_sum".format(sequence_count)]
                        if current_sum is not None:
                            # current_sum = 0
                            key = u"{}_rsum".format(sequence_count)
                            running_total = running_total + current_sum
                            ind[key] = running_total

                    # process target_period actual value
                    actual = u'{}_actual'.format(sequence_count)
                    actual_val = ''
                    percent_sign = ''
                    if ind['unit_of_measure_type'] == Indicator.NUMBER:
                        if ind['is_cumulative'] is True:
                            try:
                                actual_val = ind[u"{}_rsum".format(sequence_count)]
                                result_count = ind.get(u"{}_count".format(sequence_count), None)
                                if result_count == 0:
                                    actual_val = None
                            except KeyError:
                                actual_val = None
                        else:  # if it is not set to cumulative then default to non-cumulative even it is it not set
                            actual_val = ind[u"{}_sum".format(sequence_count)]
                    elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                        percent_sign = u'%'
                        actual_val = ind[u"{}_last".format(sequence_count)]

                    if actual_val is not None and actual_val != '':
                        ind[actual] = u"{}{}".format(formatFloat(actual_val), percent_sign)
                    else:
                        ind[actual] = u'—'

                    if reporttype == self.REPORT_TYPE_TARGETPERIODS:
                        # process target_period target value
                        target_key = u"{}_target".format(sequence_count)
                        if ind[target_key] is None:
                            target_val = u''
                        else:
                            target_val = formatFloat(float(ind[target_key]))

                        if ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                            if target_val > 0 and target_val != '':
                                ind[u'{}_period_target'.format(sequence_count)] = u"{}%".format(target_val)
                            else:
                                ind[u'{}_period_target'.format(sequence_count)] = ''
                        else:
                            ind[u'{}_period_target'.format(sequence_count)] = target_val

                        # process target_period percent_met value
                        try:
                            percent_met = u'{}_percent_met'.format(sequence_count)
                            target = float(ind[u"{}_target".format(sequence_count)])
                            if ind['unit_of_measure_type'] == Indicator.NUMBER:
                                if ind['is_cumulative'] is True:
                                    rsum = float(ind[u"{}_rsum".format(sequence_count)])
                                    percent_met_val = rsum / target * 100
                                else:
                                    percent_met_val = formatFloat(round(float(ind[u"{}_sum".format(sequence_count)]) / target * 100))
                                ind[percent_met] = percent_met_val
                            elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                                percent_met_val = formatFloat(round(float(ind[u"{}_last".format(sequence_count)]) / target * 100))
                                ind[percent_met] = percent_met_val
                        except (TypeError, KeyError):
                            ind[percent_met] = u''
                        except ZeroDivisionError:
                            ind[percent_met] = _("N/A")
        return indicators

    def prepare_iptt_period_dateranges(self, period, periods_date_ranges):
        """
        formats date_ranges with optgroup by year for all target_frequencies
        except ANNUAL, LOP, and MID_END.
        """
        if period in [Indicator.ANNUAL]:
            all_periods_start = [
                (date_range['start'], '{0} {1}'.format(
                    date_range['name'],
                    '({})'.format(date_range['label']) if date_range['label'] else ''))
                for date_range in periods_date_ranges]
            all_periods_end = [
                (date_range['end'], '{0} {1}'.format(
                    date_range['name'],
                    '({})'.format(date_range['label']) if date_range['label'] else ''))
                for date_range in periods_date_ranges]
        elif period in [Indicator.LOP, Indicator.MID_END]:
            all_periods_start = [
                (date_range['start'], l10n_date_medium(periods_date_ranges[0]['start']))
                for date_range in periods_date_ranges]
            all_periods_end = [
                (date_range['end'], l10n_date_medium(periods_date_ranges[0]['end']))
                for date_range in periods_date_ranges]
        else:
            all_periods_start = []
            all_periods_end = []
            this_year = periods_date_ranges[0]['start'].year
            these_starts = []
            these_ends = []
            for date_range in periods_date_ranges:
                if date_range['start'].year != this_year:
                    all_periods_start.append((this_year, these_starts))
                    all_periods_end.append((this_year, these_ends))
                    this_year = date_range['start'].year
                    these_starts = []
                    these_ends = []
                these_starts.append(
                    (date_range['start'], '{0} {1}'.format(
                        date_range['name'],
                        '({})'.format(date_range['label']) if date_range['label'] else ''))
                )
                these_ends.append(
                    (date_range['end'], '{0} {1}'.format(
                        date_range['name'],
                        '({})'.format(date_range['label']) if date_range['label'] else ''))
                )
            all_periods_start.append((this_year, these_starts))
            all_periods_end.append((this_year, these_ends))
        return all_periods_start, all_periods_end


    def get_context_data(self, **kwargs):
        """based on url + request params, populate context variables with all IPTT elements"""
        context = super(IPTT_Mixin, self).get_context_data(**kwargs)
        # reporttype = targetperiods/timeperiods
        reporttype = kwargs.get('reporttype', self.REPORT_TYPE_TARGETPERIODS)

        # get the program (url parameter)
        try:
            self.program = Program.objects.get(pk=kwargs.get('program_id'))
        except Program.DoesNotExist:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid program."))
            return context

        # populate self.filter_form_initial with GET parameters
        self._update_filter_form_initial(self.request.GET)
        # use the GET parameter values to filter indicators (by level/sector/site/id)
        filters = self._get_filters(self.filter_form_initial_data)

        # period is from the GET param 'timeperiods' or 'targetperiods'
        period = self.filter_form_initial_data.get(reporttype)

        # calculate aggregated actuals (sum, avg, last) per reporting period
        # (monthly, quarterly, tri-annually, seminu-annualy, and yearly) for each indicator
        lastlevel = Level.objects.filter(indicator__id=OuterRef('pk')).order_by('-id')
        last_data_record = Result.objects.filter(indicator=OuterRef('pk')).order_by('-date_collected')
        indicators = self.program.indicator_set.filter(
            **filters
            ).annotate(actualsum=Sum('result__achieved'),
                      actualavg=Avg('result__achieved'),
                      lastlevel=Subquery(lastlevel.values('name')[:1]),
                      lastlevelcustomsort=Subquery(lastlevel.values('customsort')[:1]),
                      lastdata=Subquery(last_data_record.values('achieved')[:1])) \
            .values(
            'id', 'number', 'name', 'program', 'target_frequency', 'lastlevel', 'sector', 'unit_of_measure',
            'direction_of_change', 'unit_of_measure_type', 'is_cumulative', 'baseline', 'baseline_na',
            'lop_target', 'actualsum', 'actualavg', 'lastdata', 'lastlevelcustomsort')

        if reporttype == self.REPORT_TYPE_TIMEPERIODS:
            period = Indicator.MONTHLY if period is None else period
            report_end_date, all_date_ranges, periods_date_ranges = self._generate_targetperiods(period)

        elif reporttype == self.REPORT_TYPE_TARGETPERIODS:
            target_frequencies = self.program.indicator_set.filter(
                target_frequency__isnull=False) \
                .exclude(target_frequency=Indicator.EVENT) \
                .values_list('target_frequency') \
                .distinct() \
                .order_by('target_frequency')
            if period is None or (period,) not in target_frequencies:
                period = target_frequencies[0][0]

            report_end_date, all_date_ranges, periods_date_ranges = self._generate_targetperiods(period)
            indicators = indicators.filter(target_frequency=period)
        else:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid report type."))
            return context

        all_periods_start, all_periods_end = self.prepare_iptt_period_dateranges(period, all_date_ranges)
        period_start_initial = periods_date_ranges[0]['start']
        period_end_initial = periods_date_ranges[-1]['end']
        # this removes the "Life Of Program" date range from the report so it doesn't duplicate the LOP values
        # shown for all indicators:
        if period == Indicator.LOP:
            periods_date_ranges.pop()
        self.filter_form_initial_data['period_choices_start'] = tuple(all_periods_start)
        self.filter_form_initial_data['period_choices_end'] = tuple(all_periods_end)
        self.filter_form_initial_data['period_start_initial'] = period_start_initial
        self.filter_form_initial_data['period_end_initial'] = period_end_initial
        # update report start date with filter date or program period start:
        if period_start_initial is not None:
            report_start_date = period_start_initial
        else:
            report_start_date = self.program.reporting_period_start
        if period_end_initial is not None:
            report_end_date = period_end_initial
        elif report_end_date is None:
            report_end_date = self.program.reporting_period_end

        self.annotations = self._generate_annotations(periods_date_ranges, period, reporttype)
        # update the queryset with annotations for timeperiods
        indicators = indicators.annotate(**self.annotations).order_by('lastlevelcustomsort', 'number', 'name')
        indicators = self.prepare_indicators(reporttype, period, periods_date_ranges, indicators)
        context['report_end_date_actual'] = report_end_date
        context['report_start_date'] = report_start_date
        context['report_end_date'] = report_end_date
        context['report_date_ranges'] = periods_date_ranges
        context['indicators'] = indicators  # iterable of dict()
        context['program'] = self.program
        context['reporttype'] = reporttype
        return context

def set_cell_value(cell, value, percent=False):
    value = l10n_number(value)
    if isinstance(value, str):
        value = value
    elif isinstance(value, unicode):
        value = value.encode('utf-8')
    else:
        # more catches?
        value = str(value)
    if percent and len(value) > 1 and value[-1] != '%' and value not in ['N/A', '—']:
        value = value + '%'
    cell.value = value



class IPTT_ExcelExport(IPTT_Mixin, TemplateView):
    # TODO: should be localize dates in the Excel format
    headers = ['Program ID', 'Indicator ID', 'No.', 'Indicator', 'Level', 'Unit of measure',
               'Change', 'C / NC', '# / %', 'Baseline']
    indicator_attributes = ['id', 'number', 'name', 'lastlevel', 'unit_of_measure',
                            'direction_of_change', 'cumulative', 'unittype', 'baseline',
                            'lop_target', 'lop_actual', 'lop_percent_met']

    def get_filename(self, reporttype):
        report = 'TvA'
        if reporttype == self.REPORT_TYPE_TIMEPERIODS:
            report = "Actuals only"
        filename = u'IPTT {} report {}.xlsx'.format(report, timezone.now().strftime('%b %d, %Y'))
        return filename

    def style_range(self, ws, cell_range, font, fill):
        # first_cell = ws[cell_range.split(":")[0]]

        rows = ws[cell_range]
        for row in rows:
            for cell in row:
                if fill:
                    cell.fill = fill
                if font:
                    cell.font = font

    def add_headers(self, ws, data):
        report_header_font = Font(size=18)
        headers_font = Font(bold=True)

        alignment = Alignment(horizontal='center',
                              vertical='bottom',
                              text_rotation=0,
                              wrap_text=False,
                              shrink_to_fit=False,
                              indent=0)
        alignment_right = Alignment(horizontal='right')

        bgcolor = PatternFill('solid', "EEEEEE")
        set_cell_value(ws['C1'], _("Indicator Performance Tracking Report"))
        ws['C1'].font = report_header_font
        ws.merge_cells('C1:J1')

        set_cell_value(ws['C2'], u"{0} - {1}".format(l10n_date_long(data['report_start_date']),
                                                     l10n_date_long(data['report_end_date'])))
        ws['C2'].font = report_header_font
        ws.merge_cells('C2:J2')

        ws['C3'] = data['program'].name
        ws['C3'].font = report_header_font
        ws.merge_cells('C3:J3')
        for col, header in enumerate(self.headers):
            set_cell_value(ws.cell(column=col+1, row=4), _(header))

        ws.merge_cells(start_row=3, start_column=len(self.headers)+1, end_row=3, end_column=len(self.headers)+3)
        #ws.cell(row=3, column=len(self.headers)+1).value = str(_('Life of Program'))
        set_cell_value(ws.cell(row=3, column=len(self.headers)+1), _('Life of Program'))
        ws.cell(row=3, column=len(self.headers)+1).alignment = alignment
        ws.cell(row=3, column=len(self.headers)+1).font = headers_font
        for col, header in enumerate([_('Target'), _('Actual'), _('% Met')]):
            #ws.cell(row=4, column=len(self.headers)+col+1).value = _(header)
            set_cell_value(ws.cell(row=4, column=len(self.headers)+col+1), header)
            ws.cell(row=4, column=len(self.headers)+col+1).alignment = alignment_right
        periods = data['report_date_ranges']
        col_offset = 0
        #col = 0
        periods_start_col = len(self.headers) + 4
        #col = len(self.headers) + 4
        for period in periods:
            col = periods_start_col + col_offset
            try:
                start_date = l10n_date_medium(period['start'])
                end_date = l10n_date_medium(period['end'])
            except TypeError:
                start_date = u''
                end_date = u''
            # note: period['name'] comes from the model already translated (no gettext required)
            set_cell_value(ws.cell(row=2, column=col), period['name'])
            ws.cell(row=2, column=col).alignment = alignment
            ws.cell(row=2, column=col).font = headers_font

            set_cell_value(ws.cell(row=3, column=col), u"{} - {}".format(start_date, end_date))
            ws.cell(row=3, column=col).alignment = alignment
            ws.cell(row=3, column=col).font = headers_font
            if data['reporttype'] == self.REPORT_TYPE_TARGETPERIODS:
                ws.merge_cells(start_row=2, start_column=col, end_row=2, end_column=col + 2)                
                ws.merge_cells(start_row=3, start_column=col, end_row=3, end_column=col + 2)

                set_cell_value(ws.cell(row=4, column=col), _('Target'))
                ws.cell(row=4, column=col).alignment = alignment_right
                set_cell_value(ws.cell(row=4, column=col + 1), _('Actual'))
                ws.cell(row=4, column=col + 1).alignment = alignment_right
                set_cell_value(ws.cell(row=4, column=col + 2), _('% Met'))
                ws.cell(row=4, column=col + 2).alignment = alignment_right
                col_offset += 3
            elif data['reporttype'] == self.REPORT_TYPE_TIMEPERIODS:
                ws.column_dimensions[get_column_letter(col)].width = 30

                set_cell_value(ws.cell(row=4, column=col), _("Actual"))
                ws.cell(row=4, column=col).alignment = alignment_right
                col_offset += 1

        header_range = CellRange(min_col=1, min_row=4, max_col=col, max_row=4).coord
        self.style_range(ws, header_range, headers_font, bgcolor)
        return ws

    def add_data(self, wb, ws, context):
        alignment = Alignment(wrap_text=True)
        indicators = context['indicators']
        program = context['program']
        periods = context['report_date_ranges']
        row = 5
        for indicator in indicators:
            wb.guess_types = False
            ws.cell(row=row, column=1).value = u'{0}'.format(program.id)
            is_percent = indicator.get('unittype') == '%'
            for col, attribute in enumerate(self.indicator_attributes):
                try:
                    value = indicator.get(attribute, u'N/A')
                except UnicodeDecodeError:
                    value = 'N/A'
                percent = col == 11 or (col == 10 and is_percent)
                set_cell_value(ws.cell(row=row, column=col+2), value, percent=percent)
            for col in [2, 4]:
                ws.cell(row=row, column=col).alignment = alignment
            for col in [1, 2]:
                value = ws.cell(row=row, column=col).value
                set_cell_value(ws.cell(row=row, column=col), int(value))

            col_offset = 0
            period_column_start = len(self.indicator_attributes) + 2 # program_id
            for c, period in enumerate(periods):
                col = period_column_start + col_offset
                if context['reporttype'] == self.REPORT_TYPE_TARGETPERIODS:
                    set_cell_value(ws.cell(row=row, column=col), 
                                   indicator.get(u'{0}_period_target'.format(period['customsort'])))
                    set_cell_value(ws.cell(row=row, column=col+1),
                                           indicator.get(u'{0}_actual'.format(period['customsort'])),
                                           percent=is_percent)
                    set_cell_value(ws.cell(row=row, column=col+2),
                                   indicator.get(u'{0}_percent_met'.format(period['customsort'])),
                                   percent=True)
                    col_offset += 3
                elif context['reporttype'] == self.REPORT_TYPE_TIMEPERIODS:
                    set_cell_value(ws.cell(row=row, column=col),
                                   indicator.get(u'{0}_actual'.format(c)),
                                   percent=is_percent)
                    col_offset += 1
            row += 1
        return ws

    def set_column_widths(self, ws):
        widths = [10, 10, 10, 100, 12, 40, 8, 12]
        for i, w in enumerate(widths):
            ws.column_dimensions[get_column_letter(i + 1)].width = w
        # collapse the first two columns (hidden program_id and indicator_id)
        ws.column_dimensions['A'].hidden = True
        ws.column_dimensions['B'].hidden = True
        return ws

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        wb = Workbook()
        # wb.guess_types = True
        ws = wb.active

        ws = self.add_headers(ws, context)
        ws = self.add_data(wb, ws, context)
        self.set_column_widths(ws)

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(self.get_filename(context['reporttype']))
        wb.save(response)
        return response



@require_POST
def create_pinned_report(request):
    """
    AJAX call for creating a PinnedReport
    """
    form = PinnedReportForm(request.POST)
    if form.is_valid():
        pr = form.save(commit=False)
        pr.tola_user = request.user.tola_user
        pr.save()
    else:
        return HttpResponseBadRequest(str(form.errors.items()))

    return HttpResponse()


@require_POST
def delete_pinned_report(request):
    """
    AJAX call for deleting a PinnedReport
    """
    pinned_report_id = request.POST.get('pinned_report_id')
    PinnedReport.objects.filter(id=pinned_report_id, tola_user_id=request.user.tola_user.id).delete()
    return HttpResponse()




class IPTTProgramMixin:
    def get_program_filter_data(self, request):
        programs = []
        countries = request.user.tola_user.countries.all()
        programs_qs = Program.objects.filter(
            funding_status="Funded", country__in=countries,
            reporting_period_start__isnull=False, reporting_period_end__isnull=False
        ).order_by('id')
        frequencies_qs = Indicator.objects.filter(
            program__in=programs_qs, target_frequency__isnull=False
        ).order_by('program_id', 'target_frequency').values(
            'program_id', 'target_frequency'
        ).distinct()
        for program in programs_qs:
            start_formatted = l10n_date_medium(program.reporting_period_start)
            end_formatted = l10n_date_medium(program.reporting_period_end)
            programs.append({
                'id': program.pk,
                'name': program.name,
                'frequencies': [f['target_frequency'] for f in frequencies_qs if f['program_id'] == program.pk],
                'periodDateRanges': {
                    '1': [[
                            start_formatted,
                            end_formatted
                        ]],
                    '2': [[
                            start_formatted,
                            end_formatted,
                            ugettext('Midline')
                        ],
                        [
                            start_formatted,
                            end_formatted,
                            ugettext('Endline')
                        ]],
                    '3': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date()]
                        for period in PeriodicTarget.generate_for_frequency(3)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '4': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date()]
                        for period in PeriodicTarget.generate_for_frequency(4)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '5': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date()]
                        for period in PeriodicTarget.generate_for_frequency(5)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '6': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         period['start'] > timezone.now().date()]
                        for period in PeriodicTarget.generate_for_frequency(6)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                    '7': [
                        [l10n_date_medium(period['start']),
                         l10n_date_medium(period['end']),
                         l10n_monthname(period['start']),
                         period['start'].year,
                         period['start'] > timezone.now().date()]
                        for period in PeriodicTarget.generate_for_frequency(7)(
                            program.reporting_period_start,
                            program.reporting_period_end)],
                }
            })
        return programs

class IPTTQuickstart(LoginRequiredMixin, IPTTProgramMixin, TemplateView):
    template_name = 'indicators/iptt_quickstart.html'

    def get_labels(self):
        # this is not in a loop or comprehension so as to allow translator comments:
        return {
            'tvaFilterTitle': ugettext('Periodic targets vs. actuals'),
            'timeperiodsFilterTitle': ugettext('Recent progress for all indicators'),
            'tvaFilterSubtitle': ugettext(
                'View results organized by target period for indicators that share the same target frequency'
                ),
            'timeperiodsFilterSubtitle': ugettext(
                ('View the most recent two months of results. '
                 '(You can customize your time periods.) '
                 'This report does not include periodic targets')
                ),
            'programSelect': ugettext('Program'),
            'periodSelect': ugettext('Target periods'),
            'showAll': ugettext('Show all'),
            'mostRecent': ugettext('Most recent'),
            'mostRecentPlaceholder': ugettext('enter a number'),
            'submitButton': ugettext('View report'),
            'targetperiods': {
                '2': ugettext('Midline and endline'),
                '3': ugettext('Annual'),
                '4': ugettext('Semi-annual'),
                '5': ugettext('Tri-annual'),
                # Translators: this is the measure of time (3 months)
                '6': ugettext('Quarterly'),
                '7': ugettext('Monthly')
            },
        }

    def get(self, request, *args, **kwargs):
        js_context = {
            'labels': self.get_labels(),
            'programs': self.get_program_filter_data(request)
        }
        return self.render_to_response({'js_context': js_context})


class IPTTReport(LoginRequiredMixin, IPTTProgramMixin, TemplateView):
    template_name= 'indicators/iptt_report.html'

    def get_labels(self):
        # this is not in a loop or comprehension so as to allow translator comments:
        return {
            'filterTitle': ugettext('Report options'),
            'reportTitle': ugettext('Indicator performance tracking table'),
            'sidebarToggle': ugettext('Show/hide filters'),
            'pin': ugettext('Pin'),
            'excel': ugettext('Excel'),
            'programSelect': ugettext('Program'),
            'periodSelect': {
                'tva': ugettext('Target periods'),
                'timeperiods': ugettext('Time periods')
            },
            'showAll': ugettext('Show all'),
            'mostRecent': ugettext('Most recent'),
            'startPeriod': ugettext('Start'),
            'endPeriod': ugettext('End'),
            'levelSelect': ugettext('Levels'),
            'typeSelect': ugettext('Types'),
            'sectorSelect': ugettext('Sectors'),
            'siteSelect': ugettext('Sites'),
            'indicatorSelect': ugettext('Indicators'),
            'timeperiods': {
                '3' : ugettext('Years'),
                '4' : ugettext('Semi-annual periods'),
                '5' : ugettext('Tri-annual periods'),
                # Translators: this is the measure of time (3 months)
                '6' : ugettext('Quarters'),
                '7' : ugettext('Months')
            },
            'targetperiods': {
                '2': ugettext('Midline and endline'),
                '3': ugettext('Annual'),
                '4': ugettext('Semi-annual'),
                '5': ugettext('Tri-annual'),
                # Translators: this is the measure of time (3 months)
                '6': ugettext('Quarterly'),
                '7': ugettext('Monthly')
            },
            'periodNames': {
                '3': ugettext('Year'),
                '4': ugettext('Semi-annual period'),
                '5': ugettext('Tri-annual period'),
                # Translators: this is the measure of time (3 months)
                '6': ugettext('Quarter')
            },
            'columnHeaders': {
                'lop': ugettext('Life of Program'),
                # Translators: this is the abbreviation for number
                'number': ugettext('No.'),
                'indicator': ugettext('Indicator'),
                'level': ugettext('Level'),
                'uom': ugettext('Unit of measure'),
                # Translators: the noun form (as in 'type of change')
                'change': ugettext('Change'),
                # Translators: C as in Cumulative and NC as in Non Cumulative
                'cumulative': ugettext('C / NC'),
                'numType': '# / %',
                'baseline': ugettext('Baseline'),
                'target': ugettext('Target'),
                'actual': ugettext('Actual'),
                'met': ugettext('% Met')
            },
            'noIndicatorsForFrequency': ugettext('No indicators for this target frequency in this program, '
                                                 'please select a different target period frequency.')
        }

    def get(self, request, *args, **kwargs):
        program_id = kwargs.get('program_id')
        js_context = {
            'labels': self.get_labels(),
            'programs': self.get_program_filter_data(request)
        }
        return self.render_to_response({'js_context': js_context})


class IPTTReportData(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        program_id = request.GET.get('programId')
        tva = request.GET.get('reportType') == 'tva'
        frequency = int(request.GET.get('frequency'))
        dates = Program.objects.values('reporting_period_start', 'reporting_period_end').get(pk=program_id)
        indicator_manager = IPTTIndicator.tva if tva else IPTTIndicator.timeperiods
        indicator_qs = indicator_manager.filter(
            program_id=program_id
            )
        if tva:
            indicator_qs = indicator_qs.filter(
                target_frequency=frequency
            )
        indicator_qs = indicator_qs.with_frequency_annotations(frequency, dates['reporting_period_start'], dates['reporting_period_end'])
        indicators = []
        for sort_index, indicator in enumerate(indicator_qs):
            this_indicator = {
                'id': indicator.pk,
                'sortIndex': sort_index,
                'number': indicator.number,
                'name': indicator.name,
                'level': indicator.levelname,
                'levelpk': indicator.level.pk if indicator.level else None,
                'sites': indicator.sites,
                'indicatorTypes': indicator.indicator_types,
                'sector': {'pk': indicator.sector.pk, 'name': indicator.sector.sector} if indicator.sector else {},
                'frequency': indicator.target_frequency,
                'unitOfMeasure': indicator.unit_of_measure,
                'cumulative': ugettext('Cumulative') if indicator.is_cumulative else ugettext('Non-cumulative'),
                'unitType': indicator.get_unit_of_measure_type,
                'baseline': indicator.baseline,
                'lopTarget': indicator.lop_target,
                'lopActual': indicator.lop_actual,
                'lopMet': indicator.lop_percent_met,
                'reportData': {}
            }
            if frequency != Indicator.LOP:
                values_count = getattr(indicator, 'frequency_{0}_count'.format(frequency))
                if tva:
                    this_indicator['reportData']['tva'] = {
                        frequency: [
                            {'target': getattr(indicator, 'frequency_{0}_period_{1}_target'.format(frequency, c)),
                             'value': getattr(indicator, 'frequency_{0}_period_{1}'.format(frequency, c))}
                            for c in range(values_count)
                        ]
                    }
                else:
                    this_indicator['reportData']['timeperiods'] = {
                        frequency: [getattr(indicator, 'frequency_{0}_period_{1}'.format(frequency, c)) for c in range(values_count)]
                    }
            indicators.append(this_indicator)
        reportData = {
            'programId': program_id,
            'reportFrequency': frequency,
            'reportType': 'tva' if tva else 'timeperiods',
            'indicators': indicators
        }
        return JsonResponse(reportData)