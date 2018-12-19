"""Has Reported Results unit tests for indicators for the program page indicator list

Business rules:
 - indicator has at least one result associated with it = has_reported_results=True
 - results_count = count of results associated with indicator
"""

from factories import indicators_models as i_factories
from indicators.queries import MetricsIndicator
from django import test

@test.tag('fast', 'results', 'metrics', 'core')
class TestHasReportedResults(test.TestCase):
    """Indicator should report has_reported_results = if indicator.result_set count >= 1"""

    def get_indicator(self):
        return i_factories.IndicatorFactory()

    def add_result(self, indicator):
        return i_factories.ResultFactory(
            indicator=indicator,
            achieved=100
        )

    def get_annotated_indicator(self, indicator=None):
        if indicator is None:
            indicator = self.get_indicator()
        return MetricsIndicator.objects.with_annotations('results').get(pk=indicator.pk) 

    def test_no_result_false(self):
        annotated_indicator = self.get_annotated_indicator()
        self.assertFalse(annotated_indicator.has_reported_results)
        self.assertEqual(annotated_indicator.results_count, 0)

    def test_one_result_true(self):
        indicator = self.get_indicator()
        self.add_result(indicator)
        annotated_indicator = self.get_annotated_indicator(indicator)
        self.assertTrue(annotated_indicator.has_reported_results)
        self.assertEqual(annotated_indicator.results_count, 1)

    def test_two_result_true(self):
        indicator = self.get_indicator()
        self.add_result(indicator)
        self.add_result(indicator)
        annotated_indicator = self.get_annotated_indicator(indicator)
        self.assertTrue(annotated_indicator.has_reported_results)
        self.assertEqual(annotated_indicator.results_count, 2)

    def test_three_indicators_with_different_data_counts(self):
        no_data_indicator = self.get_indicator()
        one_data_indicator = self.get_indicator()
        self.add_result(one_data_indicator)
        three_data_indicator = self.get_indicator()
        for _ in range(3):
            self.add_result(three_data_indicator)
        expected = [(False, 0), (True, 1), (True, 3)]
        for (has_results, count), indicator in zip(
            expected, MetricsIndicator.objects.with_annotations('results').order_by('pk')):
            self.assertEqual(has_results, indicator.has_reported_results)
            self.assertEqual(count, indicator.results_count)
