# -*- coding: utf-8 -*-
import datetime
from unittest import skip

from django.test import TestCase

from django.utils import translation
from tola.test.base_classes import TestBase
from factories.workflow_models import SiteProfileFactory, ProgramFactory
from factories.indicators_models import IndicatorFactory, ResultFactory
from workflow.models import SiteProfile


class TestProgramMethods(TestBase, TestCase):

    def test_get_sites(self):
        """It should return all and only the sites for a given program"""

        expected = SiteProfileFactory()
        expected2 = SiteProfileFactory()
        ResultFactory(
            indicator=self.indicator, sites=[expected, expected2])
        sites = self.program.get_sites()

        IndicatorFactory.create_batch(3)
        ResultFactory.create_batch(3)
        SiteProfileFactory.create_batch(3)

        self.assertEqual(len(sites), 2)
        self.assertEqual(len(SiteProfile.objects.all()), 5)


class TestProgramList(TestBase, TestCase):

    @skip('Test that the correct programs from a single country get loaded.')
    def test_single_country_load(self):
        pass

    @skip('Test the on-track program calculation.')
    def test_calc_program_on_track(self):
        pass

    @skip('Test that the percent of indicators with evidence metric')
    def test_calc_indicators_with_evidence(self):
        pass

