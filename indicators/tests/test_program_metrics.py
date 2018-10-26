#pylint: disable=R0901
"""ProgramWithMetrics should return stats about which indicators (by count and percent) have targets defined properly:
Interface:
ProgramWithMetrics.metrics['reported_results'] = int # percentage of indicators with reported results
ProgramWithMetrics.metrics['defined_targets'] = int # percentage of indicators with targets fully defined
ProgramWithMetrics.metrics['results_evidence'] = int # percentage of indicators with data that includes evidence
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
from django import test

class ProgramMetricsBase(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory(
            reporting_period_start=datetime.date.today()-datetime.timedelta(days=365),
            reporting_period_end=datetime.date.today()-datetime.timedelta(days=1)
        )
        self.indicators = []
        self.targets = []
        self.data = []
        self.documents = []

    def tearDown(self):
        for doc in self.documents:
            doc.delete()
        for datum in self.data:
            datum.delete()
        for target in self.targets:
            target.delete()
        for indicator in self.indicators:
            indicator.delete()
        self.program.delete()

    def get_reporting_program(self):
        return ProgramWithMetrics.objects.get(pk=self.program.id)

    def get_indicator(self, frequency=Indicator.LOP):
        indicator = i_factories.IndicatorFactory(
            target_frequency=frequency
        )
        indicator.program.add(self.program)
        indicator.save()
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

#pylint: disable=W0232
class TargetTestsMixin:
    """mixin containing test methods so tests won't fire on base class"""

    def test_one_good(self):
        self.add_good_indicator()
        program_reporting = self.get_reporting_program()
        self.assertEqual(program_reporting.metrics['targets_defined'], 100,
                         "One indicator with targets defined should be 100% good, got {0}".format(
                             program_reporting.metrics['targets_defined']))

    def test_two_good(self):
        self.add_good_indicator()
        self.add_good_indicator()
        program_reporting = self.get_reporting_program()
        self.assertEqual(program_reporting.metrics['targets_defined'], 100,
                         "Two indicators with targets defined should be 100% good, got {0}".format(
                             program_reporting.metrics['targets_defined']))

    def test_alternate_good_indicators(self):
        if not hasattr(self, 'good_indicators'):
            self.skipTest('no alternate good indicator methods')
        for good_indicator_method in self.good_indicators:
            getattr(self, good_indicator_method)()
            program_reporting = self.get_reporting_program()
            self.assertEqual(program_reporting.metrics['targets_defined'], 100,
                             "One indicator with targets defined should be 100% good, got {0}".format(
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
                "{case}: One indicator {0} should be 0% good, got {1}".format(
                    bad_indicator_method, program_reporting.metrics['targets_defined'], case=self.testcase))
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
        expected_good_percent = int(round(float(100)/(expected_bad_count+1)))
        self.assertEqual(
            program_reporting.metrics['targets_defined'], expected_good_percent,
            "One good {0} bad indicators should be {1}% good, got {2}".format(
                expected_bad_count, expected_good_percent, program_reporting.metrics['targets_defined']))

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
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 0,
                "Bare Indicator should have no reported results, got {0}".format(iptt.reported_results))
            self.add_data(indicator)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 1,
                "Indicator should have 1 reported result, got {0}".format(iptt.reported_results))
            self.add_data(indicator)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 2,
                "Indicator should have 2 reported results, got {0}".format(iptt.reported_results))

    def test_with_target_indicator_results(self):
        for frequency in [f for f, _ in Indicator.TARGET_FREQUENCIES if f != Indicator.LOP]:
            indicator = self.get_indicator(frequency=frequency)
            target = self.get_target(indicator)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 0,
                "Bare Indicator with target should have no reported results, got {0}".format(iptt.reported_results))
            self.add_data(indicator, target)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 1,
                "Indicator with target should have 1 reported result, got {0}".format(iptt.reported_results))
            self.add_data(indicator, target)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.reported_results, 2,
                "Indicator with target should have 2 reported results, got {0}".format(iptt.reported_results))

class TestProgramReportedResultsQueries(ProgramMetricsBase):
    def get_reporting_program(self):
        return ProgramWithMetrics.objects.get(pk=self.program.pk)

    def test_program_one_indicator_reported_results(self):
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['reported_results'], 0,
                "One bare indicator should not be counted 0% as reported results, got {0}".format(
                    program.metrics['reported_results'])
            )
            self.add_data(indicator)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['reported_results'], 100,
                "One indicator with results should  be counted as 100% reported results, got {0}".format(
                    program.metrics['reported_results'])
            )
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
            program.metrics['reported_results'], 50,
            "one of each freq with data should count as 50% reported results, got {0}".format(
                program.metrics['reported_results']
            )
        )

    def test_percentages(self):
        for _ in range(4):
            indicator = self.get_indicator()
            self.add_data(indicator)
        for rep, _ in [(80, 20), (67, 33), (57, 43), (50, 50), (44, 56)]:
            indicator = self.get_indicator()
            program = self.get_reporting_program()
            reported = program.metrics['reported_results']
            self.assertEqual(
                reported, rep,
                "expeected {0} for reported results but got {1}".format(rep, reported)
            )

# RESULTS BACKED UP TESTS:

class TestIPTTIndicatorWithEvidence(ProgramMetricsBase):
    def test_no_target_indicator_results(self):
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 0,
                "Bare Indicator should have no evidence, got {0}".format(iptt.evidence_count))
            data = self.add_data(indicator)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 0,
                "Indicator with data but no docs should have no evidence, got {0}".format(iptt.evidence_count))
            self.add_evidence(data)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 1,
                "Indicator with evidence should have 1 evidence, got {0}".format(iptt.evidence_count))
            data2 = self.add_data(indicator)
            self.add_evidence(data2)
            iptt = IPTTIndicator.with_metrics.get(pk=indicator.pk)
            self.assertEqual(
                iptt.evidence_count, 2,
                "Indicator with evidence should have 2 evidence, got {0}".format(iptt.evidence_count))

class TestProgramWithEvidenceQueries(ProgramMetricsBase):
    def get_reporting_program(self):
        return ProgramWithMetrics.objects.get(pk=self.program.pk)

    def test_program_one_indicator_reported_results(self):
        for frequency, _ in Indicator.TARGET_FREQUENCIES:
            indicator = self.get_indicator(frequency=frequency)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['results_evidence'], 0,
                "One bare indicator should be counted as 0% evidence, got {0}".format(
                    program.metrics['results_evidence'])
            )
            data = self.add_data(indicator)
            self.add_evidence(data)
            program = self.get_reporting_program()
            self.assertEqual(
                program.metrics['results_evidence'], 100,
                "One indicator with results should be counted as 100% with evidence, got {0}".format(
                    program.metrics['results_evidence'])
            )
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
        self.assertEqual(
            program.metrics['results_evidence'], 50,
            "one of each freq with data should count as 50% with evidence results, got {0}".format(
                program.metrics['results_evidence']
            )
        )

    def test_percentages(self):
        for _ in range(4):
            indicator = self.get_indicator()
            data = self.add_data(indicator)
            self.add_evidence(data)
        for expected_evidence, _ in [(80, 20), (67, 33), (57, 43), (50, 50), (44, 56)]:
            indicator = self.get_indicator()
            program = self.get_reporting_program()
            with_evidence = program.metrics['results_evidence']
            self.assertEqual(
                with_evidence, expected_evidence,
                "expeected {0} for backed_up_with_evidence but got {1}".format(expected_evidence, with_evidence)
            )
