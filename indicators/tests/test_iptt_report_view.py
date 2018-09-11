import datetime
from unittest import skip

from django.test import Client, RequestFactory, TestCase
from django.urls import reverse_lazy

from factories.indicators_models import IndicatorFactory
from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory
)
from indicators.models import Indicator
from indicators.views.views_reports import (
    IPTT_ReportView,
)


class IPTT_ReportViewTests(TestCase):
    """Unit tests to validate IPTT_ReportView"""

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
        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.ANNUAL)
        self.request_factory = RequestFactory()
        self.client = Client()
        self.client.login(username=self.user.username, password='orangethumb')

    def test_get(self):
        """Does get return 200 and the right template?"""

        url_kwargs = {
            'program_id': self.program.id,
            'reporttype': 'targetperiods',
        }
        filterdata = {'targetperiods': 1, 'timeframe': 1}
        path = reverse_lazy('iptt_report', kwargs=url_kwargs)

        response = self.client.get(path, data=filterdata, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name=IPTT_ReportView.template_name)

        # Verify that real program and indicator data are present
        self.assertIn(self.program.name, response.content)
        self.assertIn(self.indicator.name, response.content)
        # Dates returned as '2016-03-01'
        # Present in content as 'Mar 01, 2016'
        exp_start = datetime.datetime.strptime(self.program.reporting_period_start, '%Y-%m-%d')
        exp_end = datetime.datetime.strptime(self.program.reporting_period_end, '%Y-%m-%d')
        self.assertIn(exp_start.strftime('%b %d, %Y'), response.content)
        self.assertIn(exp_end.strftime('%b %d, %Y'), response.content)

    def test_post(self):
        """Does post return 200 show the requested report?"""
        url_kwargs = {
            'program_id': self.program.id,
            'reporttype': 'targetperiods',
        }

        data = {
            'csrfmiddlewaretoken': 'lolwut',
            'program': self.program.id,
            'targetperiods': 1,
            'timeframe': 1,
        }

        path = reverse_lazy('iptt_report', kwargs=url_kwargs)
        response = self.client.post(path, data=data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 1)

        # Verify that real program and indicator data are present
        self.assertIn(self.program.name, response.content)
        self.assertIn(self.indicator.name, response.content)
        # Dates returned as '2016-03-01'
        # Present in content as 'Mar 01, 2016'
        exp_start = datetime.datetime.strptime(self.program.reporting_period_start, '%Y-%m-%d')
        exp_end = datetime.datetime.strptime(self.program.reporting_period_end, '%Y-%m-%d')
        self.assertIn(exp_start.strftime('%b %d, %Y'), response.content)
        self.assertIn(exp_end.strftime('%b %d, %Y'), response.content)
