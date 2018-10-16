""" Functional tests of the IPTT report generation view

In the 'timeperiods' IPTT report view (all indicators, regardless of frequency, results grouped in arbitrary
time ranges) this module tests returned targets, actuals, percents, including testing grouping by date range
args for iptt_report view:
timeperiods: indicator.<frequency_type>
numrecentperiods: most recent # or blank if show all
timeframe: 1 for show all and 2 for recents or blank for time periods
start_period: %Y-%m-%d or missing for show all or recents
end_period: %Y-%m-%d or missing for show all or recents

"""

from iptt_sample_data import iptt_utility
from indicators.models import Indicator

class TestAnnualTimePeriodsIPTT(iptt_utility.TestIPTTTimePeriodsReportResponseBase):
    def test_show_all_number_of_timeperiods(self):
        for (start, end, expected_ranges) in [
                ('2014-01-01', '2017-12-31', 4),
                ('2017-01-01', '2017-05-01', 1),
                ('2012-05-02', '2018-05-03', 7)]:
            self.number_of_ranges_test(start, end, expected_ranges)

    def test_annual_indicators_in_annual_timeperiods_values_showall(self):
        self.set_dates('2015-01-01', '2017-12-31')
        self.add_indicator_with_data(Indicator.ANNUAL, [100, 150, 200])
        (lop_values, period_values) = self.get_indicator_results(self.get_showall_response(), 0)
        self.assertEqual(int(period_values[0]['actual']), 100,
                         self.format_assert_message("expected 100 for first indicator first period, got {0}".format(
                             period_values[0]['actual'])))
        self.assertEqual(int(lop_values['actual']), 450,
                         self.format_assert_message("expected 450 for sum of 3 indicators, got {0}".format(
                             lop_values['actual'])))

    def test_annual_indicators_in_annual_timeperiods_values_recents(self):
        self.set_dates('2015-01-01', '2017-12-31')
        self.add_indicator_with_data(Indicator.ANNUAL, [100, 150, 200])
        (lop_values, period_values) = self.get_indicator_results(self.get_recent_periods(1), 0)
        self.assertEqual(int(period_values[0]['actual']), 200,
                         self.format_assert_message("expected 200 for indicator 1 most recent period, got {0}".format(
                             period_values[0]['actual'])))
        self.assertEqual(int(lop_values['actual']), 450,
                         self.format_assert_message("expected 450 for sum of 3 indicators, got {0}".format(
                             lop_values['actual'])))

    def test_other_frequency_indicators_in_annual_timeperiods_values_showall(self):
        self.set_dates('2016-06-01', '2018-05-30')
        self.add_indicator_with_data(Indicator.SEMI_ANNUAL, [60, 70, 80, 90])
        self.add_indicator_with_data(Indicator.TRI_ANNUAL, [40, 80, 60, 70, 80, 90])
        self.add_indicator_with_data(Indicator.QUARTERLY, [100, 90, 120, 130, 140, 150, 160, 170])
        self.add_indicator_with_data(Indicator.MONTHLY, [100]*24)
        totals = [300, 420, 1060, 2400]
        year2_totals = [170, 240, 620, 1200]
        response = self.get_showall_response()
        for indicator in range(4):
            lop_value, period_value = self.get_indicator_results(response, indicator)
            self.assertEqual(int(period_value[1]['actual']), year2_totals[indicator],
                             self.format_assert_message("Expected {0} for indicator {1} second period, got {2}".format(
                                 year2_totals[indicator], indicator, period_value[1]['actual'])))
            self.assertEqual(int(lop_value['actual']), totals[indicator],
                             self.format_assert_message("Expected {0} for lop total for indicator {1}, got {2}".format(
                                 totals[indicator], indicator, lop_value['actual'])))

    def test_other_frequency_indicators_in_annual_timeperiods_values_recents(self):
        self.set_dates('2016-01-01', '2018-12-31')
        self.add_indicator_with_data(Indicator.SEMI_ANNUAL, [15]*5)
        self.add_indicator_with_data(Indicator.TRI_ANNUAL, [25]*7)
        self.add_indicator_with_data(Indicator.QUARTERLY, [30]*10)
        self.add_indicator_with_data(Indicator.MONTHLY, [40]*30)
        totals = [75, 175, 300, 1200]
        year3_totals = [15, 25, 60, 240]
        response = self.get_recent_periods(1)
        for indicator in range(4):
            lop_value, period_value = self.get_indicator_results(response, indicator)
            self.assertEqual(int(period_value[0]['actual']), year3_totals[indicator],
                             self.format_assert_message("Expected {0} for indicator {1} recent period, got {2}".format(
                                 year3_totals[indicator], indicator, period_value[0]['actual'])))
            self.assertEqual(int(lop_value['actual']), totals[indicator],
                             self.format_assert_message("Expected {0} for lop total for indicator {1}, got {2}".format(
                                 totals[indicator], indicator, lop_value['actual'])))

class TestQuarterlyTimePeriodsIPTT(iptt_utility.TestIPTTTimePeriodsReportResponseBase):
    timeperiods = Indicator.QUARTERLY

    def test_show_all_number_of_timeperiods(self):
        for (start, end, expected_ranges) in [
                ('2015-01-01', '2017-12-31', 12),
                ('2017-01-01', '2017-05-01', 2),
                ('2016-05-02', '2018-05-03', 9)]:
            self.number_of_ranges_test(start, end, expected_ranges)

    def test_quarterly_indicators_in_quarterly_timeperiods_values_showall(self):
        self.set_dates('2017-06-01', '2018-05-30')
        self.add_indicator_with_data(Indicator.QUARTERLY, [100, 150, 200, 250])
        (lop_values, period_values) = self.get_indicator_results(self.get_showall_response(), 0)
        self.assertEqual(int(period_values[0]['actual']), 100,
                         self.format_assert_message("expected 100 for first indicator first period, got {0}".format(
                             period_values[0]['actual'])))
        self.assertEqual(int(lop_values['actual']), 700,
                         self.format_assert_message("expected 700 for sum of 4 indicators, got {0}".format(
                             lop_values['actual'])))

    def test_quarterly_indicators_in_quarterly_timeperiods_values_recents(self):
        self.set_dates('2016-01-01', '2016-12-31')
        self.add_indicator_with_data(Indicator.QUARTERLY, [100, 150, 200, 250])
        (lop_values, period_values) = self.get_indicator_results(self.get_recent_periods(1), 0)
        self.assertEqual(int(period_values[0]['actual']), 250,
                         self.format_assert_message("expected 250 for indicator 1 most recent period, got {0}".format(
                             period_values[0]['actual'])))
        self.assertEqual(int(lop_values['actual']), 700,
                         self.format_assert_message("expected 700 for sum of 4 indicators, got {0}".format(
                             lop_values['actual'])))

    def test_other_frequency_indicators_in_quarterly_timeperiods_values_showall(self):
        self.set_dates('2016-07-01', '2017-12-31')
        self.add_indicator_with_data(Indicator.ANNUAL, [60, 70])
        self.add_indicator_with_data(Indicator.SEMI_ANNUAL, [60, 70, 80])
        self.add_indicator_with_data(Indicator.TRI_ANNUAL, [40, 80, 60, 70, 80])
        self.add_indicator_with_data(Indicator.MONTHLY, [100]*18)
        totals = [130, 210, 330, 1800]
        quarter3_totals = [0, 70, 60, 300]
        response = self.get_showall_response()
        for indicator in range(4):
            lop_value, period_value = self.get_indicator_results(response, indicator)
            self.assertEqual(int(period_value[2]['actual']) if period_value[2]['actual'] is not None else 0,
                             quarter3_totals[indicator],
                             self.format_assert_message("Expected {0} for indicator {1} third quarter, got {2}".format(
                                 quarter3_totals[indicator], indicator, period_value[2]['actual'])))
            self.assertEqual(int(lop_value['actual']), totals[indicator],
                             self.format_assert_message("Expected {0} for lop total for indicator {1}, got {2}".format(
                                 totals[indicator], indicator, lop_value['actual'])))

    def test_other_frequency_indicators_in_annual_timeperiods_values_recents(self):
        self.set_dates('2016-01-01', '2017-12-31')
        self.add_indicator_with_data(Indicator.ANNUAL, [15]*2)
        self.add_indicator_with_data(Indicator.SEMI_ANNUAL, [15]*4)
        self.add_indicator_with_data(Indicator.TRI_ANNUAL, [25]*6)
        self.add_indicator_with_data(Indicator.MONTHLY, [40]*24)
        totals = [30, 60, 150, 960]
        quarter5_totals = [15, 15, 25, 120]
        response = self.get_recent_periods(4)
        for indicator in range(4):
            lop_value, period_value = self.get_indicator_results(response, indicator)
            self.assertEqual(int(period_value[0]['actual']), quarter5_totals[indicator],
                             self.format_assert_message("Expected {0} for indicator {1} recent period, got {2}".format(
                                 quarter5_totals[indicator], indicator, period_value[0]['actual'])))
            self.assertEqual(int(lop_value['actual']), totals[indicator],
                             self.format_assert_message("Expected {0} for lop total for indicator {1}, got {2}".format(
                                 totals[indicator], indicator, lop_value['actual'])))
