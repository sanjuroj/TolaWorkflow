""" Functional tests for the iptt report generation view

in the 'targetperiods' view (all indicators on report are same frequency):
these classes test the baseline, LOP target/actual/met values for various indicator frequencies, with one or more
indicators
"""

import utility
from factories.workflow_models import ProgramFactory
from factories.indicators_models import IndicatorFactory


class TestIPTTReportResponseCounts(utility.IPTTTVADataResponseBase):

    def test_one_indicator_returned(self):
        self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response.indicators), 1,
                         self.format_assert_message(
                             "One LOP indicator added, expected 1 in return, got {0}".format(
                                 len(response.indicators))))

    def test_two_indicators_returned(self):
        self.get_indicator_by_frequency(self.indicator_frequency)
        self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response.indicators), 2,
                         self.format_assert_message("Two LOP indicators added, expected 2 in return, got {0}".format(
                             len(response.indicators))))

    def test_out_of_program_indicators_ignored(self):
        other_program = ProgramFactory()
        # add other indicators (out of program):
        IndicatorFactory(
            target_frequency=self.indicator_frequency,
            program=other_program)
        IndicatorFactory(
            target_frequency=self.indicator_frequency,
            program=other_program)
        self.get_indicator_by_frequency(self.indicator_frequency)
        response = self.get_response(self.indicator_frequency)
        self.assertEqual(len(response.indicators), 1,
                         self.format_assert_message(
                             "One LOP indicator added, two on other program,, expected 1 in return, got {0}".format(
                                 len(response.indicators))))
