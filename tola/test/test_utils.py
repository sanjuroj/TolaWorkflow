import dateutil
import datetime

from factory import Sequence

from django.test import TestCase, RequestFactory, Client
from django.utils import timezone

from factories import UserFactory
from factories.indicators_models import IndicatorFactory, PeriodicTargetFactory
from factories.workflow_models import ProgramFactory, TolaUserFactory, CountryFactory
from indicators.models import Indicator, PeriodicTarget, CollectedData
from indicators.views.views_reports import IPTT_ReportView
from indicators.views.views_indicators import generate_periodic_targets


class TestBase(TestCase):
    fixtures = ['indicatortype.json', 'levels.json']

    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest", username="IC")
        self.user.set_password('password')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.request_factory = RequestFactory()
        self.country = self.tola_user.country
        self.program = ProgramFactory(
            funding_status='Funded', reporting_period_start='2016-03-01', reporting_period_end='2020-05-01')
        self.program.country.add(self.country)
        self.program.save()
        self.indicator = IndicatorFactory(
            program=self.program, unit_of_measure=Indicator.NUMBER, is_cumulative=False,
            direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.ANNUAL)

        self.client = Client()
        self.client.login(username="IC", password='password')


def generate_core_indicator_data(c_params=None, p_count=3, i_count=4):
    """
    Create up to 5 countries and an arbitrary number of related programs and indicators
    """
    if c_params is None:
        c_params = [
            ('Colombia', 'CO'),
            ('Tunisia', 'TN'),
        ]

    program_ids = []
    indicator_ids = []
    for i in range(len(c_params)):
        country = CountryFactory(country=c_params[i][0], code=c_params[i][1])
        programs = ProgramFactory.create_batch(
            p_count, countries=[country], name=Sequence(lambda n: 'Program %s %s' % (country.code, n)),
        )
        for p in programs:
            program_ids.append(p.id)
            indicators = IndicatorFactory.create_batch(
                i_count, program=p, unit_of_measure=Indicator.NUMBER, is_cumulative=False,
                direction_of_change=Indicator.DIRECTION_OF_CHANGE_NONE, target_frequency=Indicator.ANNUAL)
            indicator_ids = [i.id for i in indicators]
            p.indicator_set.add(*indicators)

    return program_ids, indicator_ids


def create_collecteddata(indicator_ids, data_values):
    # TODO: enable wrapping of target creation to handle mismatch between target and indicator counts
    """
    The data_values parameter should be an ordered iterable (OI) of an OI of dicts, as shown in the example below, and
    the dicts should have the structure provided in the example.  Each element of the second level OI represents
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
    """

    indicator_index = 0

    for iid in indicator_ids:

        indicator = Indicator.objects.get(pk=iid)
        program = indicator.program.first()
        make_targets(program, indicator)
        periodic_targets = PeriodicTarget.objects.filter(indicator=indicator)

        pt_index = 0
        for pt in periodic_targets:
            pt.target = data_values[indicator_index][pt_index]['target']
            pt.save()

            for i, cd in enumerate(data_values[indicator_index][pt_index]['collected_data']):
                cd_date = pt.start_date + datetime.timedelta(days=2+i)
                CollectedData.objects.create(
                    periodic_target=pt, date_collected=cd_date, achieved=cd, indicator=indicator)
            pt_index += 1

        indicator_index += 1


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
