import sys
import math
import random
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from indicators.models import Indicator, CollectedData, PeriodicTarget, Level
from workflow.models import Program, Country, Documentation, Organization
from indicators.views.views_indicators import generate_periodic_targets
from indicators.views.views_reports import IPTT_ReportView

# TODO: why is no evidence turn into no results?

class Command(BaseCommand):
    help = """
        Setup targets for indicators by reading a CSV file
        """

    def add_arguments(self, parser):
        parser.add_argument('--clean', action='store_true')
        parser.add_argument('--clean_tolaland', action='store_true')
        parser.add_argument('--names')
        parser.add_argument('--named_only', action='store_true')

    def handle(self, *args, **options):
        # ***********
        # Creates programs, indicators and results for qa testing
        # ***********

        org = Organization.objects.get(id=1)
        country, created = Country.objects.get_or_create(
            country='Tolaland', defaults={
                'latitude': 21.4, 'longitude': -158, 'zoom': 6, 'organization': org, 'code': 'TO'})
        if options['clean_tolaland']:
            country = Country.objects.get(country='Tolaland')
            country.delete()
            sys.exit()
        if options['clean']:
            programs = Program.objects.filter(name__contains='QA Program -')
            print "Delete these programs?\n{}".format('\n'.join(p.name for p in programs))
            confirm = raw_input('[yes/no]: ')
            # confirm = 'yes'
            if confirm == 'yes':
                for program in programs:
                    print 'Deleting program:', program
                    for indicator in program.indicator_set.all():
                        indicator.delete()
                    program.delete()
                sys.exit()
            else:
                print '\nPrograms not deleted'
                sys.exit()

        main_start_date = (date.today() + relativedelta(months=-18)).replace(day=1)
        main_end_date = (main_start_date + relativedelta(months=+32)).replace(day=1) - timedelta(days=1)

        # Create a program whose end date has passed ond one whose start date is in the future
        passed_end_date = main_start_date - timedelta(days=1)
        passed_start_date = (passed_end_date + relativedelta(months=-19)).replace(day=1)
        future_start_date = (date.today() + relativedelta(months=6)).replace(day=1)
        future_end_date = (future_start_date + relativedelta(months=19)).replace(day=28)
        future_end_date = (future_end_date + relativedelta(days=5)).replace(day=1)


        all_params_base = []
        for direction in (Indicator.DIRECTION_OF_CHANGE_POSITIVE, Indicator.DIRECTION_OF_CHANGE_NEGATIVE):
            for uom_type in (Indicator.NUMBER, Indicator.PERCENTAGE):
                for freq in Indicator.TARGET_FREQUENCIES:
                    for is_cumulative in (True, False):
                        # Don't create indicators that are LoP|cumulative or percent|non-cumulative
                        # since we don't support those combinations
                        if (freq[0] == Indicator.LOP and is_cumulative) or \
                                (uom_type == Indicator.PERCENTAGE and not is_cumulative):
                            continue
                        all_params_base.append({'freq': freq[0], 'uom_type': uom_type, 'is_cumulative': is_cumulative,
                         'direction': direction, 'null_level': None})

        short_param_base = [
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': None},
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': None},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NEGATIVE, 'null_level': None},
            {'freq': Indicator.LOP, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.LOP, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
            {'freq': Indicator.EVENT, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': None},
        ]

        # Create programs for specific people

        if options['names']:
            tester_names = options['names'].split(',')
        else:
            tester_names = ['Emily', 'Hanna', 'Marie', 'Jenny', 'Rickie']

        for t_name in tester_names:
            program_name = 'QA Program - {}'.format(t_name)
            program = self.create_program(main_start_date, main_end_date, country, program_name)
            print 'Creating Indicators for {}'.format(Program.objects.get(id=program.id))
            self.create_indicators(program.id, all_params_base)

        if options['named_only']:
            sys.exit()

        # program_id = self.create_program(
        #     passed_start_date, passed_end_date, country, 'QA Program -- Ghost of Programs Past')
        # self.create_full_indicator_set(program_id)

        print 'Creating ghost of programs future'

        future_program_params = [
            {'freq': Indicator.ANNUAL, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'results'},
            {'freq': Indicator.QUARTERLY, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NEGATIVE, 'null_level': 'results'},
            {'freq': Indicator.EVENT, 'uom_type': Indicator.PERCENTAGE, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'results'},
            {'freq': Indicator.LOP, 'uom_type': Indicator.NUMBER, 'is_cumulative': False,
             'direction': Indicator.DIRECTION_OF_CHANGE_NONE, 'null_level': 'results'},
            {'freq': Indicator.MID_END, 'uom_type': Indicator.NUMBER, 'is_cumulative': True,
             'direction': Indicator.DIRECTION_OF_CHANGE_POSITIVE, 'null_level': 'results'},
        ]

        program = self.create_program(future_start_date, future_end_date, country, 'QA Program --- Ghost of Programs Future')
        self.create_indicators(program.id, future_program_params)

        # # Create program with lots of indicators
        # program_id = self.create_program(
        #     main_start_date, main_end_date, country, 'QA Program -- I Love Indicators So Much')
        # print 'Creating program with many indicators'
        # self.create_indicators(program_id, all_params_base)
        # print 'Creating moar indicators'
        # moar_indicator_ids = self.create_full_indicator_set(program_id, all_params_base, 'moar1')
        # moar_indicator_ids.extend(self.create_full_indicator_set(program_id, all_params_base, 'moar2'))
        # moar_indicator_ids.extend(self.create_full_indicator_set(program_id, all_params_base, 'moar3'))


        print 'Creating program with all the things'
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- All the things!')
        self.create_indicators(program.id, all_params_base)

        # Create programs with various levels of no data indicators
        print 'Creating null program with no indicators'
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Indicators Here')

        print 'Creating null program with no targets'
        long_null_levels = ['targets'] * len(all_params_base)
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Targets Here')
        fail_message = self.set_null_levels(all_params_base, long_null_levels, program.name)
        if fail_message:
            print fail_message
            program.delete()
        else:
            self.create_indicators(program.id, all_params_base)

        print 'Creating null program with no results'
        long_null_levels = ['results'] * len(all_params_base)
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Results Here')
        fail_message = self.set_null_levels(all_params_base, long_null_levels, program.name)
        if fail_message:
            print fail_message
            program.delete()
        else:
            self.create_indicators(program.id, all_params_base)

        print 'Creating null program with no evidence'
        long_null_levels = ['evidence'] * len(all_params_base)
        program = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Evidence Here')
        fail_message = self.set_null_levels(all_params_base, long_null_levels, program.name)
        if fail_message:
            print fail_message
            program.delete()
        else:
            self.create_indicators(program.id, all_params_base)
        # print 'Creating null program with no targets'
        # null_id = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Targets Here')
        # self.create_full_indicator_set(null_id, null_level=self.NULL_LEVELS['TARGETS'])
        #
        # print 'Creating null program with no results'
        # null_id = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Results Here')
        # self.create_full_indicator_set(null_id, null_level=self.NULL_LEVELS['RESULTS'])
        #
        # print 'Creating null program with no evidence'
        # null_id = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Evidence Here')
        # self.create_full_indicator_set(null_id, null_level=self.NULL_LEVELS['EVIDENCE'])

        short_null_levels = [
            None, None, 'results', 'targets', None, 'results', 'evidence', 'evidence', 'targets', None
        ]

        short_programs = [
            ('QA Program - PaQ', False),
            ('QA Program -- Small Indicator Set', False),
            ('QA Program -- Multi-country Program', True)
        ]
        for program_tuple in short_programs:
            print 'Creating {}'.format(program_tuple[0])
            program = self.create_program(main_start_date, main_end_date, country, program_tuple[0], program_tuple[1])
            fail_message = self.set_null_levels(short_param_base, short_null_levels, program.name)
            if fail_message:
                print fail_message
                program.delete()
            else:
                self.create_indicators(program.id, short_param_base)


        # print 'Creating partial indicator set'
        # program_id = self.create_program(main_start_date, main_end_date, country, 'QA Program -- Small Indicator Set')
        # self.create_indicators(program_id, short_param_base)
        #
        # print 'Creating partial indicator set with multiple countries'
        # program_id = self.create_program(
        #     main_start_date, main_end_date, country, 'QA Program -- Multi-country', multi_country=True)
        # self.create_indicators(program_id, short_param_base)

    @staticmethod
    def create_program(start_date, end_date, country, name, multi_country=False):
        program = Program.objects.create(**{
            'name': name,
            'reporting_period_start': start_date,
            'reporting_period_end': end_date,
            'funding_status': 'Funded',
            'gaitid': 'fake_gait_id_{}'.format(random.randint(1,9999)),
        })
        program.country.add(country)
        if multi_country:
            country2 = Country.objects.get(country="United States")
            program.country.add(country2)
        return program

    @staticmethod
    def set_null_levels(param_base, null_levels, program_name):
        if len(param_base)  != len(null_levels):
            return 'Could not create {}.  Null level array length did not match indicator count'.format(program_name)
        for i, params in enumerate(param_base):
            params['null_level'] = null_levels[i]
        return False

    @staticmethod
    def make_targets(program, indicator):
        if indicator.target_frequency == Indicator.LOP:
            PeriodicTarget.objects.create(**{
                'indicator': indicator,
                'customsort': 1,
                'edit_date': timezone.now(),
                'period': 'LOP target',
                })
            return

        if indicator.target_frequency == Indicator.EVENT:
            for i in range(3):
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Event {}'.format(i + 1),
                })
            return

        num_periods = IPTT_ReportView._get_num_periods(
            program.reporting_period_start, program.reporting_period_end, indicator.target_frequency)
        if indicator.target_frequency == Indicator.LOP:
            print 'lop num_periods'
        targets_json = generate_periodic_targets(
            tf=indicator.target_frequency, start_date=program.reporting_period_start, numTargets=num_periods)
        for i, pt in enumerate(targets_json):
            if indicator.target_frequency in [Indicator.LOP, Indicator.MID_END]:
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Period {}'.format(i+1),
                })
            else:
                PeriodicTarget.objects.create(**{
                    'indicator': indicator,
                    'customsort': i,
                    'edit_date': timezone.now(),
                    'period': 'Period {}'.format(i+1),
                    'start_date': pt['start_date'],
                    'end_date': pt['end_date'],
                })

    @staticmethod
    def calc_increment(target, period_count):
        return int(math.ceil((target/period_count)/10)*10)

    def create_indicators(self, program_id, param_sets, indicator_suffix=''):
        indicator_ids = []
        program = Program.objects.get(id=program_id)
        frequency_labels = {
            Indicator.LOP: 'LoP only',
            Indicator.MID_END: 'Midline and endline',
            Indicator.EVENT: 'Event',
            Indicator.ANNUAL: 'Annual',
            Indicator.SEMI_ANNUAL: 'Semi-annual',
            Indicator.TRI_ANNUAL: 'Tri-annual',
            Indicator.QUARTERLY: 'Quarterly',
            Indicator.MONTHLY: 'Monthly',
        }
        uom_labels = {
            Indicator.NUMBER: 'Number (#)',
            Indicator.PERCENTAGE: "Percentage (%)",
        }
        direction_labels = {
            Indicator.DIRECTION_OF_CHANGE_NONE: "Direction of change NA",
            Indicator.DIRECTION_OF_CHANGE_POSITIVE: "Increase (+)",
            Indicator.DIRECTION_OF_CHANGE_NEGATIVE: "Decrease (-)",
        }
        time_aware_frequencies = (
            Indicator.ANNUAL,
            Indicator.SEMI_ANNUAL,
            Indicator.TRI_ANNUAL,
            Indicator.QUARTERLY,
            Indicator.MONTHLY,
        )

        # Keep track of results and evidence created across the whole programs so we can skip them periodically
        result_count = 0
        evidence_count = 0
        result_skip_mod = 2
        evidence_skip_mod = 2

        for n, params in enumerate(param_sets):

            if params['is_cumulative']:
                cumulative_text = 'Cumulative'
            else:
                cumulative_text = 'Non-cumulative'

            null_text = '| No {}'.format(params['null_level']) if params['null_level'] else ''

            indicator_name = '{} | {} | {} | {} {}'.format(
                frequency_labels[params['freq']],
                uom_labels[params['uom_type']],
                direction_labels[params['direction']],
                cumulative_text,
                null_text,
            )

            frequency = params['freq']
            if params['null_level'] == 'targets':
                frequency = None

            levels = Level.objects.values_list('id', flat=True)

            # Finally, create the indicator
            indicator = Indicator(
                name=indicator_name + ' | ' +indicator_suffix,
                is_cumulative=params['is_cumulative'],
                target_frequency=frequency,
                unit_of_measure='This is a UOM',
                baseline=0,
                unit_of_measure_type=params['uom_type'],
                direction_of_change=params['direction'],
                program=program,
                level=Level.objects.get(id=levels[n % len(levels)])
            )
            indicator.save()
            indicator_ids.append(indicator.id)

            if params['null_level'] == 'targets':
                continue
            self.make_targets(program, indicator)
            periodic_targets = PeriodicTarget.objects.filter(indicator__id=indicator.id)

            # Different combinations of UOM type, direction of change and cummulativeness require
            # different inputs.
            if params['uom_type'] == Indicator.NUMBER:
                if params['direction'] == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                    if params['is_cumulative']:
                        target_start = 100
                        target_increment = target_start
                        achieved_start = 90
                        achieved_increment = achieved_start
                    else:
                        target_start = 100
                        target_increment = target_start
                        achieved_start = 90
                        achieved_increment = achieved_start
                else:
                    if params['is_cumulative']:
                        target_start = 500
                        target_increment = -int(math.floor((target_start/len(periodic_targets))/10)*10)
                        achieved_start = 400
                        achieved_increment = target_increment-2
                    else:
                        target_start = 500
                        target_increment = -int(math.floor((target_start/len(periodic_targets))/10)*10)
                        achieved_start = 400
                        achieved_increment = target_increment-2
            else:
                if params['direction'] == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                    # Don't need to check cumulative because we don't really handle it
                    target_start = 5
                    target_increment = 5
                    achieved_start = 4
                    achieved_increment = 5
                else:
                    # Don't need to check cumulative because we don't really handle it
                    target_start = 90
                    target_increment = max(-math.floor(target_start/len(periodic_targets)), -2)
                    achieved_start = 95
                    achieved_increment = target_increment - 1

            lop_target = 0
            day_offset = timedelta(days=2)
            for i, pt in enumerate(periodic_targets):
                # Create the target amount (the PeriodicTarget object has already been created)
                pt.target = target_start + target_increment * i
                pt.save()

                if params['is_cumulative']:
                    lop_target = pt.target
                else:
                    lop_target += pt.target

                # Users shouldn't put in results with a date in the future, so neither should we.
                if pt.start_date and date.today() < pt.start_date + day_offset:
                    continue

                # Skip creating a result if the null_level is result or if
                # the number of results has reached the arbitrary skip point.
                # Testing if i is 0 to advance the count because the first period doesn't
                # constitute a skipable period, it should always be populated (by request of testers).
                if i != 0:
                    result_count += 1
                if result_count % result_skip_mod == result_skip_mod - 1 and i != 0:
                    continue
                if params['null_level'] == 'results':
                    continue

                # Now create the Results and their related Records
                if pt.start_date:
                    date_collected = pt.start_date + day_offset
                else:
                    date_collected = date.today()
                cd = CollectedData(
                    periodic_target=pt,
                    indicator=indicator,
                    program=program,
                    achieved=achieved_start + achieved_increment * i,
                    date_collected=date_collected)
                cd.save()

                if i == 0:
                    cd2 = CollectedData(
                        periodic_target=pt,
                        indicator=indicator,
                        program=program,
                        achieved=achieved_start + int(achieved_increment * .5),
                        date_collected=date_collected + timedelta(days=2))
                    cd2.save()

                evidence_count += 1
                if evidence_count % evidence_skip_mod == evidence_skip_mod - 1:
                    continue
                if params['null_level'] == 'evidence':
                    continue
                document = Documentation.objects.create(
                    program=program, name='Doc for CDid {}'.format(cd.id), url='http://my/doc/here/')
                cd.evidence = document
                cd.save()

                if i == 0:
                    document2 = Documentation.objects.create(
                        program=program, name='Doc for CDid {}'.format(cd.id), url='http://my/doc/here/')
                    cd2.evidence = document2
                    cd2.save()

            indicator.lop_target = lop_target
            indicator.save()

        return indicator_ids
