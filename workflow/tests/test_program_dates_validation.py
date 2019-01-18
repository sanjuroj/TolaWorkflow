"""Ensure reporting_period_start and reporting_period_end can only be set with first and last of the month dates
respectively"""

import datetime
import json
from django import test
from django.shortcuts import reverse
from factories import workflow_models as w_factories
from workflow.views import reportingperiod_update
from workflow.models import Program

class TestReportingPeriodDatesValidate(test.TestCase):
    def setUp(self):
        self.factory = test.RequestFactory()

    def test_reporting_period_updates_with_good_start_data(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2017-12-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2016, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_updates_with_good_end_data(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2016-12-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2016, 12, 31))

    def test_reporting_period_updates_with_good_both_data(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2014-02-01',
                                     'reporting_period_end': '2018-10-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2014, 2, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2018, 10, 31))

    def test_reporting_period_does_not_update_with_bad_start_data(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2015-02-15',
                                     'reporting_period_end': '2017-12-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_does_not_update_with_bad_end_data(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2017-10-15'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_reporting_period_does_not_update_with_bad_both_data(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2015-02-15',
                                     'reporting_period_end': '2017-10-15'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 2)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))