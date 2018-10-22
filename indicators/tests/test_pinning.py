# -*- coding: utf-8 -*-

from django.test import TestCase
from django.urls import reverse

from indicators import models

from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory
)


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


class TestCreatePinnedReport(TestCase):
    """
    Test AJAX call for creating a pinned report
    """

    def setUp(self):
        self.user = UserFactory(first_name="PeterPeter", last_name="PumpkinEater", username="PPPE")
        self.user.set_password('orangethumb')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.country = self.tola_user.country
        self.program = ProgramFactory(
            funding_status='Funded', reporting_period_start='2016-03-01', reporting_period_end='2020-05-01')
        self.program.country.add(self.country)
        self.program.save()

        # TolaUser not available on User if not logged in
        self.client.login(username=self.user.username, password='orangethumb')

    def test_successful_create(self):
        report_name = 'Test report name'
        report_type = 'reporttype'
        query_string = 'level=3&level=2&timeframe=1&numrecentperiods=&indicators=5476&targetperiods=1'

        data = {
            'name': report_name,
            'program': self.program.id,
            'report_type': report_type,
            'query_string': query_string,
        }

        path = reverse('create_pinned_report')
        response = self.client.post(path, data=data)

        self.assertEqual(response.status_code, 200)

        pr = models.PinnedReport.objects.get()
        self.assertEquals(pr.name, report_name)
        self.assertEquals(pr.program_id, self.program.id)
        self.assertEquals(pr.report_type, report_type)
        self.assertEquals(pr.query_string, query_string)
        self.assertEquals(pr.tola_user_id, self.tola_user.id)

    def test_invalid_data_create(self):
        data = {
            # no post data!
        }

        path = reverse('create_pinned_report')
        response = self.client.post(path, data=data)

        self.assertEqual(response.status_code, 400)
        self.assertEquals(models.PinnedReport.objects.count(), 0)


class TestPinnedReportDateStrings(TestCase):
    """
    Date range strings vary depending on query string args - test possibilities
    """

    def test_fixed_date_range(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=7&numrecentperiods=&start_period=2018-01-01&end_period=2018-06-30'

        self.assertEqual(pr.date_range_str, 'Jan 1, 2018 – Jun 30, 2018')

    def test_relative_to_today(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=7&numrecentperiods=2&timeframe=2'

        self.assertEqual(pr.date_range_str, 'Most recent 2 Months')

    def test_show_all(self):
        pr = models.PinnedReport()
        pr.query_string = 'timeperiods=4&numrecentperiods=&timeframe=1'

        self.assertEqual(pr.date_range_str, 'Show all Semi-annual periods')
