""" Supplements test_program_metrics with both Functional and Transactional (query-counting) tests for program metrics

ProgramWithMetrics.with_metrics.all()
 - single query
 - each program has a .metrics property
    - targets_defined
    - reported_results
    - results_evidence
    - indicator_count
 - program.metrics should not trigger another query (annotated)

program page call with program id:
    context:
        - program
            - has metrics with correct values
"""
import time
import datetime
import json
import unittest
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from workflow.models import Documentation, Program
from indicators.models import Indicator, PeriodicTarget, CollectedData
from indicators.queries import ProgramWithMetrics, IPTTIndicator
from django import test

def do_add_indicator(program):
    indicator = i_factories.IndicatorFactory(program=program)
    return indicator

def do_add_defined_target(indicator):
    indicator.target_frequency = Indicator.MID_END
    mid_target = i_factories.PeriodicTargetFactory(
        indicator=indicator,
        period=PeriodicTarget.MIDLINE,
        target=1000
    )
    end_target = i_factories.PeriodicTargetFactory(
        indicator=indicator,
        period=PeriodicTarget.ENDLINE,
        target=400
    )
    indicator.save()
    return (mid_target, end_target)

def do_add_reported_result(indicator, collect_date, program):
    return i_factories.CollectedDataFactory(
        indicator=indicator,
        date_collected=collect_date,
        achieved=140,
        program=program
    )

def do_add_evidence(result, program):
    doc = w_factories.DocumentationFactory(program=program)
    result.evidence = doc
    result.save()

class ProgramWithMetricsQueryCountsBase(test.TestCase):
    skip_all = False
    do_print = False
    country = None
    program_start_date = datetime.date.today()-datetime.timedelta(days=730)
    program_end_date = datetime.date.today()-datetime.timedelta(days=1)
    collect_date = datetime.date.today()-datetime.timedelta(days=400)

    def setUp(self):
        if self.skip_all:
            raise unittest.SkipTest('skip')

    @classmethod
    def setUpTestData(cls):
        cls.country = w_factories.CountryFactory()
        cls.user = w_factories.TolaUserFactory()
        cls.user.countries.add(cls.country)
        for case in cls.expected_cases:
            program = w_factories.ProgramFactory(
                reporting_period_start=cls.program_start_date,
                reporting_period_end=cls.program_end_date,
                funding_status='Funded',
                name=case['name']
            )
            program.country.add(cls.country)
            for c in range(case['indicator_count']):
                data_count = 0
                indicator = do_add_indicator(program)
                if c < case['targets_defined']:
                    do_add_defined_target(indicator)
                if c < case['reported_results']:
                    collect_date = cls.collect_date + datetime.timedelta(days=data_count)
                    data_count += 1
                    result = do_add_reported_result(indicator, collect_date, program)
                    if c < case['results_evidence']:
                        do_add_evidence(result, program)

#pylint: disable=W0232
class QueryTestsMixin:
    def test_program_queryset_returns_one(self):
        program_qs = ProgramWithMetrics.with_metrics.all()
        self.assertEqual(program_qs.count(), len(self.expected_cases),
                         "{0} programs created, {1} returned, {2}".format(
                             len(self.expected_cases), program_qs.count(), [x.name for x in program_qs]))

    def test_program_queryset_metric_counts(self):
        for expected in self.expected_cases:
            if self.do_print:
                program = ProgramWithMetrics.with_metrics.filter(name=expected['name']).first()
                print "targets defined count: {0}".format(program.targets_defined_count)
                for indicator in IPTTIndicator.with_metrics.filter(program__in=[program.id]).all():
                    print "indicator: {0} and defined_targets {1} and targets {2}".format(
                        indicator,
                        indicator.defined_targets,
                        [x.target for x in PeriodicTarget.objects.filter(indicator_id=indicator.pk).all()])
                    print "indicator: {0} and reported_results {1} and results {2}".format(
                        indicator,
                        indicator.reported_results,
                        [x.achieved for x in CollectedData.objects.filter(indicator_id=indicator.pk).all()])
                    print "indicator: {0} and evidence count {1} and documents {2}".format(
                        indicator,
                        indicator.evidence_count,
                        [x for x in Documentation.objects.filter(collecteddata__indicator_id=indicator.pk).all()])
                print "metrics: {0}".format(program.metrics)
            metrics = ProgramWithMetrics.with_metrics.filter(name=expected['name']).first().metrics
            for key in ['targets_defined', 'reported_results', 'results_evidence', 'indicator_count']:
                self.assertIn(
                    key, metrics.keys(), "program.metrics should have {0}, got {1}".format(key, metrics.keys()))
                self.assertEqual(metrics[key], expected[key], "expected {0} for {1}, got {2} {3}".format(
                    expected[key], key, metrics, expected))

    def test_program_queryset_takes_one_query(self):
        for expected in self.expected_cases:
            with self.assertNumQueries(1):
                count = ProgramWithMetrics.with_metrics.filter(name=expected['name']).first().metrics['indicator_count']
                assert count == expected['indicator_count'] # to ensure queryset is evaluated

    def test_program_view_returns_correct_program_data(self):
        client = test.Client()
        client.force_login(self.user.user)
        programs = ProgramWithMetrics.with_metrics.all()
        for c, expected in enumerate(self.expected_cases):
            response = client.get('/program/{program_id}/0/0/'.format(program_id=programs[c].id))
            self.assertEqual(response.status_code, 200)
            program_response_metrics = response.context['program'].metrics
            for key in ['targets_defined', 'reported_results', 'results_evidence', 'indicator_count']:
                self.assertIn(
                    key, program_response_metrics.keys(), "program.metrics should have {0}, got {1}".format(
                        key, program_response_metrics.keys()))
                self.assertEqual(program_response_metrics[key], expected[key],
                                 "expected {0} for {1}, got {2}".format(
                                     expected[key], key, program_response_metrics[key]))

    def test_program_ajax_update_returns_correct_program_data(self):
        client = test.Client()
        client.force_login(self.user.user)
        for expected in self.expected_cases:
            program = Program.objects.filter(name=expected['name']).first()
            response = client.get('/program/{program_id}/metrics/'.format(program_id=program.id),
                                  HTTP_X_REQUESTED_WITH='XMLHttpRequest')
            self.assertEqual(response.status_code, 200)
            json_metrics = json.loads(response.content)['metrics']
            for key in ['targets_defined', 'reported_results', 'results_evidence', 'indicator_count']:
                self.assertIn(
                    key, json_metrics.keys(), "json metrics should have {0}, got {1}".format(
                        key, json_metrics.keys()))
                self.assertEqual(json_metrics[key], expected[key],
                                 "expected {0} for {1}, got {2}".format(
                                     expected[key], key, json_metrics[key]))

class TestOneBareProgram(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    skip_all = False
    expected_cases = [
        {
            'indicator_count': 0,
            'targets_defined': 0,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Bare 1'
        }
    ]

class TestOneProgramWithIndicators(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 5,
            'targets_defined': 0,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Bare Indicators 1'
        }
    ]

class TestFourProgramsWithIndicators(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 5,
            'targets_defined': 0,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Bare Indicators 1'
        },
        {
            'indicator_count': 3,
            'targets_defined': 0,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Bare Indicators 2'
        },
        {
            'indicator_count': 9,
            'targets_defined': 0,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Bare Indicators 3'
        },
        {
            'indicator_count': 1,
            'targets_defined': 0,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Bare Indicators 4'
        }
    ]

class TestOneProgramWithTargetsDefined(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 5,
            'targets_defined': 3,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Target Indicators 1'
        }
    ]

class TestThreeProgramsWithTargetsDefined(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 4,
            'targets_defined': 3,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Target Indicators 1'
        },
        {
            'indicator_count': 2,
            'targets_defined': 2,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Target Indicators 2'
        },
        {
            'indicator_count': 5,
            'targets_defined': 1,
            'reported_results': 0,
            'results_evidence': 0,
            'name': 'Target Indicators 3'
        }
    ]

class TestOneProgramWithResultsReported(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 5,
            'targets_defined': 0,
            'reported_results': 2,
            'results_evidence': 0,
            'name': 'Results Indicators 1'
        }
    ]

class TestMultipleProgramsWithResultsReported(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 5,
            'targets_defined': 0,
            'reported_results': 2,
            'results_evidence': 0,
            'name': 'Results Indicators 1'
        },
        {
            'indicator_count': 1,
            'targets_defined': 0,
            'reported_results': 1,
            'results_evidence': 0,
            'name': 'Results Indicators 2'
        },
        {
            'indicator_count': 6,
            'targets_defined': 0,
            'reported_results': 5,
            'results_evidence': 0,
            'name': 'Results Indicators 3'
        }
    ]

class TestOneProgramWithEvidenceReported(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 5,
            'targets_defined': 0,
            'reported_results': 2,
            'results_evidence': 1,
            'name': 'Evidence Indicators 1'
        }
    ]

class TestMultipleProgramsWithEvidenceReported(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 3,
            'targets_defined': 0,
            'reported_results': 2,
            'results_evidence': 2,
            'name': 'Evidence Indicators 1'
        },
        {
            'indicator_count': 4,
            'targets_defined': 0,
            'reported_results': 2,
            'results_evidence': 1,
            'name': 'Evidence Indicators 2'
        },
        {
            'indicator_count': 6,
            'targets_defined': 0,
            'reported_results': 3,
            'results_evidence': 3,
            'name': 'Evidence Indicators 3'
        }
    ]

class TestProgramsWithMixedTargetTypesAndResultsAndEvdience(ProgramWithMetricsQueryCountsBase, QueryTestsMixin):
    expected_cases = [
        {
            'indicator_count': 2,
            'targets_defined': 1,
            'reported_results': 2,
            'results_evidence': 2,
            'name': 'test name 1'
        },
        {
            'indicator_count': 4,
            'targets_defined': 4,
            'reported_results': 3,
            'results_evidence': 3,
            'name': 'test name 2'
        },
        {
            'indicator_count': 3,
            'targets_defined': 1,
            'reported_results': 3,
            'results_evidence': 1,
            'name': 'test name 3'
        }
    ]
