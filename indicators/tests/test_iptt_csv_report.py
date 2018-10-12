""" Functional tests for the CSV generation file for Palantir import

url: /indicators/iptt_csv/<program_id>/
"""

from factories.workflow_models import ProgramFactory
from django import test
from StringIO import StringIO
import csv

class TestCSVEndpointGeneratesCSVFile(test.TestCase):
    url = '/indicators/iptt_csv/{0}/'
    def setUp(self):
        self.client = test.Client()
        self.program = ProgramFactory()
        self.url = self.url.format(self.program.id)

    def tearDown(self):
        self.program.delete()

    def test_endpoint_exists(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200,
                         "Expected a 200 OK at url {0}, got {1}".format(
                             self.url, response.status_code))

    def test_endpoint_returns_csv(self):
        response = self.client.get(self.url)
        self.assertEqual(response['Content-Type'], "text/csv",
                         "expected a text/csv response,at url {0}, got {1}".format(
                             self.url, response['Content-Type']))
        response_csv = csv.reader(StringIO(response.content))
        header_row = response_csv.next()
        self.assertGreater(len(header_row), 1,
                           "expected more than 1 cell in a csv file, got:\n {0}".format(
                               response.content))
        for c, value in enumerate(['Program:', self.program.name]):
            self.assertEqual(header_row[c], value,
                             "expected header row 1 cell {0} to be {1}, got {2}".format(
                                c, value, header_row[c]))
        subheader_row = response_csv.next()
        for c, value in enumerate(["id", "name"]):
            self.assertEqual(subheader_row[c], value,
                             "expected subhead row 2 cell {0} to be {1}, got {2}".format(
                                c, value, subheader_row[c]))
