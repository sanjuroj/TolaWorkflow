from __future__ import print_function
from datetime import datetime
from django.test import TestCase, Client
from indicators.models import Indicator
from indicators.views.views_reports import IPTT_Mixin


class IpttQuickstartTest(TestCase):

    def setup(self):
        self.client = Client()
        self.mixin = IPTT_Mixin()

    def test_page_load_returns_200(self):
        response = self.client.get('/indicators/iptt_quickstart/', follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.redirect_chain), 0)

    def test_page_loads_correct_template(self):
        response = self.client.get('/indicators/iptt_quickstart/')
        self.assertTemplateUsed('indicators/iptt_quickstart.html')
        self.assertContains(response, 'Indicator Performance Tracking Table')

    def test_get_num_months(self):
        freqs = {
            Indicator.ANNUAL: 12,
            Indicator.SEMI_ANNUAL: 6,
            Indicator.TRI_ANNUAL: 4,
            Indicator.QUARTERLY: 3,
            Indicator.MONTHLY: 1,
        }

        mixin = IPTT_Mixin()
        for freq in freqs:
            num_months_in_period = mixin._get_num_months(freq)
            self.assertEqual(num_months_in_period, freqs[freq])

    def test_get_num_periods(self):
        _get_num_periods = IPTT_Mixin._get_num_periods
        start_date = datetime.strptime("2016-01-15", "%Y-%m-%d").date()
        end_date = datetime.strptime("2017-12-16", "%Y-%m-%d").date()

        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.ANNUAL), 2)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 4)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 6)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.QUARTERLY), 8)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.MONTHLY), 24)

    def test_get_num_periods_returns_0_for_reversed_date_range(self):
        _get_num_periods = IPTT_Mixin._get_num_periods
        start_date = datetime.strptime("2020-01-01", "%Y-%m-%d").date()
        end_date = datetime.strptime("2019-01-01", "%Y-%m-%d").date()

        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.QUARTERLY), 0)
        self.assertEqual(_get_num_periods(start_date, end_date, Indicator.MONTHLY), 0)

    def test_get_period_names(self):
        _get_period_name = IPTT_Mixin._get_period_name

        self.assertEqual(_get_period_name(Indicator.ANNUAL), "Year")
        self.assertEqual(_get_period_name(Indicator.SEMI_ANNUAL), "Semi-annual")
        self.assertEqual(_get_period_name(Indicator.TRI_ANNUAL), "Tri-annual")
        self.assertEqual(_get_period_name(Indicator.QUARTERLY), "Quarter")
        self.assertEqual(_get_period_name(Indicator.MONTHLY), "Month")

    def test_get_first_period(self):
        freqs = {
            Indicator.ANNUAL: 12,
            Indicator.SEMI_ANNUAL: 6,
            Indicator.TRI_ANNUAL: 4,
            Indicator.QUARTERLY: 3,
            Indicator.MONTHLY: 1,
        }
        real_start_date = datetime.strptime("2016-07-15", "%Y-%m-%d").date()


        mixin = IPTT_Mixin()
        for freq in freqs:
            num_months = mixin._get_num_months(freq)

            _get_first_period = mixin._get_first_period(real_start_date, num_months)
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

    def test_generate_annotations(self):
        pass

    def test_generate_targetperiods(self):
        pass

    def test_generate_timeperiods(self):
        pass

    def test_update_filter_form_initial(self):
        pass

    def test_get_filters(self):
        pass

    def test_prepare_indicators(self):
        pass

    # def test_prepare_iptt_period_dateranges(self):
    #     '''prepare_iptt_period_dateranges(self, period, periods_date_ranges, from_or_to):'''
    #     self.mixin = IPTT_Mixin()
    #     self.FROM = True
    #     start_date = datetime.strptime("2018-01-01", "%Y-%m-%d").date(),
    #     end_date = datetime.strptime("2018-12-31", "%Y-%m-%d").date()
    #     ranges = self.mixin.prepare_iptt_period_dateranges(Indicator.TRI_ANNUAL, [start_date, end_date], self.FROM)
    #     print(ranges)

    def test_get_context_data(self):
        pass
