#pylint: disable=R0901
"""ProgramWithMetrics should return stats about which indicators (by count and percent) have targets defined properly:
Interface:
ProgramWithMetrics.metrics['reported_results'] = int # percentage of indicators with reported results
ProgramWithMetrics.metrics['defined_targets'] = int # percentage of indicators with targets fully defined
ProgramWithMetrics.metrics['results_evidence'] = int # percentage of all results for all indicators that have evidence
ProgramWithMetrics.metrics['indicator_count'] = int # denominator for the above percentages


Specific business rules
targets_defined:
    - Indicator has target frequency
    - if LOP, indicator has lop_target
    - if MID_END, indicator has both MID and END periodic_target and also target values for both
    - if EVENT, indicator has at least one periodic_target and all have target values
    - if time aware, indicator has all periods from reporting_period_start to reporting_period_end with targets
reported_results:
    - Indicator has a piece of collected data tied to either it (indicator_id=pk) or one of its periodic targets
results_evidence:
    - Indicator has AT LEAST ONE piece of Collected Data which has an associated Documentation as 'evidence'

Units:
IPTTIndicator.with_metrics => queryset annotated:
     - targets_defined
     - results_count
     - evidence_count

Query counts and complex situations checked in another test
"""

import datetime
from indicators.queries import IPTTIndicator, ProgramWithMetrics
from indicators.models import Indicator, PeriodicTarget
from indicators.views.views_indicators import generate_periodic_targets
from indicators.views.views_reports import IPTT_ReportView
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from workflow.models import Program
from django import test
from django.db import connection
from django.conf import settings

class ProgramMetricsBase(test.TestCase):
    fixtures = ['one_year_program.yaml']

    def setUp(self):
        self.program = Program.objects.get(pk=1)
        self.indicators = []
        self.targets = []
        self.data = []
        self.documents = []

    def get_reporting_program(self):
        return ProgramWithMetrics.with_metrics.get(pk=1)

    def get_indicator(self, frequency=Indicator.LOP):
        indicator = i_factories.IndicatorFactory(
            target_frequency=frequency,
            program=self.program
        )
        self.indicators.append(indicator)
        return indicator

    def add_data(self, indicator=None, target=None):
        data = i_factories.CollectedDataFactory(
            indicator=indicator,
            periodic_target=target,
            date_collected=self.program.reporting_period_start+datetime.timedelta(days=3+2*len(self.data)),
            achieved=100
        )
        self.data.append(data)
        return data

    def get_target(self, indicator):
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period="target {0}".format(len(self.targets)),
            target=100
        )
        self.targets.append(target)
        return target

    def add_evidence(self, data):
        documentation = w_factories.DocumentationFactory()
        data.evidence = documentation
        data.save()
        self.documents.append(documentation)

# TARGETS DEFINED TESTS:

# pylint: disable=W0232
class TargetTestsMixin:
    """mixin containing test methods so tests won't fire on base class"""

    def test_one_good(self):
        self.add_good_indicator()
        program_reporting = self.get_reporting_program()
        self.assertEqual(program_reporting.metrics['targets_defined'], 1,
                         "One indicator with targets defined should be 1 good, got {0}".format(
                             program_reporting.metrics['targets_defined']))
        indicator = program_reporting.get_annotated_indicators().first()
        self.assertTrue(
            indicator.all_targets_defined, "Indicator with targets defined should show all_targets_defined")

    def test_two_good(self):
        self.add_good_indicator()
        self.add_good_indicator()
        program_reporting = self.get_reporting_program()
        self.assertEqual(program_reporting.metrics['targets_defined'], 2,
                         "Two indicators with targets defined should be 2 good, got {0}".format(
                             program_reporting.metrics['targets_defined']))
        indicators = program_reporting.get_annotated_indicators()
        for indicator in indicators:
            self.assertTrue(
                indicator.all_targets_defined, "Indicator with targets defined should show all_targets_defined")

    def test_alternate_good_indicators(self):
        if not hasattr(self, 'good_indicators'):
            self.skipTest('no alternate good indicator methods')
        for good_indicator_method in self.good_indicators:
            getattr(self, good_indicator_method)()
            program_reporting = self.get_reporting_program()
            self.assertEqual(program_reporting.metrics['targets_defined'], 1,
                             "One indicator with targets defined should be 1 good, got {0}".format(
                                 program_reporting.metrics['targets_defined']))
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
            self.assertEqual(
                program_reporting.metrics['targets_defined'], 0,
                "{case}: One indicator {0} should be 0 good, got {1}".format(
                    bad_indicator_method, program_reporting.metrics['targets_defined'], case=self.testcase))
            indicator = program_reporting.get_annotated_indicators().first()
            self.assertFalse(
                indicator.all_targets_defined,
                "Indicator in case {0} should not show all_targets_defined".format(self.testcase))
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
        self.assertEqual(
            program_reporting.metrics['targets_defined'], 1,
            "One good {0} bad indicators should be {1} good, got {2}".format(
                expected_bad_count, 1, program_reporting.metrics['targets_defined']))
        indicators = program_reporting.get_annotated_indicators().all()
        bad_count = [x for x in indicators if not x.all_targets_defined]
        self.assertEqual(
            len(bad_count), expected_bad_count,
            "Expected {0} bad indicators, got {1}".format(
                expected_bad_count, [x.all_targets_defined for x in indicators]))

class TestLOPTargetsDefined(ProgramMetricsBase, TargetTestsMixin):
    testcase = "lop"
    bad_indicators = [
        'add_no_target_indicator'
    ]

    def add_good_indicator(self):
        indicator = self.get_indicator(Indicator.LOP)
        indicator.lop_target = 1000
        indicator.save()

    def add_no_target_indicator(self):
        indicator = self.get_indicator(Indicator.LOP)
        assert indicator.lop_target is None, "test relies on lop_target being default None"

class TestMidEndTargetsDefined(ProgramMetricsBase, TargetTestsMixin):
    testcase = "midend"
    bad_indicators = [
        'add_no_midline_indicator',
        'add_no_endline_indicator',
        'add_no_targets_indicator',
    ]
    def add_good_indicator(self):
        indicator = self.get_indicator(Indicator.MID_END)
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
        self.targets.extend([target_mid, target_end])

    def add_no_midline_indicator(self):
        indicator = self.get_indicator(Indicator.MID_END)
        target_end = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period=PeriodicTarget.ENDLINE,
            target=800
        )
        self.targets.append(target_end)

    def add_no_endline_indicator(self):
        indicator = self.get_indicator(Indicator.MID_END)
        target_mid = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period=PeriodicTarget.MIDLINE,
            target=800
        )
        self.targets.append(target_mid)

    def add_no_targets_indicator(self):
        self.get_indicator(Indicator.MID_END)

class TestEventTargetsDefined(ProgramMetricsBase, TargetTestsMixin):
    testcase = 'event'
    good_indicators = [
        'add_good_indicator_multiple_targets',
    ]
    bad_indicators = [
        'add_no_target_indicator',
    ]
    def add_good_indicator(self):
        indicator = self.get_indicator(Indicator.EVENT)
        target = i_factories.PeriodicTargetFactory(
            indicator=indicator,
            period="Event 1",
            target=400
        )
        self.targets.append(target)

    def add_good_indicator_multiple_targets(self):
        indicator = self.get_indicator(Indicator.EVENT)
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
        self.targets.extend([target_1, target_2])

    def add_no_target_indicator(self):
        self.get_indicator(Indicator.EVENT)

class TimeAwareTargetsMixin:
    testcase = 'timeaware'
    bad_indicators = [
        'add_indicator_missing_one_target',
    ]

    def generate_targets(self, indicator, skip=None):
        #pylint: disable=W0212
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
        indicator = self.get_indicator(self.frequency)
        targets = self.generate_targets(indicator)
        for target in targets:
            target.value = 400
            target.save()
            self.targets.append(target)

    def add_indicator_missing_one_target(self):
        indicator = self.get_indicator(self.frequency)
        targets = self.generate_targets(indicator, skip=1)
        for target in targets:
            target.value = 400
            target.save()
            self.targets.append(target)

class TestAnnualTargetsDefined(TargetTestsMixin, TimeAwareTargetsMixin, ProgramMetricsBase):
    testcase = 'annual'
    frequency = Indicator.ANNUAL

class TestSemiAnnualTargetCounts(TargetTestsMixin, TimeAwareTargetsMixin, ProgramMetricsBase):
    testcase = 'semiannual'
    frequency = Indicator.SEMI_ANNUAL

class TestTriAnnualTargetCounts(TargetTestsMixin, TimeAwareTargetsMixin, ProgramMetricsBase):
    testcase = 'triannual'
    frequency = Indicator.TRI_ANNUAL

class TestQuarterlyTargetCounts(TargetTestsMixin, TimeAwareTargetsMixin, ProgramMetricsBase):
    testcase = 'quarterly'
    frequency = Indicator.QUARTERLY

class TestMonthlyTargetCounts(TargetTestsMixin, TimeAwareTargetsMixin, ProgramMetricsBase):
    testcase = 'monthly'
    frequency = Indicator.MONTHLY

# REPORTED RESULTS TESTS:

class TestIPTTIndicatorReportedResults(ProgramMetricsBase):
    def test_no_target_indicator_results(self):
        program = self.get_reporting_program()
        for frequency in [Indicator.MID_END, Indicator.QUARTERLY, Indicator.LOP]:
            indicator = self.get_indicator(frequency=frequency)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 0,
                "Bare Indicator should have no reported results, got {0}".format(iptt.reported_results))
            self.assertFalse(iptt.has_reported_results, "Bare indicator should not have reported results")
            self.add_data(indicator)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 1,
                "Indicator should have 1 reported result, got {0}".format(iptt.reported_results))
            self.assertTrue(iptt.has_reported_results, "Indicator with 1 result should have reported results")
            self.add_data(indicator)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 2,
                "Indicator should have 2 reported results, got {0}".format(iptt.reported_results))
            self.assertTrue(iptt.has_reported_results, "Indicator with 2 result should have reported results")

    def test_with_target_indicator_results(self):
        program = self.get_reporting_program()
        for frequency in [f for f, _ in Indicator.TARGET_FREQUENCIES if f != Indicator.LOP]:
            indicator = self.get_indicator(frequency=frequency)
            target = self.get_target(indicator)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 0,
                "Bare Indicator with target should have no reported results, got {0}".format(iptt.reported_results))
            self.assertFalse(iptt.has_reported_results, "Bare indicator should not have reported results")
            self.add_data(indicator, target)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 1,
                "Indicator with target should have 1 reported result, got {0}".format(iptt.reported_results))
            self.assertTrue(iptt.has_reported_results, "Indicator with 1 result should have reported results")
            self.add_data(indicator, target)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 2,
                "Indicator with target should have 2 reported results, got {0}".format(iptt.reported_results))
            self.assertTrue(iptt.has_reported_results, "Indicator with 2 result should have reported results")

class TestProgramReportedResultsQueries(ProgramMetricsBase):
    def test_program_one_indicator_reported_results(self):
        for frequency in [Indicator.LOP, Indicator.EVENT, Indicator.SEMI_ANNUAL, Indicator.MONTHLY]:
            indicator = self.get_indicator(frequency=frequency)
            with self.assertNumQueries(1):
                program = self.get_reporting_program()
                self.assertEqual(
                    program.metrics['results_count'], 0,
                    "One bare indicator should not be counted as 0 reported results, got {0}".format(
                        program.metrics['results_count'])
                )
            with self.assertNumQueries(1):
                iptt = program.get_annotated_indicators().get(pk=indicator.pk)
                self.assertFalse(iptt.has_reported_results, "Bare indicator should have no reported results")
            self.add_data(indicator)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['results_count'], 1,
                "One indicator with results should  be counted as 1 reported results, got {0}".format(
                    program.metrics['results_count'])
            )
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertTrue(iptt.has_reported_results, "Indicator with results should have reported results")
            for datum in self.data:
                datum.delete()
            self.data = []
            for indicator in self.indicators:
                indicator.delete()
            self.indicators = []

    def test_multiple_indicators(self):
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            self.add_data(indicator)
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
        program = self.get_reporting_program()
        self.assertEqual(
            program.metrics['results_count'], len(Indicator.TARGET_FREQUENCIES),
            "one of each freq with data should count as {0} reported results, got {1}".format(
                len(Indicator.TARGET_FREQUENCIES), program.metrics['results_count']
            )
        )

# RESULTS BACKED UP TESTS:

class TestIPTTIndicatorWithEvidence(ProgramMetricsBase):
    def test_no_target_indicator_results(self):
        program = self.get_reporting_program()
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 0,
                "Bare Indicator should have no evidence, got {0}".format(iptt.evidence_count))
            data = self.add_data(indicator)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 0,
                "Indicator with data but no docs should have no evidence, got {0}".format(iptt.evidence_count))
            self.assertFalse(
                iptt.all_results_backed_up,
                "Indicator with 1 result and no evidence should not show all results backed up (no evidence)")
            self.add_evidence(data)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 1,
                "Indicator with evidence should have 1 evidence, got {0}".format(iptt.evidence_count))
            self.assertTrue(
                iptt.all_results_backed_up,
                "Indicator with 1 result and 1 evidence should show all results backed up")
            data2 = self.add_data(indicator)
            self.add_evidence(data2)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 2,
                "Indicator with evidence should have 2 evidence, got {0}".format(iptt.evidence_count))
            self.assertTrue(
                iptt.all_results_backed_up,
                "Indicator with 2 result, both with evidence should show all results backed up")

    def test_fewer_evidence_than_results(self):
        program = self.get_reporting_program()
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            # add one result with evidence
            data = self.add_data(indicator)
            self.add_evidence(data)
            # add another result (so not all results backed up with evidence)
            data2 = self.add_data(indicator)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 1,
                "Indicator with 2 data points but one doc should have 1 evidence, got {0}".format(
                    iptt.evidence_count))
            self.assertEqual(
                iptt.reported_results, 2,
                "Indicator with 2 data points but one doc should have 2 rep results, got {0}".format(
                    iptt.reported_results))
            self.assertFalse(
                iptt.all_results_backed_up,
                "Indicator with 2 results and 1 evidence should not show all results backed up")
            # add another result and another data (still one fewer data than result)
            self.add_evidence(data2)
            _ = self.add_data(indicator)
            iptt = program.get_annotated_indicators().get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 2,
                "Indicator with 2 evidence for 3 results should show 2 evidence, got {0}".format(iptt.evidence_count))
            self.assertEqual(
                iptt.reported_results, 3,
                "Indicator with 2 evidence for 3 results should show 3 results, got {0}".format(
                    iptt.reported_results))
            self.assertFalse(
                iptt.all_results_backed_up,
                "Indicator with 3 results and 2 evidence should not show all results backed up")

class TestProgramWithEvidenceQueries(ProgramMetricsBase):
    def test_program_one_indicator_reported_results(self):
        for frequency in [Indicator.LOP, Indicator.EVENT, Indicator.MID_END, Indicator.QUARTERLY]:
            indicator = self.get_indicator(frequency=frequency)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['results_evidence'], 0,
                "One bare indicator should be counted as 0% evidence, got {0}".format(
                    program.metrics['results_evidence'])
            )
            iptt = program.get_annotated_indicators().first()
            self.assertTrue(iptt.all_results_backed_up,
                            "Indicator with no results or evidence should report all_results_backed_up=True")
            data = self.add_data(indicator)
            self.add_evidence(data)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['results_evidence'], 1,
                "One indicator with 1 result and 1 evidence should be counted as 1 with evidence, got {0}".format(
                    program.metrics['results_evidence'])
            )
            iptt = program.get_annotated_indicators().first()
            self.assertTrue(iptt.all_results_backed_up,
                            "Indicator with 1 result and 1 evidence should report all_results_backed_up=True")
            for doc in self.documents:
                doc.delete()
            self.documents = []
            for datum in self.data:
                datum.delete()
            self.data = []
            for indicator in self.indicators:
                indicator.delete()
            self.indicators = []

    def test_multiple_indicators(self):
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            data = self.add_data(indicator)
            self.add_evidence(data)
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            data = self.add_data(indicator)
        program = self.get_reporting_program()
        indicators = program.get_annotated_indicators()
        bad_count = len([x for x in indicators if x.all_results_backed_up])
        self.assertEqual(bad_count*2, len(indicators), "half indicators should have all_results_backed_up=True")
        self.assertEqual(
            program.metrics['results_evidence']*2, program.metrics['results_count'],
            "one of each freq with data should count as double evidence as count, got {0} ev and {1} results".format(
                program.metrics['results_evidence'], program.metrics['results_count']
            )
        )

    def test_multiple_data_points(self):
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            data = self.add_data(indicator)
            self.add_evidence(data)
            _ = self.add_data(indicator)
            _ = self.add_data(indicator)
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            data = self.add_data(indicator)
        program = self.get_reporting_program()
        self.assertEqual(
            program.metrics['results_evidence'], len(Indicator.TARGET_FREQUENCIES),
            "one of each freq with 1 ev/3 results, 1 of each freq with 0 ev/1res"
            " should count as 8 with evidence results, got {0}".format(
                program.metrics['results_evidence']
            )
        )
        indicators = program.get_annotated_indicators()
        no_missing_count = len([x for x in indicators if x.all_results_backed_up])
        self.assertEqual(no_missing_count, 0, "All indicators should show as no missing evidence")


class TestIndicatorReportingEdgeCases(test.TestCase):
    fixtures = ['one_year_program.yaml']

    def setUp(self):
        self.program = Program.objects.get(pk=1)

    def get_indicator(self):
        return i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.LOP,
            lop_target=1000
        )

    def add_result(self, indicator):
        i_factories.CollectedDataFactory(
            indicator=indicator,
            program=self.program,
            achieved=100,
            date_collected=self.program.reporting_period_start
        )

    def results_count_asserts(self, indicator_count, with_results_count, results_count):
        reporting_program = ProgramWithMetrics.with_metrics.get(pk=1)
        self.assertEqual(
            reporting_program.metrics['indicator_count'], indicator_count,
            "{0} indicator should show indicator_count as {0}, got {1}".format(
                indicator_count, reporting_program.metrics['indicator_count']
            )
        )
        self.assertEqual(
            reporting_program.metrics['reported_results'], with_results_count,
            "{0} with results should show reported_results as {0}, got {1}".format(
                with_results_count, reporting_program.metrics['reported_results']
                ))
        self.assertEqual(
            reporting_program.metrics['results_count'], results_count,
            "{0} results should show results_count as {0}, got {1}".format(
                results_count, reporting_program.metrics['results_count'])
        )

    def test_collected_data_counts(self):
        """indicator has_reported_results and program.metrics['reported_results'] independent of result count"""
        # one indicator with no reported results
        indicator = self.get_indicator()
        reporting_indicator = IPTTIndicator.with_metrics.get(pk=indicator.pk)
        self.assertFalse(
            reporting_indicator.has_reported_results,
            "no results should show has_reported_results false")
        self.results_count_asserts(1, 0, 0)
        # two indicators, one with 1 reported result
        indicator2 = self.get_indicator()
        self.add_result(indicator2)
        reporting_indicator2 = IPTTIndicator.with_metrics.get(pk=indicator2.pk)
        self.assertTrue(
            reporting_indicator2.has_reported_results,
            "1 result should show has_reported_results true")
        self.results_count_asserts(2, 1, 1)
        # three indicators, one with 1 reported result, 1 with 2 reported results
        indicator3 = self.get_indicator()
        self.add_result(indicator3)
        self.add_result(indicator3)
        reporting_indicator3 = IPTTIndicator.with_metrics.get(pk=indicator3.pk)
        self.assertTrue(
            reporting_indicator3.has_reported_results,
            "2 result should show has_reported_results true")
        self.results_count_asserts(3, 2, 3)