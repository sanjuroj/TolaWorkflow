from django.test import TestCase
from django.test import Client

class IpttQuickstartTest(TestCase):

    def setup(self):
        self.client = Client()

    def test_page_load_returns_200(self):
        response = self.client.get('/indicators/iptt_quickstart/')
        self.assertEqual(response.status_code, 200)

    def test_page_loads_correct_template(self):
        response = self.client.get('/indicators/iptt_quickstart/')
        self.assertTemplateUsed('indicators/iptt_quickstart.html')
        self.assertContains(response, 'Indicator Performance Tracking Table')
