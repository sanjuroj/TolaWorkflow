"""Queries for PeriodicTargets that roll up data for use in Program Page, Home Page, and eventually IPTT"""

from indicators.models import (
    PeriodicTarget,
    CollectedData,
    Indicator
)
from indicators.queries import utils
from django.db import models


class ResultsTargetQuerySet(models.QuerySet):
    def with_annotations(self):
        qs = self.all()
        # add results count annotation (used for is_complete in some cases):
        qs = qs.annotate(results_count=target_results_count_annotation())
        # add is_complete annotation:
        qs = qs.annotate(is_complete=target_is_complete_annotation())
        # add a target_sum annotation (all targets up to and including this one
        #  combined with indicator number type logic):
        qs = qs.annotate(target_sum=target_target_sum_annotation())
        # add an achieved_sum annotation (all results for this target combined with indicator number type logic):
        qs = qs.annotate(achieved=target_achieved_sum_annotation())
        # combine target and achieved to determine percent met:
        qs = qs.annotate(percent_met=target_percent_met_annotation())
        return qs

class ResultsTargetManager(models.Manager):
    def get_queryset(self):
        return ResultsTargetQuerySet(self.model, using=self._db)

class ResultsTarget(PeriodicTarget):
    class Meta:
        proxy = True

    objects = ResultsTargetManager()

def target_results_count_annotation():
    return models.functions.Coalesce(
        models.Subquery(
            CollectedData.objects.filter(
                periodic_target=models.OuterRef('pk')
                ).order_by().values('periodic_target').annotate(
                    total_results=models.Count('id')
                ).values('total_results')[:1],
            output_field=models.IntegerField()
        ), 0)

def target_is_complete_annotation():
    return models.Case(
        models.When(
            models.Q(
                models.Q(indicator__target_frequency=Indicator.LOP) &
                models.Q(indicator__program__reporting_period_end__lte=models.functions.Now())
                ),
            then=models.Value(True)
        ),
        models.When(
            models.Q(
                models.Q(indicator__target_frequency__in=[Indicator.MID_END, Indicator.EVENT]) &
                models.Q(results_count__gt=0)
            ),
            then=models.Value(True)
        ),
        models.When(
            models.Q(
                models.Q(indicator__target_frequency__in=[f[0] for f in utils.TIME_AWARE_FREQUENCIES]) &
                models.Q(end_date__lte=models.functions.Now())
            ),
            then=models.Value(True)
        ),
        default=models.Value(False),
        output_field=models.BooleanField()
    )

def target_target_sum_annotation():
    targets = PeriodicTarget.objects.filter(
        models.Q(indicator=models.OuterRef('indicator_id')) &
        models.Q(
            models.Q(indicator__target_frequency=Indicator.LOP) |
            models.Q(
                models.Q(indicator__target_frequency__in=[f[0] for f in utils.TIME_AWARE_FREQUENCIES]) &
                models.Q(start_date__lte=models.OuterRef('start_date'))
            ) |
            models.Q(
                models.Q(indicator__target_frequency__in=[Indicator.MID_END, Indicator.EVENT]) &
                models.Q(customsort__lte=models.OuterRef('customsort'))
            )
        )
    )
    return models.Case(
        models.When(
            models.Q(
                models.Q(indicator__unit_of_measure_type=Indicator.PERCENTAGE) |
                models.Q(indicator__is_cumulative=True)
                ),
            then=models.Subquery(
                targets.order_by('-start_date').values('target')[:1]
            )
        ),
        default=models.Subquery(
            targets.order_by().values('indicator').annotate(
                target_sum=models.Sum('target')
            ).values('target_sum')[:1]
        ),
        output_field=models.IntegerField()
    )

def target_achieved_sum_annotation():
    return models.Case(
        models.When(
            indicator__unit_of_measure_type=Indicator.PERCENTAGE,
            then=models.Subquery(
                CollectedData.objects.filter(
                    periodic_target=models.OuterRef('pk')
                ).order_by('-date_collected').values('achieved')[:1],
                output_field=models.IntegerField()
            )
        ),
        default=models.Subquery(
            CollectedData.objects.filter(
                periodic_target=models.OuterRef('pk')
            ).order_by().values('periodic_target').annotate(
                results_sum=models.Sum('achieved')
            ).values('results_sum')[:1],
            output_field=models.IntegerField()
        )
    )

def target_percent_met_annotation():
    return models.Case(
        models.When(
            models.Q(
                models.Q(target__isnull=True) &
                models.Q(achieved__isnull=True)
            ),
            then=models.Value(None)
        ),
        default=models.ExpressionWrapper(
            models.F('achieved') / models.F('target'),
            output_field=models.FloatField()
        )
    )