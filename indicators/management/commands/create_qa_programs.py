import sys
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from indicators.models import Indicator, CollectedData, PeriodicTarget
from workflow.models import Program, Country, Documentation
from indicators.views.views_indicators import generate_periodic_targets
from indicators.views.views_reports import IPTT_ReportView


class Command(BaseCommand):
    help = """
        Setup targets for indicators by reading a CSV file
        """

    def add_arguments(self, parser):
        parser.add_argument('--clean', action='store_true')
        parser.add_argument('--names')

    def handle(self, *args, **options):
        # ***********
        # Creates programs, indicators and results for qa testing
        # ***********

        # levels at which there should be no data
        self.NULL_LEVELS = {
            'INDICATORS': 1,
            'TARGETS': 2,
            'RESULTS': 3,
            'EVIDENCE': 4,
        }


        country, created = Country.objects.get_or_create(
            country='Tolaland', defaults={'latitude': 21.4, 'longitude':-158, 'zoom': 6})
        if options['clean']:
            programs = Program.objects.filter(name__contains='QA Program')
            print "Delete these programs?\n{}".format('\n'.join(p.name for p in programs))
            confirm = raw_input('[yes/no]: ')
            # confirm = 'yes'
            if confirm == 'yes':
                for program in programs:
                    print 'Deleting program:', program
                    for indicator in program.indicator_set.all():
                        indicator.delete()
                    program.delete()
                country = Country.objects.get(country='Tolaland')
                country.delete()
                sys.exit()

        if options['names']:
            tester_names = options['names'].split(',')
        else:
            tester_names = ['Emily', 'Hanna', 'Marie', 'Jenny']

        main_start_date = (date.today() + relativedelta(months=-18)).replace(day=1)
        main_end_date = (main_start_date + relativedelta(months=+32)).replace(day=1) - timedelta(days=1)

        # Create programs for specific people
        program_ids = []
        for t_name in tester_names:
            program_name =  'QA Program - {}'.format(t_name)
            print 'Creating {}'.format(program_name)
            program_ids.append(self.create_program(main_start_date, main_end_date, country, program_name))

        # Create a program whose end date has passed ond one whose start date is in the future
        passed_end_date = main_start_date - timedelta(days=1)
        passed_start_date = (passed_end_date + relativedelta(months=-19)).replace(day=1)
        future_start_date = main_end_date + timedelta(days=1)
        future_end_date = (future_start_date + relativedelta(months=+20)).replace(day=1) - timedelta(days=1)
        program_ids.append(self.create_program(
            passed_start_date, passed_end_date, country, 'QA Program -- Ghost of Programs Past'))
        program_ids.append(self.create_program(
            future_start_date, future_end_date, country, 'QA Program -- Ghost of Programs Future'))

        # Create program with lots of indicators
        crazy_indicators_program_id = (self.create_program(
            main_start_date, main_end_date, country, 'QA Program -- I Love Indicators So Much'))
        program_ids.append(crazy_indicators_program_id)
        for program_id in program_ids:
            print 'Creating Indicators for {}'.format(Program.objects.get(id=program_id))
            indicator_ids = self.create_indicators(program_id)
            # print '{} indids: {}'.format(len(indicator_ids), indicator_ids)

        print 'Creating moar indicators'
        moar_indicator_ids = self.create_indicators(crazy_indicators_program_id, 'moar1')
        moar_indicator_ids.extend(self.create_indicators(crazy_indicators_program_id, 'moar2'))
        moar_indicator_ids.extend(self.create_indicators(crazy_indicators_program_id, 'moar3'))
        print 'moar indids: {}:'.format(len(moar_indicator_ids))

        # Create programs with various levels of no data indicators
        print 'Creating null program with no indicators'
        self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Indicators Here')

        print 'Creating null program with no targets'
        null_id = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Targets Here')
        null_indicator_ids = self.create_indicators(null_id, null_level=self.NULL_LEVELS['TARGETS'])

        print 'Creating null program with no results'
        null_id = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Results Here')
        null_indicator_ids = self.create_indicators(null_id, null_level=self.NULL_LEVELS['RESULTS'])

        print 'Creating null program with no evidence'
        null_id = self.create_program(main_start_date, main_end_date, country, 'QA Program --- No Evidence Here')
        null_indicator_ids = self.create_indicators(null_id, null_level=self.NULL_LEVELS['EVIDENCE'])

    @staticmethod
    def create_program(start_date, end_date, country, name):
        program = Program.objects.create(**{
            'name': name,
            'reporting_period_start': start_date,
            'reporting_period_end': end_date,
            'funding_status': 'Funded',
            'gaitid': name,
        })
        program.country.add(country)
        return program.id

    def create_indicators(self, program_id, indicator_suffix='', null_level=0):
        if null_level == self.NULL_LEVELS['INDICATORS']:
            return
        indicator_ids = []
        program = Program.objects.get(id=program_id)

        seq = 1
        for direction in (Indicator.DIRECTION_OF_CHANGE_POSITIVE, Indicator.DIRECTION_OF_CHANGE_NEGATIVE):
            for uom_type in Indicator.UNIT_OF_MEASURE_TYPES:
                for freq in Indicator.TARGET_FREQUENCIES:
                    for is_cumulative in (True, False):
                        if is_cumulative:
                            cumulative_text = 'cumulative'
                        else:
                            cumulative_text = 'non-cumulative'
                        indicator_name = '{} | {} | {} | {}'.format(
                            freq[1],
                            uom_type[1],
                            Indicator.DIRECTION_OF_CHANGE[direction-1][1],
                            cumulative_text
                        )
                        indicator = Indicator(
                            name=indicator_name + indicator_suffix,
                            is_cumulative=is_cumulative,
                            target_frequency=freq[0],
                            unit_of_measure_type=uom_type[0],
                            direction_of_change=direction,
                            program=program
                        )
                        indicator.save()
                        indicator_ids.append(indicator.id)

                        seq += 1
                        if null_level == self.NULL_LEVELS['TARGETS']:
                            continue
                        self.make_targets(program, indicator)
                        if null_level == self.NULL_LEVELS['RESULTS']:
                            continue
                        periodic_targets = PeriodicTarget.objects.filter(indicator__id=indicator.id)
                        if uom_type[0] == Indicator.NUMBER:
                            if direction == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                                if is_cumulative:
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
                                if is_cumulative:
                                    target_start = 500
                                    target_increment = -50
                                    achieved_start = 400
                                    achieved_increment = -50
                                else:
                                    target_start = 500
                                    target_increment = -50
                                    achieved_start = 400
                                    achieved_increment = -50
                        else:
                            if direction == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
                                # Don't need to check cumulative because we don't really handle it
                                target_start = 5
                                target_increment = 5
                                achieved_start = 4
                                achieved_increment = 5
                            else:
                                # Don't need to check cumulative because we don't really handle it
                                target_start = 90
                                target_increment = -5
                                achieved_start = 95
                                achieved_increment = -5

                        lop_target = 0
                        for i, pt in enumerate(periodic_targets):
                            pt.target = target_start + target_increment * i
                            pt.save()
                            if pt.start_date:
                                date_collected = pt.start_date + timedelta(days=2)
                            else:
                                date_collected = date.today()
                            cd = CollectedData(
                                periodic_target=pt,
                                indicator=indicator,
                                program=program,
                                achieved=achieved_start + achieved_increment * i,
                                date_collected=date_collected)
                            cd.save()
                            if is_cumulative:
                                lop_target = pt.target
                            else:
                                lop_target += pt.target

                            if null_level == self.NULL_LEVELS['EVIDENCE']:
                                continue
                            document = Documentation.objects.create(
                                program=program, name='Doc for CDid {}'.format(cd.id), url='http://my/doc/here/')
                            cd.evidence = document
                            cd.save()

                        indicator.lop_target = lop_target
                        indicator.save()



        return indicator_ids

    @staticmethod
    def make_targets(program, indicator):
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

