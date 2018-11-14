""" View functions for generating IPTT Reports (HTML and Excel)"""

import bisect
import csv
from collections import OrderedDict
from datetime import datetime
from dateutil import rrule, parser
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.core.urlresolvers import reverse_lazy
from django.db.models import Sum, Avg, Subquery, OuterRef, Case, When, Q, F, Max
from django.views.generic import TemplateView, FormView
from django.utils.translation import ugettext_lazy as _
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib import messages
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.cell_range import CellRange

from tola.util import formatFloat
from tola.l10n_utils import l10n_date_year_month, l10n_date_medium
from workflow.models import Program
from ..models import Indicator, CollectedData, Level, PeriodicTarget
from ..forms import IPTTReportQuickstartForm, IPTTReportFilterForm
from ..templatetags.mytags import symbolize_change, symbolize_measuretype
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
        """
        i = 0
        if period == Indicator.LOP:
            self.annotations = {}
        elif period == Indicator.MID_END:
            # Create annotations for MIDLINE TargetPeriod
            last_data_record = CollectedData.objects.filter(
                indicator=OuterRef('pk'),
                periodic_target__period=PeriodicTarget.MIDLINE) \
                .order_by('-date_collected', '-pk')
            midline_sum = Sum(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.NUMBER) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.MIDLINE),
                        then=F('collecteddata__achieved')
                    )
                )
            )
            # midline_avg = Avg(
            #     Case(
            #         When(
            #             Q(unit_of_measure_type=Indicator.PERCENTAGE) &
            #             Q(is_cumulative=False) &
            #             Q(collecteddata__periodic_target__period=PeriodicTarget.MIDLINE),
            #             then=F('collecteddata__achieved')
            #         )
            #     )
            # )
            midline_last = Max(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        # Q(is_cumulative=True) &
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
                        # Q(periodictargets__period=PeriodicTarget.MIDLINE),
                        # then=F('periodictargets__target')
                    )
                )
            )

            # Create annotations for ENDLINE TargetPeriod
            last_data_record = CollectedData.objects.filter(
                indicator=OuterRef('pk'),
                periodic_target__period=PeriodicTarget.ENDLINE) \
                .order_by('-date_collected', '-pk')
            endline_sum = Sum(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.NUMBER) &
                        Q(collecteddata__periodic_target__period=PeriodicTarget.ENDLINE),
                        then=F('collecteddata__achieved')
                    )
                )
            )
            # endline_avg = Avg(
            #     Case(
            #         When(
            #             Q(unit_of_measure_type=Indicator.PERCENTAGE) &
            #             Q(is_cumulative=False) &
            #             Q(collecteddata__periodic_target__period=PeriodicTarget.ENDLINE),
            #             then=F('collecteddata__achieved')
            #         )
            #     )
            # )
            endline_last = Max(
                Case(
                    When(
                        Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                        # Q(is_cumulative=True) &
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
                        # Q(periodictargets__period=PeriodicTarget.ENDLINE),
                        # then=F('periodictargets__target')
                    )
                )
            )
            self.annotations["Midline_target"] = midline_target
            self.annotations["Endline_target"] = endline_target
            self.annotations['Midline_sum'] = midline_sum
            # self.annotations['Midline_avg'] = midline_avg
            self.annotations['Midline_last'] = midline_last
            self.annotations['Endline_sum'] = endline_sum
            # self.annotations['Endline_avg'] = endline_avg
            self.annotations['Endline_last'] = endline_last
        else:
            for k, v in timeperiods.items():
                start_date = datetime.strftime(v[0], '%Y-%m-%d') # TODO: localize this date
                end_date = datetime.strftime(v[1], '%Y-%m-%d') # TODO: localize this date

                last_data_record = CollectedData.objects.filter(
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
                                Q(collecteddata__date_collected__lte=end_date),
                                then=F('collecteddata__achieved')
                            ),
                            When(
                                Q(unit_of_measure_type=Indicator.NUMBER) &
                                Q(collecteddata__date_collected__gte=start_date) &
                                Q(collecteddata__date_collected__lte=end_date),
                                then=F('collecteddata__achieved')
                            )
                        )
                    )
                else:
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
                i += 1
                # annotation_avg = Avg(
                #     Case(
                #         When(
                #             Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                #             Q(is_cumulative=False) &
                #             Q(collecteddata__date_collected__gte=start_date) &
                #             Q(collecteddata__date_collected__lte=end_date),
                #             then=F('collecteddata__achieved')
                #         )
                #     )
                # )
                annotation_last = Max(
                    Case(
                        When(
                            Q(unit_of_measure_type=Indicator.PERCENTAGE) &
                            # Q(is_cumulative=True) &
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
                                # Q(periodictargets__start_date__gte=start_date) &
                                # Q(periodictargets__end_date__lte=end_date),
                                # then=F('periodictargets__target')
                            )
                        )
                    )
                    self.annotations[u"{}_target".format(k)] = annotation_target

                # the following becomes annotations for the queryset
                # e.g.
                # Year 1_sum=..., Year 2_sum=..., etc.
                # Year 1_avg=..., Year 2_avg=..., etc.
                # Year 1_last=..., Year 2_last=..., etc.
                #
                self.annotations[u"{}_sum".format(k)] = annotation_sum
                # self.annotations[u"{}_avg".format(k)] = annotation_avg
                self.annotations[u"{}_last".format(k)] = annotation_last
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

    def _generate_targetperiods(self, program, filter_start_date, filter_end_date, period, show_all, num_recents):
        targetperiods = OrderedDict()
        today = datetime.today().date()
        # today = datetime.strptime('2020-02-23', '%Y-%m-%d').date()

        # Get all periodic targets whose indicator is in this program and whose frequency matches this period,
        # use "values" to group by period, target, start_date, and end_date
        # this "grab all of them and group by" deals with programs where some targets have not been added after
        # the reporting period was changed (issue #700: https://github.com/mercycorps/TolaActivity/issues/700)
        periodic_targets = PeriodicTarget.objects.filter(
            indicator__program__in=[program.id],
            indicator__target_frequency=period
        ).values("period", "target", "start_date", "end_date").order_by("start_date")

        try:
            start_date = parser.parse(self.filter_form_initial_data['start_date']).date()
            end_date = parser.parse(self.filter_form_initial_data['end_date']).date()
            periodic_targets = periodic_targets.filter(start_date__gte=start_date, end_date__lte=end_date)
        except (KeyError, ValueError):
            pass

        for pt in periodic_targets:
            # if it is LOP Target then do not show any target periods becaseu there are none.
            if pt['period'] == Indicator.TARGET_FREQUENCIES[0][1]:
                continue
            targetperiods[pt['period']] = [pt['start_date'], pt['end_date'], pt['target']]

        # save the unfiltered targetperiods into the global variable so that
        # it be used to populate the periods dropdown
        all_date_ranges = targetperiods

        # Update the report_end_date with the last reporting_period's end_date
        try:
            report_end_date = targetperiods[targetperiods.keys()[-1]][1]
        except (TypeError, IndexError):
            report_end_date = self.program.reporting_period_end
        # this check is necessary becasue mid/end line do not have start/end dates
        if report_end_date is None:
            report_end_date = self.program.reporting_period_end

        if num_recents is not None and num_recents > 0 and period not in [Indicator.LOP, Indicator.MID_END]:
            # filter out those timeperiods whose end_dates are larger than today's date
            targetperiods_less_than_today = filter(lambda v: v[1][0] <= today, targetperiods.items())

            if len(targetperiods_less_than_today) > num_recents:
                # filter out dates that are outside of the most_recent index specified by user
                most_recent_targetperiods = targetperiods_less_than_today[(
                    len(targetperiods_less_than_today) - num_recents):]
            else:
                most_recent_targetperiods = targetperiods_less_than_today

            # convert to oredered dictionary to preserve order (IMPORTANT!)
            targetperiods = OrderedDict((k, v) for k, v in most_recent_targetperiods)
        elif show_all == 0 and filter_start_date is not None and filter_end_date is not None:
            filtered_targetperiods = OrderedDict()
            # TODO: localize the following dates
            filter_start_date = datetime.strptime(filter_start_date, "%Y-%m-%d").date()
            filter_end_date = datetime.strptime(filter_end_date, "%Y-%m-%d").date()
            # update report_end_date context variable so date displays match target periods displayed:
            report_end_date = filter_end_date
            for k, v in targetperiods.items():
                start_date = v[0]
                end_date = v[1]
                if start_date >= filter_start_date and filter_end_date >= end_date:
                    filtered_targetperiods[k] = [start_date, end_date]
            return (report_end_date, all_date_ranges, filtered_targetperiods)
        return (report_end_date, all_date_ranges, targetperiods)

    def _generate_timeperiods(self, filter_start_date, filter_end_date, frequency, show_all, num_recents):
        timeperiods = OrderedDict()
        today_date = datetime.today().date()
        # today_date = datetime.strptime('2020-02-23', '%Y-%m-%d').date()

        period_name = self._get_period_name(frequency)
        num_months_in_period = self._get_num_months(frequency)

        num_periods = IPTT_Mixin._get_num_periods(self.program.reporting_period_start,
                                                  self.program.reporting_period_end, frequency)

        start_date = self.program.reporting_period_start

        # bump up num_periods by 1 because the loop starts from 1 instead of 0
        num_periods += 1
        for i in range(1, num_periods):
            if i > 1:
                # if it is not the first period then advance the
                # start_date by the correct number of months.
                start_date = start_date + relativedelta(months=+num_months_in_period)

            end_date = start_date + relativedelta(months=+num_months_in_period) + relativedelta(days=-1)
            # print('start_date={}, end_date={}'.format(start_date, end_date))
            if frequency == Indicator.MONTHLY:
                period_name = datetime.strftime(start_date, "%b %Y") #
                timeperiods[u"{}".format(period_name)] = [start_date, end_date]
            else:
                timeperiods[u"{} {}".format(period_name, i)] = [start_date, end_date]

        # save the unfiltered targetperiods into the global variable so that
        # it be used to populate the periods dropdown
        all_date_ranges = timeperiods

        # Update the report_end_date with the last reporting_period's end_date
        try:
            report_end_date = timeperiods[timeperiods.keys()[-1]][1]
        except (TypeError, IndexError):
            report_end_date = self.program.reporting_period_end

        if num_recents is not None and num_recents > 0:
            # filter out those timeperiods whose end_dates are larger than today's date
            timeperiods_less_than_today = filter(lambda v: v[1][0] <= today_date, timeperiods.items())
            if len(timeperiods_less_than_today) > num_recents:
                # filter out dates that are outside of the most_recent index specified by user
                most_recent_timeperiods = timeperiods_less_than_today[(
                    len(timeperiods_less_than_today) - num_recents):]
            else:
                most_recent_timeperiods = timeperiods_less_than_today
            # convert to oredered dictionary to preserve order (IMPORTANT!)
            timeperiods = OrderedDict((k, v) for k, v in most_recent_timeperiods)
        elif show_all == 0 and filter_start_date is not None and filter_end_date is not None:
            filtered_timeperiods = OrderedDict()
            # TODO: localize the following dates
            filter_start_date = datetime.strptime(filter_start_date, "%Y-%m-%d").date()
            filter_end_date = datetime.strptime(filter_end_date, "%Y-%m-%d").date()
            for k, v in timeperiods.items():
                start_date = v[0]
                end_date = v[1]
                if start_date >= filter_start_date and filter_end_date >= end_date:
                    filtered_timeperiods[k] = [start_date, end_date]
            return (report_end_date, all_date_ranges, filtered_timeperiods)

        return (report_end_date, all_date_ranges, timeperiods)

    def _update_filter_form_initial(self, formdata):
        self.filter_form_initial_data = {}
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

            if k == 'numrecentperiods':
                try:
                    v = int(v)
                except ValueError:
                    continue
            # print("{} = {}".format(k, v))
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
            filters['collecteddata__site__in'] = data['site'] if isinstance(data['site'], list) else [data['site']]
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
                ind['number'] = ''

            # process level
            if ind['lastlevel'] is None:
                ind['lastlevel'] = ''

            # process unit_of_measure
            if ind['unit_of_measure'] is None:
                ind['unit_of_measure'] = ''

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
                ind['baseline'] = ''
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
                lop_target = ''
                ind['lop_target'] = lop_target

            # process lop_actual
            lop_actual = ''
            percent = ''
            if ind['unit_of_measure_type'] == Indicator.NUMBER:
                if ind['actualsum'] is not None:
                    lop_actual = float(ind['actualsum'])
            elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                if ind['lastdata'] is not None:
                    lop_actual = float(ind['lastdata'])
                    percent = "%"
            try:
                ind['lop_actual'] = u"{}{}".format(formatFloat(lop_actual), percent)
            except TypeError:
                ind['lop_actual'] = ''

            # process lop_percent_met
            try:
                ind['lop_percent_met'] = u"{}%".format(formatFloat(round(lop_actual / lop_target * 100)))
            except TypeError:
                ind['lop_percent_met'] = ''
            except ZeroDivisionError:
                ind['lop_percent_met'] = _('N/A')

            if period in [Indicator.ANNUAL, Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.QUARTERLY,
                          Indicator.MONTHLY, Indicator.MID_END]:
                # if the frequency (period) is periodic, i.e., time-aware then go through each period
                # and calculate the cumulative total achieved across date ranges (periods)
                for k, v in periods_date_ranges.items():
                    if ind['unit_of_measure_type'] == Indicator.NUMBER and ind['is_cumulative'] is True:
                        current_sum = ind[u"{}_sum".format(k)]
                        if current_sum is not None:
                            # current_sum = 0
                            key = u"{}_rsum".format(k)
                            running_total = running_total + current_sum
                            ind[key] = running_total

                    # process target_period actual value
                    actual = u'{}_actual'.format(k)
                    actual_val = ''
                    percent_sign = ''
                    if ind['unit_of_measure_type'] == Indicator.NUMBER:
                        if ind['is_cumulative'] is True:
                            try:
                                actual_val = ind[u"{}_rsum".format(k)]
                            except KeyError:
                                actual_val = ''
                        else:  # if it is not set to cumulative then default to non-cumulative even it is it not set
                            actual_val = ind[u"{}_sum".format(k)]
                    elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                        percent_sign = '%'
                        actual_val = ind[u"{}_last".format(k)]

                    if actual_val is not None and actual_val != '':
                        ind[actual] = u"{}{}".format(formatFloat(actual_val), percent_sign)
                    else:
                        ind[actual] = ''

                    if reporttype == self.REPORT_TYPE_TARGETPERIODS:
                        # process target_period target value
                        target_key = u"{}_target".format(k)
                        if ind[target_key] is None:
                            target_val = ''
                        else:
                            target_val = formatFloat(float(ind[target_key]))

                        if ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                            if target_val > 0 and target_val != '':
                                ind[u'{}_period_target'.format(k)] = u"{}%".format(target_val)
                            else:
                                ind[u'{}_period_target'.format(k)] = ''
                        else:
                            ind[u'{}_period_target'.format(k)] = target_val

                        # process target_period percent_met value
                        try:
                            percent_met = u'{}_percent_met'.format(k)
                            target = float(ind[u"{}_target".format(k)])
                            if ind['unit_of_measure_type'] == Indicator.NUMBER:
                                if ind['is_cumulative'] is True:
                                    rsum = float(ind[u"{}_rsum".format(k)])
                                    percent_met_val = formatFloat(round(rsum / target * 100))
                                else:
                                    percent_met_val = formatFloat(round(float(ind[u"{}_sum".format(k)]) / target * 100))
                                ind[percent_met] = u"{}%".format(percent_met_val)
                            elif ind['unit_of_measure_type'] == Indicator.PERCENTAGE:
                                percent_met_val = formatFloat(round(float(ind[u"{}_last".format(k)]) / target * 100))
                                ind[percent_met] = u"{}%".format(percent_met_val)
                        except (TypeError, KeyError):
                            ind[percent_met] = ''
                        except ZeroDivisionError:
                            ind[percent_met] = _("N/A")
        return indicators

    def prepare_iptt_period_dateranges(self, period, periods_date_ranges, from_or_to):
        """
        formats date_ranges with optgroup by year for all target_frequencies
        except ANNUAL.
        """
        start_date_choices = []
        choices = []
        start = None
        for i, name in enumerate(periods_date_ranges):
            start = periods_date_ranges[name][0]
            if i == 0:
                prev_start = start

            # For annual period (frequency) do not create optgrp
            if period != Indicator.ANNUAL and start.year != prev_start.year:
                start_date_choices.append((prev_start.year, tuple(choices)))
                prev_start = start
                choices = []

            # TODO: localize the following dates
            if period == Indicator.MONTHLY:
                # this is the value printed to IPTT:
                value = u"{}".format(l10n_date_year_month(periods_date_ranges[name][0]).decode('utf-8'))
            else:
                value = u"{} ({} - {})".format(
                    name,
                    l10n_date_medium(periods_date_ranges[name][0]).decode('utf-8'),
                    l10n_date_medium(periods_date_ranges[name][1]).decode('utf-8')
                )
            if from_or_to == self.FROM:
                key = periods_date_ranges[name][0]
            else:
                key = periods_date_ranges[name][1]
            choices.append((key, value))

        if period == Indicator.ANNUAL:
            start_date_choices = choices
        else:
            if start:
                # now add the last set of choices from the last iteration
                start_date_choices.append((start.year, tuple(choices)))
        return start_date_choices


    def get_context_data(self, **kwargs):
        context = super(IPTT_Mixin, self).get_context_data(**kwargs)
        reporttype = kwargs.get('reporttype')
        program_id = kwargs.get('program_id')

        try:
            self.program = Program.objects.get(pk=program_id)
        except Program.DoesNotExist:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid program."))
            return context

        self._update_filter_form_initial(self.request.GET)
        filters = self._get_filters(self.filter_form_initial_data)

        if reporttype == self.REPORT_TYPE_TIMEPERIODS:
            period = self.filter_form_initial_data[self.REPORT_TYPE_TIMEPERIODS]
        else:
            period = self.filter_form_initial_data[self.REPORT_TYPE_TARGETPERIODS]

        try:
            num_recents = self.filter_form_initial_data['numrecentperiods']
        except KeyError:
            num_recents = 0

        try:
            show_all = self.filter_form_initial_data['timeframe']
        except KeyError:
            show_all = 0

        # calculate aggregated actuals (sum, avg, last) per reporting period
        # (monthly, quarterly, tri-annually, seminu-annualy, and yearly) for each indicator
        lastlevel = Level.objects.filter(indicator__id=OuterRef('pk')).order_by('-id')
        last_data_record = CollectedData.objects.filter(indicator=OuterRef('pk')).order_by('-date_collected')
        indicators = Indicator.objects.filter(program__in=[program_id], **filters) \
            .annotate(actualsum=Sum('collecteddata__achieved'),
                      actualavg=Avg('collecteddata__achieved'),
                      lastlevel=Subquery(lastlevel.values('name')[:1]),
                      lastlevelcustomsort=Subquery(lastlevel.values('customsort')[:1]),
                      lastdata=Subquery(last_data_record.values('achieved')[:1])) \
            .values(
            'id', 'number', 'name', 'program', 'target_frequency', 'lastlevel', 'sector', 'unit_of_measure',
            'direction_of_change', 'unit_of_measure_type', 'is_cumulative', 'baseline', 'baseline_na',
            'lop_target', 'actualsum', 'actualavg', 'lastdata', 'lastlevelcustomsort')

        start_period = self.request.GET.get('start_period')
        end_period = self.request.GET.get('end_period')

        if reporttype == self.REPORT_TYPE_TIMEPERIODS:
            # Update the report_end_date to make sure it ends with the last period's end_date
            # Also, get the all of the periodic date ranges based on the selected period
            report_end_date, all_date_ranges, periods_date_ranges = self._generate_timeperiods(
                start_period, end_period, period, show_all, num_recents)

        elif reporttype == self.REPORT_TYPE_TARGETPERIODS:
            target_frequencies = Indicator.objects \
                .filter(program__in=[program_id], target_frequency__isnull=False) \
                .exclude(target_frequency=Indicator.EVENT) \
                .values_list('target_frequency') \
                .distinct() \
                .order_by('target_frequency')

            if (period,) not in target_frequencies:
                period = target_frequencies[0][0]

            report_end_date, all_date_ranges, periods_date_ranges = self._generate_targetperiods(
                self.program, start_period, end_period, period, show_all, num_recents)
            indicators = indicators.filter(target_frequency=period)
        else:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid report type."))
            return context

        if period == Indicator.MID_END or period == Indicator.LOP:
            reporting_sdate = l10n_date_medium(self.program.reporting_period_start)
            reporting_edate = l10n_date_medium(self.program.reporting_period_end)
            all_periods_start = ((self.program.reporting_period_start, reporting_sdate,),)
            all_periods_end = ((self.program.reporting_period_end, reporting_edate),)

            period_start_initial = None  # self.program.reporting_period_start
            period_end_initial = None  # self.program.reporting_period_end
        else:
            try:
                period_start_initial = periods_date_ranges[periods_date_ranges.keys()[0]][0]
                period_end_initial = periods_date_ranges[periods_date_ranges.keys()[-1]][1]
            except IndexError:
                period_start_initial = None
                period_end_initial = None
            all_periods_start = self.prepare_iptt_period_dateranges(period, all_date_ranges, self.FROM)
            all_periods_end = self.prepare_iptt_period_dateranges(period, all_date_ranges, self.TO)
        # TODO: localize the following dates ?
        self.filter_form_initial_data['period_choices_start'] = tuple(all_periods_start)
        self.filter_form_initial_data['period_choices_end'] = tuple(all_periods_end)
        self.filter_form_initial_data['period_start_initial'] = period_start_initial
        self.filter_form_initial_data['period_end_initial'] = period_end_initial
        # update report start date with filter date or program period start:
        if period_start_initial is not None:
            report_start_date = period_start_initial
        else:
            report_start_date = self.program.reporting_period_start
        self.annotations = self._generate_annotations(periods_date_ranges, period, reporttype)
        # update the queryset with annotations for timeperiods
        indicators = indicators.annotate(**self.annotations).order_by('lastlevelcustomsort', 'number', 'name')
        indicators = self.prepare_indicators(reporttype, period, periods_date_ranges, indicators)

        context['report_end_date_actual'] = report_end_date
        context['report_start_date'] = report_start_date
        context['report_end_date'] = report_end_date
        context['report_date_ranges'] = periods_date_ranges  # collections.OrderedDict
        context['indicators'] = indicators  # iterable of dict()
        context['program'] = self.program
        context['reporttype'] = reporttype
        return context


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
        ws['C1'] = "Indicator Performance Tracking Report"
        ws['C1'].font = report_header_font
        ws.merge_cells('C1:J1')

        ws['C2'] = u"{0} - {1}".format(datetime.strftime(data['report_start_date'], "%b %d, %Y"),
                                      datetime.strftime(data['report_end_date'], "%b %d, %Y"))
        ws['C2'].font = report_header_font
        ws.merge_cells('C2:J2')

        ws['C3'] = data['program'].name
        ws['C3'].font = report_header_font
        ws.merge_cells('C3:J3')
        for col, header in enumerate(self.headers):
            ws.cell(column=col+1, row=4).value = header

        ws.merge_cells(start_row=3, start_column=len(self.headers)+1, end_row=3, end_column=len(self.headers)+3)
        ws.cell(row=3, column=len(self.headers)+1).value = 'Life of Program'
        ws.cell(row=3, column=len(self.headers)+1).alignment = alignment
        ws.cell(row=3, column=len(self.headers)+1).font = headers_font
        for col, header in enumerate(['Target', 'Actual', '% Met']):
            ws.cell(row=4, column=len(self.headers)+col+1).value = header
            ws.cell(row=4, column=len(self.headers)+col+1).alignment = alignment_right
        periods = data['report_date_ranges']
        col_offset = 0
        col = 0
        periods_start_col = len(self.headers) + 4
        if data['reporttype'] == self.REPORT_TYPE_TARGETPERIODS:
            for name, period in periods.items():
                col = periods_start_col + col_offset

                # processs period date ranges
                try:
                    start_date = datetime.strftime(period[0], '%b %d, %Y')
                    end_date = datetime.strftime(period[1], '%b %d, %Y')

                    # process period name
                    ws.merge_cells(start_row=2, start_column=col, end_row=2, end_column=col + 2)
                    ws.cell(row=2, column=col).value = name
                    ws.cell(row=2, column=col).alignment = alignment
                    ws.cell(row=2, column=col).font = headers_font

                    ws.merge_cells(start_row=3, start_column=col, end_row=3, end_column=col + 2)
                    ws.cell(row=3, column=col).value = "{} - {}".format(start_date, end_date)
                    ws.cell(row=3, column=col).alignment = alignment
                    ws.cell(row=3, column=col).font = headers_font

                except TypeError:
                    start_date = ''
                    end_date = ''
                    ws.merge_cells(start_row=3, start_column=col, end_row=3, end_column=col + 2)
                    ws.cell(row=3, column=col).value = name
                    ws.cell(row=3, column=col).alignment = alignment
                    ws.cell(row=3, column=col).font = headers_font

                ws.cell(row=4, column=col).value = 'Target'
                ws.cell(row=4, column=col).alignment = alignment_right
                ws.cell(row=4, column=col + 1).value = 'Actual'
                ws.cell(row=4, column=col + 1).alignment = alignment_right
                ws.cell(row=4, column=col + 2).value = '% Met'
                ws.cell(row=4, column=col + 2).alignment = alignment_right
                col_offset += 3
            col += 2
        elif data['reporttype'] == self.REPORT_TYPE_TIMEPERIODS:
            for name, period in periods.items():
                col = periods_start_col + col_offset
                ws.cell(row=2, column=col).value = name
                ws.cell(row=2, column=col).alignment = alignment
                ws.cell(row=2, column=col).font = headers_font
                ws.column_dimensions[get_column_letter(col)].width = 30

                start_date = datetime.strftime(period[0], '%b %d, %Y')
                end_date = datetime.strftime(period[1], '%b %d, %Y')
                ws.cell(row=3, column=col).value = "{} - {}".format(start_date, end_date)
                ws.cell(row=3, column=col).alignment = alignment
                ws.cell(row=3, column=col).font = headers_font

                ws.cell(row=4, column=col).value = "Actual"
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
            for col, attribute in enumerate(self.indicator_attributes):
                ws.cell(row=row, column=col+2).value = u'{0}'.format(
                    indicator.get(attribute, 'N/A')
                    )
            for col in [2, 4]:
                ws.cell(row=row, column=col).alignment = alignment
            for col in [1, 2]:
                value = ws.cell(row=row, column=col).value
                ws.cell(row=row, column=col).value = int(value)

            col_offset = 0
            period_column_start = len(self.indicator_attributes) + 2 # program_id
            for period in periods.keys():
                col = period_column_start + col_offset
                if context['reporttype'] == self.REPORT_TYPE_TARGETPERIODS:
                    ws.cell(row=row, column=col).value = u'{0}'.format(
                        indicator.get(u'{0}_period_target'.format(period)))
                    ws.cell(row=row, column=col+1).value = u'{0}'.format(
                        indicator.get(u'{0}_actual'.format(period)))
                    ws.cell(row=row, column=col+2).value = u'{0}'.format(
                        indicator.get(u'{0}_percent_met'.format(period)))
                    col_offset += 3
                elif context['reporttype'] == self.REPORT_TYPE_TIMEPERIODS:
                    ws.cell(row=row, column=col+1).value = u'{0}'.format(
                        indicator.get(u'{0}_actual'.format(period)))
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


class IPTT_ReportIndicatorsWithVariedStartDate(TemplateView):
    template_name = "indicators/iptt_indicators_varied_startdates.html"

    def get_context_data(self, **kwargs):
        context = super(IPTT_ReportIndicatorsWithVariedStartDate, self).get_context_data(**kwargs)
        program_id = kwargs.get('program_id')

        try:
            program = Program.objects.get(pk=program_id)
        except Program.DoesNotExist:
            context['redirect'] = reverse_lazy('iptt_quickstart')
            messages.info(self.request, _("Please select a valid program."))
            return context

        if program.do_periodictargets_match_reporting_date is True:
            context['redirect'] = reverse_lazy('iptt_quickstart')
        context['program'] = program
        context['indicators'] = program.get_indicators_in_need_of_targetperiods_fixing
        return context

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        try:
            redirect_url = context['redirect']
            return HttpResponseRedirect(redirect_url)
        except KeyError:
            pass
        return self.render_to_response(context)


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
        program_id = request.POST.get('targetperiods-program', None)
        if program_id:
            program = Program.objects.get(pk=program_id)
            if program.do_periodictargets_match_reporting_date is False:
                return HttpResponseRedirect(reverse_lazy('iptt_redirect', kwargs={'program_id': program_id}))

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

        redirect_url = u"{}?{}={}&timeframe={}".format(redirect_url, prefix, period, timeframe)
        if num_recents:
            redirect_url = u"{}&numrecentperiods={}".format(redirect_url, num_recents)
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


class IPTT_ReportView(IPTT_Mixin, TemplateView):

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)

        form_kwargs = {'request': request, 'program': context['program']}
        context['form'] = IPTTReportFilterForm(initial=self.filter_form_initial_data, **form_kwargs)

        context['report_wide'] = True
        if context.get('redirect', None):
            return HttpResponseRedirect(reverse_lazy('iptt_quickstart'))
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        filterdata = request.POST.copy()
        # no need to include this token in querystring
        del (filterdata['csrfmiddlewaretoken'])
        url_kwargs = {
            'program_id': filterdata['program'],
            'reporttype': kwargs['reporttype'],
        }
        # do not include it in the querystring because it is already part of the url kwargs
        del filterdata['program']

        # if show_all or most_recent is specified then do not filter
        # by period_start or period_end dates.
        if filterdata.get('timeframe', None) is not None:
            try:
                del (filterdata['start_period'])
                del (filterdata['end_period'])
            except KeyError:
                pass

        redirect_url = u"{}?{}".format(reverse_lazy('iptt_report', kwargs=url_kwargs),
                                      filterdata.urlencode())
        return HttpResponseRedirect(redirect_url)

class IPTT_CSVExport(IPTT_Mixin, TemplateView):
    header_row = ["Program:"]
    subheader_row = ['id', 'number', 'name', 'level_name', 'unit_of_measure', 'unit_of_measure_type',
                     'sector', 'disaggregations', 'baseline', 'baseline_na', 'lop_target', 'target_frequency',
                     'lop_sum', 'lop_target', 'lop_met']

    def _update_filter_form_initial(self, formdata):
        super(IPTT_CSVExport, self)._update_filter_form_initial(formdata)
        default_values = {
            'timeperiods': Indicator.MONTHLY,
            'timeframe': 2,
        }
        default_values.update(self.filter_form_initial_data)
        self.filter_form_initial_data = default_values

    def get_context_data(self, **kwargs):
        self.program = Program.objects.get(pk=kwargs.get('program_id'))
        self.reporttype = kwargs['reporttype']
        if self.reporttype == self.REPORT_TYPE_TIMEPERIODS:
            end_date, all_date_ranges, periods_date_ranges = self._generate_timeperiods(
            self.program.reporting_period_start,
            self.program.reporting_period_end,
            Indicator.MONTHLY, None, None)
            indicators = IPTTIndicator.notargets.filter(program__in=[self.program.id]).period(Indicator.MONTHLY)
        context = {
            'program': self.program,
            'indicators': indicators,
            'report_date_ranges': periods_date_ranges
        }
        return context

    def get_indicator_row(self, indicator, timeperiods):
        row = []
        for field in self.subheader_row:
            value = getattr(indicator, field, 'N/A')
            value = value if value is not None else 'N/A'
            row.append(value)
        for timeperiod in timeperiods:
            row.append(getattr(indicator, u"{}_sum".format(timeperiod), 'N/A'))
        return row

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        header_row = self.header_row + [self.program.name] + [''] * (len(self.subheader_row)-2)
        header_row.extend(context['report_date_ranges'].keys())
        subheader_row = self.subheader_row + ['Actual'] * len(context['report_date_ranges'].keys())
        response = HttpResponse(content_type="text/csv")
        writer = csv.writer(response)
        writer.writerow(header_row)
        writer.writerow(subheader_row)
        for indicator in context['indicators']:
            writer.writerow(self.get_indicator_row(indicator, context['report_date_ranges']))
        return response
