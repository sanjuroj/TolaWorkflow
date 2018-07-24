from unittest import skip

from django.test import TestCase, RequestFactory, Client
from django.urls import reverse_lazy

from factories import UserFactory
from factories.indicators_models import (IndicatorTypeFactory)
from factories.workflow_models import (ProgramFactory, TolaUserFactory)


class TestBaseMixin(object):
    fixtures = ['indicatortype.json', 'levels.json']

    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest", username="IC")
        self.user.set_password('password')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.request_factory = RequestFactory()
        self.indicator_type = IndicatorTypeFactory()
        self.country = self.tola_user.country
        self.program = ProgramFactory()

        self.client = Client()
        self.client.login(username="IC", password='password')


class IndicatorCreateFunctionTests(TestBaseMixin, TestCase):

    def setUp(self):
        super(IndicatorCreateFunctionTests, self).setUp()

    def test_get(self):
        url = reverse_lazy('indicator_create', args=[self.program.id])
        response = self.client.get(url)

        self.assertContains(response, 'Indicator Performance Tracking Table')
        self.assertTemplateUsed(response, 'indicators/indicator_create.html')

    def test_post(self):
        request_content = {
            'program': self.program.id, 'country': self.country.id, 'services': 0, 'service_indicator': 0}
        response = self.client.post('/indicators/indicator_create/%s/' % self.program.id, request_content)

        self.assertEqual(response.status_code, 302)
