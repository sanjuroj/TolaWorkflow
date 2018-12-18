import datetime

from django.urls import reverse_lazy, reverse
from django.test import TestCase
from bs4 import BeautifulSoup

from factories.indicators_models import IndicatorTypeFactory
from factories.workflow_models import ProgramFactory
from workflow.models import Country, Program
from indicators.models import Indicator
from tola.test.base_classes import TestBase, ScenarioBase, ScenarioBase2, IndicatorDetailsMixin, IndicatorStatsMixin
from tola.test.scenario_definitions import indicator_scenarios
from tola.test.utils import instantiate_scenario, generate_core_indicator_data


class CollectedDataTest(TestBase, TestCase):

    def setUp(self):
        super(CollectedDataTest, self).setUp()
        core_params = {'c_params': [('Country1', 'C1')], 'p_count': 1, 'i_count': 2}
        self.program_ids, self.indicator_ids = generate_core_indicator_data(**core_params)
        program = Program.objects.get(id=self.program_ids[0])
        program.reporting_period_start = datetime.date(2016, 3, 1)
        program.reporting_period_end = datetime.date(2019, 5, 31)
        program.save()
        instantiate_scenario(
            program.id, indicator_scenarios['scenario_2i-default_4pt_3cd'], self.indicator_ids)

        self.base_url = 'collected_data_view'
        self.base_args = [0, 0, 0]

    def test_load_correct_indicator_data(self):
        program = Program.objects.get(id=self.program_ids[0])
        indicator = Indicator.objects.get(id=self.indicator_ids[0])
        url = reverse(self.base_url, args=[indicator.id, program.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class DefaultScenarioTest(ScenarioBase, IndicatorDetailsMixin, TestCase):
    scenario = indicator_scenarios['scenario_1i-default_5pt_3cd']
    url_name = 'collected_data_view'


class CumulativeNumberScenarioTest(ScenarioBase, IndicatorDetailsMixin, TestCase):
    scenario = indicator_scenarios['scenario_1i-cumulative_number_5pt_3cd']
    url_name = 'collected_data_view'


class PercentScenarioTest(ScenarioBase, IndicatorDetailsMixin, TestCase):
    scenario = indicator_scenarios['scenario_1i-cumulative_percent_5pt_3cd']
    url_name = 'collected_data_view'


class DefaultScenarioStatsTest(ScenarioBase2, IndicatorStatsMixin, TestCase):
    scenario = indicator_scenarios['scenario_1i-default_5pt_3cd_7ev']
    url_name = 'program_page'
