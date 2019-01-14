""" Proxy models and supporting classes for rollup indicator queries
    Used in Program Page, Home Page, and soon IPTT"""


from indicators.models import (
    Indicator,
    PeriodicTarget,
    CollectedData,
    IndicatorSortingQSMixin,
    IndicatorSortingManagerMixin
)
from indicators.queries import (
    utils,
    targets_queries as tq
)
from django.db import models
from django.utils.functional import cached_property


class MetricsIndicatorQuerySet(models.QuerySet, IndicatorSortingQSMixin):
    """QuerySet for indicators returned for Program Page with annotated metrics"""

    def with_annotations(self, *annotations):
        qs = self.all()
        if 'months' in annotations or 'targets' in annotations:
            # 'months' is for unit testing,
            # 'targets' because program_months is a prerequisite for measuring all_targets_defined
            qs = qs.annotate(program_months=indicator_get_program_months_annotation())
        if 'targets' in annotations:
            # sets all_targets_defined to True/False based on business rules
            qs = qs.annotate(defined_targets=models.Count('periodictargets'))
            defined_targets_filter = indicator_get_defined_targets_filter()
            qs = qs.annotate(
                all_targets_defined=models.Case(
                    models.When(
                        defined_targets_filter,
                        then=models.Value(True)
                    ),
                    default=models.Value(False),
                    output_field=models.BooleanField()
                )
            )
        if 'results' in annotations:
            # result count = count of results associated with indicator:
            qs = qs.annotate(results_count=indicator_results_count_annotation())
        if 'evidence' in annotations:
            # results with evidence count = count of results that have evidence associated
            qs = qs.annotate(results_with_evidence_count=indicator_results_evidence_annotation())
        if 'reporting' in annotations or 'scope' in annotations:
            # reporting indicates whether indicator should be counted towards on-scope reporting
            # note: "reporting" alone is for testing, scope relies on these annotations as a prerequisite
            qs = qs.annotate(lop_actual_progress=utils.indicator_lop_actual_progress_annotation())
            qs = qs.annotate(lop_target_progress=utils.indicator_lop_target_progress_annotation())
            qs = qs.annotate(reporting=utils.indicator_reporting_annotation())
        if 'scope' in annotations:
            qs = qs.annotate(lop_percent_met_progress=utils.indicator_lop_percent_met_progress_annotation())
            qs = qs.annotate(over_under=utils.indicator_over_under_annotation())
        if 'table' in annotations:
            qs = qs.select_related('level')
        return qs


class MetricsIndicatorManager(models.Manager, IndicatorSortingManagerMixin):
    def get_queryset(self):
        return MetricsIndicatorQuerySet(self.model, using=self._db)

    def with_annotations(self, *annotations):
        return self.get_queryset().with_annotations(*annotations)

class MetricsIndicator(Indicator):
    """Indicator for reporting metrics to Program Page and HomePage"""
    class Meta:
        proxy = True

    objects = MetricsIndicatorManager()

    @property
    def has_reported_results(self):
        return self.results_count > 0

    @property
    def all_results_backed_up(self):
        return self.results_count == self.results_with_evidence_count

    @cached_property
    def cached_data_count(self):
        if hasattr(self, 'data_count'):
            return self.data_count
        return self.collecteddata_set.count()

class ResultsIndicatorQuerySet(models.QuerySet):
    def annotated(self):
        qs = self.all()
        # add lop_target_calculated annotation (not used yet, but will replace deprecated lop_target value):
        qs = qs.annotate(lop_target_calculated=utils.indicator_lop_target_calculated_annotation())
        # add lop_actual annotation (for results display):
        qs = qs.annotate(lop_actual=utils.indicator_lop_actual_annotation())
        # add lop_met_real annotation:
        qs = qs.annotate(lop_percent_met=utils.indicator_lop_percent_met_annotation())
        # add is_complete annotation:
        qs = qs.annotate(is_complete=indicator_is_complete_annotation())
        return qs

class ResultsIndicatorManager(models.Manager):
    def get_queryset(self):
        return ResultsIndicatorQuerySet(self.model, using=self._db).annotated()

class ResultsIndicator(Indicator):
    """Indicator for displaying Results in the Results View"""
    class Meta:
        proxy = True

    results_view = ResultsIndicatorManager()

    @property
    def lop_target_active(self):
        """currently points at lop_target field, but this alias will let us move to lop_target_calculated
           when we deprecate the lop_target field"""
        return self.lop_target

    @property
    def annotated_targets(self):
        targets = tq.ResultsTarget.objects.filter(indicator=self)
        return targets.with_annotations()


# utils:

def indicator_get_program_months_annotation():
    """annotates an indicator with the number of months in the associated program
        this annotation is used by the defined_targets_filter"""
    return utils.MonthsCount('program__reporting_period_end', 'program__reporting_period_start')


def indicator_get_defined_targets_filter():
    """returns a set of filters that filter out indicators that do not have all defined targets
        this version is used for an indicator_set that has been annotated with program_months
        (see get_program_months_annotation)"""
    filters = []
    # LOP indicators require a defined lop_target:
    filters.append(models.Q(target_frequency=Indicator.LOP) & models.Q(lop_target__isnull=False))
    # MID_END indicators require 2 defined targets (mid and end):
    filters.append(models.Q(target_frequency=Indicator.MID_END) &
                   models.Q(defined_targets__isnull=False) &
                   models.Q(defined_targets__gte=2))
    # EVENT indicators require at least 1 defined target:
    filters.append(models.Q(target_frequency=Indicator.EVENT) &
                   models.Q(defined_targets__isnull=False) &
                   models.Q(defined_targets__gte=1))
    # TIME_AWARE indicators need a number of indicators defined by the annotation on the program:
    # note the program_months field annotation is required for this annotation to succeed
    for frequency, month_count in utils.TIME_AWARE_FREQUENCIES:
        period_count_filter = models.Q(defined_targets__gte=models.F('program_months') / month_count)
        filters.append(models.Q(target_frequency=frequency) &
                       models.Q(defined_targets__isnull=False) &
                       period_count_filter)
    combined_filter = filters.pop()
    for filt in filters:
        combined_filter |= filt
    return combined_filter


def indicator_results_count_annotation():
    """annotates an indicator queryset with the number of results associated with each indicator"""
    return models.functions.Coalesce(
        models.Subquery(
            CollectedData.objects.filter(
                indicator=models.OuterRef('pk')
                ).order_by().values('indicator').annotate(
                    total_results=models.Count('id')
                ).values('total_results')[:1],
            output_field=models.IntegerField()
        ), 0)


def indicator_results_evidence_annotation():
    """annotates an indicator queryset with the number of results associated with each indicator that have
        either a Documentation or TolaTable as evidence"""
    return models.functions.Coalesce(
        models.Subquery(
            CollectedData.objects.filter(
                indicator=models.OuterRef('pk')
                ).filter(
                    models.Q(evidence__isnull=False) | models.Q(tola_table__isnull=False)
                ).order_by().values('indicator').annotate(
                    total_results=models.Count('id')
                ).values('total_results')[:1],
            output_field=models.IntegerField()
        ), 0)

def indicator_is_complete_annotation():
    """annotates an indicator with a boolean is_complete:
        True if the indicator's program's reporting period is defined and over, otherwise False
    """
    return models.Case(
        models.When(
            models.Q(program__reporting_period_end__lte=models.functions.Now()),
            then=models.Value(True)
        ),
        default=models.Value(False),
        output_field=models.BooleanField()
    )

