import datetime
from unittest import skip

from django.test import TestCase
from indicators.models import Indicator
from indicators.views.views_reports import (
    IPTT_Mixin,
    IPTT_ReportView,
)
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


class IPTT_ReportIndicatorsWithVariedStartDateTests(TestCase):
    def setUp(self):
        pass

    @skip('TODO: Implement this')
    def test_get_context_data(self):
        pass

    @skip('TODO: Implement this')
    def test_get(self):
        pass
