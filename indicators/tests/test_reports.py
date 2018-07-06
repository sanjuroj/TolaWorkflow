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

    def get_num_months_annual(self):
        mixin = IPTT_Mixin()
        num_months_in_period = mixin._get_num_months(Indicator.ANNUAL)
        self.assertEqual(num_months_in_period, 1)

        todays_date = datetime.today().date()
        _get_first_period = mixin._get_first_period(todays_date, num_months_in_period)
        self.assertLessEqual(_get_first_period, todays_date)
        print("First period:", _get_first_period)

        # The 2016 start date includes leap year in the range
        start_date = datetime.strptime("2016-01-22", "%Y-%m-%d").date()
        end_date = datetime.strptime("2018-12-31", "%Y-%m-%d").date()

        _get_num_periods = mixin._get_num_periods(start_date, end_date, Indicator.ANNUAL)
        print("NumPeriods", _get_num_periods)
        self.assertEqual(_get_num_periods, 3)

    def test_get_num_months_semiannual(self):
        mixin = IPTT_Mixin()
        _get_num_months = mixin._get_num_months(Indicator.SEMI_ANNUAL)
        self.assertEqual(_get_num_months, 6)

        todays_date = datetime.today().date()
        _get_first_period = mixin._get_first_period(todays_date, _get_num_months)
        self.assertLessEqual(_get_first_period, todays_date)

        start_date = datetime.strptime("2016-01-22", "%Y-%m-%d").date()
        end_date = datetime.strptime("2018-12-31", "%Y-%m-%d").date()

        _get_num_periods = mixin._get_num_periods(start_date, end_date, Indicator.SEMI_ANNUAL)
        self.assertEqual(_get_num_periods, 6)

    def test_get_num_months_triannual(self):
        mixin = IPTT_Mixin()
        _get_num_months = mixin._get_num_months(Indicator.TRI_ANNUAL)
        self.assertEqual(_get_num_months, 4)

        todays_date = datetime.today().date()
        _get_first_period = mixin._get_first_period(todays_date, _get_num_months)
        self.assertLessEqual(_get_first_period, todays_date)

        start_date = datetime.strptime("2016-01-22", "%Y-%m-%d").date()
        end_date = datetime.strptime("2018-12-31", "%Y-%m-%d").date()

        _get_num_periods = mixin._get_num_periods(start_date, end_date, Indicator.TRI_ANNUAL)
        self.assertEqual(_get_num_periods, 9)

    def test_get_num_months_quarterly(self):
        mixin = IPTT_Mixin()
        _get_num_months = mixin._get_num_months(Indicator.QUARTERLY)
        self.assertEqual(_get_num_months, 3)

        todays_date = datetime.today().date()
        _get_first_period = mixin._get_first_period(todays_date, _get_num_months)
        self.assertLessEqual(_get_first_period, todays_date)

        start_date = datetime.strptime("2016-01-22", "%Y-%m-%d").date()
        end_date = datetime.strptime("2018-12-31", "%Y-%m-%d").date()

        _get_num_periods = mixin._get_num_periods(start_date, end_date, Indicator.QUARTERLY)
        self.assertEqual(_get_num_periods, 12)

    def test_get_num_months_monthly(self):
        mixin = IPTT_Mixin()
        _get_num_months = mixin._get_num_months(Indicator.MONTHLY)
        self.assertEqual(_get_num_months, 1)

        todays_date = datetime.today().date()
        _get_first_period = mixin._get_first_period(todays_date, _get_num_months)

        self.assertLessEqual(_get_first_period, todays_date)
        start_date = datetime.strptime("2016-01-22", "%Y-%m-%d").date()
        end_date = datetime.strptime("2018-12-31", "%Y-%m-%d").date()

        _get_num_periods = mixin._get_num_periods(start_date, end_date, Indicator.MONTHLY)
        self.assertEqual(_get_num_periods, 36)
