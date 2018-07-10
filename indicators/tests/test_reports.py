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
        start_date = datetime.strptime("2016-01-15", "%Y-%m-%d").date()
        end_date = datetime.strptime("2017-12-16", "%Y-%m-%d").date()

        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.ANNUAL), 2)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 4)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 6)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.QUARTERLY), 8)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.MONTHLY), 24)

    def test_get_num_periods_rejects_reversed_date_range(self):
        start_date = datetime.strptime("2020-01-01", "%Y-%m-%d").date()
        end_date = datetime.strptime("2019-01-01", "%Y-%m-%d").date()

        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.ANNUAL), 0)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL), 0)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL), 0)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.QUARTERLY), 0)
        self.assertEqual(IPTT_Mixin._get_num_periods(start_date, end_date, Indicator.MONTHLY), 0)

    def test_get_period_names(self):
        self.assertEqual(IPTT_Mixin._get_period_name(Indicator.ANNUAL), "Year")
        self.assertEqual(IPTT_Mixin._get_period_name(Indicator.SEMI_ANNUAL), "Semi-annual")
        self.assertEqual(IPTT_Mixin._get_period_name(Indicator.TRI_ANNUAL), "Tri-annual")
        self.assertEqual(IPTT_Mixin._get_period_name(Indicator.QUARTERLY), "Quarter")
        self.assertEqual(IPTT_Mixin._get_period_name(Indicator.MONTHLY), "Month")

    def test_get_first_period_annual(self):
        mixin = IPTT_Mixin()

        real_start_date = datetime.strptime("2016-02-29", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-01-01", "%Y-%m-%d").date()
        ret = mixin._get_num_months(Indicator.ANNUAL)
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

    def test_get_first_period_semiannual(self):
        mixin = IPTT_Mixin()

        real_start_date = datetime.strptime("2016-02-29", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-01-01", "%Y-%m-%d").date()
        ret = mixin._get_num_months(Indicator.SEMI_ANNUAL)
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date, '')

        real_start_date = datetime.strptime("2016-07-15", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-07-01", "%Y-%m-%d").date()
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

    def test_get_first_period_triannual(self):
        mixin = IPTT_Mixin()

        real_start_date = datetime.strptime("2016-02-29", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-01-01", "%Y-%m-%d").date()
        ret = mixin._get_num_months(Indicator.TRI_ANNUAL)
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

        real_start_date = datetime.strptime("2016-05-31", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-05-01", "%Y-%m-%d").date()
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

        real_start_date = datetime.strptime("2016-09-15", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-09-01", "%Y-%m-%d").date()
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

    def test_get_first_period_quarterly(self):
        mixin = IPTT_Mixin()

        real_start_date = datetime.strptime("2016-02-29", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-01-01", "%Y-%m-%d").date()
        ret = mixin._get_num_months(Indicator.QUARTERLY)
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

        real_start_date = datetime.strptime("2016-04-15", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-04-01", "%Y-%m-%d").date()
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

        real_start_date = datetime.strptime("2016-07-04", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-07-01", "%Y-%m-%d").date()
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

        real_start_date = datetime.strptime("2016-10-31", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-10-01", "%Y-%m-%d").date()
        _get_first_period = mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

    def test_get_first_period_monthly(self):
        self.mixin = IPTT_Mixin()
        real_start_date = datetime.strptime("2016-02-29", "%Y-%m-%d").date()
        period_start_date = datetime.strptime("2016-02-01", "%Y-%m-%d").date()
        ret = self.mixin._get_num_months(Indicator.MONTHLY)
        _get_first_period = self.mixin._get_first_period(real_start_date, ret)
        self.assertEqual(_get_first_period, period_start_date)

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
