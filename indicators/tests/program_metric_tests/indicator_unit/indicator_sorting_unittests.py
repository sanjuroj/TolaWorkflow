"""Test that indicators from any source have a sort order that takes log frame into account

    this is per GH ticket #826, but is almost certainly temporary (log frame support will root this process
    in data structures, as opposed to string formatting in the indicator number field)
    Current (temporary) business logic:
        - if all indicator number fields are strictly numeric: sort numerically
        - if all indicator number fields are strictly numbers separated by '.': sort as an outline
            (1, 1.1, 1.2, 1.2.1.1, etc.)
        - else sort alphabetically"""

from factories import indicators_models as factory
from indicators.models import Indicator
from indicators.queries import (
    MetricsIndicator,
    IPTTIndicator
)
from django import test

def get_indicator(number):
    return factory.IndicatorFactory(
        number=number
    )

class SortingTestsMixin(object):

    def test_metrics_indicator_manager(self):
        metricsindicators = list(MetricsIndicator.objects.with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk)

    def test_metrics_indicator_queryset(self):
        metricsindicators = list(MetricsIndicator.objects.all().with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk)

    def test_regular_indicator_manager(self):
        metricsindicators = list(Indicator.objects.with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk)

    def test_regular_indicator_queryset(self):
        metricsindicators = list(Indicator.objects.all().with_logframe_sorting())
        for c, pk in enumerate(self.expected):
            self.assertEqual(metricsindicators[c].pk, pk)

class TestNumericSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        self.expected = []
        for x in range(10):
            self.expected.append(get_indicator(x+1).id)

class TestAlphabeticalSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        self.expected = []
        for x in ['aasdf', 'basdf', 'casdf', 'daasdf', 'e3214', 'f5235']:
            self.expected.append(get_indicator(x).id)

class TestLogframeSorting(test.TestCase, SortingTestsMixin):
    def setUp(self):
        self.expected = []
        for x in ['1', '1.1', '1.1.1', '1.2', '2.1.2', '3', '3.2.1.1']:
            self.expected.append(get_indicator(x).id)