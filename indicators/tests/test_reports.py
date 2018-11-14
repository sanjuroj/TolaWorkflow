from datetime import datetime, date
from unittest import skip
from openpyxl import Workbook

from django.core.urlresolvers import reverse, reverse_lazy
from django.test import Client, TestCase

from collections import OrderedDict
from factories.workflow_models import ProgramFactory, UserFactory
from factories.indicators_models import IndicatorFactory
from indicators.models import Indicator
from indicators.views.views_reports import (
    IPTT_Mixin,
    IPTTReportQuickstartView,
    IPTT_ExcelExport
    )
from tola.test.base_classes import TestBase, ScenarioBase

from workflow.models import Program


class IPTT_MixinTests(TestCase):
    """Tests private methods not specifically tested in other test cases"""
    freqs = {
        Indicator.ANNUAL: 12,
        Indicator.SEMI_ANNUAL: 6,
        Indicator.TRI_ANNUAL: 4,
        Indicator.QUARTERLY: 3,
        Indicator.MONTHLY: 1,
    }

    def setUp(self):
        self.mixin = IPTT_Mixin()

    def test__get_num_months(self):
        """Do we return the right number of months per period?"""
        for freq in IPTT_MixinTests.freqs:
            num_months_in_period = self.mixin._get_num_months(freq)
            self.assertEqual(num_months_in_period, IPTT_MixinTests.freqs[freq])

    def test__get_num_periods(self):
        """Do we return the correct number of periods"""
        _get_num_periods = IPTT_Mixin._get_num_periods
        start_date = datetime.strptime("2016-01-15", "%Y-%m-%d").date()
        end_date = datetime.strptime("2017-12-16", "%Y-%m-%d").date()

        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.ANNUAL), 2)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 4)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 6)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.QUARTERLY), 8)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.MONTHLY), 24)

    def test__get_num_periods_returns_0_for_reversed_date_range(self):
        """Do we return 0 if end date is before start date?"""
        _get_num_periods = IPTT_Mixin._get_num_periods
        start_date = datetime.strptime("2020-01-01", "%Y-%m-%d").date()
        end_date = datetime.strptime("2019-01-01", "%Y-%m-%d").date()

        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.QUARTERLY), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.MONTHLY), 0)

    def test__get_period_names(self):
        """Do we return the correct period names?"""
        _get_period_name = IPTT_Mixin._get_period_name

        self.assertEqual(_get_period_name(Indicator.ANNUAL), "Year")
        self.assertEqual(_get_period_name(Indicator.SEMI_ANNUAL), "Semi-annual")
        self.assertEqual(_get_period_name(Indicator.TRI_ANNUAL), "Tri-annual")
        self.assertEqual(_get_period_name(Indicator.QUARTERLY), "Quarter")
        self.assertEqual(_get_period_name(Indicator.MONTHLY), "Month")

    def test__get_first_period(self):
        """Do we calculate the first period of a date range correctly?"""
        real_start_date = datetime.strptime("2016-07-15", "%Y-%m-%d").date()
        for freq in IPTT_MixinTests.freqs:
            num_months = self.mixin._get_num_months(freq)

            _get_first_period = self.mixin._get_first_period(real_start_date, num_months)
            if freq == Indicator.ANNUAL:
                self.assertEqual(_get_first_period,
                                 datetime.strptime("2016-01-01", "%Y-%m-%d").date())
            elif freq == Indicator.SEMI_ANNUAL:
                self.assertEqual(_get_first_period,
                                 datetime.strptime("2016-07-01", "%Y-%m-%d").date())
            elif freq == Indicator.TRI_ANNUAL:
                self.assertEqual(_get_first_period,
                                 datetime.strptime("2016-05-01", "%Y-%m-%d").date())
            elif freq == Indicator.QUARTERLY:
                self.assertEqual(_get_first_period,
                                 datetime.strptime("2016-07-01", "%Y-%m-%d").date())
            elif freq == Indicator.MONTHLY:
                self.assertEqual(_get_first_period,
                                 datetime.strptime("2016-07-01", "%Y-%m-%d").date())
            else:
                self.assertEqual(1, 0, msg="Unexpected target frequency: " + freq)

    @skip('TODO: Implement this')
    def test_generate_annotations(self):
        pass

    def test_generate_targetperiods(self):
        """Can we generate target periods correctly"""
        filter_start_date = datetime.strptime("2018-01-01", "%Y-%m-%d").date()
        filter_end_date = datetime.strptime("2019-12-31", "%Y-%m-%d").date()
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

    def test_generate_timeperiods(self):
        """Can we generate time periods correctly?"""
        filter_start_date = datetime.strptime("2018-01-01", "%Y-%m-%d").date()
        filter_end_date = datetime.strptime("2019-12-31", "%Y-%m-%d").date()
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
        self.assertEqual(filter_end_date, report_end_date)
        self.assertEqual(len(all_date_ranges), 2)
        self.assertEqual(len(periods_date_ranges), 2)

    @skip('TODO: Implement this')
    def test_update_filter_form_initial(self):
        """Do we populate the initial filter form properly?"""
        # _update_filter_form_initial(self, formdata)
        # _update_filter_form_initial(self.request.GET)
        pass

    @skip('TODO: Implement this')
    def test_get_filters(self):
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
        self.program = ProgramFactory(
            reporting_period_start=date(2015, 1, 1),
            reporting_period_end=date(2019, 12, 31),
            name='Test Program Name'
        )
        self.view = IPTT_ExcelExport()

    def test_get_filename(self):
        pass

    @skip('TODO: Implement this')
    def test_style_range(self):
        pass

    def test_add_headers(self):
        """headers should be built into the worksheet according to context data
        context variables used:
        reporttype (timeperiods/targetperiods)
        program Program
        report_start_date (date)
        report_end_date (date)
        report_date_ranges (dict) period_name : list
            - start, end, ...
        """

        context = {
            'reporttype': 'timeperiods',
            'report_start_date': date(2015, 1, 1),
            'report_end_date': date(2015, 12, 31),
            'program': self.program,
            'report_date_ranges': OrderedDict([
                ('period_1', [date(2015, 1, 1), date(2015, 6, 30)]),
                ('period_2', [date(2015, 7, 1), date(2015, 12, 31)])
            ])
        }
        wb = Workbook()
        ws = wb.active
        ws = self.view.add_headers(ws, context)
        for column, header in [
            ('A', 'Program ID'),
            ('B', 'Indicator ID'),
            ('C', 'No.'),
            ('D', 'Indicator'),
            ('E', 'Level'),
            ('F', 'Unit of measure'),
            ('G', 'Change'),
            ('H', 'C / NC'),
            ('I', '# / %'),
            ('J', 'Baseline'),
            ('K', 'Target'),
            ('L', 'Actual'),
            ('M', '% Met'),
            ('N', 'Actual'),
            ('O', 'Actual')
            ]:
            self.assertEqual(ws['{0}4'.format(column)].value, header, "{0} != {1} for col {2}".format(
                ws['{0}4'.format(column)].value, header, column))
        print "L {0} M {1} N {2} O {3}".format(ws['L2'].value, ws['M2'].value, ws['N2'].value, ws['O2'].value)
        self.assertEqual(ws['N2'].value, 'period_1')
        self.assertEqual(ws['N3'].value, 'Jan 01, 2015 - Jun 30, 2015')
        self.assertEqual(ws['O2'].value, 'period_2')
        self.assertEqual(ws['O3'].value, 'Jul 01, 2015 - Dec 31, 2015')
        context = {
            'reporttype': 'targetperiods',
            'report_start_date': date(2015, 1, 1),
            'report_end_date': date(2015, 12, 31),
            'program': self.program,
            'report_date_ranges': OrderedDict([
                ('period_1', [date(2015, 1, 1), date(2015, 6, 30)]),
                ('period_2', [date(2015, 7, 1), date(2015, 12, 31)])
            ])
        }
        wb = Workbook()
        ws = wb.active
        ws = self.view.add_headers(ws, context)
        for column, header in [
            ('A', 'Program ID'),
            ('B', 'Indicator ID'),
            ('C', 'No.'),
            ('D', 'Indicator'),
            ('E', 'Level'),
            ('F', 'Unit of measure'),
            ('G', 'Change'),
            ('H', 'C / NC'),
            ('I', '# / %'),
            ('J', 'Baseline'),
            ('K', 'Target'),
            ('L', 'Actual'),
            ('M', '% Met'),
            ('N', 'Target'),
            ('O', 'Actual'),
            ('P', '% Met'),
            ('Q', 'Target'),
            ('R', 'Actual'),
            ('S', '% Met'),
            ]:
            self.assertEqual(ws['{0}4'.format(column)].value, header, "{0} != {1} for col {2}".format(
                ws['{0}4'.format(column)].value, header, column))
        self.assertEqual(ws['N2'].value, 'period_1')
        self.assertEqual(ws['N3'].value, 'Jan 01, 2015 - Jun 30, 2015')
        self.assertEqual(ws['Q2'].value, 'period_2')
        self.assertEqual(ws['Q3'].value, 'Jul 01, 2015 - Dec 31, 2015')


    def test_add_data(self):
        """does the right ws row get generated based on context data provided?
        context keys:
        indicators (list of indicators)
            -program id
            -id
            -number
            -name
            -lastlevel
            -unit_of_measure
            -direction_of_change
            -cumulative
            -unitttype
            -baseline
            -lop_target
            -lop_actual
            -lop_percent_met
        report_date_ranges keys: (targetperiods)
            -key_period_target
            -key_actual
            -key_percent_met
        report_date_ranges keys: (timeperiods)
            -key_actual"""
        indicator = OrderedDict([
            ('id', 1),
            ('number', '2.4'),
            ('name', 'indicator name'),
            ('lastlevel', 'level'),
            ('unit_of_measure', 'bananas'),
            ('direction_of_change', '+'),
            ('cumulative', 'Cumulative'),
            ('unittype', '#'),
            ('baseline', '100'),
            ('lop_target', '100'),
            ('lop_actual', '50'),
            ('lop_percent_met', '50%'),
            ('one_period_target', '25'),
            ('one_actual', '40'),
            ('one_percent_met', '90%'),
            ('two_period_target', '30'),
            ('two_actual', '80'),
            ('two_percent_met', '60%')
        ])
        context = {
            'report_date_ranges': OrderedDict([('one', None), ('two', None)]),
            'program': self.program,
            'indicators': [
                indicator
            ]
        }
        wb = Workbook()
        ws = wb.active
        context['reporttype'] = 'timeperiods'
        ws = self.view.add_data(wb, ws, context)
        self.assertEqual(ws['A5'].value, self.program.id)
        for col, key in enumerate(indicator.keys()[:-6]):
            value = ws.cell(row=5, column=col+2).value
            self.assertEqual(indicator[key], value)
        self.assertEqual(ws.cell(row=5, column=15).value, u'40')
        self.assertEqual(ws.cell(row=5, column=16).value, u'80')
        context['reporttype'] = 'targetperiods'
        ws = self.view.add_data(wb, ws, context)
        self.assertEqual(ws['A5'].value, self.program.id)
        for col, key in enumerate(indicator.keys()):
            value = ws.cell(row=5, column=col+2).value
            self.assertEqual(indicator[key], value)

    def test_set_column_widths(self):
        widths = [10, 10, 10, 100, 12, 40, 8, 12]
        collapseds = [True, True] + [False*6]
        wb = Workbook()
        ws = wb.active
        for x, v in enumerate(['banana']*20):
            ws.cell(row=1, column=x+1).value = v
        ws = self.view.set_column_widths(ws)
        for col, width in enumerate(widths):
            column_letter = ws.cell(row=1, column=col+1).column
            self.assertEqual(ws.column_dimensions[column_letter].width,
                             width)
        for col, collapsed in enumerate(collapseds):
            column_letter = ws.cell(row=1, column=col+1).column
            self.assertEqual(ws.column_dimensions[column_letter].hidden,
                             collapsed)

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


class IPTTReportQuickstartViewTests(TestBase, TestCase):

    def setUp(self):
        self.client = Client()
        self.program = ProgramFactory()
        self.user = UserFactory()

    def test_get_returns_200(self):
        """Do we return 200?"""
        path = reverse_lazy('iptt_quickstart')
        response = self.client.get(path, follow=True)
        self.assertEqual(response.status_code, 200)

    def test_get_does_not_redirect(self):
        """This page should not redirect"""
        path = reverse_lazy('iptt_quickstart')
        response = self.client.get(path, follow=True)
        self.assertEqual(len(response.redirect_chain), 0)

    def test_page_loads_correct_template(self):
        """Do we load the right template?"""
        path = reverse_lazy('iptt_quickstart')
        response = self.client.get(path, follow=True)
        self.assertTemplateUsed(response, 'indicators/iptt_quickstart.html')
        self.assertContains(response, 'Indicator Performance Tracking Table')

    @skip('TODO: Implement this')
    def test_get_context_data(self):
        pass

    @skip('TODO: Implement this')
    def test_get_form_kwargs(self):
        pass

    @skip('TODO: WIP; currently fails to redirect')
    def test_post_with_valid_form_redirects(self):
        """Does POSTing to iptt_quickstart with valid form data return 302
        and redirect to /indicators/iptt_report/{program_id}/{reporttype}/"""
        data = {
            'csrfmiddlewaretoken': 'lolwut',
            'timeperiods-formprefix': IPTTReportQuickstartView.FORM_PREFIX_TIME,
            'timeperiods-numrecentperiods': 2,
            'timeperiods-program': self.program.id,
            'timeperiods-timeframe': 2,
            'timeperiods-timeperiods': 7,
        }
        path = reverse('iptt_quickstart')
        response = self.client.post(path=path, data=data, follow=True)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(response.redirect_chain), 1)

    @skip('TODO: Implement this')
    def test_post_with_invalid_form(self):
        pass

    @skip('TODO: Implement this')
    def test_form_valid(self):
        pass

    @skip('TODO: Implement this')
    def test_form_invalid(self):
        pass


class IPTT_ReportViewTestCase(TestCase):

    def setUp(self):
        pass

    @skip('TODO: Implement this')
    def test_get(self):
        pass

    @skip('TODO: Implement this')
    def test_post(self):
        pass
