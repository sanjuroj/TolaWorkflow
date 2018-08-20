import random

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


class PTValues(object):

    def __init__(self, target=0, collected_data=None):
        self.target = target
        self.collected_data = collected_data or []

    @property
    def collected_data_sum(self):
        return sum(self.collected_data)


class IndicatorValues(object):

    def __init__(self, periodic_targets=None, name=random.randint(1, 10)):
        self.name = name
        self.periodic_targets = periodic_targets or []

    @property
    def target_sum(self):
        return sum([pt.target for pt in self.periodic_targets])

    @property
    def collected_data_sum(self):
        return sum([pt.collected_data_sum for pt in self.periodic_targets])

    def __unicode__(self):
        return '%s, %s periodic targets' % (self.name, len(self.periodic_targets))

    def __str__(self):
        return unicode(self).encode('utf-8')
