import datetime

from factory import Sequence

from django.test import RequestFactory, Client
from django.urls import reverse_lazy
from django.core.exceptions import ImproperlyConfigured

from factories.django_models import UserFactory
from factories.indicators_models import IndicatorFactory
from factories.workflow_models import ProgramFactory, TolaUserFactory, CountryFactory
from indicators.models import Indicator, PeriodicTarget, CollectedData
from tola.test.utils import instantiate_scenario, make_targets


class TestBase(object):
    fixtures = ['indicatortype.json', 'levels.json']

    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest", username="IC")
        self.user.set_password('password')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.request_factory = RequestFactory()
        self.country = self.tola_user.country
        self.program = ProgramFactory(
            funding_status='Funded', reporting_period_start='2016-03-01', reporting_period_end='2020-05-01')
        self.program.country.add(self.country)
        self.program.save()
        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.ANNUAL)

        self.client = Client()
        self.client.login(username="IC", password='password')


class ScenarioBase(TestBase):

    def setUp(self):
        super(ScenarioBase, self).setUp()
        self.indicator.delete()
        indicator_ids = instantiate_scenario(self.program.id, self.scenario)
        if len(indicator_ids) > 1:
            raise ImproperlyConfigured('The scenario contained more than one indicator')
        self.indicators = Indicator.objects.filter(id__in=indicator_ids)
        self.url = reverse_lazy(self.url_name, args=[self.indicators.first().id, self.program.id])
        self.response = self.client.get(self.url)

    def test_collected_data_sum_correct(self):
        data = self.response.context.pop()
        self.assertEqual(self.scenario[0].collected_data_sum, data['grand_achieved_sum'])
