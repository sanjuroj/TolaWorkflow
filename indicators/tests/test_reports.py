import datetime
import urllib
from unittest import skip

from django.http import QueryDict
from django.test import Client, RequestFactory, TestCase

from factories.indicators_models import IndicatorFactory
from factories.workflow_models import (
    ProgramFactory,
    TolaUserFactory,
    UserFactory,
)
from indicators.models import Indicator
from indicators.views.views_reports import (IPTTReportQuickstartView, IPTT_Mixin)
from workflow.models import Program


class IPTT_MixinTests(TestCase):
    """Test private methods not specifically tested in other test cases"""

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
        self.user = UserFactory(first_name="Indy", last_name="Cater", username="CI")
        self.user.set_password('password')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.country = self.tola_user.country
        self.program = ProgramFactory(
            funding_status='Funded', reporting_period_start='2016-04-01', reporting_period_end='2020-06-01')
        self.program.country.add(self.country)
        self.program.save()
        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.LOP)
        self.request_factory = RequestFactory()
        self.client = Client()
        self.client.login(username="CI", password='password')

    def test__get_num_months(self):
        """Do we return the right number of months per period?"""

        for freq in IPTT_MixinTests.freqs:
            num_months_in_period = self.mixin._get_num_months(freq)
            self.assertEqual(num_months_in_period, IPTT_MixinTests.freqs[freq])

    def test__get_num_periods_returns_0_for_reversed_date_range(self):
        """Do we return if end date is before start date?"""

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
                self.fail('Unexpected target frequency' + freq)

    def test__generate_annotations(self):
        """Do we generate queryset annotations correctly?"""

        reporttype = 'timeperiods'
        filter_start_date = datetime.date(2018, 1, 1)
        filter_end_date = datetime.date(2019, 12, 31)
        num_recents = 0
        show_all = True

        self.mixin.program = Program()
        self.mixin.program.reporting_period_start = filter_start_date
        self.mixin.program.reporting_period_end = filter_end_date

        freqs = (Indicator.LOP, Indicator.MID_END, Indicator.EVENT, Indicator.ANNUAL,
                 Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.QUARTERLY,
                 Indicator.MONTHLY)

        for freq in freqs:
            (report_end_date, all_date_ranges, periods_date_ranges) = self.mixin._generate_timeperiods(
                self.mixin.program, filter_start_date, filter_end_date, show_all, num_recents)
            self.assertEqual(self.mixin.program.reporting_period_end, report_end_date)
            self.assertEqual(self.mixin.program.reporting_period_end, filter_end_date)

            annotations = self.mixin._generate_annotations(periods_date_ranges, freq, reporttype)
            if freq == Indicator.LOP:
                self.assertEqual(annotations, {})
            else:
                self.assertNotEqual(annotations, {})

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
        freqs = (Indicator.LOP, Indicator.MID_END, Indicator.EVENT, Indicator.ANNUAL,
                 Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.QUARTERLY,
                 Indicator.MONTHLY)

        filter_start_date = datetime.date(2018, 1, 1)
        filter_end_date = datetime.date(2019, 12, 31)
        num_recents = 0
        show_all = True
        self.mixin.program = Program()
        self.mixin.program.reporting_period_start = filter_start_date
        self.mixin.program.reporting_period_end = filter_end_date

        for freq in freqs:
            report_end_date, all_date_ranges, targetperiods = self.mixin._generate_targetperiods(
                self.mixin.program, filter_start_date, filter_end_date, freq, show_all, num_recents
            )
            self.assertEqual(filter_end_date, report_end_date)
            self.assertEqual(len(all_date_ranges), 0)
            self.assertEqual(len(targetperiods), 0)

    def test__generate_timeperiods(self):
        """Can we generate time periods correctly?"""

        freqs = (Indicator.LOP, Indicator.MID_END, Indicator.EVENT, Indicator.ANNUAL,
                 Indicator.SEMI_ANNUAL, Indicator.TRI_ANNUAL, Indicator.QUARTERLY,
                 Indicator.MONTHLY)
        filter_start_date = datetime.date(2018, 1, 1)
        filter_end_date = datetime.date(2019, 12, 31)
        num_recents = 0
        show_all = True
        self.mixin.program = Program()
        self.mixin.program.reporting_period_start = filter_start_date
        self.mixin.program.reporting_period_end = filter_end_date

        for freq in freqs:
            report_end_date, all_date_ranges, timeperiods = self.mixin._generate_timeperiods(
                filter_start_date, filter_end_date, freq, show_all, num_recents
            )
            self.assertEqual(report_end_date, filter_end_date, 'End dates don\'t match')
            if freq == Indicator.LOP or freq == Indicator.MID_END or freq == Indicator.EVENT:
                self.assertEqual(len(all_date_ranges), 0)
            elif freq == Indicator.ANNUAL:
                self.assertEqual(len(all_date_ranges), 2,
                                 'Unexpected number of date ranges for {0}: {1}'.format(freq, len(all_date_ranges)))
                self.assertEqual(len(timeperiods), 2,
                                 'Unexpected number of timeperiods for {0}: {1}'.format(freq, len(timeperiods)))
            elif freq == Indicator.SEMI_ANNUAL:
                self.assertEqual(len(all_date_ranges), 4,
                                 'Unexpected number of date ranges for {0}: {1}'.format(freq, len(all_date_ranges)))
                self.assertEqual(len(timeperiods), 4,
                                 'Unexpected number of timeperiods for {0}: {1}'.format(freq, len(timeperiods)))
            elif freq == Indicator.TRI_ANNUAL:
                self.assertEqual(len(all_date_ranges), 6,
                                 'Unexpected number of date ranges for {0}: {1}'.format(freq, len(all_date_ranges)))
                self.assertEqual(len(timeperiods), 6,
                                 'Unexpected number of timeperiods for {0}: {1}'.format(freq, len(timeperiods)))
            elif freq == Indicator.QUARTERLY:
                self.assertEqual(len(all_date_ranges), 8,
                                 'Unexpected number of date ranges for {0}: {1}'.format(freq, len(all_date_ranges)))
                self.assertEqual(len(timeperiods), 8,
                                 'Unexpected number of timeperiods for {0}: {1}'.format(freq, len(timeperiods)))
            elif freq == Indicator.MONTHLY:
                self.assertEqual(len(all_date_ranges), 24,
                                 'Unexpected number of date ranges for {0}: {1}'.format(freq, len(all_date_ranges)))
                self.assertEqual(len(timeperiods), 24,
                                 'Unexpected number of timeperiods for {0}: {1}'.format(freq, len(timeperiods)))

    def test__update_filter_form_initial(self):
        """Do we populate the initial filter form properly?"""

        data = {
            'csrfmiddlewaretoken': 'lolwut',
            'program': self.program.id,
            'formprefix': IPTTReportQuickstartView.FORM_PREFIX_TARGET,
            'timeframe': Indicator.LOP,
            'targetperiods': 1,
            'numrecentperiods': 1,
        }
        query_string = urllib.urlencode(data)
        formdata = QueryDict(query_string=query_string, mutable=True)
        self.mixin._update_filter_form_initial(formdata=formdata)

        filter_form_initial_data = self.mixin.filter_form_initial_data
        # Strips off program and csrfmiddlewaretoken
        self.assertEqual(len(filter_form_initial_data), 4)
        self.assertNotIn('csrfmiddlewaretokeen', filter_form_initial_data)
        self.assertNotIn('program', filter_form_initial_data)

        # Dicts should have the same keys and the same values
        del (data['csrfmiddlewaretoken'])
        del (data['program'])
        for k in data.keys():
            self.assertIn(k, formdata)
            # Coercing both to str because the data arg is an int
            # and the formdata arg is a unicode value
            self.assertEqual(str(data[k]), str(formdata[k]))

    @skip('WIP')
    def test__get_filters(self):
        # setup data
        data = {
            'level': 'Outcome',
            'sector': 'Conflict Management',
            # workflow.models.SiteProfile ?
            'site': self.program.country.name,
            'indicators': self.indicator,
        }

        # self.mixin._get_filters(data)
        filters = self.mixin._get_filters(data)

        # assert things about the returned filters
        # assert things about the report contents

    @skip('TODO: Implement this')
    def test_prepare_indicators(self):
        pass

    @skip('TODO: Implement this')
    def test_prepare_iptt_period_dateranges(self):
        pass

    @skip('TODO: Implement this')
    def test_get_context_data(self):
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
