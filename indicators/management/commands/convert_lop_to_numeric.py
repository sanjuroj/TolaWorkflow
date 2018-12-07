import re
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import models
from indicators.models import Indicator
from datetime import date



def run_conversion(apps_obj, schema_editor_obj):
    na_values = ['n/a', 'N/A', 'NA', 'None', 'Not define', '-']
    # Print the starting profil of all the LoP target values
    pre_categories = profile_lops(Indicator.objects.all(), na_values)
    print_categories(pre_categories, na_values)

    # profile_lops(IndicatorHistory.objects.all(), na_values)

    print '\n==================== Executing ===========================\n'
    print 'Post execution Counts\n'
    post_categories = profile_lops(Indicator.objects.all(), na_values)
    print_categories(post_categories, na_values, verbose=False)

    # Calculate what the expected final number of interger values should be
    int_should_be = \
        len(pre_categories['percent']['values']) + \
        len(pre_categories['int']['values']) + \
        len(pre_categories['float']['values']) + \
        len(pre_categories['has_separator']['values'])
    if len(post_categories['int']['values']) + len(post_categories['float']['values']) == int_should_be:
        print 'Integer/float counts are as expected'
    else:
        print 'Integer/float counts are off!  Exepected final database value of {} (sum of int, percent, has_separator counts) but final value is {}' \
            .format(int_should_be, len(post_categories['int']['values']))

    # Calculate what the expected final number of null values should be
    null_should_be = \
        len(pre_categories['empty_string']['values']) + \
        len(pre_categories['null']['values']) + \
        len(pre_categories['N/A']['values']) + \
        len(pre_categories['other']['values']) + \
        len(pre_categories['small']['values']) + \
        len(pre_categories['zero']['values'])
    if len(post_categories['null']['values']) == null_should_be:
        print 'Null counts are as expected'
    else:
        print 'Null counts are off!  Exepected final database value of {} (sum of null, N/A, empty strings, and none-of-the-above counts) but final value is {}' \
            .format(null_should_be, len(post_categories['null']['values']))


# Categorize the lop_target field values and covert to a Decimal field if possible.
def profile_lops(queryset, na_values):

    categories = {
        'empty_string': {'values': [], 'label': 'Empty String'},
        'zero': {'values': [], 'label': 'Zero'},
        'null': {'values': [], 'label': 'Null in DB'},
        'N/A': {'values': [], 'label': 'Entered N/A'},
        'int': {'values': [], 'label': 'Integer'},
        'float': {'values': [], 'label': 'Float'},
        'small': {'values': [], 'label': '<.01'},
        'percent': {'values': [], 'label': 'Percent'},
        'has_separator': {'values': [], 'label': 'Number with comma/space'},
        'other': {'values': [], 'label': 'Other'},
    }

    for indicator in queryset:

        try:
            target = indicator.lop_target_old.strip()
        except AttributeError:
            if indicator.lop_target_old is None:
                categories['null']['values'].append(indicator.lop_target_old)
                continue
            else:
                raise

        # Set the generic text for when a value's text representation is preserved in the rationale field.
        # If rationale text already exists, preserve it.
        rationale_text = '{} UPDATE:  TolaActivity no longer accepts non-numeric values in the Life of Program (LOP) target field.  The original LoP target value was: {}.' \
            .format(date.today(), indicator.lop_target_old.encode('utf-8'))
        if indicator.rationale_for_target:
            rationale_text = '[' + rationale_text + '] {}'.format(indicator.rationale_for_target.encode('utf-8'))

        if target == '0':
            categories['zero']['values'].append(target)
            indicator.lop_target = None
            indicator.rationale_for_target = rationale_text
            indicator.save()
            continue

        try:
            int(target)
            indicator.lop_target = indicator.lop_target_old
            categories['int']['values'].append(target)
            continue
        except:
            pass

        try:
            decimal_value = Decimal(target)
            if decimal_value < .01:
                indicator.lop_target = None
                indicator.rationale_for_target = rationale_text
                categories['small']['values'].append(target)
                indicator.save()
            else:
                indicator.lop_target = indicator.lop_target_old
                categories['float']['values'].append(target)
            continue
        except:
            pass

        if target == '':
            categories['empty_string']['values'].append(target)
            indicator.lop_target = None
        elif target in na_values:
            categories['N/A']['values'].append(target)
            indicator.lop_target = None
            indicator.rationale_for_target = rationale_text

        elif re.search('^\d+%$', target):
            match = re.search('^(\d+)%$', target)
            indicator.lop_target = Decimal(match.group(1))
            categories['percent']['values'].append(
                'id:{}, {} -> {}'.format(indicator.pk, target.encode('utf-8'), Decimal(match.group(1))))
        elif re.search('^[\d,]+$', target) and number_has_separator(target):
            new_target = target.replace(',', '')
            categories['has_separator']['values'].append(
                'id:{}, {} -> {}'.format(indicator.pk, target.encode('utf-8'), new_target))
            indicator.lop_target = Decimal(new_target)
        elif re.search('^[\d\s]+$', target) and number_has_separator(target, sep=' '):
            new_target = target.replace(' ', '')
            categories['has_separator']['values'].append(
                'id:{}, {} -> {}'.format(indicator.pk, target.encode('utf-8'), new_target))
            indicator.lop_target = Decimal(new_target)
        else:
            categories['other']['values'].append('id:{}, {} -> None'.format(indicator.pk, target.encode('utf-8')))
            indicator.lop_target = None
            indicator.rationale_for_target = rationale_text

        indicator.save()

    return categories


def print_categories(categories, na_values, verbose=True):
    if verbose:
        for key in ['percent', 'has_separator', 'other']:
            print '\n+++++++++++++++++++++++++%s+++++++++++++++++++++++++\n' % key
            print '\n'.join(categories[key]['values'])

        print '\n+++++++++++++++++++++++++++++++++++++++++++++++++++\n'
    categorized_total = sum([len(category['values']) for category in categories.values()])

    print 'categorized sum', categorized_total
    print 'indicator count', Indicator.objects.count()
    print 'Values considered as N/A: ', ', '.join(na_values)
    print 'Count of programs with end dates of < 1 yr ago and unparsable lop_targets:'
    print 'Category counts:'
    for key, values in categories.iteritems():
        print '  %s: %s' % (categories[key]['label'], len(categories[key]['values']))


def number_has_separator(target, sep=','):
    # Check if number is separated into groups of three digits, except for the first group, which can
    # have fewer than three.
    pieces = target.split(sep)
    return len(pieces[0]) <= 3 and all([len(val) == 3 for val in pieces[1:]])


# Need this model to provide entry to the historicalindicator table.  If we don't clear that out as well,
# the migration won't run.
# class IndicatorHistory(models.Model):
#     lop_target = models.CharField(max_length=255)
#     rationale_for_target = models.TextField()
#     history_id = models.IntegerField(primary_key=True)
#
#     class Meta:
#         managed = False
#         db_table = 'indicators_historicalindicator'


class Command(BaseCommand):
    help = """
        Converts Indicator lop_target field from Char to Decimal.  Characterizes the text types and converts as 
        many as practicable to Decimal, sets the rest to null.  Mirrors changes to indicator table in the 
        historicalindicator table.
        """

    def add_arguments(self, parser):
        parser.add_argument(
            '--execute', action='store_true', help='Use if you want to execute the changes')

    def handle(self, *args, **options):
        run_conversion("a", "b")
