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
import datetime
import unittest
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from workflow.models import Documentation, Program
from indicators.models import Indicator, PeriodicTarget, CollectedData
from indicators.queries import ProgramWithMetrics, IPTTIndicator
from django import test

class ProgramWithMetricsQueryCountsBase(test.TransactionTestCase):
    skip_all = False
    do_print = False

    def setUp(self):
        if self.skip_all:
            raise unittest.SkipTest('skip')
        self.program_ids = []
        self.program_start_date = datetime.date.today()-datetime.timedelta(days=730)
        self.program_end_date = datetime.date.today()-datetime.timedelta(days=1)
        self.collect_date = datetime.date.today()-datetime.timedelta(days=400)
        self.country = None

    def get_bare_program(self):
        self.country = w_factories.CountryFactory()
        program = w_factories.ProgramFactory(
            reporting_period_start=self.program_start_date,
            reporting_period_end=self.program_end_date,
            funding_status='Funded',
        )
        program.country.add(self.country)
        self.program_ids.append(program.id)
        return program

    def get_program_setup(self):
        for case in self.expected_cases:
            program = self.get_bare_program()
            program.name = case['name']
            program.save()
            for c in range(case['indicator_count']):
                indicator = self.add_indicator(program)
                if c < case['targets_defined']:
                    self.add_defined_target(indicator)
                if c < case['reported_results']:
                    result = self.add_reported_result(indicator)
                    if c < case['results_evidence']:
                        self.add_evidence(result)

    def get_reporting_qs(self):
        return ProgramWithMetrics.with_metrics.filter(id__in=self.program_ids)

    def add_indicator(self, program):
        indicator = i_factories.IndicatorFactory()
        indicator.program.add(program)
        indicator.save()
        return indicator

    def add_defined_target(self, indicator):
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

    def add_reported_result(self, indicator):
        data = i_factories.CollectedDataFactory(
            indicator=indicator,
            date_collected=self.collect_date,
            achieved=140
        )
        self.collect_date = self.collect_date + datetime.timedelta(days=1)
        return data

    def add_evidence(self, result):
        doc = w_factories.DocumentationFactory()
        result.evidence = doc
        result.save()

#pylint: disable=W0232
class QueryTestsMixin:
    def test_program_queryset_returns_one(self):
        self.get_program_setup()
        program_qs = self.get_reporting_qs()
        self.assertEqual(program_qs.count(), len(self.expected_cases),
                         "{0} programs created, {1} returned".format(
                             len(self.expected_cases), program_qs.count()))

    def test_program_queryset_metric_counts(self):
        self.get_program_setup()
        for expected in self.expected_cases:
            if self.do_print:
                program = self.get_reporting_qs().filter(name=expected['name']).first()
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
            metrics = self.get_reporting_qs().filter(name=expected['name']).first().metrics
            for key in ['targets_defined', 'reported_results', 'results_evidence', 'indicator_count']:
                self.assertIn(
                    key, metrics.keys(), "program.metrics should have {0}, got {1}".format(key, metrics.keys()))
                expected_value = expected[key]
                if expected[key] != 0 and key != 'indicator_count' and key != 'results_evidence':
                    expected_value = int(round(float(expected[key])*100/metrics['indicator_count']))
                elif expected[key] != 0 and key == 'results_evidence':
                    expected_value = int(round(float(expected[key])*100/expected['reported_results']))
                self.assertEqual(metrics[key], expected_value, "expected {0} for {1}, got {2} {3}".format(
                    expected_value, key, metrics, expected))

    def test_program_queryset_takes_one_query(self):
        self.get_program_setup()
        for expected in self.expected_cases:
            with self.assertNumQueries(1):
                count = self.get_reporting_qs().filter(name=expected['name']).first().metrics['indicator_count']
                assert count == expected['indicator_count'] # to ensure queryset is evaluated

    def test_program_view_returns_correct_program_data(self):
        self.get_program_setup()
        client = test.Client()
        user = w_factories.TolaUserFactory()
        user.countries.add(self.country)
        client.force_login(user.user)
        for expected in self.expected_cases:
            program = Program.objects.filter(name=expected['name']).first()
            response = client.get('/program/{program_id}/0/0/'.format(program_id=program.id))
            self.assertEqual(response.status_code, 200)
            program_response_metrics = response.context['program'].metrics
            for key in ['targets_defined', 'reported_results', 'results_evidence', 'indicator_count']:
                self.assertIn(
                    key, program_response_metrics.keys(), "program.metrics should have {0}, got {1}".format(
                        key, program_response_metrics.keys()))
                expected_value = expected[key]
                if expected[key] != 0 and key != 'indicator_count' and key != 'results_evidence':
                    expected_value = int(round(float(expected[key])*100/program_response_metrics['indicator_count']))
                elif key == 'results_evidence' and expected[key] != 0:
                    expected_value = int(round(float(expected[key])*100/expected['reported_results']))
                self.assertEqual(program_response_metrics[key], expected_value,
                                 "expected {0} for {1}, got {2}".format(
                                     expected_value, key, program_response_metrics[key]))

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

    def get_program_setup(self):
        program = self.get_bare_program()
        program.name = 'Bare 1'
        program.save()

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

    def get_program_setup(self):
        self.program_start_date = datetime.date(2015, 10, 1)
        self.program_end_date = datetime.date(2016, 9, 30)
        program1 = self.get_bare_program()
        program1.name = self.expected_cases[0]['name']
        program1.save()
        # undefined lop target:
        indicator11 = self.add_indicator(program1)
        indicator11.target_frequency = Indicator.LOP
        # has a result:
        evidence11 = w_factories.DocumentationFactory()
        i_factories.CollectedDataFactory(
            indicator=indicator11,
            date_collected=datetime.date(2016, 4, 1),
            achieved=250,
            evidence=evidence11
        )
        indicator11.save()
        # defined annual target:
        indicator12 = self.add_indicator(program1)
        indicator12.target_frequency = Indicator.ANNUAL
        tp11 = i_factories.PeriodicTargetFactory(
            indicator=indicator12,
            period='year 1',
            start_date=self.program_start_date,
            end_date=self.program_end_date,
            target=400
        )
        evidence12 = w_factories.DocumentationFactory()
        i_factories.CollectedDataFactory(
            indicator=indicator12,
            periodic_target=tp11,
            date_collected=datetime.date(2016, 1, 1),
            achieved=300,
            evidence=evidence12
        )
        indicator12.save()
        program2 = self.get_bare_program()
        program2.name = self.expected_cases[1]['name']
        program2.save()
        indicator21 = self.add_indicator(program2)
        indicator21.target_frequency = Indicator.LOP
        indicator21.lop_target = 10000000
        indicator21.save()
        evidence21 = w_factories.DocumentationFactory()
        i_factories.CollectedDataFactory(
            indicator=indicator21,
            date_collected=datetime.date(2016, 1, 1),
            achieved=300,
            evidence=evidence21
        )
        indicator22 = self.add_indicator(program2)
        indicator22.target_frequency = Indicator.SEMI_ANNUAL
        indicator22.save()
        i_factories.PeriodicTargetFactory(
            indicator=indicator22,
            period='semi-year 1',
            start_date=self.program_start_date,
            end_date=datetime.date(2016, 3, 31),
            target=40000
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator22,
            period='semi-year 2',
            start_date=datetime.date(2016, 4, 1),
            end_date=datetime.date(2016, 9, 30),
            target=3000
        )
        indicator23 = self.add_indicator(program2)
        indicator23.target_frequency = Indicator.MID_END
        indicator23.save()
        i_factories.PeriodicTargetFactory(
            indicator=indicator23,
            period=PeriodicTarget.MIDLINE,
            target=5
        )
        i_factories.PeriodicTargetFactory(
            indicator=indicator23,
            period=PeriodicTarget.ENDLINE,
            target=4
        )
        evidence22 = w_factories.DocumentationFactory()
        i_factories.CollectedDataFactory(
            indicator=indicator23,
            date_collected=datetime.date(2016, 1, 1),
            achieved=400,
            evidence=evidence22
        )
        indicator24 = self.add_indicator(program2)
        indicator24.target_frequency = Indicator.EVENT
        indicator24.save()
        i_factories.PeriodicTargetFactory(
            indicator=indicator24,
            period='event 1',
            target=3
        )
        evidence23 = w_factories.DocumentationFactory()
        i_factories.CollectedDataFactory(
            indicator=indicator24,
            date_collected=datetime.date(2016, 1, 1),
            achieved=5,
            evidence=evidence23
        )
        program3 = self.get_bare_program()
        program3.name = self.expected_cases[2]['name']
        program3.save()
        indicator31 = self.add_indicator(program3)
        indicator31.target_frequency = Indicator.TRI_ANNUAL
        indicator31.save()
        i_factories.PeriodicTargetFactory(
            indicator=indicator31,
            period='tri annual 1',
            start_date=datetime.date(2015, 10, 1),
            end_date=datetime.date(2016, 2, 28),
            target=3
        )
        tp32 = i_factories.PeriodicTargetFactory(
            indicator=indicator31,
            period='tri annual 2',
            start_date=datetime.date(2016, 3, 1),
            end_date=datetime.date(2016, 7, 31),
            target=8
        )
        evidence31 = w_factories.DocumentationFactory()
        i_factories.CollectedDataFactory(
            indicator=indicator31,
            periodic_target=tp32,
            date_collected=datetime.date(2016, 1, 1),
            achieved=300,
            evidence=evidence31
        )
        indicator32 = self.add_indicator(program3)
        indicator32.target_frequency = Indicator.MONTHLY
        indicator32.save()
        tp33 = i_factories.PeriodicTargetFactory(
            indicator=indicator32,
            period='month 1',
            start_date=datetime.date(2015, 10, 1),
            end_date=datetime.date(2015, 10, 31),
            target=3
        )
        i_factories.CollectedDataFactory(
            indicator=indicator32,
            date_collected=datetime.date(2016, 1, 1),
            periodic_target=tp33,
            achieved=300,
        )
        indicator33 = self.add_indicator(program3)
        indicator33.target_frequency = Indicator.LOP
        indicator33.lop_target = 4000
        indicator33.save()
        i_factories.CollectedDataFactory(
            indicator=indicator33,
            date_collected=datetime.date(2016, 1, 1),
            achieved=300,
        )
    