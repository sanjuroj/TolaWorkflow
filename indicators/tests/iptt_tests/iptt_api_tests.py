""" Tests for the api call functions for the IPTT Report page React calls"""

from django import test
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.serializers import IPTTProgramSerializer

old_levels = (
    (1, "Goal"),
    (2, "Output"),
    (3, "Outcome"),
    (4, "Activity"),
    (5, "Impact"),
    (6, "Intermediate Outcome")
)

def get_old_style_program():
    return w_factories.ProgramFactory(
        using_results_framework=False
    )

def get_old_style_program_with_all_levels():
    program = get_old_style_program()
    for (_, level_name) in old_levels:
        i_factories.IndicatorFactory(
            program=program,
            old_level=level_name
        )
    return program

class TestOldStyleLevelAPIData(test.TestCase):
    """ensure an old style program serializes to have correct level data for filters"""

    def test_all_levels_in_serializer(self):
        program = get_old_style_program_with_all_levels()
        serialized = IPTTProgramSerializer(program)
        self.assertIn('levels', serialized.data)
        levels = serialized.data['levels']
        self.assertEqual(len(levels), 6)