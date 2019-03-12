# -*- coding: utf-8 -*-
"""
Test levels
"""
import datetime

from django import test

from factories import ProgramFactory, LevelFactory, LevelTierFactory


class TestLevelDepthCalculation(test.TestCase):
    """
    Test the get_level_depth method on the Level model to assure that the depth calculation is correct.
    """

    def setUp(self):
        self.program = ProgramFactory(
            reporting_period_start=datetime.date(2018, 1, 1),
            reporting_period_end=datetime.date(2019, 1, 1),
        )
        self.level1 = LevelFactory(program=self.program)
        self.level1_21 = LevelFactory(parent=self.level1, program=self.program)
        self.level1_21_31 = LevelFactory(parent=self.level1_21, customsort=1, program=self.program)
        self.level1_21_32 = LevelFactory(parent=self.level1_21, customsort=2, program=self.program)

        self.tier1 = LevelTierFactory(program=self.program, name='Tier1', tier_depth=1)
        self.tier2 = LevelTierFactory(program=self.program, name='Tier2', tier_depth=2)

    def test_level_depth(self):
        self.assertEqual(self.level1.get_level_depth(), 1)
        self.assertEqual(self.level1_21.get_level_depth(), 2)
        self.assertEqual(self.level1_21_31.get_level_depth(), 3)
        self.assertEqual(self.level1_21_32.get_level_depth(), 3)

    def test_leveltier_method(self):
        self.assertEqual(self.level1.leveltier.tier_depth, 1)
        self.assertEqual(self.level1_21.leveltier.tier_depth, 2)
        self.assertEqual(self.level1_21_31.leveltier, None)

        # check if the property is still correct after a reordering and if the numbers don't start with 1
        self.tier1.tier_depth = 5
        self.tier1.save()
        self.tier2.tier_depth = 4
        self.tier2.save()
        self.assertEqual(self.level1.leveltier.name, 'Tier2')
        self.assertEqual(self.level1_21.leveltier.name, 'Tier1')
