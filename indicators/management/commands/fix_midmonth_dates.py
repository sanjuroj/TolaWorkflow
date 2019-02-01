import re
import os
from decimal import Decimal

from django.core.management.base import BaseCommand
from datetime import date, timedelta
import copy
import calendar
from workflow.models import Program
from indicators.models import PeriodicTarget, Indicator

'''
Fixes target periods that were created with mid-month dates.     
'''


class Command(BaseCommand):
    help = """
        Fixes target periods that were created with mid-month dates.
        """

    def add_arguments(self, parser):
        parser.add_argument('--execute', action='store_true')
    #     parser.add_argument('--names')
    #     parser.add_argument('--named_only', action='store_true')

    def handle(self, *args, **options):
        # ***********
        # Creates programs, indicators and results for qa testing
        # ***********
        affected_program_ids = set()

        for program in Program.objects.all():
            program_start = program.reporting_period_start
            program_end = program.reporting_period_end
            if program_start and program_start.day != 1:
                affected_program_ids.add(program.id)
                program.reporting_period_start = program_start.replace(day=1)
            if program_end and (program_end + timedelta(days=1)).day != 1:
                affected_program_ids.add(program.id)
                last_day = \
                    calendar.monthrange(program_end.year, program_end.month)[1]
                program.reporting_period_end = program_end.replace(day=last_day)
            if options['execute']:
                program.save()

        periodic_targets = PeriodicTarget.objects \
            .filter(
                indicator__program__id__in=affected_program_ids,
                indicator__target_frequency__in=Indicator.TIME_AWARE_TARGET_FREQUENCIES,
            )\
            .order_by('end_date')

        indicators = Indicator.objects.filter(program_id__in=affected_program_ids)
        indicators.prefetch_related('periodictargets')
        oddball_indicators = set()
        for indicator in indicators:
            for pt in periodic_targets.filter(indicator__id=indicator.id):
                if not pt.start_date or not pt.end_date:
                    oddball_indicators.add(indicator)
                    continue
                indicator = pt.indicator
                pt_start = pt.start_date
                pt_end = pt.end_date
                try:
                    if pt_start.day != 1:
                        pt.start_date = pt_start.replace(day=1)
                except AttributeError as e:
                    if 'NoneType' in e.message:
                        oddball_indicators.add(indicator)
                    else:
                        raise

                end_test = pt_end + timedelta(days=1)
                try:
                    if end_test.day != 1:
                        pt.end_date = pt_end.replace(day=1) - timedelta(days=1)
                except AttributeError as e:
                    if 'NoneType' in e.message:
                        oddball_indicators.add(indicator)
                    else:
                        raise

                if options['execute']:
                    pt.save()

        affected_programs = Program.objects.filter(id__in=affected_program_ids)
        prog_country = []
        for program in affected_programs:
            countries = ','.join(list(program.country.all().values_list('country', flat=True)))
            prog_country.append('{} {}'.format(countries, program.name.encode('utf-8')))
        print '\n'.join(sorted(prog_country))
        print 'affected programs', len(affected_program_ids)
        print '\n\noddballs\n', "\n".join(['{} ||| {}'.format(
            i.program, i.name.encode('utf-8')) for i in oddball_indicators])
