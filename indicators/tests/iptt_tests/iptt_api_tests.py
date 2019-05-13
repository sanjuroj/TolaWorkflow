""" Tests for the api call functions for the IPTT Report page React calls"""

from django import test
from factories.workflow_models import ProgramFactory


class TestOldStyleLevelAPIData(test.TestCase):
    """ensure an old style program serializes to have correct level data for filters"""

    def setUp(self):
        self.program = ProgramFactory(
            new_grouping = 
        )
