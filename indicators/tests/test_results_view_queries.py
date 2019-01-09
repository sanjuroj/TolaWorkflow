""" Tests of the periodic target summaries available at collected data view (now result view) summing target values
and determining if periodic targets' periods are complete

Indicator should have the following attributes:
 - lop_actual_sum
 - lop_target_sum (#)
 - lop_met_real (#)
 - is_complete (boolean)
 - annotated_targets: PeriodicTargets with the following attributes:
    - achieved (#)
    - target (#)
    - percent_met (#)
    - is_complete (boolean)
"""

import datetime
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.models import Indicator
from indicators.queries import ResultsIndicator
from django import test

def get_indicator_and_targets(indicator_pk):
    return ResultsIndicator.results_view.get(pk=indicator_pk)

class ResultsViewBase:
    def get_set_up(self):
        program = w_factories.ProgramFactory(
            reporting_period_start=self.start_date,
            reporting_period_end=self.end_date
        )
        self.indicator = i_factories.IndicatorFactory(
            program=program,
            target_frequency=self.target_frequency,
            lop_target=1000
        )
        self.get_targets(self.indicator)
        self.annotated_indicator = get_indicator_and_targets(self.indicator.pk)

class TestLOPIndicatorIncompleteNoData(test.TestCase, ResultsViewBase):
    start_date = datetime.date(2016, 1, 1)
    end_date = datetime.date(2026, 12, 31)
    target_frequency = Indicator.LOP

    def setUp(self):
        self.get_set_up()

    def get_targets(self, indicator):
        i_factories.PeriodicTargetFactory(
            indicator=indicator,
            start_date=self.start_date,
            end_date=self.end_date,
            target=1000
        )

    def test_achieved_and_target(self):
        self.assertEqual(self.annotated_indicator.lop_actual_sum, None)
        self.assertEqual(self.annotated_indicator.lop_target_sum, 1000)
        self.assertEqual(self.annotated_indicator.lop_met_real, None)

    def test_targets_achieved_and_target(self):
        targets = self.annotated_indicator.annotated_targets
        self.assertEqual(len(targets), 1)
        self.assertEqual(targets[0].achieved, None)
        self.assertEqual(targets[0].target, 1000)
        self.assertEqual(targets[0].percent_met, None)

    def test_is_complete_methods(self):
        self.assertFalse(self.annotated_indicator.is_complete)
        self.assertFalse(self.annotated_indicator.annotated_targets[0].is_complete)

    def test_is_complete_with_not_setup_program(self):
        program = self.annotated_indicator.program
        program.reporting_period_end = None
        program.save()
        self.assertFalse(get_indicator_and_targets(self.annotated_indicator.pk).is_complete)

class TestLOPIndicatorIncompleteWithData(test.TestCase, ResultsViewBase):
    start_date = datetime.date(2016, 1, 1)
    end_date = datetime.date(2026, 12, 31)
    target_frequency = Indicator.LOP

    def setUp(self):
        self.get_set_up()

    def get_targets(self, indicator):
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            start_date=self.start_date,
            end_date=self.end_date,
            target=1000
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2016, 10, 1),
            achieved=400
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2016, 11, 1),
            achieved=300
        )

    def test_targets_and_is_complete(self):
        self.assertEqual(self.annotated_indicator.lop_target_sum, 1000)
        self.assertFalse(self.annotated_indicator.is_complete)
        self.assertEqual(self.annotated_indicator.annotated_targets[0].target, 1000)
        self.assertFalse(self.annotated_indicator.annotated_targets[0].is_complete)

    def test_achieved_sum_logic_non_cumulative(self):
        self.indicator.is_cumulative = False
        self.indicator.save()
        a_i = ResultsIndicator.results_view.get(pk=self.indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 700)
        self.assertEqual(a_i.percent_met, 0.7)
        self.assertEqual(a_i.annotated_targets[0].achieved, 700)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.7)

    def test_achieved_sum_logic_cumulative(self):
        self.indicator.is_cumulative = True
        self.indicator.save()
        a_i = ResultsIndicator.results_view.get(pk=self.indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 700)
        self.assertEqual(a_i.percent_met, 0.7)
        self.assertEqual(a_i.annotated_targets[0].achieved, 700)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.7)

    def test_achieved_sum_logic_percent(self):
        self.indicator.unit_of_measure_type=Indicator.PERCENTAGE
        self.indicator.save()
        a_i = get_indicator_and_targets(self.indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 300)
        self.assertEqual(a_i.percent_met, 0.3)
        self.assertEqual(a_i.annotated_targets[0].achieved, 300)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.3)

class TestLOPIndicatorCompleteWithoutData(test.TestCase, ResultsViewBase):
    start_date = datetime.date(2014, 1, 1)
    end_date = datetime.date(2016, 12, 31)
    target_frequency = Indicator.LOP

    def setUp(self):
        self.get_set_up()

    def get_targets(self, indicator):
        i_factories.PeriodicTargetFactory(
            indicator=indicator,
            start_date=self.start_date,
            end_date=self.end_date,
            target=1000
        )

    def test_achieved_and_target(self):
        self.assertEqual(self.annotated_indicator.lop_actual_sum, None)
        self.assertEqual(self.annotated_indicator.lop_target_sum, 1000)
        self.assertEqual(self.annotated_indicator.lop_met_real, None)

    def test_targets_achieved_and_target(self):
        targets = self.annotated_indicator.annotated_targets
        self.assertEqual(len(targets), 1)
        self.assertEqual(targets[0].achieved, None)
        self.assertEqual(targets[0].target, 1000)
        self.assertEqual(targets[0].percent_met, None)

    def test_is_complete_methods(self):
        self.assertTrue(self.annotated_indicator.is_complete)
        self.assertTrue(self.annotated_indicator.annotated_targets[0].is_complete)

class TestLOPIndicatorCompleteWithData(test.TestCase, ResultsViewBase):
    start_date = datetime.date(2014, 1, 1)
    end_date = datetime.date(2016, 12, 31)
    target_frequency = Indicator.LOP

    def setUp(self):
        self.get_set_up()

    def get_targets(self, indicator):
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            start_date=self.start_date,
            end_date=self.end_date,
            target=1000
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2014, 10, 1),
            achieved=400
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2015, 11, 1),
            achieved=300
        )

    def test_targets_and_is_complete(self):
        self.assertEqual(self.annotated_indicator.lop_target_sum, 1000)
        self.assertTrue(self.annotated_indicator.is_complete)
        self.assertEqual(self.annotated_indicator.annotated_targets[0].target, 1000)
        self.assertEqual(self.annotated_indicator.annotated_targets[0].target_sum, 1000)
        self.assertTrue(self.annotated_indicator.annotated_targets[0].is_complete)

    def test_achieved_sum_logic_non_cumulative(self):
        self.indicator.is_cumulative = False
        self.indicator.save()
        a_i = ResultsIndicator.results_view.get(pk=self.indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 700)
        self.assertEqual(a_i.percent_met, 0.7)
        self.assertEqual(a_i.annotated_targets[0].achieved, 700)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.7)

    def test_achieved_sum_logic_cumulative(self):
        self.indicator.is_cumulative = True
        self.indicator.save()
        a_i = ResultsIndicator.results_view.get(pk=self.indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 700)
        self.assertEqual(a_i.percent_met, 0.7)
        self.assertEqual(a_i.annotated_targets[0].achieved, 700)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.7)

    def test_achieved_sum_logic_percent(self):
        self.indicator.unit_of_measure_type=Indicator.PERCENTAGE
        self.indicator.save()
        a_i = get_indicator_and_targets(self.indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 300)
        self.assertEqual(a_i.percent_met, 0.3)
        self.assertEqual(a_i.annotated_targets[0].achieved, 300)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.3)

class TestMidEndIndicator(test.TestCase):
    start_date=datetime.date(2014, 1, 1)
    end_date=datetime.date(2015, 12, 31)

    def setUp(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=self.start_date,
            reporting_period_end=self.end_date
        )

    def test_one_target_no_data(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            lop_target=400
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=0,
            start_date=None,
            end_date=None,
            target=10000
        )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, None)
        self.assertEqual(a_i.percent_met, None)
        self.assertEqual(a_i.lop_target_sum, None)
        self.assertEqual(len(a_i.annotated_targets), 1)
        self.assertEqual(a_i.annotated_targets[0].percent_met, None)
        self.assertEqual(a_i.annotated_targets[0].achieved, None)
        self.assertEqual(a_i.annotated_targets[0].target, 10000)
        self.assertEqual(a_i.annotated_targets[0].target_sum, 10000)

    def test_two_targets_no_data(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            is_cumulative=False,
            unit_of_measure_type=Indicator.NUMBER,
            lop_target=130
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=0,
            start_date=None,
            end_date=None,
            target=40
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=1,
            start_date=None,
            end_date=None,
            target=90
        )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, None)
        self.assertEqual(a_i.percent_met, None)
        self.assertEqual(a_i.lop_target_sum, None)
        self.assertEqual(len(a_i.annotated_targets), 2)
        self.assertEqual(a_i.annotated_targets[0].percent_met, None)
        self.assertEqual(a_i.annotated_targets[0].achieved, None)
        self.assertEqual(a_i.annotated_targets[0].target, 40)
        self.assertEqual(a_i.annotated_targets[0].target_sum, 40)
        self.assertFalse(a_i.annotated_targets[0].is_complete)
        self.assertEqual(a_i.annotated_targets[1].target, 90)
        self.assertEqual(a_i.annotated_targets[1].target_sum, 130)
        self.assertFalse(a_i.annotated_targets[1].is_complete)

    def test_one_target_with_data(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            lop_target=400
        )
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=0,
            start_date=None,
            end_date=None,
            target=505
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2015, 1, 1),
            achieved=379
        )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 379)
        self.assertAlmostEqual(a_i.percent_met, 0.75, 2)
        self.assertEqual(a_i.lop_target_sum, 505)
        self.assertEqual(len(a_i.annotated_targets), 1)
        self.assertAlmostEqual(a_i.annotated_targets[0].percent_met, 0.75, 2)
        self.assertEqual(a_i.annotated_targets[0].achieved, 379)
        self.assertEqual(a_i.annotated_targets[0].target, 505)
        self.assertEqual(a_i.annotated_targets[0].target_sum, 505)
        self.assertTrue(a_i.annotated_targets[0].is_complete)

    def test_two_targets_with_one_data(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            lop_target=300
        )
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=0,
            start_date=None,
            end_date=None,
            target=100
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2015, 1, 1),
            achieved=80
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=1,
            start_date=None,
            end_date=None,
            target=200
        )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 80)
        self.assertAlmostEqual(a_i.percent_met, 0.8, 2)
        self.assertEqual(a_i.lop_target_sum, 100)
        self.assertEqual(len(a_i.annotated_targets), 2)
        self.assertAlmostEqual(a_i.annotated_targets[0].percent_met, 0.80, 2)
        self.assertEqual(a_i.annotated_targets[0].achieved, 80)
        self.assertEqual(a_i.annotated_targets[0].target, 100)
        self.assertTrue(a_i.annotated_targets[0].is_complete)
        self.assertEqual(a_i.annotated_targets[1].percent_met, None)
        self.assertEqual(a_i.annotated_targets[1].achieved, None)
        self.assertEqual(a_i.annotated_targets[1].target, 200)
        self.assertEqual(a_i.annotated_targets[1].target_sum, 300)
        self.assertFalse(a_i.annotated_targets[1].is_complete)

    def test_two_targets_two_data(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.MID_END,
            lop_target=300
        )
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=0,
            start_date=None,
            end_date=None,
            target=100
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=datetime.date(2015, 1, 1),
            achieved=80
        )
        target2 = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            customsort=1,
            start_date=None,
            end_date=None,
            target=200
        )
        i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target2,
            date_collected=datetime.date(2015, 10, 1),
            achieved=280
        )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 360)
        self.assertAlmostEqual(a_i.percent_met, 1.2, 2)
        self.assertEqual(a_i.lop_target_sum, 300)
        self.assertEqual(len(a_i.annotated_targets), 2)
        self.assertAlmostEqual(a_i.annotated_targets[0].percent_met, 0.80, 2)
        self.assertEqual(a_i.annotated_targets[0].achieved, 80)
        self.assertEqual(a_i.annotated_targets[0].target, 100)
        self.assertEqual(a_i.annotated_targets[0].target_sum, 100)
        self.assertTrue(a_i.annotated_targets[0].is_complete)
        self.assertAlmostEqual(a_i.annotated_targets[1].percent_met, 1.4, 2)
        self.assertEqual(a_i.annotated_targets[1].achieved, 280)
        self.assertEqual(a_i.annotated_targets[1].target, 200)
        self.assertEqual(a_i.annotated_targets[1].target_sum, 300)
        self.assertTrue(a_i.annotated_targets[1].is_complete)

class TestTimeAwareTargets(test.TestCase):
    start_date = datetime.date(2015, 1, 1)
    end_date = datetime.date(2020, 12, 31)

    def setUp(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=self.start_date,
            reporting_period_end=self.end_date
        )

    def test_annual_targets(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.ANNUAL,
            lop_target=1000
        )
        for year in range(2015, 2021):
            i_factories.PeriodicTargetFactory(
                indicator=indicator,
                target=100,
                start_date=datetime.date(year, 1, 1),
                end_date=datetime.date(year, 12, 31)
            )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, None)
        self.assertEqual(a_i.percent_met, None)
        self.assertEqual(a_i.lop_target_sum, 400)
        self.assertEqual(len(a_i.annotated_targets), 6)
        self.assertEqual(a_i.annotated_targets[0].achieved, None)
        self.assertEqual(a_i.annotated_targets[0].percent_met, None)
        self.assertEqual(a_i.annotated_targets[0].target, 100)
        self.assertTrue(a_i.annotated_targets[0].is_complete)
        self.assertEqual(a_i.annotated_targets[0].target_sum, 100)
        self.assertEqual(a_i.annotated_targets[3].achieved, None)
        self.assertEqual(a_i.annotated_targets[3].percent_met, None)
        self.assertEqual(a_i.annotated_targets[3].target, 100)
        self.assertEqual(a_i.annotated_targets[3].target_sum, 400)
        self.assertFalse(a_i.annotated_targets[5].is_complete)

    def test_annual_targets_with_data(self):
        indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.ANNUAL,
            lop_target=1000
        )
        targets = []
        for year in range(2015, 2021):
            targets.append(i_factories.PeriodicTargetFactory(
                indicator=indicator,
                target=100,
                start_date=datetime.date(year, 1, 1),
                end_date=datetime.date(year, 12, 31)
            ))
        for c, achieved in enumerate([50, 150, 175]):
            i_factories.CollectedDataFactory(
                indicator=indicator,
                periodic_target=targets[c],
                date_collected=targets[c].start_date,
                achieved=achieved
            )
        a_i = get_indicator_and_targets(indicator.pk)
        self.assertEqual(a_i.lop_actual_sum, 375)
        self.assertAlmostEqual(a_i.percent_met, 0.94, 2)
        self.assertEqual(a_i.lop_target_sum, 400)
        self.assertEqual(len(a_i.annotated_targets), 6)
        self.assertEqual(a_i.annotated_targets[0].achieved, 50)
        self.assertEqual(a_i.annotated_targets[0].percent_met, 0.5)
        self.assertEqual(a_i.annotated_targets[0].target, 100)
        self.assertTrue(a_i.annotated_targets[0].is_complete)
        self.assertEqual(a_i.annotated_targets[0].target_sum, 100)
        self.assertEqual(a_i.annotated_targets[1].achieved, 150)
        self.assertEqual(a_i.annotated_targets[1].percent_met, 1.5)
        self.assertEqual(a_i.annotated_targets[1].target, 100)
        self.assertTrue(a_i.annotated_targets[1].is_complete)
        self.assertEqual(a_i.annotated_targets[1].target_sum, 200)
        self.assertEqual(a_i.annotated_targets[2].achieved, 175)
        self.assertEqual(a_i.annotated_targets[2].percent_met, 1.75)
        self.assertEqual(a_i.annotated_targets[2].target, 100)
        self.assertEqual(a_i.annotated_targets[2].target_sum, 300)
        self.assertFalse(a_i.annotated_targets[5].is_complete)