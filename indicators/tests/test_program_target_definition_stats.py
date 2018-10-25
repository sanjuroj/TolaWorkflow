"""ProgramWithMetrics should return stats about which indicators (by count and percent) have targets defined properly

Specific business rules
targets_defined:
    - Indicator has target frequency
    - if LOP, indicator has lop_target
    - if MID_END, indicator has both MID and END periodic_target and also target values for both
    - if EVENT, indicator has at least one periodic_target and all have target values
    - if time aware, indicator has all periods from reporting_period_start to reporting_period_end with targets
"""

import datetime
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from indicators.models import Indicator, PeriodicTarget
from indicators.queries import ProgramWithMetrics, IPTTIndicator
from indicators.views.views_indicators import generate_periodic_targets
from indicators.views.views_reports import IPTT_ReportView
from django import test, db
from django.db import models
from django.conf import settings


class TargetTestBase(test.TestCase):
    testcase = "base"
    frequency = None
    def setUp(self):
        settings.DEBUG = True
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date.today()-datetime.timedelta(days=365),
            reporting_period_end=datetime.date.today()-datetime.timedelta(days=1)
        )
        self.indicators = []
        self.targets = []

    def tearDown(self):
        settings.DEBUG = False
        for target in self.targets:
            target.delete()
        for indicator in self.indicators:
            indicator.delete()
        self.program.delete()

    def get_reporting_program(self):
        return ProgramWithMetrics.objects.get(pk=self.program.id)

    def get_bare_indicator(self):
        indicator = i_factories.IndicatorFactory()
        indicator.program.add(self.program)
        indicator.save()
        return indicator

    def add_no_frequency_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.lop_target = 100
        indicator.save()
        self.indicators.append(indicator)

class TargetTestsMixin:
    """mixin so tests won't fire on base class"""

    def assert_query_count(self, baseline, expected, scenario):
        new_baseline = len(db.connection.queries)
        self.assertLessEqual(
            new_baseline-baseline, expected,
            "For query {0} expected at max {1} queries, it took {2}".format(
                scenario, expected, new_baseline-baseline
            )
        )
        return new_baseline

    def test_one_good(self):
        self.add_good_indicator()
        iptt = IPTTIndicator.defined_targets.get(pk=self.indicators[0].id)
        program_reporting = self.get_reporting_program()
        baseline = len(db.connection.queries)
        good_count = program_reporting.targets_defined.count()
        baseline = self.assert_query_count(baseline, 1, "one good indicator targets_defined_count")
        target_percentages = program_reporting.targets_percentages
        baseline = self.assert_query_count(baseline, 2, "one good indicator targets_percentages")
        self.assertEqual(good_count, 1,
                         "One indicator with targets defined should show as good, got {0}".format(good_count))
        good_percent = target_percentages['defined']
        self.assertEqual(good_percent, 100,
                         "One indicator with targets defined should be 100% good, got {0}".format(good_percent))
        bad_percent = target_percentages['undefined']
        self.assertEqual(bad_percent, 0,
                         "One indicator with targets defined should be 0% bad, got {0}".format(bad_percent))

    def test_two_good(self):
        self.add_good_indicator()
        self.add_good_indicator()
        program_reporting = self.get_reporting_program()
        baseline = len(db.connection.queries)
        good_count = program_reporting.targets_defined.count()
        baseline = self.assert_query_count(baseline, 1, "two good indicators targets_defined_count")
        target_percentages = program_reporting.targets_percentages
        baseline = self.assert_query_count(baseline, 2, "two good indicators targets_percentages")
        self.assertEqual(good_count, 2,
                         "Two indicator with targets defined should show as good, got {0}".format(good_count))
        good_percent = target_percentages['defined']
        self.assertEqual(good_percent, 100,
                         "Two indicators with targets defined should be 100% good, got {0}".format(good_percent))
        bad_percent = target_percentages['undefined']
        self.assertEqual(bad_percent, 0,
                         "Two indicators with targets defined should be 0% bad, got {0}".format(bad_percent))

    def test_alternate_good_indicators(self):
        if not hasattr(self, 'good_indicators'):
            self.skipTest('no alternate good indicator methods')
        for good_indicator_method in self.good_indicators:
            getattr(self, good_indicator_method)()
            program_reporting = self.get_reporting_program()
            baseline = len(db.connection.queries)
            good_count = program_reporting.targets_defined.count()
            baseline = self.assert_query_count(baseline, 1, "one good indicator targets_defined_count")
            self.assertEqual(good_count, 1,
                             "One indicator with targets defined should show as good, got {0}".format(good_count))
            good_percent = program_reporting.targets_percentages['defined']
            self.assertEqual(good_percent, 100,
                             "One indicator with targets defined should be 100% good, got {0}".format(good_percent))
            bad_percent = program_reporting.targets_percentages['undefined']
            self.assertEqual(bad_percent, 0,
                             "One indicator with targets defined should be 0% bad, got {0}".format(bad_percent))
            for indicator in self.indicators:
                indicator.delete()
            self.indicators = []
            for target in self.targets:
                target.delete()
            self.targets = []

    def test_one_bad_indicator(self):
        if not hasattr(self, 'bad_indicators'):
            self.skipTest('no bad indicator methods')
        for bad_indicator_method in self.bad_indicators:
            getattr(self, bad_indicator_method)()
            program_reporting = self.get_reporting_program()
            baseline = len(db.connection.queries)
            good_count = program_reporting.targets_defined.count()
            baseline = self.assert_query_count(baseline, 1, "one bad indicator targets_defined_count")
            bad_count = program_reporting.targets_undefined.count()
            baseline = self.assert_query_count(baseline, 1, "one bad indicator targets_undefined_count")
            target_percentages = program_reporting.targets_percentages
            baseline = self.assert_query_count(baseline, 2, "one bad indicator targets_percentages")
            if False and bad_indicator_method == 'add_indicator_missing_one_target':
                iptt_indicator = IPTTIndicator.defined_targets.filter(program__in=[self.program.id]).first()
                print "indicator: {0}".format(iptt_indicator)
                print "indicators: {0}".format(IPTTIndicator.defined_targets.filter(program__in=[self.program.id]).all())
                print "frequency: {0} def targets: {1}".format(iptt_indicator.target_frequency, iptt_indicator.defined_targets)
                print "targets: {0}".format([x.target for x in self.targets])
                print "targets_indicator: {0}".format([x.indicator for x in self.targets])
                print "defined count: {0}".format(good_count)
                print "expected periods count: {0}".format(program_reporting.get_num_periods(self.frequency))
                print "filter: {0}".format(program_reporting.get_defined_targets_filter())
            self.assertEqual(
                good_count, 0,
                "{case}: One indicator {0} defined should show as 0 good, got {1}".format(
                    bad_indicator_method, good_count, case=self.testcase))
            self.assertEqual(
                bad_count, 1,
                "{case}: One indicator {0} defined should show as 1 bad, got {1}".format(
                    bad_indicator_method, bad_count, case=self.testcase))
            good_percent = target_percentages['defined']
            self.assertEqual(
                good_percent, 0,
                "{case}: One indicator {0} should be 0% good, got {1}".format(
                    bad_indicator_method, good_percent, case=self.testcase))
            bad_percent = target_percentages['undefined']
            self.assertEqual(
                bad_percent, 100,
                "{case}: One indicator with {0} should be 100% bad, got {1}".format(
                    bad_indicator_method, bad_percent, case=self.testcase))
            for indicator in self.indicators:
                indicator.delete()
            self.indicators = []
            for target in self.targets:
                target.delete()
            self.targets = []

    def test_bad_and_good(self):
        if not hasattr(self, 'bad_indicators'):
            self.skipTest('no bad indicator methods')
        self.add_good_indicator()
        expected_bad_count = 0
        for bad_indicator_method in self.bad_indicators:
            getattr(self, bad_indicator_method)()
            expected_bad_count += 1
        program_reporting = self.get_reporting_program()
        baseline = len(db.connection.queries)
        good_count = program_reporting.targets_defined.count()
        baseline = self.assert_query_count(baseline, 1, "multiple bad/good indicators targets_defined_count")
        bad_count = program_reporting.targets_undefined.count()
        baseline = self.assert_query_count(baseline, 1, "multiple bad/good indicators targets_undefined_count")
        target_percentages = program_reporting.targets_percentages
        baseline = self.assert_query_count(baseline, 2, "multiple bad/good indicators targets_percentages")
        self.assertEqual(
            good_count, 1,
            "Multiple indicators, one good,should show as 1 good, got {0}".format(good_count))
        self.assertEqual(
            bad_count, expected_bad_count,
            "{0} bad and 1 good indicators {0} bad, got {1}".format(expected_bad_count, bad_count))
        good_percent = target_percentages['defined']
        expected_good_percent = int(round(float(100)/(expected_bad_count+1)))
        self.assertEqual(
            good_percent, expected_good_percent,
            "One good {0} bad indicators should be {1}% good, got {2}".format(
                expected_bad_count, expected_good_percent, good_percent))
        bad_percent = target_percentages['undefined']
        expected_bad_percent = int(round(float(expected_bad_count)*100/(expected_bad_count+1)))
        self.assertEqual(
            bad_percent, expected_bad_percent,
            "One good {0} bad indicators should be {1}% bad, got {2}".format(
                expected_bad_count, expected_bad_percent, bad_percent))

class TestLOPTargetsDefined(TargetTestBase, TargetTestsMixin):
    testcase = "lop"
    bad_indicators = [
        'add_no_target_indicator'
    ]

    def add_good_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.LOP
        indicator.lop_target = 1000
        indicator.save()
        self.indicators.append(indicator)

    def add_no_target_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.LOP
        indicator.save()
        self.indicators.append(indicator)

class TestMidEndTargetsDefined(TargetTestBase, TargetTestsMixin):
    testcase = "midend"
    bad_indicators = [
        'add_no_midline_indicator',
        'add_no_endline_indicator',
        'add_no_targets_indicator',
    ]
    def add_good_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.MID_END
        indicator.save()
        target_mid = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period=PeriodicTarget.MIDLINE,
            target=400
        )
        target_end = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period=PeriodicTarget.ENDLINE,
            target=800
        )
        self.indicators.append(indicator)
        self.targets.extend([target_mid, target_end])

    def add_no_midline_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.MID_END
        indicator.save()
        target_end = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period=PeriodicTarget.ENDLINE,
            target=800
        )
        self.indicators.append(indicator)
        self.targets.append(target_end)

    def add_no_endline_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.MID_END
        indicator.save()
        target_mid = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period=PeriodicTarget.MIDLINE,
            target=800
        )
        self.indicators.append(indicator)
        self.targets.append(target_mid)

    def add_no_targets_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.MID_END
        indicator.save()
        self.indicators.append(indicator)

class TestEventTargetsDefined(TargetTestBase, TargetTestsMixin):
    testcase = 'event'
    good_indicators = [
        'add_good_indicator_multiple_targets',
    ]
    bad_indicators = [
        'add_no_target_indicator',
    ]
    def add_good_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.EVENT
        indicator.save()
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period="Event 1",
            target=400
        )
        self.indicators.append(indicator)
        self.targets.append(target)

    def add_good_indicator_multiple_targets(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.EVENT
        indicator.save()
        target_1 = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period="Event 1",
            target=400
        )
        target_2 = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period="Event 6",
            target=500
        )
        self.indicators.append(indicator)
        self.targets.extend([target_1, target_2])

    def add_no_target_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = Indicator.EVENT
        indicator.save()
        self.indicators.append(indicator)

class TimeAwareTargetTestBase(TargetTestBase):
    testcase = 'timeaware'
    bad_indicators = [
        'add_indicator_missing_one_target',
    ]

    def generate_targets(self, indicator, skip=None):
        target_frequency_num_periods = IPTT_ReportView._get_num_periods(
            self.program.reporting_period_start,
            self.program.reporting_period_end,
            self.frequency
        )
        if skip is not None:
            target_frequency_num_periods -= 1
        if target_frequency_num_periods == 0:
            return []
        generatedTargets = generate_periodic_targets(
            self.frequency, self.program.reporting_period_start,
            target_frequency_num_periods, '')
        to_return_targets = []
        for target in generatedTargets:
            to_return_targets.append(
                i_factories.PeriodicTargetFactory(
                    indicator=indicator,
                    period=target['period'],
                    start_date=target['start_date'],
                    end_date=target['end_date']
                )
            )
        return to_return_targets

    def add_good_indicator(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = self.frequency
        indicator.save()
        self.indicators.append(indicator)
        targets = self.generate_targets(indicator)
        for target in targets:
            target.value = 400
            target.save()
            self.targets.append(target)

    def add_indicator_missing_one_target(self):
        indicator = self.get_bare_indicator()
        indicator.target_frequency = self.frequency
        indicator.save()
        self.indicators.append(indicator)
        targets = self.generate_targets(indicator, skip=1)
        for target in targets:
            target.value = 400
            target.save()
            self.targets.append(target)

class TestAnnualTargetsDefined(TimeAwareTargetTestBase, TargetTestsMixin):
    testcase = 'annual'
    frequency = Indicator.ANNUAL

class TestSemiAnnualTargetCounts(TimeAwareTargetTestBase, TargetTestsMixin):
    testcase = 'semiannual'
    frequency = Indicator.SEMI_ANNUAL

class TestTriAnnualTargetCounts(TimeAwareTargetTestBase, TargetTestsMixin):
    testcase = 'triannual'
    frequency = Indicator.TRI_ANNUAL

class TestQuarterlyTargetCounts(TimeAwareTargetTestBase, TargetTestsMixin):
    testcase = 'quarterly'
    frequency = Indicator.QUARTERLY

class TestMonthlyTargetCounts(TimeAwareTargetTestBase, TargetTestsMixin):
    testcase = 'monthly'
    frequency = Indicator.MONTHLY