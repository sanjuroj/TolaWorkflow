""" tests for the iptt processing class (in indicators.tests.iptt_sample_data.iptt_utility)

Yes, this is in fact a test suite for a test utility class, but it ensures we can abstract IPTT responses
in a way that is faithful to the data they are representing, letting us test the view without digging inti the HTML.
This is currently written in such a way that a change to table structure will break this class, so front end changes
will necessitate updating this class.
"""

import unittest
from datetime import datetime
import os
from iptt_sample_data import response_one, iptt_utility
from bs4 import BeautifulSoup

class TestResponseClass(unittest.TestCase):

    def setUp(self):
        """written in such a way that expanding to more test responses defined are easy to add"""
        self.expected = response_one.indicators
        self.responsedir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "iptt_sample_data")
        with open(os.path.join(self.responsedir, "response1.html")) as rawfile:
            self.responseraw = rawfile.read()
            self.soup = BeautifulSoup(self.responseraw, 'html.parser')
            self.processed = iptt_utility.IPTTResponse(self.responseraw)

    def test_indicator_count(self):
        self.assertEqual(len(self.processed.indicators),
                         len(self.expected),
                         u"Expected {0} indicators, found {1} indicators from response:\n{2}".format(
                             len(self.expected), len(self.processed.indicators),
                             self.soup.prettify())
                        )

    def test_indicator_values(self):
        for j, indicator in enumerate(self.expected):
            for key, value in indicator.items():
                if key != 'ranges':
                    self.assertEqual(self.processed.indicators[j][key],
                                     value,
                                     u"Expected {0} to have value {1}, got {2} instead.".format(
                                         key, value, self.processed.indicators[j][key]
                                     ))

    def test_range_count(self):
        for j, indicator in enumerate(self.expected):
            self.assertEqual(len(self.processed.indicators[j]['ranges']),
                             len(indicator['ranges']),
                             u"Expected {0} date ranges, got {1} instead.".format(
                                 len(indicator['ranges']),
                                 len(self.processed.indicators[j]['ranges'])
                             ))

    def test_range_values(self):
        for i, indicator in enumerate(self.expected):
            for j, daterange in enumerate(indicator['ranges']):
                for k, expected_value in daterange.items():
                    if k in ['start_date', 'end_date'] and expected_value is not None:
                        expected_value = datetime.strptime(expected_value, "%Y-%m-%d").strftime("%Y-%m-%d")
                    self.assertEqual(self.processed.indicators[i]['ranges'][j][k],
                                     expected_value,
                                     "Expected indicator {0} range {1} key {2} to have value {3}, got {4}.".format(
                                         i, j, k, expected_value, self.processed.indicators[i]['ranges'][j][k]
                                     ))
 