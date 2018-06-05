from django.test import TestCase, RequestFactory

from TolaActivity.factories import (IndicatorTypeFactory, IndicatorFactory, LevelFactory, SiteProfileFactory,
                                    SectorFactory, ProgramFactory, CollectedDataFactory, UserFactory)
from indicators.forms import IPTTReportFilterForm


class TestFilterForm(TestCase):

    def test_form_populates(self):
        """The form should populate several fields from the db"""
        request = RequestFactory().get('/')
        request.user = UserFactory()
        sectors = SectorFactory.create_batch(3)
        levels = LevelFactory.create_batch(3)
        ind_types = IndicatorTypeFactory.create_batch(3)

        program = ProgramFactory()
        indicator = IndicatorFactory(program=program)
        IndicatorFactory.create_batch(3)
        collected_data = CollectedDataFactory(indicator=indicator)
        CollectedDataFactory.create_batch(3)
        expected = SiteProfileFactory()
        expected2 = SiteProfileFactory()
        collected_data.site.add(expected2)
        collected_data.site.add(expected)
        SiteProfileFactory.create_batch(3)
        period_choices = ((2018, (('2018-02-01_2018-04-30', 'Quarter 4 (Feb 01, 2018 - Apr 30, 2018)'),
                                  ('2018-05-01_2018-07-31', 'Quarter 5 (May 01, 2018 - Jul 31, 2018)'))),)
        kwargs = {'program': program, 'request': request, 'initial': {'period_choices': period_choices}}
        form = IPTTReportFilterForm(**kwargs)

        stuff = str(form)
        self.assertIn(expected.name, stuff)
        self.assertIn(expected2.name, stuff)
        self.assertIn(indicator.name, stuff)
        # for i in range(2):
        #     self.assertIn(sectors[i].sector, stuff)
        #     self.assertIn(levels[i].name, stuff)
        #     self.assertIn(ind_types[i].indicator_type, stuff)
