""" Functional tests for the iptt report generation view

in the 'targetperiods' view (all indicators on report are same frequency):
these classes test monthly/annual/mid-end indicators generated report ranges, values, sums, and percentages
"""

from datetime import datetime, timedelta
from iptt_sample_data import iptt_utility
from factories.indicators_models import IndicatorFactory, CollectedDataFactory, PeriodicTargetFactory
from indicators.models import Indicator, CollectedData, PeriodicTarget


class TestPeriodicTargetsBase(iptt_utility.TestIPTTTargetPeriodsReportResponseBase):
    def setUp(self):
        self.program = None
        super(TestPeriodicTargetsBase, self).setUp()
        self.indicators = []

    def tearDown(self):
        CollectedData.objects.all().delete()
        PeriodicTarget.objects.all().delete()
        Indicator.objects.all().delete()
        super(TestPeriodicTargetsBase, self).tearDown()
        if self.program is not None:
            self.program.delete()
        self.indicators = []

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
            (next_start, period_end) = self.increment_period(current)
            target = PeriodicTargetFactory(indicator=indicator, start_date=current, end_date=period_end)
            if targets is not None and len(targets) > count:
                target.target = targets[count]
                target.save()
                value = 10 if values is None else values[count]
                _ = CollectedDataFactory(indicator=indicator, periodic_target=target, achieved=value,
                                         date_collected=current)
            current = next_start
            count += 1

class TestMonthlyTargetPeriodsIPTTBase(TestPeriodicTargetsBase):
    indicator_frequency = Indicator.MONTHLY

    def increment_period(self, current):
        year = current.year if current.month < 12 else current.year + 1
        month = current.month + 1 if current.month < 12 else current.month - 11
        next_start = datetime(year, month, current.day)
        period_end = next_start - timedelta(days=1)
        return (next_start, period_end)

    def test_one_year_range_has_twelve_range_periods(self):
        self.set_reporting_period('2017-02-01', '2018-01-31')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 12,
                         self.format_assert_message(
                             "expected 12 ranges for monthly indicators over a year, got {0}".format(
                                 len(ranges))))

    def test_eight_month_range_has_eight_range_periods(self):
        self.set_reporting_period('2018-01-01', '2018-08-30')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 8,
                         self.format_assert_message(
                             "expected 8 ranges for monthly indicators over 8 mos, got {0}".format(
                                 len(ranges))))

    def test_four_month_range_reports_targets(self):
        self.set_reporting_period('2017-11-01', '2018-02-28')
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
        self.set_reporting_period('2016-11-01', '2018-01-31')
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
                             "fourth monthly indicator {0}\n expected 100 for target, got {1}".format(
                                 ranges[3], ranges[3]['target'])))
        self.assertEqual(int(ranges[8]['actual']), 135,
                         self.format_assert_message(
                             "eigth monthly indicator {0}\n expected 135 for actual, got {1}".format(
                                 ranges[8], ranges[8]['actual'])))
        self.assertEqual(ranges[5]['met'], "90%",
                         self.format_assert_message(
                             "sixth monthly indicator {0}\n expected 90% for met (90/100) got {1}".format(
                                 ranges[5], ranges[5]['met'])))

class TestAnnualTargetPeriodsIPTTBase(TestPeriodicTargetsBase):
    indicator_frequency = Indicator.ANNUAL

    def increment_period(self, current):
        next_start = datetime(current.year + 1, current.month, current.day)
        period_end = next_start - timedelta(days=1)
        return (next_start, period_end)

    def test_two_year_range_has_two_range_periods(self):
        self.set_reporting_period('2016-02-01', '2018-01-31')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 2,
                         self.format_assert_message(
                             "expected 2 ranges for yearly indicators over two years, got {0}".format(
                                 len(ranges))))

    def test_four_and_a_half_year_range_has_five_range_periods(self):
        self.set_reporting_period('2014-06-01', '2018-12-31')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 5,
                         self.format_assert_message(
                             "expected 5 ranges for yearly indicators over 4.5 years, got {0}".format(
                                 len(ranges))))

    def test_three_year_range_reports_targets(self):
        self.set_reporting_period('2015-08-01', '2018-07-31')
        self.add_indicator(targets=[1000, 500, 200], values=[800, 500, 300])
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 3,
                         self.format_assert_message(
                             "expected 3 ranges for yearly indicators over 3 yrs, got {0}".format(
                                 len(ranges))))
        self.assertEqual(int(ranges[0]['target']), 1000,
                         self.format_assert_message(
                             "first yearly indicator {0}\n expected 1000 for target, got {1}".format(
                                 ranges[0], ranges[0]['target'])))
        self.assertEqual(int(ranges[1]['actual']), 500,
                         self.format_assert_message(
                             "second yearly indicator {0}\n expected 500 for actual, got {1}".format(
                                 ranges[1], ranges[1]['actual'])))
        self.assertEqual(ranges[2]['met'], "150%",
                         self.format_assert_message(
                             "third yearly indicator {0}\n expected 150% for met (300/200) got {1}".format(
                                 ranges[2], ranges[2]['met'])))

    def test_five_year_range_cumulative_reports_targets(self):
        self.set_reporting_period('2015-11-01', '2020-11-30')
        self.add_indicator(targets=[100]*6, values=[30]*6)
        self.indicators[0].is_cumulative = True
        self.indicators[0].save()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 6,
                         self.format_assert_message(
                             "expected 6 ranges for yearly indicators over 5 yrs 1 month, got {0}".format(
                                 len(ranges))))
        self.assertEqual(int(ranges[3]['target']), 100,
                         self.format_assert_message(
                             "fourth yearly indicator {0}\n expected 100 for target, got {1}".format(
                                 ranges[3], ranges[3]['target'])))
        self.assertEqual(int(ranges[4]['actual']), 150,
                         self.format_assert_message(
                             "fifth yearly indicator {0}\n expected 150 for actual, got {1}".format(
                                 ranges[4], ranges[4]['actual'])))
        self.assertEqual(ranges[1]['met'], "60%",
                         self.format_assert_message(
                             "second yearly indicator {0}\n expected 60% for met (60/100) got {1}".format(
                                 ranges[1], ranges[1]['met'])))

class TestMidEndTargetPeriodsIPTTBase(TestPeriodicTargetsBase):
    indicator_frequency = Indicator.MID_END

    def add_periodic_targets(self, indicator, targets=None, values=None):
        assert targets is None or len(targets) == 2, "targets should be a tuple of two, midline and endline"
        assert values is None or len(values) == 2, "values should be two tuples, midline and endline"
        if targets is None:
            target = PeriodicTargetFactory(indicator=indicator, period=PeriodicTarget.MIDLINE)
            _ = CollectedDataFactory(indicator=indicator, periodic_target=target)
            target = PeriodicTargetFactory(indicator=indicator, period=PeriodicTarget.ENDLINE)
            _ = CollectedDataFactory(indicator=indicator, periodic_target=target)
            return
        for c, (target, target_type) in enumerate(zip(targets, [PeriodicTarget.MIDLINE, PeriodicTarget.ENDLINE])):
            target = PeriodicTargetFactory(indicator=indicator, period=target_type, target=target)
            for v in values[c] if values is not None else [10]:
                _ = CollectedDataFactory(indicator=indicator, periodic_target=target, achieved=v)

    def test_bare_mid_end_has_two_range_periods(self):
        self.set_reporting_period('2016-02-01', '2018-01-31')
        self.add_indicator()
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 2,
                         self.format_assert_message(
                             "expected 2 ranges for bare mid/end indicators, got {0}".format(
                                 len(ranges))))

    def test_mid_end_reports_targets(self):
        self.set_reporting_period('2015-08-01', '2018-07-31')
        self.add_indicator(targets=[1000, 200], values=[[800,], [500,]])
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 2,
                         self.format_assert_message(
                             "expected 2 ranges for mid-end indicators, got {0}".format(
                                 len(ranges))))
        self.assertEqual(int(ranges[0]['target']), 1000,
                         self.format_assert_message(
                             "single mid indicator {0}\n expected 1000 for target, got {1}".format(
                                 ranges[0], ranges[0]['target'])))
        self.assertEqual(int(ranges[1]['actual']), 500,
                         self.format_assert_message(
                             "single end indicator {0}\n expected 500 for actual, got {1}".format(
                                 ranges[1], ranges[1]['actual'])))
        self.assertEqual(ranges[0]['met'], "80%",
                         self.format_assert_message(
                             "single mid indicator {0}\n expected 80% for met (800/1000) got {1}".format(
                                 ranges[0], ranges[0]['met'])))

    def test_mid_end_multiple_indicatorsreports_targets(self):
        self.set_reporting_period('2015-08-01', '2018-07-31')
        self.add_indicator(targets=[1600, 1000], values=[[800, 200], [500, 500]])
        ranges = self.get_response().indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), 2,
                         self.format_assert_message(
                             "expected 2 ranges for mid-end indicators, got {0}".format(
                                 len(ranges))))
        self.assertEqual(int(ranges[0]['target']), 1600,
                         self.format_assert_message(
                             "single mid indicator {0}\n expected 1600 for target, got {1}".format(
                                 ranges[0], ranges[0]['target'])))
        self.assertEqual(int(ranges[1]['actual']), 1000,
                         self.format_assert_message(
                             "single end indicator {0}\n expected 1000 for actual, got {1}".format(
                                 ranges[1], ranges[1]['actual'])))
        self.assertEqual(ranges[0]['met'], "63%",
                         self.format_assert_message(
                             "single mid indicator {0}\n expected 63% for met (1000/1600 rounded) got {1}".format(
                                 ranges[0], ranges[0]['met'])))
    