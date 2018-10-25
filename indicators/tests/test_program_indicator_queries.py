"""Tests for the Mangosteen program queries (indicator on target/completion reporting)

Ticket: https://github.com/mercycorps/TolaActivity/issues/463
Decisions:
    which targets/data do we count:
        LOP - lop_target / all data (sum)
        MID_END - whichever targets have data, all data associated to those targets
        EVENT - all data and all targets
        TIME-AWARE - all targets which have completed, all data during those periods
    how do we sum:
        tested in test_time_aware_iptt_queries
      

  3.2. What percentage of indicators?
  4. Which indicators are ABOVE the 15% variance range?
  4.1. How many indicators?
  4.2. What percentage of indicators?
  5. Which indicators are BELOW the 15% variance range?
  5.1. How many indicators?
  5.2. What percentage of indicators?
"""

import datetime
from indicators.models import Indicator, PeriodicTarget
from indicators.queries import ProgramWithMetrics, IPTTIndicator
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
    )
from django import test
from django.conf import settings
from django.db import connection

class TestCollectionCorrect(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2016, 10, 1),
            reporting_period_end=datetime.date(2017, 9, 30)
        )
        self.indicator = i_factories.IndicatorFactory()
        self.indicator.program.add(self.program)
        self.indicator.save()
        self.targets = []
        self.data = []

    def tearDown(self):
        for datum in self.data:
            datum.delete()
        for target in self.targets:
            target.delete()
        self.indicator.delete()
        self.program.delete()

    def test_midend_target_sums_midend_with_both_data(self):
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=500,
            period=PeriodicTarget.MIDLINE,
            customsort=0
        )
        end_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=800,
            period=PeriodicTarget.ENDLINE,
            customsort=1
        )
        self.targets.extend([mid_target, end_target])
        mid_data = i_factories.CollectedDataFactory(
            indicator=self.indicator,
            periodic_target=mid_target,
            achieved=350,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=1)
        )
        end_data = i_factories.CollectedDataFactory(
            indicator=self.indicator,
            periodic_target=end_target,
            achieved=950,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=10)
        )
        self.data.extend([mid_data, end_data])
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        # both have data, defaults to non_cumulative, so should show sum of both targets:
        self.assertEqual(
            indicator.lop_target_sum, 1300,
            "should sum both targets 500 and 800 to get 1300, got {0}".format(indicator.lop_target_sum)
        )
        # both have data and targets, defaults to non_cumulative, should show sum of both data:
        self.assertEqual(
            indicator.lop_actual_sum, 1300,
            "should sum both data 350 and 950 to get 1300, got {0}".format(indicator.lop_actual_sum)
        )
        self.assertEqual(
            indicator.over_under, 0,
            "should show overunder as 0 (in range), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).ontarget.count(),
            1,
            "should show 1 ontarget indicator"
        )
        self.indicator.is_cumulative = True
        self.indicator.save()
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        # both have data, set to cumulative, so should show latest (endline) target:
        self.assertEqual(
            indicator.lop_target_sum, 800,
            "should show latest target (800), got {0}".format(indicator.lop_target_sum)
        )
        # both have data and targets, defaults to non_cumulative, should show sum of both data:
        self.assertEqual(
            indicator.lop_actual_sum, 1300,
            "should show all data (1300), got {0}".format(indicator.lop_actual_sum)
        )
        self.assertEqual(
            indicator.over_under, 1,
            "should show overunder as 1 (over range), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).overtarget.count(),
            1,
            "should show 1 overtarget indicator"
        )
        self.indicator.direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        self.indicator.save()
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        self.assertEqual(
            indicator.over_under, -1,
            "should show overunder as -1 (under range - negative DOC), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).undertarget.count(),
            1,
            "should show 1 undertarget indicator"
        )

    def test_midend_doesnt_sum_if_no_endline_data(self):
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=500,
            period=PeriodicTarget.MIDLINE,
            customsort=0
        )
        end_target = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=800,
            period=PeriodicTarget.ENDLINE,
            customsort=1
        )
        self.targets.extend([mid_target, end_target])
        mid_data = i_factories.CollectedDataFactory(
            indicator=self.indicator,
            periodic_target=mid_target,
            achieved=350,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=1)
        )
        self.data.append(mid_data)
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        # both have data, defaults to non_cumulative, so should show sum of both targets:
        self.assertEqual(
            indicator.lop_target_sum, 500,
            "should not sum targets (no data for endline) expecting 500, got {0}".format(indicator.lop_target_sum)
        )
        self.assertEqual(
            indicator.lop_actual_sum, 350,
            "should show only data, 350 got {0}".format(indicator.lop_actual_sum)
        )
        self.assertEqual(
            indicator.over_under, -1,
            "should show under (350/500), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).undertarget.count(),
            1,
            "should show 1 undertarget indicator"
        )
        self.indicator.direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        self.indicator.save()
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        self.assertEqual(
            indicator.over_under, 1,
            "should show over (350/500), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).overtarget.count(),
            1,
            "should show 1 overtarget indicator"
        )
        self.indicator.is_cumulative = True
        self.indicator.save()
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        self.assertEqual(
            indicator.lop_target_sum, 500,
            "should not take endline target (no data`) expecting 500, got {0}".format(indicator.lop_target_sum)
        )


    def test_event_sums_all_targets_using_customsort(self):
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        target_1 = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=500,
            period="event 1",
            customsort=0
        )
        target_2 = i_factories.PeriodicTargetFactory(
            indicator=self.indicator,
            target=800,
            period="event 2",
            customsort=1
        )
        self.targets.extend([target_1, target_2])
        data_1 = i_factories.CollectedDataFactory(
            indicator=self.indicator,
            periodic_target=target_1,
            achieved=350,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=1)
        )
        self.data.append(data_1)
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        # both have data, defaults to non_cumulative, so should show sum of both targets:
        self.assertEqual(
            indicator.lop_target_sum, 500,
            "should not sum targets (no data for second target) expecting 500, got {0}".format(
                indicator.lop_target_sum)
        )
        self.assertEqual(
            indicator.lop_actual_sum, 350,
            "should show only data, 350 got {0}".format(indicator.lop_actual_sum)
        )
        self.assertEqual(
            indicator.over_under, -1,
            "should show under (350/500), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).undertarget.count(),
            1,
            "should show 1 undertarget indicator"
        )
        data_2 = i_factories.CollectedDataFactory(
            indicator=self.indicator,
            periodic_target=target_2,
            achieved=950,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=20)
        )
        self.data.append(data_2)
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        self.assertEqual(
            indicator.lop_target_sum, 1300,
            "expected sum of targets (both have data) 1300, got {0}".format(indicator.lop_target_sum)
        )
        self.assertEqual(
            indicator.lop_actual_sum, 1300,
            "expecting sum of data 1300, got {0}".format(indicator.lop_actual_sum)
        )
        self.assertEqual(
            indicator.over_under, 0,
            "should show on target (over under 0, 1300/1300), got {0}".format(indicator.over_under)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).ontarget.count(), 1,
            "should show 1 on target indicator"
        )
        self.indicator.is_cumulative = True
        self.indicator.save()
        indicator = IPTTIndicator.withtargets.get(pk=self.indicator.id)
        self.assertEqual(
            indicator.lop_target_sum, 800,
            "expected most recent target for non-cumulative indicator 800, got {0}".format(indicator.lop_target_sum)
        )
        self.assertEqual(
            ProgramWithMetrics.objects.get(pk=self.program.id).overtarget.count(), 1,
            "exepcted 1 overtarget indicator"
        )

class TestProgramReportingingCounts (test.TestCase):
    def setUp(self):
        settings.DEBUG = True
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date.today()-datetime.timedelta(days=365),
            reporting_period_end=datetime.date.today()-datetime.timedelta(days=1)
        )
        self.indicators = []
        self.data = []
        self.targets = []
        self.indicators.extend(self.get_on_target_indicators())
        self.indicators.extend(self.get_undertarget_indicators())
        self.indicators.extend(self.get_overtarget_indicators())
        self.indicators.extend(self.get_nonreporting_indicators())
        baseline = len(connection.queries)
        self.reporting_program = ProgramWithMetrics.objects.get(pk=self.program.id)
        self.fetch_queries = len(connection.queries) - baseline

    def tearDown(self):
        for datum in self.data:
            datum.delete()
        for target in self.targets:
            target.delete()
        for indicator in self.indicators:
            indicator.delete()
        self.program.delete()
        settings.DEBUG = False

    def get_base_indicator(self):
        indicator = i_factories.IndicatorFactory()
        indicator.program.add(self.program)
        indicator.save()
        return indicator

    def get_base_data(self, indicator, target=None):
        data = i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=10)
        )
        return data

    def get_on_target_indicators(self):
        # lop indicator on target to lop target value
        lop_indicator = self.get_base_indicator()
        lop_indicator.target_frequency = Indicator.LOP
        lop_indicator.lop_target = 10000
        lop_indicator.is_cumulative = False
        lop_indicator.unit_of_measure_type = Indicator.NUMBER
        lop_indicator.save()
        lop_data = self.get_base_data(lop_indicator)
        lop_data.achieved = 10000
        lop_data.save()
        self.data.append(lop_data)
        # semi annual indicator with target and valid data
        time_indicator = self.get_base_indicator()
        time_indicator.target_frequency = Indicator.SEMI_ANNUAL
        time_indicator.is_cumulative = True
        time_indicator.unit_of_measure_type = Indicator.NUMBER
        time_indicator.save()
        start_date = self.program.reporting_period_start
        mid_date = datetime.date(
            start_date.year + 1 if start_date.month > 6 else start_date.year,
            start_date.month - 6 if start_date.month > 6 else start_date.month + 6,
            start_date.day)
        time_target_1 = i_factories.PeriodicTargetFactory(
            indicator=time_indicator,
            target=400,
            start_date=start_date,
            end_date=mid_date - datetime.timedelta(days=1)
        )
        time_target_2 = i_factories.PeriodicTargetFactory(
            indicator=time_indicator,
            target=600,
            start_date=mid_date,
            end_date=self.program.reporting_period_end
        )
        self.targets.extend([time_target_1, time_target_2])
        data_1 = i_factories.CollectedDataFactory(
            indicator=time_indicator,
            periodic_target=time_target_1,
            date_collected=time_target_1.start_date + datetime.timedelta(days=2),
            achieved=200
        )
        data_2 = i_factories.CollectedDataFactory(
            indicator=time_indicator,
            periodic_target=time_target_2,
            date_collected=time_target_2.start_date + datetime.timedelta(days=2),
            achieved=600
        )
        self.data.extend([data_1, data_2])
        return [lop_indicator, time_indicator]

    def get_undertarget_indicators(self):
        # event indicator (percent) with less than 85% of the target % hit
        event_indicator = self.get_base_indicator()
        event_indicator.target_frequency = Indicator.EVENT
        event_indicator.is_cumulative = False
        event_indicator.unit_of_measure_type = Indicator.PERCENTAGE
        event_indicator.save()
        event_target = i_factories.PeriodicTargetFactory(
            indicator=event_indicator,
            target=75,
            customsort=0,
            period="event 1"
        )
        self.targets.append(event_target)
        event_data = self.get_base_data(indicator=event_indicator, target=event_target)
        event_data.achieved = 60
        event_data.save()
        self.data.append(event_data)
        return [event_indicator]

    def get_overtarget_indicators(self):
        # lop indicator with 120/100 data
        lop_indicator = self.get_base_indicator()
        lop_indicator.target_frequency = Indicator.LOP
        lop_indicator.is_cumulative = False
        lop_indicator.lop_target = 100
        lop_indicator.save()
        lop_data = self.get_base_data(lop_indicator)
        lop_data.achieved = 120
        lop_data.save()
        self.data.append(lop_data)
        # negative direction of change so under data should show as over target
        neg_indicator = self.get_base_indicator()
        neg_indicator.target_frequency = Indicator.LOP
        neg_indicator.direction_of_change = Indicator.DIRECTION_OF_CHANGE_NEGATIVE
        neg_indicator.lop_target = 800
        neg_indicator.save()
        neg_data = self.get_base_data(neg_indicator)
        neg_data.achieved = 600
        neg_data.save()
        self.data.append(neg_data)
        # mid end indicator _cumulative_ should check against end target only
        midend_indicator = self.get_base_indicator()
        midend_indicator.target_frequency = Indicator.MID_END
        midend_indicator.is_cumulative = True
        midend_indicator.save()
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=midend_indicator,
            period=PeriodicTarget.MIDLINE,
            customsort=0,
            target=500
        )
        end_target = i_factories.PeriodicTargetFactory(
            indicator=midend_indicator,
            period=PeriodicTarget.ENDLINE,
            customsort=1,
            target=800
        )
        self.targets.extend([mid_target, end_target])
        mid_data_1 = self.get_base_data(midend_indicator, mid_target)
        mid_data_1.achieved = 200
        mid_data_1.save()
        mid_data_2 = self.get_base_data(midend_indicator, mid_target)
        mid_data_2.achieved = 200
        mid_data_2.save()
        mid_data_3 = self.get_base_data(midend_indicator, end_target)
        mid_data_3.achieved = 250
        mid_data_3.save()
        mid_data_4 = self.get_base_data(midend_indicator, end_target)
        mid_data_4.achieved = 250
        mid_data_4.save()
        self.data.extend([mid_data_1, mid_data_2, mid_data_3, mid_data_4])
        return [lop_indicator, neg_indicator, midend_indicator]

    def get_nonreporting_indicators(self):
        event_indicator = self.get_base_indicator()
        event_indicator.target_frequency = Indicator.EVENT
        event_indicator.save()
        event_target = i_factories.PeriodicTargetFactory(
            indicator=event_indicator,
            target=400,
            customsort=0,
            period="event 1"
        )
        self.targets.append(event_target)
        return [event_indicator]

    def test_counts(self):
        baseline = len(connection.queries)
        ontarget_count = self.reporting_program.ontarget.count()
        ontarget_queries = len(connection.queries) - baseline
        baseline = len(connection.queries)
        overtarget_count = self.reporting_program.overtarget.count()
        overtarget_queries = len(connection.queries) - baseline
        baseline = len(connection.queries)
        undertarget_count = self.reporting_program.undertarget.count()
        undertarget_queries = len(connection.queries) - baseline
        baseline = len(connection.queries)
        nonreporting_count = self.reporting_program.nonreporting.count()
        nonreporting_queries = len(connection.queries) - baseline
        baseline = len(connection.queries)
        percentages = self.reporting_program.scope_percentages
        percentages_queries = len(connection.queries) - baseline
        baseline = len(connection.queries)
        self.assertEqual(
            ontarget_count, 2, "expected 2 ontarget, got {0}".format(ontarget_count)
        )
        self.assertEqual(
            overtarget_count, 3, "expected 3 overtarget, got {0}".format(overtarget_count)
        )
        self.assertEqual(
            undertarget_count, 1, "expected 1 undertarget, got {0}".format(undertarget_count)
        )
        self.assertEqual(
            nonreporting_count, 1, "expected 1 nonreporting, got {0}".format(nonreporting_count)
        )
        self.assertEqual(
            percentages['low'], 17,
            "expected 17% undertarget for 1/6, got {0}".format(percentages['low'])
        )
        self.assertEqual(
            percentages['on_scope'], 33,
            "expected 33% ontarget for 2/6, got {0}".format(percentages['on_scope'])
        )
        self.assertEqual(
            percentages['high'], 50,
            "expected 50% overtarget for 3/6, got {0}".format(percentages['high'])
        )
        # query count tests:
        for c, query_count in enumerate([self.fetch_queries, ontarget_queries, overtarget_queries,
                                         undertarget_queries, nonreporting_queries]):
            self.assertEqual(query_count, 1, "expected 1 query for #{0} got {1}".format(c, query_count))
        self.assertEqual(percentages_queries, 4,
                         "expected 4 queries to fetch 3 scopes and denominator, got {0}".format(percentages_queries))
            