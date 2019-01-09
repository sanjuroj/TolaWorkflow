""" Utilities to support queries in program_queries and indicator_queries"""

from indicators.models import (
    Indicator,
    CollectedData,
    PeriodicTarget
)
from django.db import models


TIME_AWARE_FREQUENCIES = [
    (Indicator.ANNUAL, 12),
    (Indicator.SEMI_ANNUAL, 6),
    (Indicator.TRI_ANNUAL, 4),
    (Indicator.QUARTERLY, 3),
    (Indicator.MONTHLY, 1)
]

# pylint: disable=W0223
class Round(models.Func):
    """One argument, rounds to integer level (0 decimal places)"""
    function = 'ROUND'
    template = '%(function)s(%(expressions)s, 0)'

# pylint: disable=W0223
class MonthDate(models.Func):
    """takes a date and outputs a YYYYMM format date for period_diff comparison"""
    function = 'DATE_FORMAT'
    template = '%(function)s(%(expressions)s, \'%%%%Y%%%%m\')'


# pylint: disable=W0223
class MonthsCount(models.Func):
    """takes two date fields, finds their value, converts them to MonthDate format, and finds the difference in months

        note: +1 is due to the 'first of the month to end of the month' inclusive month ranges in our dates
        note: wrapping parens due to this field being used in division math"""
    function = 'PERIOD_DIFF'
    template = '(%(function)s(%(expressions)s)+1)'

    def __init__(self, end_date, start_date, **extra):
        if not start_date:
            raise ValueError('two dates required for diff')
        expressions = MonthDate(models.F(end_date)), MonthDate(models.F(start_date))
        super(MonthsCount, self).__init__(*expressions)


def indicator_lop_annotations():
    """generates annotations for LOP target and actual data

    takes into account cumulative/noncumulative and number/percent"""
    # we only want targets that are either time naive or for completed periods:
    data_subquery = CollectedData.objects.filter(
        periodic_target_id=models.OuterRef('pk')
    ).order_by().values('id')
    indicator_targets = PeriodicTarget.objects.annotate(
        data_count=models.Subquery(
            data_subquery.annotate(total=models.Count('achieved')).values('total')[:1],
            output_field=models.IntegerField()
        )
    ).filter(
        models.Q(indicator=models.OuterRef('pk')),
        (
            models.Q(indicator__target_frequency__in=[Indicator.LOP, Indicator.MID_END, Indicator.EVENT]) &
            models.Q(data_count__gt=0)
        ) | models.Q(end_date__lte=models.functions.Now())
    )
    indicator_data = CollectedData.objects.filter(
        models.Q(indicator=models.OuterRef('pk'))
    )
    lop_target_sum = models.Case(
        models.When(
            # the only target for a LOP indicator is the "lop_target" value on the indicator itself:
            target_frequency=Indicator.LOP,
            then=models.ExpressionWrapper(
                models.F('lop_target'),
                output_field=models.FloatField()
            )
        ),
        models.When(
            # cumulative indicator means sort and take the most recent:
            is_cumulative=True,
            then=models.Case(
                # midline/endling and event indicators sort on customsort (with fallbacks)
                models.When(
                    target_frequency__in=[Indicator.MID_END, Indicator.EVENT],
                    then=models.Subquery(
                        indicator_targets.order_by(
                            '-customsort', '-end_date', '-create_date'
                        ).values('target')[:1],
                        output_field=models.FloatField()
                    )
                ),
                # not midline/endline means it's time-aware, sort on end_date:
                default=models.Subquery(
                    indicator_targets.order_by('-end_date').values('target')[:1],
                    output_field=models.FloatField())
                )
        ),
        default=models.Subquery(
            indicator_targets.order_by().values(
                'indicator_id'
            ).annotate(
                total=models.Sum('target')
            ).values('total'),
            output_field=models.FloatField()
        )
    )
    # lop_actual_sum = sum of all the data collected:
    lop_actual_sum = models.Case(
        models.When(
            unit_of_measure_type=Indicator.PERCENTAGE,
            then=Round(
                models.Subquery(
                    indicator_data.order_by(
                        '-date_collected'
                    ).values('achieved')[:1],
                    output_field=models.FloatField()
                    )
                )
            ),
        default=models.Subquery(
            indicator_data.order_by().values(
                'indicator_id'
            ).annotate(
                total=models.Sum('achieved')
            ).values('total'),
            output_field=models.FloatField()
        )
    )
    return {
        'lop_target_sum': lop_target_sum,
        'lop_actual_sum': lop_actual_sum,
    }


def indicator_reporting_annotation():
    """annotation to sort indicators into 'reporting' and 'nonreporting' based on business rules:
        LOP only reports when the program reporting period has ended
        all indicators only report when their targets are defined
        all indicators only report when they have at least one data point (an actual data sum)
        for target_sum and actual_sum business logic see indicator_lop_annotations"""
    return models.Case(
        models.When(
            models.Q(target_frequency=Indicator.LOP) &
            models.Q(program__reporting_period_end__gt=models.functions.Now()),
            then=models.Value(False)
        ),
        models.When(
            models.Q(lop_target_sum__isnull=True) |
            models.Q(lop_target_sum=0),
            then=models.Value(False)
        ),
        models.When(
            lop_actual_sum__isnull=True,
            then=models.Value(False)
        ),
        default=models.Value(True),
        output_field=models.BooleanField()
    )

def indicator_lop_met_real_annotation():
    """for a reporting indicator, determines how close actual values are to target values"""
    return models.Case(
        models.When(
            models.Q(lop_target_sum__isnull=True) |
            models.Q(lop_actual_sum__isnull=True),
            then=models.Value(None)
            ),
        default=models.ExpressionWrapper(
            models.F('lop_actual_sum') / models.F('lop_target_sum'),
            output_field=models.FloatField()
        )
    )


def indicator_over_under_annotation():
    """annotates indicators with how close to on-track they are:
        -1 : under target by a 15% margin
        0 : within 15% of target
        1 : over target by a 15% margin
        None: nonreporting indicator"""
    over_scope = 1 + Indicator.ONSCOPE_MARGIN
    under_scope = 1 - Indicator.ONSCOPE_MARGIN
    return models.Case(
        # None for indicators missing targets or data:
        models.When(
            models.Q(reporting=False) |
            models.Q(lop_met_real__isnull=True),
            then=models.Value(None)
            ),
        models.When(
            # over is negative if DOC is Negative
            models.Q(lop_met_real__gt=over_scope) &
            models.Q(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE),
            then=models.Value(-1)
            ),
        models.When(
            lop_met_real__gt=over_scope,
            then=models.Value(1)
        ),
        models.When(
            # under is positive if DOC is Negative:
            models.Q(lop_met_real__lt=under_scope) &
            models.Q(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE),
            then=models.Value(1)
        ),
        models.When(
            lop_met_real__lt=under_scope,
            then=models.Value(-1)
        ),
        default=models.Value(0),
        output_field=models.IntegerField(null=True)
    )
