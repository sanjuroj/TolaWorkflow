import requests
import json
import dateutil
import datetime
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from workflow.models import Program


class Command(BaseCommand):
    help = """
        Gets the GAIT program start and end dates from mcapi.
        """

    def handle(self, *args, **options):
        base_url = 'https://mcapi.mercycorps.org/gaitprogram/?gaitid='
        # for program in Program.objects.all():
        #     program.start_date = None
        #     program.end_date = None
        #     program.save()

        programs = Program.objects.filter(
            Q(gaitid__isnull=False),
            Q(start_date__isnull=True) | Q(end_date__isnull=True)) \
            .order_by('id')
        print 'Processing %s programs' % len(programs)
        for program in programs:
            if program.gaitid and (not program.start_date or not program.end_date):
                response = requests.get(base_url + str(program.gaitid))
                responseObj = json.loads(response.content)
                if len(responseObj) > 1:
                    print 'ERROR: Multiple programs for program id %s, gaitid %s.' % (program.id, program.gaitid)
                    continue
                elif len(responseObj) < 1:
                    print 'Warning: Program id %s (GAIT id %s) not found in GAIT.' % (program.id, program.gaitid)
                    continue

                try:
                    program.start_date = dateutil.parser.parse(responseObj[0]['start_date'])
                    program.reporting_period_start = program.start_date.replace(day=1)
                except TypeError:
                    pass
                try:
                    program.end_date = dateutil.parser.parse(responseObj[0]['end_date'])
                    program.reporting_period_end = program.end_date.replace(day=1)
                except TypeError:
                    pass
                program.save()
