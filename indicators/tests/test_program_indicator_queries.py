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
      

1. For all completed target periods to date, what is the target value?
  1.1. Calculation takes into account cumulative vs non-cumulative and # vs %
  2. For all completed target periods to date, what is the actual value?
  2.1. Calculation takes into account cumulative vs non-cumulative and # vs %
  3. For all completed target periods to date, what is the percentage variance of the actual value from the target value?
  4. Which indicators are INSIDE the plus or minus 15% variance range?
  3.1. How many indicators?
  3.2. What percentage of indicators?
  4. Which indicators are ABOVE the 15% variance range?
  4.1. How many indicators?
  4.2. What percentage of indicators?
  5. Which indicators are BELOW the 15% variance range?
  5.1. How many indicators?
  5.2. What percentage of indicators?
  
"""


from django import test, db
from django.conf import settings
import datetime
import unittest
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
    )
from indicators.models import Indicator, PeriodicTarget
from indicators.queries import ProgramWithMetrics, IPTTIndicator

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


    @unittest.skip('not implemented')
    def test_event_sums_all_targets_using_customsort(self):
        self.fail('not implemented')

    @unittest.skip('not implemented')
    def test_time_aware_sums_targets(self):
        self.fail('not implemented')

class TestDataCollectionCorrect(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory()
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

    @unittest.skip('not implemented')
    def test_lop_target_sums_all_data(self):
        self.fail('not implemented')

    @unittest.skip('not implemented')
    def test_midend_sums_data_with_both_data(self):
        self.fail('not implemented')

    @unittest.skip('not implemented')
    def test_midend_sums_midend_if_no_endline_data(self):
        self.fail('not implemented')

    @unittest.skip('not implemented')
    def test_event_sums_all_data_using_date_collected(self):
        self.fail('not implemented')

    @unittest.skip('not implemented')
    def test_time_aware_sums_targets(self):
        self.fail('not implemented')
