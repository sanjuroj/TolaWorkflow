# -*- coding: utf-8 -*-
"""
Test levels
"""
import datetime

from django import test

from factories import ProgramFactory, LevelFactory


class TestLevelDepthCalculation(test.TestCase):
    """
    Test the get_level_depth method on the Level model to assure that the depth calculation is correct.
    """

    def setUp(self):
        self.program = ProgramFactory(
            reporting_period_start=datetime.date(2018, 1, 1),
            reporting_period_end=datetime.date(2019, 1, 1),
        )
        self.level1 = LevelFactory()
        self.level2_1 = LevelFactory(parent=self.level1)
        self.level3_1 = LevelFactory(parent=self.level2_1, customsort=1)
        self.level3_2 = LevelFactory(parent=self.level2_1, customsort=2)

    def test_result_table_html(self):
        self.assertEqual(self.level1.get_level_depth(), 1)
        self.assertEqual(self.level2_1.get_level_depth(), 2)
        self.assertEqual(self.level3_1.get_level_depth(), 3)
        self.assertEqual(self.level3_2.get_level_depth(), 3)
