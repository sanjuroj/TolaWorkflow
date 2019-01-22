import datetime

from django.test import TestCase

from factories.indicators_models import IndicatorFactory, PeriodicTargetFactory

from indicators.models import Indicator
from tola.test.base_classes import TestBase


def _create_3_periodic_targets(indicator):
    PeriodicTargetFactory(
        indicator=indicator,
        target=10,
        start_date=datetime.date(2016, 03, 01),
        end_date=datetime.date(2016, 03, 31),
    )

    PeriodicTargetFactory(
        indicator=indicator,
        target=20,
        start_date=datetime.date(2016, 04, 01),
        end_date=datetime.date(2016, 04, 30),
    )

    PeriodicTargetFactory(
        indicator=indicator,
        target=30,
        start_date=datetime.date(2016, 05, 01),
        end_date=datetime.date(2016, 05, 31),
    )


class TestIndicatorGetCurrentPeriodicTarget(TestBase, TestCase):
    """
    Test getting the current PeriodicTarget of an Indicator based on a contained date
    """

    def setUp(self):
        super(TestIndicatorGetCurrentPeriodicTarget, self).setUp()

        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.MONTHLY)

    def test_current_periodic_target_accessor_monthly(self):
        _create_3_periodic_targets(self.indicator)

        # test in range
        self.assertEquals(self.indicator.current_periodic_target(datetime.date(2016, 04, 15)).target, 20)

        # test out of range
        self.assertIsNone(self.indicator.current_periodic_target(datetime.date(2017, 04, 15)))

        # test no date given
        self.assertIsNone(self.indicator.current_periodic_target())

    def test_current_periodic_target_accessor_none(self):
        self.assertIsNone(self.indicator.current_periodic_target(datetime.date(2016, 04, 15)))


class TestIndicatorResultDateRange(TestBase, TestCase):
    """
    Is the start and end date of when results can be submitted valid based on business rules?

    Program start date is '2016-03-01' and end date is '2020-05-01'
    """

    def test_range_monthly(self):
        indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.MONTHLY)

        _create_3_periodic_targets(indicator)

        # program start and periodic target end date
        self.assertEqual(indicator.valid_result_date_range(datetime.date(2016, 04, 15)),
                         (datetime.date(2016, 3, 1), datetime.date(2016, 4, 30)))

        # program start to program end
        self.assertEqual(indicator.valid_result_date_range(datetime.date(2021, 6, 1)),
                         (datetime.date(2016, 3, 1), datetime.date(2020, 5, 1)))

        # None because program hasn't started
        self.assertIsNone(indicator.valid_result_date_range(datetime.date(2015, 6, 1)))

    def test_range_lop(self):
        indicator = IndicatorFactory(
            program=self.program, unit_of_measure_type=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.LOP)

        # program start and "today"
        self.assertEqual(indicator.valid_result_date_range(datetime.date(2016, 04, 15)),
                         (datetime.date(2016, 3, 1), datetime.date(2016, 4, 15)))

        # program start to program end
        self.assertEqual(indicator.valid_result_date_range(datetime.date(2021, 6, 1)),
                         (datetime.date(2016, 3, 1), datetime.date(2020, 5, 1)))

        # None because program hasn't started
        self.assertIsNone(indicator.valid_result_date_range(datetime.date(2015, 6, 1)))
