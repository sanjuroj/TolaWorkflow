import mock
from django.test import TestCase

from factories.indicators_models import ExternalServiceFactory
from indicators.views.views_indicators import import_indicator


class ImportIndicatorTests(TestCase):

    @mock.patch("indicators.views.views_indicators.requests.get")
    def test_remote_resource_true(self, mock_get):
        """
        It should deserialize the response content
        """
        class mock_response(object):
            json = lambda self: {'hello': 1}
            content = '{"hello": 1}'

        mock_get.return_value = mock_response()
        service = ExternalServiceFactory(name="Import Ind Test Service")
        result = import_indicator(service=service.id)

        self.assertDictEqual(result, {'hello': 1})
