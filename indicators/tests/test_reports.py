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
    IPTTReportQuickstartView,
    IPTT_Mixin,
    IPTT_ReportView,
)
from workflow.models import Program


class IPTT_MixinTests(TestCase):
    """Tests private methods not specifically tested in other test cases"""
    freqs = {
        Indicator.ANNUAL: 12,
        Indicator.SEMI_ANNUAL: IPTT_Mixin.MONTHS_PER_SEMIANNUAL,
        Indicator.TRI_ANNUAL: IPTT_Mixin.MONTHS_PER_TRIANNUAL,
        Indicator.QUARTERLY: IPTT_Mixin.MONTHS_PER_QUARTER,
        Indicator.MONTHLY: IPTT_Mixin.MONTHS_PER_MONTH,
        # Indicator.LOP, Indicator.MID_END, Indicator.EVENT
    }

    def setUp(self):
        self.mixin = IPTT_Mixin()

    def test__get_num_months(self):
        """Do we return the right number of months per period?"""
        for freq in IPTT_MixinTests.freqs:
            num_months_in_period = self.mixin._get_num_months(freq)
            self.assertEqual(num_months_in_period, IPTT_MixinTests.freqs[freq])

    def test__get_num_periods_returns_0_for_reversed_date_range(self):
        """Do we return  if end date is before start date?"""
        _get_num_periods = IPTT_Mixin._get_num_periods
        start_date = datetime.date(2020, 1, 1)
        end_date = datetime.date(2019, 1, 1)

        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.QUARTERLY), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.MONTHLY), 0)

    def test__get_period_name(self):
        """Do we return the correct period names?"""
        _get_period_name = IPTT_Mixin._get_period_name

        self.assertEqual(_get_period_name(Indicator.ANNUAL), "Year")
        self.assertEqual(_get_period_name(Indicator.SEMI_ANNUAL), "Semi-annual")
        self.assertEqual(_get_period_name(Indicator.TRI_ANNUAL), "Tri-annual")
        self.assertEqual(_get_period_name(Indicator.QUARTERLY), "Quarter")
        self.assertEqual(_get_period_name(Indicator.MONTHLY), "Month")

    def test__get_first_period(self):
        """Do we calculate the first period of a date range correctly?"""
        real_start_date = datetime.date(2016, 7, 15)
        for freq in IPTT_MixinTests.freqs:
            num_months = self.mixin._get_num_months(freq)

            _get_first_period = self.mixin._get_first_period(real_start_date, num_months)
            if freq == Indicator.ANNUAL:
                self.assertEqual(_get_first_period,
                                 datetime.date(2016, 1, 1))
            elif freq == Indicator.SEMI_ANNUAL:
                self.assertEqual(_get_first_period,
                                 datetime.date(2016, 7, 1))
            elif freq == Indicator.TRI_ANNUAL:
                self.assertEqual(_get_first_period,
                                 datetime.date(2016, 5, 1))
            elif freq == Indicator.QUARTERLY:
                self.assertEqual(_get_first_period,
                                 datetime.date(2016, 7, 1))
            elif freq == Indicator.MONTHLY:
                self.assertEqual(_get_first_period,
                                 datetime.date(2016, 7, 1))
            else:
                self.assertEqual(1, 0, msg="Unexpected target frequency: " + freq)

    @skip('WIP -- think I need to add collected data')
    def test__generate_annotations(self):
        """Do we generate queryset annotations correctly?"""
        reporttype = 'timeperiods'
        filter_start_date = datetime.date(2018, 1, 1)
        filter_end_date = datetime.date(2019, 12, 31)
        freq = Indicator.MONTHLY
        num_recents = 0
        show_all = True

        self.mixin.program = Program()
        self.mixin.program.reporting_period_start = filter_start_date
        self.mixin.program.reporting_period_end = filter_end_date

        (report_end_date, all_date_ranges, periods_date_ranges) = \
            self.mixin._generate_timeperiods(filter_start_date,
                                             filter_end_date,
                                             freq,
                                             show_all,
                                             num_recents)
        self.assertEqual(self.mixin.program.reporting_period_end, report_end_date)
        self.assertEqual(self.mixin.program.reporting_period_end, filter_end_date)
        self.assertEqual(len(all_date_ranges), 24)
        self.assertEqual(len(periods_date_ranges), 24)

        period = Indicator.LOP
        annotations = self.mixin._generate_annotations(periods_date_ranges, period, reporttype)
        if freq == Indicator.LOP:
            self.assertEqual(annotations, {})
        else:
            self.assertNotEqual(annotations, {}, "{0} failed".format(freq))

    def test__get_num_periods(self):
        """Do we return the correct number of periods"""
        _get_num_periods = IPTT_Mixin._get_num_periods
        start_date = datetime.date(2016, 1, 15)
        end_date = datetime.date(2017, 12, 16)

        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.ANNUAL), 2)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 4)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 6)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.QUARTERLY), 8)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.MONTHLY), 24)

    def test__generate_targetperiods(self):
        """Can we generate target periods correctly"""
        filter_start_date = datetime.date(2018, 1, 1)
        filter_end_date = datetime.date(2019, 12, 31)
        freq = Indicator.ANNUAL
        num_recents = 0
        show_all = True
        self.mixin.program = Program()
        self.mixin.program.reporting_period_start = filter_start_date
        self.mixin.program.reporting_period_end = filter_end_date

        report_end_date, all_date_ranges, targetperiods = \
            self.mixin._generate_targetperiods(self.mixin.program,
                                               filter_start_date,
                                               filter_end_date,
                                               freq,
                                               show_all,
                                               num_recents)
        self.assertEqual(filter_end_date, report_end_date)
        self.assertEqual(len(all_date_ranges), 0)
        self.assertEqual(len(targetperiods), 0)

    def test__generate_timeperiods(self):
        """Can we generate time periods correctly?"""
        filter_start_date = datetime.date(2018, 1, 1)
        filter_end_date = datetime.date(2019, 12, 31)
        freq = Indicator.ANNUAL
        num_recents = 0
        show_all = True
        self.mixin.program = Program()
        self.mixin.program.reporting_period_start = filter_start_date
        self.mixin.program.reporting_period_end = filter_end_date

        report_end_date, all_date_ranges, periods_date_ranges = \
            self.mixin._generate_timeperiods(filter_start_date,
                                             filter_end_date,
                                             freq,
                                             show_all,
                                             num_recents)
        self.assertEqual(report_end_date, filter_end_date)
        self.assertEqual(len(all_date_ranges), 2)
        self.assertEqual(len(periods_date_ranges), 2)

    @skip('TODO: Implement this')
    def test__update_filter_form_initial(self):
        """Do we populate the initial filter form properly?"""
        # _update_filter_form_initial(self, formdata)
        # _update_filter_form_initial(self.request.GET)
        pass

    @skip('TODO: Implement this')
    def test__get_filters(self):
        pass

    @skip('TODO: Implement this')
    def test_prepare_indicators(self):
        pass

    @skip('TODO: Implement this')
    def test_prepare_iptt_period_dateranges(self):
        pass

    @skip('TODO: Implement this')
    def test_get_context_data(self):
        pass


class IPTT_ExcelExportTests(TestCase):

    def setUp(self):
        pass

    @skip('TODO: Implement this')
    def test_get_filename(self):
        pass

    @skip('TODO: Implement this')
    def test_style_range(self):
        pass

    @skip('TODO: Implement this')
    def test_add_headers(self):
        pass

    @skip('TODO: Implement this')
    def test_add_data(self):
        pass

    @skip('TODO: Implement this')
    def test_set_column_widths(self):
        pass

    @skip('TODO: Implement this')
    def test_get(self):
        pass


class IPTT_ReportIndicatorsWithVariedStartDateTests(TestCase):
    def setUp(self):
        pass

    @skip('TODO: Implement this')
    def test_get_context_data(self):
        pass

    @skip('TODO: Implement this')
    def test_get(self):
        pass


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
