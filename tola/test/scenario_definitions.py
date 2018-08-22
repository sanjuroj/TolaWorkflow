import random
from indicators.models import Indicator
from factories.indicators_models import IndicatorFactory, PeriodicTargetFactory, CollectedDataFactory
from indicators.views.views_reports import IPTT_ReportView
from indicators.views.views_indicators import generate_periodic_targets
from django.utils import timezone
from indicators.models import PeriodicTarget
from workflow.models import Program

"""
Each element of RESULTS_SCNARIOS should be an ordered iterable (OI) of an OI of dicts, as shown in the example below,
and the dicts should have the structure provided in the example.  Each element of the second level OI represents
an indicator's targets, and as such the number of second level OI's should be same as the count of indicators.
Each dict represents a periodic target and its associated collected data records, so the count of dicts
for each second level OI should match the number of targets for its corresponding indicator.

Example data_values for 2 indicators:

data_values = [
    [
        {'target': 100, 'collected_data': (50, 25, 15)},
        {'target': 100, 'collected_data': (0, 25, 50)},
        {'target': 100, 'collected_data': (50, 25, 15)},
        {'target': 100, 'collected_data': (50, 25, 15)},
    ],
    [
        {'target': 200, 'collected_data': (10, 100, 15)},
        {'target': 200, 'collected_data': (0, 50, 150)},
        {'target': 200, 'collected_data': (60, 35, 15)},
        {'target': 200, 'collected_data': (60, 35, 15)},
    ]
]

RESULTS_SCENARIOS = [
    'VANILLA': [
        [
            {'target': 100, 'collected_data': (50, 25, 15)},
            {'target': 100, 'collected_data': (0, 25, 50)},
            {'target': 100, 'collected_data': (50, 25, 15)},
            {'target': 100, 'collected_data': (50, 25, 15)},
        ],
        [
            {'target': 200, 'collected_data': (10, 100, 15)},
            {'target': 200, 'collected_data': (0, 50, 150)},
            {'target': 200, 'collected_data': (60, 35, 15)},
            {'target': 200, 'collected_data': (60, 35, 15)},
        ]
    ]
]
"""


class PeriodicTargetValues(object):

    def __init__(self, target=0, collected_data=None):
        self.target = target
        self.collected_data = collected_data or []

    @property
    def collected_data_sum(self):
        return sum(self.collected_data)


class IndicatorValues(object):

    def __init__(
            self, periodic_targets, unit_of_measure=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.ANNUAL):
        self.periodic_targets = periodic_targets
        self.is_cumulative = is_cumulative
        self.direction_of_change = direction_of_change
        self.target_frequency = target_frequency

    @property
    def target_sum(self):
        return sum([pt.target for pt in self.periodic_targets])

    @property
    def collected_data_sum(self):
        return sum([pt.collected_data_sum for pt in self.periodic_targets])

    def __unicode__(self):

        return '%s periodic targets' % (len(self.periodic_targets))

    def __str__(self):
        return unicode(self).encode('utf-8')


def instantiate_scenario(program_id, scenario):
    program = Program.objects.get(id=program_id)
    for indicator_value_set in scenario:
        indicator = IndicatorFactory(
            program=program,
            is_cumulative=indicator_value_set.is_cumulative,
            direction_of_change=indicator_value_set.direction_of_change,
            target_frequency=indicator_value_set.target_frequency)
        make_targets(program, indicator)
        periodic_targets = PeriodicTarget.objects.filter(indicator__id=indicator.id)
        for i, pt in enumerate(periodic_targets):
            pt.target = indicator_value_set.periodic_targets[i].target
            pt.save()
            for cd_value in indicator_value_set.periodic_targets[i].collected_data:
                CollectedDataFactory(
                    periodic_target=pt, indicator=indicator, program=program, achieved=cd_value)


def make_targets(program, indicator):
    num_periods = IPTT_ReportView._get_num_periods(
        program.reporting_period_start, program.reporting_period_end, indicator.target_frequency)
    targets_json = generate_periodic_targets(
        tf=indicator.target_frequency, start_date=program.reporting_period_start, numTargets=num_periods)
    for i, pt in enumerate(targets_json):
        PeriodicTargetFactory(
            indicator=indicator,
            customsort=i,
            start_date=pt['start_date'],
            end_date=pt['end_date'],
            edit_date=timezone.now())


scenarios = {}

vanilla = []
pts = [PeriodicTargetValues(target=100, collected_data=(50, 25, 15))]
pts.append(PeriodicTargetValues(target=100, collected_data=(0, 25, 50)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
vanilla.append(IndicatorValues(periodic_targets=pts))
pts = [PeriodicTargetValues(target=200, collected_data=(10, 100, 15))]
pts.append(PeriodicTargetValues(target=200, collected_data=(0, 50, 150)))
pts.append(PeriodicTargetValues(target=200, collected_data=(60, 35, 15)))
pts.append(PeriodicTargetValues(target=200, collected_data=(60, 35, 15)))
pts.append(PeriodicTargetValues(target=200, collected_data=(60, 35, 15)))
vanilla.append(IndicatorValues(periodic_targets=pts))
scenarios['vanilla'] = vanilla
