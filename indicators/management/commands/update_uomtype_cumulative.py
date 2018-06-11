from django.core.management.base import BaseCommand
from django.db.models import Q
from indicators.models import Indicator


class Command(BaseCommand):
    help = """
        Update unit_of_measure and is_cumulative field based on whether indicator name
        contains 'Percent' or '%'.  If it does, change to uom type of percent and is_cumulative to
        true.  Otherwise treat as a non-cumulative number type.
        """

    def handle(self, *args, **options):
        percent_indicators = Indicator.objects.filter(
            Q(name__icontains='percent') | Q(name__contains='%') |
            Q(unit_of_measure__icontains='percent') | Q(unit_of_measure__contains='%')
        )
        contra_percent_indicators = Indicator.objects.exclude(id__in=percent_indicators)

        # Need to do this because the contra_ query above is done with a subquery, which can't
        # be used to update the db.  Keeping contra_ just to check counts.
        number_indicators = Indicator.objects.filter(
            ~Q(name__icontains='percent') & ~Q(name__contains='%') &
            ~Q(unit_of_measure__icontains='percent') & ~Q(unit_of_measure__contains='%')
        )

        percent_indicators.update(unit_of_measure_type=2)
        percent_indicators.update(is_cumulative=1)
        number_indicators.update(unit_of_measure_type=1)
        number_indicators.update(is_cumulative=0)

        print "Updated Percent Indicators:"
        for i in percent_indicators:
            print '%s name=%s, uom=%s' % (i.id, i.name, i.unit_of_measure)

        print '\nTotal indicator count: ', Indicator.objects.count()
        print 'Count with percent/%: ', percent_indicators.count()
        print 'Not-percent count/%: ', number_indicators.count()
        print 'Not-percent count check: ', contra_percent_indicators.count()
