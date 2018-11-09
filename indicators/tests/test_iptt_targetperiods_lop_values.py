""" Functional tests for the iptt report generation view

in the 'targetperiods' view (all indicators on report are same frequency):
these classes test the baseline, LOP target/actual/met values for various indicator frequencies, with one or more
indicators
"""

from iptt_sample_data import iptt_utility
from factories.workflow_models import ProgramFactory
from factories.indicators_models import IndicatorFactory, CollectedDataFactory
from indicators.models import Indicator, CollectedData
from indicators.views.views_reports import IPTT_Mixin


class TestIPTTReportResponseCounts(iptt_utility.TestIPTTTargetPeriodsReportResponseBase):

    def test_one_indicator_returned(self):
        _ = self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response.indicators), 1,
                         self.format_assert_message(
                             "One LOP indicator added, expected 1 in return, got {0}".format(
                                 len(response.indicators))))

    def test_two_indicators_returned(self):
        _ = self.get_indicator_by_frequency(self.indicator_frequency)
        _ = self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response.indicators), 2,
                         self.format_assert_message("Two LOP indicators added, expected 2 in return, got {0}".format(
                             len(response.indicators))))

    def test_out_of_program_indicators_ignored(self):
        other_program = ProgramFactory()
        other_indicator1 = IndicatorFactory(
            target_frequency=self.indicator_frequency,
            program=other_program)
        other_indicator2 = IndicatorFactory(
            target_frequency=self.indicator_frequency,
            program=other_program)
        _ = self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response.indicators), 1,
                         self.format_assert_message(
                             "One LOP indicator added, two on other program,, expected 1 in return, got {0}".format(
                                 len(response.indicators))))

class TestSingleLOPIndicatorIPTTResponse(iptt_utility.TestIPTTTargetPeriodsReportResponseBase):
    def setUp(self):
        super(TestSingleLOPIndicatorIPTTResponse, self).setUp()
        self.indicator = self.get_indicator_by_frequency(self.indicator_frequency, baseline=10, lop_target=99)
        self.data = []

    def tearDown(self):
        CollectedData.objects.all().delete()
        super(TestSingleLOPIndicatorIPTTResponse, self).tearDown()

    def add_collected_data(self, value):
        collected_data_point = CollectedDataFactory(indicator=self.indicator, achieved=value)
        self.data.append(collected_data_point)
        return collected_data_point

    def get_response(self, target_frequency=None, reporttype=IPTT_Mixin.REPORT_TYPE_TARGETPERIODS):
        target_frequency = self.indicator_frequency if target_frequency is None else target_frequency
        self.response = super(TestSingleLOPIndicatorIPTTResponse, self).get_response(target_frequency,
                                                                                     reporttype=reporttype)
        self.assertEqual(len(self.response.indicators), 1,
                         self.format_assert_message(
                             "single indicator test should return one indicator response, got {0}".format(
                                 len(self.response.indicators))))
        return self.response.indicators[0]

    def get_lop_result(self):
        return self.get_response()['ranges'][0]

    def test_indicator_baseline(self):
        indicator = self.get_response()
        self.assertEqual(int(indicator['Baseline']), self.indicator.baseline,
                         self.format_assert_message("expected baseline {0} for indicator, got {1}".format(
                             self.indicator.baseline, indicator['Baseline'])))

    def test_indicator_lop_target(self):
        lop_result = self.get_lop_result()
        self.assertEqual(int(lop_result['target']), self.indicator.lop_target,
                         self.format_assert_message("expected lop target {0} for indicator, got {1}".format(
                             self.indicator.lop_target, lop_result['target'])))

    def test_indicator_lop_sum_single_data_point(self):
        self.add_collected_data(50)
        lop_result = self.get_lop_result()
        self.assertEqual(int(lop_result['actual']), 50,
                         self.format_assert_message("expected lop sum 50 for indicator, got {0}".format(
                             lop_result['actual'])))

    def test_indicator_lop_sum_multiple_data_points(self):
        expected_sum = 0
        for point in [14, 200, 29.3, 58, 43]:
            expected_sum += point
            self.add_collected_data(point)
        lop_result = self.get_lop_result()
        self.assertEqual(float(lop_result['actual']), expected_sum,
                         self.format_assert_message(
                             "Expected lop sum {0} for indicator, got {1}".format(expected_sum, lop_result['actual'])))

    def test_indicator_lop_pct_single_data_point(self):
        self.add_collected_data(49.5)
        lop_result = self.get_lop_result()
        self.assertEqual(lop_result['met'], "50%",
                         self.format_assert_message("Expected 50% met (49.5/99), got {0}".format(lop_result['met'])))

    def test_indicator_lop_pct_multiple_data_points(self):
        for point in [80, 10, 4, 3, 1, 1]:
            self.add_collected_data(point)
        lop_result = self.get_lop_result()
        self.assertEqual(lop_result['met'], "100%",
                         self.format_assert_message("Expected 100% met (99/99), got {0}".format(lop_result['met'])))

class TestMultipleLOPIndicatorsIPTTResponse(iptt_utility.TestIPTTTargetPeriodsReportResponseBase):
    indic1_baseline = 85
    indic1_target = 200
    indic2_baseline = 33
    indic2_target = 1000

    def setUp(self):
        super(TestMultipleLOPIndicatorsIPTTResponse, self).setUp()
        self.indicators = [
            self.get_indicator_by_frequency(self.indicator_frequency, baseline=self.indic1_baseline,
                                            lop_target=self.indic1_target),
            self.get_indicator_by_frequency(self.indicator_frequency, baseline=self.indic2_baseline,
                                            lop_target=self.indic2_target)
            ]
        self.data = [[], []]

    def get_response(self, target_frequency=None, reporttype=IPTT_Mixin.REPORT_TYPE_TARGETPERIODS):
        target_frequency = self.indicator_frequency if target_frequency is None else target_frequency
        self.response = super(TestMultipleLOPIndicatorsIPTTResponse, self).get_response(target_frequency,
                                                                                        reporttype=reporttype)
        self.assertEqual(len(self.response.indicators), 2,
                         self.format_assert_message(
                             "double indicator test should return two indicator response, got {0}".format(
                                 len(self.response.indicators))))
        return self.response.indicators[0:2]

    def get_lop_result(self):
        return [indic['ranges'][0] for indic in self.get_response()]

    def add_collected_data(self, value, indicator):
        collected_data_point = CollectedDataFactory(indicator=self.indicators[indicator], achieved=value)
        self.data[indicator].append(collected_data_point)
        return collected_data_point

    def test_indicator_baselines(self):
        for c, indicator in enumerate(self.get_response()):
            self.assertEqual(int(indicator['Baseline']), self.indicators[c].baseline,
                             self.format_assert_message("expected baseline {0} for indicator {1}, got {2}".format(
                                 self.indicators[c].baseline, c, indicator['Baseline'])))

    def test_indicator_lop_target(self):
        for c, lop_result in enumerate(self.get_lop_result()):
            self.assertEqual(int(lop_result['target']), self.indicators[c].lop_target,
                             self.format_assert_message("expected lop target {0} for indicator {1}, got {2}".format(
                                 self.indicators[c].lop_target, c, lop_result['target'])))

    def test_indicator_sums_and_percents_single_data_points(self):
        self.add_collected_data(40, 0)
        self.add_collected_data(100, 1)
        expected = [40, 100]
        expected_pct = ["20%", "10%"]
        for c, lop_result in enumerate(self.get_lop_result()):
            self.assertEqual(int(lop_result['actual']), expected[c],
                             self.format_assert_message("expected lop actual {0} for indicator {1}, got {2}".format(
                                 expected[c], c, lop_result['actual']
                             )))
            self.assertEqual(lop_result['met'], expected_pct[c],
                             self.format_assert_message("expectged lop pct {0} for indicator {1}, got {2}".format(
                                 expected_pct[c], c, lop_result['met']
                             )))

    def test_indicator_sums_and_percents_multiple_data_points(self):
        expected = [180, 1400]
        expected_pct = ["90%", "140%"]
        values = [
            [90, 40, 50],
            [100, 100, 100, 50, 50, 50, 50, 425, 475]
        ]
        for value in values[0]:
            self.add_collected_data(value, 0)
        for value in values[1]:
            self.add_collected_data(value, 1)
        for c, lop_result in enumerate(self.get_lop_result()):
            self.assertEqual(int(lop_result['actual']), expected[c],
                             self.format_assert_message("expected lop actual {0} for indicator {1}, got {2}".format(
                                 expected[c], c, lop_result['actual']
                             )))
            self.assertEqual(lop_result['met'], expected_pct[c],
                             self.format_assert_message("expectged lop pct {0} for indicator {1}, got {2}".format(
                                 expected_pct[c], c, lop_result['met']
                             )))

#now run these tests for other indicator frequencies:
class TestIPTTReportResponseCountsAnnual(TestIPTTReportResponseCounts):
    indicator_frequency = Indicator.ANNUAL
class TestSingleAnnualIndicatorIPTTResponse(TestSingleLOPIndicatorIPTTResponse):
    indicator_frequency = Indicator.ANNUAL
class TestMultipleAnnualIndicatorIPTTResponse(TestMultipleLOPIndicatorsIPTTResponse):
    indicator_frequency = Indicator.ANNUAL
class TestIPTTReportResponseCountsMidEnd(TestIPTTReportResponseCounts):
    indicator_frequency = Indicator.MID_END
class TestSingleMidEndIndicatorIPTTResponse(TestSingleLOPIndicatorIPTTResponse):
    indicator_frequency = Indicator.MID_END
class TestMultipleMidEndIndicatorIPTTResponse(TestMultipleLOPIndicatorsIPTTResponse):
    indicator_frequency = Indicator.MID_END
class TestIPTTReportResponseCountsQuarterly(TestIPTTReportResponseCounts):
    indicator_frequency = Indicator.QUARTERLY
class TestSingleQuarterlyIndicatorIPTTResponse(TestSingleLOPIndicatorIPTTResponse):
    indicator_frequency = Indicator.QUARTERLY
class TestMultipleQuarterlyIndicatorIPTTResponse(TestMultipleLOPIndicatorsIPTTResponse):
    indicator_frequency = Indicator.QUARTERLY
class TestIPTTReportResponseCountsMonthly(TestIPTTReportResponseCounts):
    indicator_frequency = Indicator.MONTHLY
class TestSingleMonthlyIndicatorIPTTResponse(TestSingleLOPIndicatorIPTTResponse):
    indicator_frequency = Indicator.MONTHLY
class TestMultipleMonthlyIndicatorIPTTResponse(TestMultipleLOPIndicatorsIPTTResponse):
    indicator_frequency = Indicator.MONTHLY

