from unittest import skip

from django.test import TestCase, RequestFactory, Client

from factories import UserFactory
from factories.indicators_models import (IndicatorTypeFactory)
from factories.workflow_models import (ProgramFactory, TolaUserFactory)
from indicators.views.views_indicators import indicator_create


class IndicatorCreateFunctionTests(TestCase):
    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest")
        self.tola_user = TolaUserFactory(user=self.user)
        self.request_factory = RequestFactory()
        self.indicator_type = IndicatorTypeFactory()
        self.country = self.tola_user.country
        self.program = ProgramFactory()

    def test_get(self):
        """It should just return an empty form for us to fillout"""
        path = '/indicator_create/{0}'.format(self.program.id)
        request = self.request_factory.get(path=path)
        request.user = self.user
        response = indicator_create(request, id=self.program.id)
        self.assertContains(response, 'Indicator Performance Tracking Table')

    @skip("Skipping")
    def test_page_load_returns_200(self):
        print 'progid', self.program
        response = self.client.get('/indicators/indicator_create/%s/' % self.program.id)
        self.assertEqual(response.status_code, 200)

    def test_page_loads_correct_template(self):
        client = Client()
        client.force_login(self.user)
        client.get('/indicator_create/{0}'.format(self.program.id))
        self.assertTemplateUsed('indicators/indicator_create.html')
