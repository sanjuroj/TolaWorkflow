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
        # for program in Program.objects.all():
        #     program.start_date = None
        #     program.end_date = None
        #     program.save()

        programs = Program.objects.filter(
            Q(gaitid__isnull=False),
            Q(start_date__isnull=True) | Q(end_date__isnull=True)) \
            .order_by('id')
        program_gaitIDs = []
        for program in programs:
            try:
                program_gaitIDs.append(str(int(program.gaitid)))
            except ValueError:
                pass
        base_url = 'https://mcapi.mercycorps.org/gaitprogram/?gaitids='

        response = requests.get(base_url + ','.join(program_gaitIDs))
        responseObj = json.loads(response.content)
        gaitid_map = dict()
        duplicate_ids = []
        for gaitobj in responseObj:
            gaitid = int(gaitobj['gaitid'])
            # Need to handle duplicate gaitids
            if gaitid in gaitid_map:
                del (gaitid_map[gaitid])
                duplicate_ids.append(gaitid)
            elif gaitid not in duplicate_ids:
                gaitid_map[gaitid] = gaitobj

        for program in programs:
            if program.gaitid and (not program.start_date or not program.end_date):
                try:
                    p_gaitid = int(program.gaitid)
                except ValueError:
                    continue

                if p_gaitid in duplicate_ids:
                    print 'ERROR: Multiple programs for program id %s, gaitid %s.' % (program.id, p_gaitid)
                    continue
                elif p_gaitid not in gaitid_map:
                    print 'Warning: Program %s %s (GAIT id %s) not found in GAIT API.' % (
                        program.id, program.name, p_gaitid)
                    continue

                try:
                    program.start_date = dateutil.parser.parse(gaitid_map[p_gaitid]['start_date'])
                    program.reporting_period_start = program.start_date.replace(day=1)
                except TypeError:
                    pass
                try:
                    program.end_date = dateutil.parser.parse(gaitid_map[p_gaitid]['end_date'])
                    next_month = program.end_date.replace(day=28) + datetime.timedelta(days=4)
                    program.reporting_period_end = next_month - datetime.timedelta(days=next_month.day)
                except TypeError:
                    pass
                program.save()

        print '\nThere were %s duplicate gaitids:' % len(duplicate_ids)
        print 'Processed %s programs' % len(programs)
