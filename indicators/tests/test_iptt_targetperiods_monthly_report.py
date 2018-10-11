""" Functional tests for the iptt report generation view

in the 'targetperiods' view (all indicators on report are same frequency):
these classes test monthly indicators generated report ranges, values, sums, and percentages
"""

from datetime import datetime, timedelta
from iptt_sample_data import iptt_utility
from factories.indicators_models import IndicatorFactory, CollectedDataFactory, PeriodicTargetFactory
from indicators.models import Indicator, CollectedData, PeriodicTarget
import copy

class TestMonthlyTargetPeriodsIPTTBase(iptt_utility.TestIPTTTargetPeriodsReportResponseBase):
    indicator_frequency = Indicator.MONTHLY
    
    def setUp(self):
        super(TestMonthlyTargetPeriodsIPTTBase, self).setUp()
        self.indicators = []

    def tearDown(self):
        super(TestMonthlyTargetPeriodsIPTTBase, self).tearDown()
        PeriodicTarget.objects.all().delete()
        Indicator.objects.all().delete()

    def set_reporting_period(self, start, end):
        self.program.reporting_period_start = datetime.strptime(start, '%Y-%m-%d')
        self.program.reporting_period_end = datetime.strptime(end, '%Y-%m-%d')
        self.program.save()

    def add_indicator(self, targets=None, values=None):
        indicator = IndicatorFactory(target_frequency=self.indicator_frequency)
        indicator.program.add(self.program)
        self.indicators.append(indicator)
        self.add_periodic_targets(indicator, targets=targets, values=values)

    def add_periodic_targets(self, indicator, targets=None, values=None):
        current = self.program.reporting_period_start
        end = self.program.reporting_period_end
        count = 0
        while current < end:
            year = current.year if current.month < 12 else current.year + 1
            month = current.month + 1 if current.month < 12 else current.month - 11
            next_month = datetime(year, month, current.day)
            period_end = next_month - timedelta(days=1)
            target = PeriodicTargetFactory(indicator=indicator, start_date=current, end_date=period_end)
            if targets is not None and len(targets) > count:
                target.target = targets[count]
                target.save()
                value = 10 if values is None else values[count]
                _ = CollectedDataFactory(indicator=indicator, periodic_target=target, achieved=value,
                                         date_collected=current)
            current = next_month
            count += 1

    def test_one_year_range_has_twelve_range_periods(self):
        self.set_reporting_period('2017-02-01', '2018-02-01')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 12,
                         self.format_assert_message(
                             "expected 12 ranges for monthly indicators over a year, got {0}".format(
                                 len(ranges))))

    def test_eight_month_range_has_eight_range_periods(self):
        self.set_reporting_period('2018-01-01', '2018-09-01')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 8,
                         self.format_assert_message(
                             "expected 8 ranges for monthly indicators over 8 mos, got {0}".format(
                                 len(ranges))))

    def test_four_month_range_reports_targets(self):
        self.set_reporting_period('2017-11-01', '2018-03-01')
        self.add_indicator(targets=[10, 12, 16, 14], values=[20, 11, 12, 13])
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 4,
                         self.format_assert_message(
                             "expected 4 ranges for monthly indicators over 4 mos, got {0}".format(
                                 len(ranges))))
        self.assertEqual(int(ranges[0]['target']), 10,
                         self.format_assert_message(
                             "first monthly indicator {0}\n expected 10 for target, got {1}".format(
                                 ranges[0], ranges[0]['target'])))
        self.assertEqual(int(ranges[1]['actual']), 11,
                         self.format_assert_message(
                             "second monthly indicator {0}\n expected 11 for actual, got {1}".format(
                                 ranges[1], ranges[1]['actual'])))
        self.assertEqual(ranges[2]['met'], "75%",
                         self.format_assert_message(
                             "third monthly indicator {0}\n expected 75% for met (12/16) got {1}".format(
                                 ranges[2], ranges[2]['met'])))

    def test_fifteen_month_range_cumulative_reports_targets(self):
        self.set_reporting_period('2016-11-01', '2018-02-01')
        self.add_indicator(targets=[100]*15, values=[15]*15)
        self.indicators[0].is_cumulative = True
        self.indicators[0].save()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 15,
                         self.format_assert_message(
                             "expected 15 ranges for monthly indicators over 15 mos, got {0}".format(
                                 len(ranges))))
        self.assertEqual(int(ranges[3]['target']), 100,
                         self.format_assert_message(
                             "third monthly indicator {0}\n expected 100 for target, got {1}".format(
                                 ranges[3], ranges[3]['target'])))
        self.assertEqual(int(ranges[8]['actual']), 135,
                         self.format_assert_message(
                             "eigth monthly indicator {0}\n expected 135 for actual, got {1}".format(
                                 ranges[8], ranges[8]['actual'])))
        self.assertEqual(ranges[5]['met'], "90%",
                         self.format_assert_message(
                             "sixth monthly indicator {0}\n expected 90% for met (90/100) got {1}".format(
                                 ranges[5], ranges[5]['met'])))
