"""For a given queryset of programs (1..n) queryset should provide an "all_targets_defined" count and "program_count"
   without unnecessary queries"""

from indicators.queries import ProgramWithMetrics
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from django import test


class TestTwoProgramsBothDefined(test.TestCase):
    def setUp(self):
        program1 = get_program()
        get_all_targets_defined_indicator(program1)
        program2 = get_program()
        get_all_targets_defined_indicator(program2)
        self.program_ids = (program1.id, program2.id)

    def test_programs_each_report_all_defined(self):
        for program_id in self.program_ids:
            annotated = ProgramWithMetrics.home_page.with_annotations().get(pk=program_id)
            self.assertEqual(
                annotated.metrics['indicator_count'],
                annotated.metrics['targets_defined']
            )
            self.assertTrue(annotated.all_targets_defined_for_all_indicators)

    def test_programs_qs_reports_all_defined_counts(self):
        program_qs = ProgramWithMetrics.home_page.with_annotations().filter(pk__in=self.program_ids)
        self.assertEqual(
            program_qs.program_count,
            program_qs.all_targets_defined_for_all_indicators_count
        )
