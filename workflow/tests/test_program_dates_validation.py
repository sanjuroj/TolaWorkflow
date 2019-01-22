"""Ensure reporting_period_start and reporting_period_end can only be set with first and last of the month dates
respectively"""

import datetime
import json
from django import test
from django.shortcuts import reverse
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator
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

    def test_reporting_period_does_not_update_with_inverse_dates(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2015-10-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_start_date_may_not_change_if_time_aware_target_set(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2017-12-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_start_date_does_change_if_no_time_aware_target_set(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.MID_END,
            program=program
        )
        i_factories.PeriodicTargetFactory(
            start_date=None,
            end_date=None,
            customsort=0,
            indicator=indicator
        )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2016-01-01',
                                     'reporting_period_end': '2017-12-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 0)
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2016, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_end_date_will_not_change_to_before_last_time_aware_target_set(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2016-10-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'fail')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 1)
        self.assertEqual(response.status_code, 422)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 12, 31))

    def test_end_date_will_change_to_after_last_time_aware_target_set(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2015, 1, 1),
            reporting_period_end=datetime.date(2017, 12, 31)
        )
        indicator = i_factories.IndicatorFactory(
            target_frequency=Indicator.ANNUAL,
            program=program
        )
        for start, end in [(datetime.date(2015, 1, 1), datetime.date(2015, 12, 31)),
                           (datetime.date(2016, 1, 1), datetime.date(2016, 12, 31)),
                           (datetime.date(2017, 1, 1), datetime.date(2017, 12, 31))]:
            i_factories.PeriodicTargetFactory(
                start_date=start,
                end_date=end,
                indicator=indicator
            )
        request = self.factory.post(reverse('reportingperiod_update', kwargs={'pk': program.pk}),
                                    {'reporting_period_start': '2015-01-01',
                                     'reporting_period_end': '2017-10-31'})
        response = reportingperiod_update(request, program.pk)
        self.assertEqual(json.loads(response.content)['msg'], 'success')
        self.assertEqual(len(json.loads(response.content)['failmsg']), 0)
        self.assertEqual(response.status_code, 200)
        refreshed = Program.objects.get(pk=program.pk)
        self.assertEqual(refreshed.reporting_period_start, datetime.date(2015, 1, 1))
        self.assertEqual(refreshed.reporting_period_end, datetime.date(2017, 10, 31))