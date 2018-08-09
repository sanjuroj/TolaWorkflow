# from unittest import skip

from django.urls import reverse_lazy

from factories.indicators_models import IndicatorTypeFactory
from factories.workflow_models import ProgramFactory
from workflow.models import Country
from test.test_utils import TestBase, generate_core_indicator_data


class IndicatorListTests(TestBase):

    def setUp(self):
        super(IndicatorListTests, self).setUp()
        self.base_url = 'indicator_list'
        self.base_args = [0, 0, 0]
        generate_core_indicator_data(c_count=3, p_count=3, i_count=5)

    def test_simple_get(self):

        indicator_type = IndicatorTypeFactory()
        self.indicator.indicator_type.add(indicator_type)
        self.indicator.save()

        url = reverse_lazy(self.base_url, args=self.base_args)
        response = self.client.get(url)
        self.assertContains(response, self.program.name)

        kwargs = {
            'program': self.program.id, 'indicator': self.indicator.id, 'type': indicator_type.id}
        url = reverse_lazy(self.base_url, kwargs=kwargs)
        response = self.client.get(url)
        self.assertContains(response, self.program.name)

    def test_get_by_status(self):
        prog_completed = ProgramFactory(name='This fund is completed', funding_status='Completed')
        prog_closed = ProgramFactory(name='This fund is closed', funding_status='Completed')

        url = reverse_lazy(self.base_url, args=self.base_args)
        response = self.client.get(url)
        self.assertNotContains(response, prog_completed.name)
        self.assertNotContains(response, prog_closed.name)

    def test_user_country_filter(self):
        self.tola_user.countries.add(Country.objects.get(country='Colombia'))
        url = reverse_lazy(self.base_url, args=[0, 0, 0])
        response = self.client.get(url)

        db_countries = set()
        for i in response.context['getIndicators']:
            for p in i.program.all():
                db_countries.update(p.country.values_list('country', flat=True))
        self.tola_user.countries.remove(Country.objects.get(country='Colombia'))
        self.assertTrue(db_countries == set(['United States', 'Colombia']))
