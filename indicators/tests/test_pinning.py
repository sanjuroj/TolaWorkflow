from django.test import TestCase

from indicators import models


class TestUrlCreationFromPinnedReport(TestCase):
    """
    From a saved report, can a GET URL be reconstituted
    """

    def setUp(self):
        self.pinned_report = models.PinnedReport(
            name='Test Pinned Report',
            program_id=42,
            report_type='timeperiods',
            query_string='level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1',
        )

    def test_url_from_pinned_report(self):
        url_str = self.pinned_report.report_url
        expected = '/indicators/iptt_report/42/timeperiods/?level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1'

        self.assertEquals(url_str, expected)
