# from unittest import skip

from django.urls import reverse_lazy

from factories.indicators_models import IndicatorTypeFactory
from factories.workflow_models import ProgramFactory
from workflow.models import Country, Program
from indicators.models import Indicator
from test.test_utils import TestBase, generate_core_indicator_data


class IndicatorListTests(TestBase):

    def setUp(self):
        super(IndicatorListTests, self).setUp()
        self.base_url = 'indicator_list'
        self.base_args = [0, 0, 0]

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
        c_params = [
            ('FakeCountry1', 'C1'),
            ('FakeCountry2', 'C2'),
        ]
        created_programs, created_indicators = generate_core_indicator_data(c_params=c_params, p_count=3, i_count=5)

        self.tola_user.countries.add(Country.objects.get(country='FakeCountry1'))
        target_country_names = self.tola_user.countries.values_list('country', flat=True)

        # First test with well-behaved programs that only belong to one country
        target_indicators = Indicator.objects.filter(
            program__country__country__in=target_country_names).values_list('id', flat=True)

        url = reverse_lazy(self.base_url, args=[0, 0, 0])
        response = self.client.get(url)
        self.assertListEqual(sorted([i.id for i in response.context['getIndicators']]), sorted(target_indicators))

        # Add a country to one program and run the same query as before.  The list of indicators should be the same,
        # even though one of the projects is now linked to two countries,
        # one of which the tola_user doens't have access to.
        ps = Program.objects.filter(country__country='FakeCountry1').first()
        ps.country.add(Country.objects.get(country='FakeCountry2'))

        target_indicators = Indicator.objects.filter(
            program__country__country__in=target_country_names).values_list('id', flat=True)
        response = self.client.get(url)
        self.assertListEqual(sorted([i.id for i in response.context['getIndicators']]), sorted(target_indicators))

        # Sorry about the mess
        for c in c_params:
            c_obj = Country.objects.get(country=c[0])
            c_obj.delete()
        for p in created_programs:
            p.delete()
        for i in created_indicators:
            i.delete()
