"""Tests for the Mangosteen program queries (indicator on target/completion reporting)

Ticket: https://github.com/mercycorps/TolaActivity/issues/463
Cases:
    Program
        - open reporting period
            - LOP indicators should be "incomplete"
            - time aware indicators should report on most recently completed target
        - closed reporting period
            - LOP indicators should report
            - time aware indicators should report on all targets / sum of targets
    Indicator
        - no indicators
            - all buckets should be empty
        - one indicator
            - should be in appropriate bucket
        - multiple indicators
            - should be bucketed appropriately
    Frequency
        - LOP
            - should report data against lop_target field
        - MID_END
            - should report midline data against midline target, endline data against endline target
            - should only report against targets for which at least 1 data point exists
        - EVENT
            - should report all data against event target
            - should only report if at least 1 data point collected
        - time-based
            - should report on reporting_period_start through most recently completed target period
    Data
        - no data
            - should bucket "incomplete"
        - one data
            - should report data point against target
        - multiple data
            - should report data sum against target
    Target
        - no target
            - should bucket "incomplete"
        - one target
            - should report against target
        - multiple target
            - should report against target sums
    Summation
        - cumulative
            - should report latest data point against latest target
        - non cumulative
            - should report sum of data points against sum of targets
    DOC
        - +
            - over target = 1, under target = -1
        - -
            - over target = -1, under target = 1
    Measure
        - Number
            - noncumulative = add
        - Percentage
            - noncumulative = no data (nonsense data)

1. For all completed target periods to date, what is the target value?
  1.1. Calculation takes into account cumulative vs non-cumulative and # vs %
  2. For all completed target periods to date, what is the actual value?
  2.1. Calculation takes into account cumulative vs non-cumulative and # vs %
  3. For all completed target periods to date, what is the percentage variance of the actual value from the target value?
  4. Which indicators are INSIDE the plus or minus 15% variance range?
  3.1. How many indicators?
  3.2. What percentage of indicators?
  4. Which indicators are ABOVE the 15% variance range?
  4.1. How many indicators?
  4.2. What percentage of indicators?
  5. Which indicators are BELOW the 15% variance range?
  5.1. How many indicators?
  5.2. What percentage of indicators?
  

Units
ProgramWithMetrics.reporting.all()
    - returns a queryset of all indicators which meet criteria to report
        - LOP indicator in closed program with lop_target
        - Midline/Endline/Event with set target and 1+ data
        - Time aware indicator with completed target period and set target and 1+ data
ProgramWithMetrics.nonreporting.all()
    - return a queryset of all indicators which do not meet criteria to report
        - LOP indicator in open program
        - LOP indicator in closed program with no lop_target
        - Midline/Endline indicator with no data/target
        - Event indicator with no data/target
        - Time aware indicator with no data
        - Time aware indicator with no target
        - Time aware indicator with no completed target period

Reporting Indicators Queryset (can assume all indicators here have targets, data, and complete period):
    .overtarget
    .undertarget
    .ontarget
"""


from django import test, db
from django.conf import settings
import datetime
import unittest
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
    )
from indicators.models import Indicator, PeriodicTarget
from indicators.queries import ProgramWithMetrics, IPTTIndicator


class ReportingIndicatorBase(test.TestCase):
    TIME_AWARE_FREQUENCIES = [
        Indicator.ANNUAL,
        Indicator.SEMI_ANNUAL,
        Indicator.TRI_ANNUAL,
        Indicator.QUARTERLY,
        Indicator.MONTHLY
    ]

    DATE_FUNCS = {
        Indicator.ANNUAL: lambda x: datetime.date(x.year+1, x.month, x.day),
        Indicator.SEMI_ANNUAL: lambda x: datetime.date(
            x.year + 1 if x.month > 6 else x.year,
            x.month - 6 if x.month > 6 else x.month + 6,
            1
        ) - datetime.timedelta(days=1),
        Indicator.TRI_ANNUAL: lambda x: datetime.date(
            x.year + 1 if x.month > 8 else x.year,
            x.month - 8 if x.month > 8 else x.month + 4,
            1
        ) - datetime.timedelta(days=1),
        Indicator.QUARTERLY: lambda x: datetime.date(
            x.year + 1 if x.month > 9 else x.year,
            x.month - 9 if x.month > 9 else x.month + 3,
            1
        ) - datetime.timedelta(days=1),
        Indicator.MONTHLY: lambda x: datetime.date(
            x.year + 1 if x.month == 12 else x.year,
            1 if x.month == 12 else x.month + 1,
            1
        ) - datetime.timedelta(days=1)
    }

    def setUp(self):
        settings.DEBUG = True
        self.program = None
        self.indicator = None
        self.data = []
        self.targets = []

    def tearDown(self):
        for datum in self.data:
            datum.delete()
        for target in self.targets:
            target.delete()
        if self.indicator is not None:
            self.indicator.delete()
        if self.program is not None:
            self.program.delete()
        settings.DEBUG = False

    def load_base_indicator(self):
        """loads a bare indicator in this program"""
        self.indicator = i_factories.IndicatorFactory()
        if self.program is not None:
            self.indicator.program.add(self.program)
            self.indicator.save()

    def load_data(self, indicator=None, achieved=None, date=None, target=None):
        """adds data to the indicator"""
        indicator = self.indicator if indicator is None else indicator
        achieved = 800 if achieved is None else achieved
        date = self.program.reporting_period_start + datetime.timedelta(days=5) if date is None else date
        datum = i_factories.CollectedDataFactory(
            indicator=indicator,
            achieved=achieved,
            date_collected=date
        )
        if target is not None:
            datum.periodic_target = target
            datum.save()
        self.data.append(datum)

    def load_target(self, indicator, target, period=None, start_date=None):
        end_date = start_date
        period = "Period {0}".format(len(self.targets)) if period is None else period
        if start_date is not None:
            end_date = self.DATE_FUNCS[indicator.target_frequency](start_date)
        self.targets.append(
            i_factories.PeriodicTargetFactory(
                indicator=indicator,
                period=period,
                target=target,
                start_date=start_date,
                end_date=end_date
            )
        )

    def get_time_aware_dates(self, target_frequency):
        start_date = self.program.reporting_period_start
        date_func = self.DATE_FUNCS[target_frequency]
        end_date = date_func(start_date)
        dates = [start_date,]
        while end_date < self.program.reporting_period_end:
            start_date = end_date + datetime.timedelta(days=1)
            end_date = date_func(start_date)
            dates.append(start_date)
        return dates

    def load_targets(self, indicator=None, targets=None):
        indicator = self.indicator if indicator is None else indicator
        target_frequency = indicator.target_frequency
        if target_frequency == Indicator.MID_END:
            targets = [500, 800] if targets is None else targets
            self.load_target(indicator, targets[0], period=PeriodicTarget.MIDLINE)
            self.load_target(indicator, targets[1], period=PeriodicTarget.ENDLINE)
        elif target_frequency == Indicator.EVENT:
            targets = [1200,] if targets is None else targets
            for target in targets:
                self.load_target(indicator, target)
        elif target_frequency in self.TIME_AWARE_FREQUENCIES:
            dates = self.get_time_aware_dates(target_frequency)
            targets = [400]*len(dates) if targets is None else targets
            for target, start_date in zip(targets, dates):
                self.load_target(indicator, target, start_date=start_date)


    def get_annotated_program(self, program=None):
        program = self.program if program is None else program
        return ProgramWithMetrics.objects.get(pk=program.id)

    def query_assert(self, baseline, expected_count, query_type):
        new_baseline = len(db.connection.queries)
        self.assertEqual(
            new_baseline-baseline, expected_count,
            "Expected {0} query to take {1} queries, took {2}".format(
                query_type, expected_count, new_baseline-baseline))
        return new_baseline

    def get_closed_program(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date(2016, 1, 1),
            reporting_period_end=datetime.date(2016, 12, 31)
        )

class TestSingleNonReportingIndicator(ReportingIndicatorBase):

    def one_incomplete_assert(self, program, scenario):
        self.assertEqual(
            program.nonreporting.count(), 1,
            "For {0}, program should have 1 incomplete indicator, got {1}".format(
                scenario, program.nonreporting.count()
            )
        )
        self.assertEqual(
            program.reporting.count(), 0,
            "For {0}, program should have 0 complete indicators, got {1}".format(
                scenario, program.reporting.count()
            )
        )

    def test_lop_indicator_in_open_program(self):
        # get open (reporting period not over) program:
        # set dates from today so test doesn't become obsolete at some arbitrary future date:
        start_date = datetime.date.today() - datetime.timedelta(days=10)
        end_date = datetime.date.today() + datetime.timedelta(days=100)
        self.program = w_factories.ProgramFactory(
            reporting_period_start=start_date,
            reporting_period_end=end_date
        )
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        # lop_target and data should be set to ensure it's only program openness restricting from "complete"
        self.indicator.lop_target = 1000
        self.indicator.save()
        self.load_data()
        baseline = len(db.connection.queries)
        program = self.get_annotated_program(self.program)
        baseline = self.query_assert(baseline, 1, "fetch program")
        incomplete = program.nonreporting
        self.assertEqual(
            incomplete.count(), 1,
            "LOP program with open program reporting period should be in incomplete"
        )
        baseline = self.query_assert(baseline, 1, "count incompletes")
        complete = program.reporting
        self.assertEqual(
            complete.count(), 0,
            "No indicators should be reporting as complete"
        )
        self.query_assert(baseline, 1, "count completes")

    def test_lop_indicator_no_lop_target(self):
        #program is complete:
        self.get_closed_program()
        # add indicator with data:
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        self.indicator.save()
        self.load_data()
        program = self.get_annotated_program(self.program)
        self.one_incomplete_assert(program, "lop indicator, no lop_target")

    def test_lop_indicator_no_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        self.indicator.lop_target = 1400
        self.indicator.save()
        program = self.get_annotated_program(self.program)
        self.one_incomplete_assert(program, "lop indicator, no data")

    def test_midend_indicator_no_targets(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has data for midline indicator:
        self.load_data()
        program = self.get_annotated_program(self.program)
        self.one_incomplete_assert(program, "midend indicator no periodic targets")

    def test_midend_indicator_no_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        self.load_targets()
        program = self.get_annotated_program(self.program)
        self.one_incomplete_assert(program, "midend indicator no data")

    def test_event_indicator_no_target(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        self.load_data()
        program = self.get_annotated_program(self.program)
        self.one_incomplete_assert(program, "event, no targets")

    def test_event_indicator_no_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        self.load_targets()
        program = self.get_annotated_program(self.program)
        self.one_incomplete_assert(program, "event, no data")

    def test_time_aware_indicators_no_targets(self):
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_data()
            program = self.get_annotated_program(self.program)
            self.one_incomplete_assert(
                program, "{0} freq, no targets".format(self.indicator.get_target_frequency_display()))
            for datum in self.data:
                datum.delete()
            self.data = []
            self.indicator.delete()
            self.indicator = None

    def test_time_aware_indicators_no_data(self):
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_targets()
            program = self.get_annotated_program(self.program)
            self.one_incomplete_assert(
                program, "{0} freq, no data".format(self.indicator.get_target_frequency_display()))
            for target in self.targets:
                target.delete()
            self.targets = []
            self.indicator.delete()
            self.indicator = None

    def test_time_aware_indicators_no_completed_periods(self):
        # if program started yesterday then no targets will be finished by today:
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date.today()-datetime.timedelta(days=1),
            reporting_period_end=datetime.date.today()+datetime.timedelta(days=365)
        )
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_targets()
            self.load_data(date=datetime.date.today()-datetime.timedelta(days=1), target=self.targets[0])
            program = self.get_annotated_program(self.program)
            self.one_incomplete_assert(
                program, "{0} freq, no complete periods".format(self.indicator.get_target_frequency_display()))
            for target in self.targets:
                target.delete()
            self.targets = []
            self.indicator.delete()
            self.indicator = None


class TestSingleReportingIndicator(ReportingIndicatorBase):
    def one_complete_assert(self, program, scenario):
        self.assertEqual(
            program.reporting.count(), 1,
            "In {0} query expected 1 complete, got {1}".format(
                scenario, program.reporting.count()
            )
        )
        self.assertEqual(
            program.nonreporting.count(), 0,
            "In {0} query expected 0 incomplete, got {1}".format(
                scenario, program.nonreporting.count()
            )
        )

    def test_lop_indicator_closed_program_target_set_with_data(self):
        #program is complete:
        self.get_closed_program()
        # add indicator with data:
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.LOP
        self.indicator.lop_target = 1400
        self.indicator.save()
        self.load_data()
        program = self.get_annotated_program(self.program)
        self.one_complete_assert(program, "one lop indicator")

    def test_midend_indicator_midline_target_and_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        self.load_target(self.indicator, 800, period=PeriodicTarget.MIDLINE)
        self.load_data(indicator=self.indicator, achieved=500, date=None, target=self.targets[0])
        program = self.get_annotated_program(self.program)
        self.one_complete_assert(program, "midend indicator")

    def test_midend_indicator_both_targets_and_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.MID_END
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        self.load_target(self.indicator, 800, period=PeriodicTarget.MIDLINE)
        self.load_target(self.indicator, 400, period=PeriodicTarget.ENDLINE)
        self.load_data(indicator=self.indicator, achieved=500, date=None, target=self.targets[0])
        self.load_data(indicator=self.indicator, achieved=700, date=None, target=self.targets[1])
        program = self.get_annotated_program(self.program)
        self.one_complete_assert(program, "midend indicator")

    def test_event_indicator_with_target_and_data(self):
        self.get_closed_program()
        self.load_base_indicator()
        self.indicator.target_frequency = Indicator.EVENT
        self.indicator.save()
        # ensure indicator has targets for midline indicator:
        self.load_target(self.indicator, 800)
        self.load_data(indicator=self.indicator, achieved=500, date=None, target=self.targets[0])
        program = self.get_annotated_program(self.program)
        self.one_complete_assert(program, "event indicator")

    def test_time_aware_indicators_with_completed_targets_and_data(self):
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            self.load_base_indicator()
            self.indicator.target_frequency = frequency
            self.indicator.save()
            self.load_targets()
            self.load_data()
            program = self.get_annotated_program(self.program)
            self.one_complete_assert(
                program, "{0} freq".format(self.indicator.get_target_frequency_display()))
            for target in self.targets:
                target.delete()
            for datum in self.data:
                datum.delete()
            self.data = []
            self.targets = []
            self.indicator.delete()
            self.indicator = None


class TestMixedReportingAndNonIndicators(ReportingIndicatorBase):
    def setUp(self):
        super(TestMixedReportingAndNonIndicators, self).setUp()
        self.indicators = []

    def tearDown(self):
        super(TestMixedReportingAndNonIndicators, self).tearDown()
        for indicator in self.indicators:
            indicator.delete()

    def test_lop_and_midend_just_mid_reporting(self):
        self.get_closed_program()
        indicator_lop = i_factories.IndicatorFactory(
            target_frequency=Indicator.LOP,
            lop_target=1000
        )
        indicator_lop.program.add(self.program)
        indicator_lop.save()
        self.indicators.append(indicator_lop)
        lop_data = i_factories.CollectedDataFactory(
            indicator=indicator_lop,
            achieved=400,
            date_collected=self.program.reporting_period_end - datetime.timedelta(days=10)
        )
        self.data.append(lop_data)
        indicator_midend = i_factories.IndicatorFactory(
            target_frequency=Indicator.MID_END
        )
        indicator_midend.program.add(self.program)
        indicator_midend.save()
        self.indicators.append(indicator_midend)
        mid_target = i_factories.PeriodicTargetFactory(
            indicator=indicator_midend,
            period=PeriodicTarget.MIDLINE,
            target=1000
        )
        self.targets.append(mid_target)
        mid_data = i_factories.CollectedDataFactory(
            indicator=indicator_midend,
            periodic_target=mid_target,
            achieved=400,
            date_collected=self.program.reporting_period_start + datetime.timedelta(days=20)
        )
        self.data.append(mid_data)
        baseline = len(db.connection.queries)
        program = self.get_annotated_program(self.program)
        baseline = self.query_assert(baseline, 1, "fetch program, two indicators")
        reporting = program.reporting.count()
        self.assertEqual(
            reporting, 2,
            "expected both midend and lop indicators to be reporting, got {0}".format(reporting)
        )
        baseline = self.query_assert(baseline, 1, "reporting count, two indicators")
        nonreporting = program.nonreporting.count()
        self.assertEqual(
            nonreporting, 0,
            "expected no nonreporting indicators, got {0}".format(nonreporting)
        )

    def test_multiple_time_aware_indicators(self):
        self.get_closed_program()
        for frequency in self.TIME_AWARE_FREQUENCIES:
            indicator = i_factories.IndicatorFactory(
                target_frequency=frequency
            )
            indicator.program.add(self.program)
            indicator.save()
            self.load_targets(indicator=indicator)
            self.load_data(indicator=indicator)
        program = self.get_annotated_program(self.program)
        reporting = program.reporting.count()
        self.assertEqual(
            reporting, len(self.TIME_AWARE_FREQUENCIES),
            "expected {0} reporting indicators, got {1}, qs: {2}".format(
                len(self.TIME_AWARE_FREQUENCIES), reporting, program.reporting.all()
            )
        )
        self.assertEqual(
            program.nonreporting.count(), 0,
            "expected 0 nonreporting timeaware indicators, got {0}".format(program.nonreporting.count())
        )