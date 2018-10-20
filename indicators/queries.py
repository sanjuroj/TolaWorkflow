"""Querymanagers and proxymodels to abstract complex queries on indicator models

"""

from indicators.models import (
    Indicator,
    Level,
    PeriodicTarget,
    CollectedData
)
from django.db import models
from django.db.models.functions import Concat
#from django.db.models import Sum, Avg, Subquery, OuterRef, Case, When, Q, F, Max

class Round(models.Func):
    function = 'ROUND'
    template = '%(function)s(%(expressions)s, 0)'

class IPTTIndicatorQuerySet(models.QuerySet):
    pass

class IPTTIndicatorManager(models.Manager):
    def get_lop_target_annotations(self):
        """generates annotations for LOP target and actual data

        takes into account cumulative/noncumulative and number/percent"""
        indicator_targets = PeriodicTarget.objects.filter(
            indicator=models.OuterRef('pk')
        )
        indicator_data = CollectedData.objects.filter(
            indicator=models.OuterRef('pk')
        )
        lop_target_sum = models.Case(
            models.When(
                is_cumulative=False,
                then=models.Subquery(
                    indicator_targets.order_by().values(
                        'indicator_id'
                    ).annotate(
                        total=models.Sum('target')
                    ).values('total'),
                    output_field=models.FloatField()
                )
            ),
            models.When(
                is_cumulative=True,
                then=models.Subquery(
                    indicator_targets.order_by('-end_date').values('target')[:1],
                    output_field=models.FloatField()))
        )
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

    def get_labeling_annotations(self):
        most_recent_level = Level.objects.filter(indicator__id=models.OuterRef('pk')).order_by('-id')
        return {
            'level_name': models.Subquery(most_recent_level.values('name')[:1])
        }

    def get_queryset(self):
        annotations = self.get_labeling_annotations()
        annotations.update(self.get_lop_target_annotations())
        return super(IPTTIndicatorManager, self).get_queryset().annotate(
            **annotations
        )

class NoTargetsIndicatorManager(IPTTIndicatorManager):

    def period(self, period_name, period_start, period_end):
        return self.get_queryset().period(period_name, period_start, period_end)

    def get_queryset(self):
        qs = super(NoTargetsIndicatorManager, self).get_queryset()
        return qs


class WithTargetsIndicatorManager(IPTTIndicatorManager):
    """Manager for Indicator with PeriodicTargets and CollectedData

    automatically annotates for lop target and actual lop sum of collected data
    also can self-annotate for periodic target and actual sum
    returns % met for the above"""

    def get_target_prefetch(self):
        # inner query to apply target_id to data collected within target range
        target_inner_query = PeriodicTarget.objects.filter(
            indicator_id=models.OuterRef('indicator_id'),
            start_date__lte=models.OuterRef('date_collected'),
            end_date__gte=models.OuterRef('date_collected')
        ).order_by().values('id')[:1]
        # inner query to collect data annotated by target_id
        data_with_periods_non_cumulative = CollectedData.objects.filter(
            indicator_id=models.OuterRef('indicator_id')
        ).annotate(
            target_id=models.Subquery(target_inner_query)
        ).filter(
            target_id=models.OuterRef('id')
        ).order_by().values('target_id')
        data_with_periods_cumulative = CollectedData.objects.filter(
            indicator_id=models.OuterRef('indicator_id'),
            date_collected__lte=models.OuterRef('end_date')
        ).order_by().values('indicator_id')
        # targets with data sums attached
        targets = PeriodicTarget.objects.annotate(
            data_sum=models.Case(
                models.When(
                    indicator__unit_of_measure_type=Indicator.PERCENTAGE,
                    then=models.Subquery(
                        data_with_periods_non_cumulative.order_by(
                            '-date_collected'
                            ).values('achieved')[:1],
                        output_field=models.FloatField()
                    )
                ),
                models.When(
                    indicator__is_cumulative=True,
                    then=models.Subquery(
                        data_with_periods_cumulative.annotate(
                            total=models.Sum('achieved')
                        ).values('total'),
                        output_field=models.FloatField()
                    )
                ),
                default=models.Subquery(
                    data_with_periods_non_cumulative.annotate(
                        total=models.Sum('achieved')
                    ).values('total'),
                    output_field=models.FloatField()
                )
            )
        ).annotate(
            met_real=models.ExpressionWrapper(
                models.F('data_sum')/models.F('target'),
                output_field=models.FloatField()
            ),
            met=models.ExpressionWrapper(
                Concat(Round(models.F('data_sum')*100/models.F('target')), models.Value("%")),
                output_field=models.CharField()
            )
        ).annotate(
            within_target_range=models.Case(
                models.When(
                    met_real__gt=1.15,
                    then=models.Case(
                        models.When(
                            indicator__direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE,
                            then=models.Value(-1)
                        ),
                        default=models.Value(1)
                    )
                ),
                models.When(
                    met_real__lt=0.85,
                    then=models.Case(
                        models.When(
                            indicator__direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE,
                            then=models.Value(1)
                        ),
                        default=models.Value(-1)
                    )
                ),
                models.When(
                    met_real__isnull=True,
                    then=models.Value(None)
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            )
        )
        prefetch = models.Prefetch(
            'periodictargets',
            queryset=targets,
            to_attr='data_targets'
        )
        return prefetch

    def get_queryset(self):
        qs = super(WithTargetsIndicatorManager, self).get_queryset().prefetch_related(
            self.get_target_prefetch()
        )
        return qs

class IPTTIndicator(Indicator):
    SEPARATOR = '/' # this is used by CSV output as a default joiner for multiple values
    class Meta:
        proxy = True

    notargets = NoTargetsIndicatorManager()
    withtargets = WithTargetsIndicatorManager()

    @property
    def lop_met_target(self):
        return str(int(round(float(self.lop_actual_sum)*100/self.lop_target_sum))) + "%"