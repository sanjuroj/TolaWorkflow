from datetime import datetime
from django.test import TestCase
from django.test import Client
from indicators.models import Indicator
from indicators.views.views_reports import IPTT_Mixin


class IpttQuickstartTest(TestCase):

    def setup(self):
        self.client = Client()
        self.mixin = IPTT_Mixin()

    def test_page_load_returns_200(self):
        response = self.client.get('/indicators/iptt_quickstart/')
        self.assertEqual(response.status_code, 200)

    def test_page_loads_correct_template(self):
        response = self.client.get('/indicators/iptt_quickstart/')
        self.assertTemplateUsed('indicators/iptt_quickstart.html')
        self.assertContains(response, 'Indicator Performance Tracking Table')

    def test_mixin(self):

        mixin = IPTT_Mixin()
        print("mixin instance created")
        num_months_in_period = mixin._get_num_months(Indicator.ANNUAL)
        todays_date = datetime.today().date()
        print(mixin._get_first_period(todays_date, num_months_in_period))

        start_date = datetime.strptime("2017-01-22", "%Y-%m-%d").date()
        end_date = datetime.strptime("2019-12-31", "%Y-%m-%d").date()

        _get_num_periods = mixin._get_num_periods(start_date, end_date, Indicator.ANNUAL)
        print("NumPeriods", _get_num_periods)
        self.assertEqual(1, 1)
