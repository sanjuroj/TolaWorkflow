import json
import datetime
from django.urls import reverse
from django import test
from factories import workflow_models as w_factories
from factories import indicators_models as i_factories
from indicators.models import Indicator

class IPTTTVADataResponseBase(test.TestCase):
    indicator_frequency = Indicator.LOP

    def setUp(self):
        self.user = w_factories.TolaUserFactory()
        self.client = test.Client()
        self.client.force_login(self.user.user)
        self.response = None
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2017, 2, 1),
            reporting_period_end=datetime.date(2019, 10, 31)
        )

    def tearDown(self):
        self.response = None

    def get_indicator_for_program(self, **kwargs):
        kwargs['program'] = self.program
        return i_factories.IndicatorFactory(**kwargs)

    def get_indicator_by_frequency(self, frequency, **kwargs):
        kwargs['target_frequency'] = frequency
        return self.get_indicator_for_program(**kwargs)

    def get_response(self, frequency=None):
        data = {
            'programId': self.program.id,
            'frequency': frequency if frequency is not None else self.indicator_frequency,
            'reportType': 'tva'
        }
        response = self.client.get(reverse('iptt_ajax'), data, follow=True)
        self.assertEqual(response.status_code, 200, "expected 200 code, got {0}".format(response.status_code))
        self.assertEqual(len(response.redirect_chain), 0, "no redirects expected, got {0}".format(response.redirect_chain))
        return response

    def format_assert_message(self, message):
        return "{0}: \n{1}".format(self.response, message)