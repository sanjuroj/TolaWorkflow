from django.test import Client, RequestFactory, TestCase
from django.urls import reverse_lazy

from factories.indicators_models import IndicatorFactory
from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory
)
from indicators.models import Indicator
from indicators.views.views_reports import IPTTReportQuickstartView


class IPTTReportQuickstartViewTests(TestCase):
    """Unit tests to valid the IPTTReportQuickStartView"""

    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest", username="IC")
        self.user.set_password('password')
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
        self.client.login(username="IC", password='password')

    def test_page_load_returns_200(self):
        """Do we return 200?"""

        response = self.client.get(reverse_lazy('iptt_quickstart'))
        self.assertEqual(response.status_code, 200)

    def test_page_load_does_not_redirect(self):
        """This page should not redirect"""

        response = self.client.get(reverse_lazy('iptt_quickstart'), follow=True)
        self.assertEqual(len(response.redirect_chain), 0)

    def test_page_loads_correct_template(self):
        """Do we load the right template?"""

        response = self.client.get(reverse_lazy('iptt_quickstart'), follow=True)
        self.assertTemplateUsed(response, 'indicators/iptt_quickstart.html')
        self.assertContains(response, 'Indicator Performance Tracking Table')

    def test_get_form_kwargs(self):
        """Do we get the correct form kwargs?"""

        data = {'csrfmiddlewaretoken': 'lolwut',
                'targetperiods-program': self.program.id,
                'targetperiods-formprefix': IPTTReportQuickstartView.FORM_PREFIX_TARGET,
                'targetperiods-timeframe': Indicator.LOP,
                'targetperiods-targetperiods': 1,
                'targetperiods-numrecentperiods': 1, }
        path = reverse_lazy('iptt_quickstart')
        response = self.client.post(path, data=data, follow=True)
        kwargs = response.resolver_match.kwargs
        self.assertEqual(kwargs['reporttype'], IPTTReportQuickstartView.FORM_PREFIX_TARGET)
        self.assertEqual(int(kwargs['program_id']), self.program.id)

    def test_get_context_data(self):
        """Do we get the correct context data?"""

        data = {'csrfmiddlewaretoken': 'lolwut',
                'targetperiods-program': self.program.id,
                'targetperiods-formprefix': IPTTReportQuickstartView.FORM_PREFIX_TARGET,
                'targetperiods-timeframe': Indicator.LOP,
                'targetperiods-targetperiods': 1,
                'targetperiods-numrecentperiods': 1, }
        path = reverse_lazy('iptt_quickstart')
        response = self.client.post(path, data=data, follow=True)
        context_data = response.context_data

        self.assertEqual(int(context_data['program_id']), self.program.id)
        # self.assertEqual(context['report_wide'], ?)
        # self.assertEqual(context['report_date_ranges'], ?)
        # self.assertEqual(context['indicators'], ?)
        self.assertRegex(str(context_data['program']), self.program.name)
        self.assertEqual(str(context_data['reporttype']),
                         IPTTReportQuickstartView.FORM_PREFIX_TARGET)
        self.assertEqual(str(context_data['report_end_date']),
                         self.program.reporting_period_end)
        self.assertEqual(str(context_data['report_end_date_actual']),
                         self.program.reporting_period_end)
        self.assertEqual(str(context_data['report_start_date']),
                         self.program.reporting_period_start)

    def test_post_with_valid_form(self):
        """Does POSTing to iptt_quickstart with valid form data redirect to the
        correct view (iptt_report)?"""

        data = {'csrfmiddlewaretoken': 'lolwut',
                'targetperiods-program': self.program.id,
                'targetperiods-formprefix': IPTTReportQuickstartView.FORM_PREFIX_TARGET,
                'targetperiods-timeframe': Indicator.LOP,
                'targetperiods-targetperiods': 1,
                'targetperiods-numrecentperiods': 1, }
        path = reverse_lazy('iptt_quickstart')

        response = self.client.post(path, data=data, follow=True)
        self.assertEqual(len(response.redirect_chain), 1)
        self.assertTemplateUsed(response, 'indicators/iptt_report.html')
        self.assertEqual(response.status_code, 200)

    def test_post_with_invalid_form(self):
        """Does POSTing to iptt_quickstart with crap form data leave us at
        iptt_quickstart?"""

        path = reverse_lazy('iptt_quickstart')
        response = self.client.post(path, data={'foo': 'bar'})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'indicators/iptt_quickstart.html')
