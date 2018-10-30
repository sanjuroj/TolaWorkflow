"""Querymanagers and proxymodels to abstract complex queries on indicator models

"""

import datetime
from indicators.models import (
    Indicator,
    Level,
    PeriodicTarget,
    CollectedData
)
#from datetime import date
from workflow import models as wf_models
from django.db import models
from django.db.models.functions import Concat
from django.utils.functional import cached_property

#pylint disable=W0223
class Round(models.Func):
    function = 'ROUND'
    template = '%(function)s(%(expressions)s, 0)'


class IPTTIndicatorQuerySet(models.QuerySet):
    """This overrides the count method because ONLY_FULL_GROUP_BY errors appear otherwise on this custom query"""
    def count(self):
        return self.values('id').aggregate(total=models.Count('id', distinct=True))['total']


class IPTTIndicatorManager(models.Manager):
    """this is the general manager for all IPTT (annotated) indicators - generates totals over LOP"""
    def get_lop_target_annotations(self):
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
            ) | models.Q(end_date__lte=datetime.date.today())
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

    def get_labeling_annotations(self):
        most_recent_level = Level.objects.filter(indicator__id=models.OuterRef('pk')).order_by('-id')
        return {
            'level_name': models.Subquery(most_recent_level.values('name')[:1])
        }

    def get_reporting_annotations(self):
        reporting = models.Case(
            models.When(
                models.Q(target_frequency=Indicator.LOP) & models.Q(program__reporting_period_end__gt=models.functions.Now()),
                then=models.Value(False)
            ),
            models.When(
                lop_target_sum__isnull=True,
                then=models.Value(False)
            ),
            models.When(
                lop_actual_sum__isnull=True,
                then=models.Value(False)
            ),
            default=models.Value(True),
            output_field=models.BooleanField()
        )
        return {
            'reporting': reporting
        }

    def get_queryset(self):
        annotations = self.get_labeling_annotations()
        annotations.update(self.get_lop_target_annotations())
        reporting_annotations = self.get_reporting_annotations()
        return IPTTIndicatorQuerySet(self.model, using=self._db).annotate(
            **annotations
        ).annotate(
            **reporting_annotations
        ).annotate(
            lop_met_real=models.Case(
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
        ).annotate(
            over_under=models.Case(
                models.When(
                    lop_met_real__isnull=True,
                    then=models.Value(None)
                    ),
                models.When(
                    models.Q(lop_met_real__gt=1.15) &
                    models.Q(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE),
                    then=models.Value(-1)
                    ),
                models.When(
                    lop_met_real__gt=1.15,
                    then=models.Value(1)
                ),
                models.When(
                    models.Q(lop_met_real__lt=0.85) &
                    models.Q(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE),
                    then=models.Value(1)
                ),
                models.When(
                    lop_met_real__lt=0.85,
                    then=models.Value(-1)
                ),
                default=models.Value(0),
                output_field=models.IntegerField(null=True)
            )
        )

class NoTargetsIndicatorManager(IPTTIndicatorManager):

    def periods(self, periods):
        """annotate a query with actual data sums for a set of time periods"""
        period_annotations = {}
        for c, period in enumerate(periods):
            date_range = "{0}-{1}".format(
                period['start_date'].strftime('%Y-%m-%d'),
                period['end_date'].strftime('%Y-%m-%d')
            )
            period_annotations[date_range] = models.Case(
                models.When(
                    unit_of_measure_type=Indicator.PERCENTAGE,
                    then=models.Subquery(
                        CollectedData.objects.filter(
                            indicator_id=models.OuterRef('pk'),
                            date_collected__lte=period['end_date']
                        ).order_by('-date_collected').values('achieved')[:1],
                        output_field=models.FloatField()
                    )),
                default=models.Subquery(
                    CollectedData.objects.filter(
                        indicator_id=models.OuterRef('pk'),
                        date_collected__lte=period['end_date']
                    ).filter(
                        models.Q(date_collected__gte=period['start_date']) |
                        models.Q(indicator__is_cumulative=True)
                    ).order_by().values('indicator_id').annotate(
                        total=models.Sum('achieved')).values('total'),
                    output_field=models.FloatField())
            )
            period_annotations["period_{0}".format(c)] = models.Value(
                date_range, output_field=models.CharField())
        return self.get_queryset().annotate(**period_annotations)

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

class WithMetricsIndicatorManager(IPTTIndicatorManager):
    """queryset annotated to provide counts to the with_metrics Program call"""

    def get_evidence_count(self, qs):
        """annotates qs with evidence_count= # of results that have evidence, and all_results_backed_up=Boolean"""
        data_with_evidence = CollectedData.objects.filter(
            models.Q(indicator_id=models.OuterRef('pk')) |
            models.Q(periodic_target__indicator_id=models.OuterRef('pk')),
            evidence__isnull=False
        ).order_by().values('indicator_id')
        qs = qs.annotate(
            evidence_count=models.functions.Coalesce(
                models.Subquery(
                    data_with_evidence.annotate(
                        total_count=models.Count('date_collected')
                        ).order_by().values('total_count')[:1],
                    output_field=models.IntegerField()
                ), 0)
        )
        qs = qs.annotate(
            all_results_backed_up=models.Case(
                models.When(
                    models.Q(reported_results__isnull=False) &
                    models.Q(evidence_count__isnull=False) &
                    models.Q(reported_results__gt=0) &
                    models.Q(evidence_count=models.F('reported_results')),
                    then=models.Value(True)
                ),
                default=models.Value(False),
                output_field=models.BooleanField()
            )
        )
        return qs

    def get_defined_targets(self, qs):
        periodic_targets_with_target_values = PeriodicTarget.objects.filter(
            indicator_id=models.OuterRef('pk'),
            target__isnull=False
        ).order_by().values('indicator_id')
        qs = qs.annotate(
            defined_targets=models.functions.Coalesce(
                models.Subquery(
                    periodic_targets_with_target_values.annotate(
                        target_count=models.Count('period')).values('target_count')[:1],
                    output_field=models.IntegerField()
                ), 0)
        )
        return qs

    def get_reported_results(self, qs):
        collected_data_with_achieved_values = CollectedData.objects.filter(
            models.Q(indicator_id=models.OuterRef('pk')),
            models.Q(achieved__isnull=False)
        ).order_by().values('indicator_id')
        qs = qs.annotate(
            reported_results=models.functions.Coalesce( # coalesce to return 0 if the subquery is empty (not None)
                models.Subquery(
                    collected_data_with_achieved_values.annotate(
                        result_count=models.Count('date_collected')).values('result_count')[:1],
                    output_field=models.IntegerField()
                ), 0)
        )
        return qs

    def get_queryset(self):
        qs = super(WithMetricsIndicatorManager, self).get_queryset()
        qs = self.get_defined_targets(qs)
        qs = self.get_reported_results(qs)
        qs = self.get_evidence_count(qs)
        return qs

class IPTTIndicator(Indicator):
    SEPARATOR = '/' # this is used by CSV output as a default joiner for multiple values
    class Meta:
        proxy = True

    notargets = NoTargetsIndicatorManager()
    withtargets = WithTargetsIndicatorManager()
    with_metrics = WithMetricsIndicatorManager()

    @property
    def lop_met_target(self):
        return str(int(round(float(self.lop_actual_sum)*100/self.lop_target_sum))) + "%"

    @property
    def timeperiods(self):
        if self.unit_of_measure_type == self.PERCENTAGE and not self.is_cumulative:
            return
        else:
            count = 0
            while getattr(self, "period_{0}".format(count), None) is not None:
                yield getattr(self, "period_{0}".format(count))
                count += 1


class ProgramMetricsQuerySet(models.QuerySet):
    def count(self):
        return self.values('id').aggregate(total=models.Count('id', distinct=True))['total']



class ProgramWithMetricsManager(models.Manager):
    TIME_AWARE_FREQUENCIES = [
        (Indicator.ANNUAL, 12),
        (Indicator.SEMI_ANNUAL, 6),
        (Indicator.TRI_ANNUAL, 4),
        (Indicator.QUARTERLY, 3),
        (Indicator.MONTHLY, 1)
    ]

    def get_scope_annotations(self):
        """if self.reporting_period_end > datetime.date.today():
            # open program -> LOP targets are incomplete
            filters.append(models.Q(target_frequency=Indicator.LOP))
        # indicator with no periodic targets is incomplete (this field falls back to lop_target for lop indicators:
        filters.append(models.Q(lop_target_sum__isnull=True))
        filters.append(models.Q(lop_actual_sum__isnull=True))"""
        indicator_base = IPTTIndicator.with_metrics.filter(
            program__in=models.OuterRef('pk')
        )
        nonreporting = models.functions.Coalesce(
            models.Subquery(
                indicator_base.order_by().values('program').filter(
                    reporting=False
                ).annotate(
                    nonreporting_count=models.Count('*')
                ).values('nonreporting_count')[:1],
                output_field=models.IntegerField()
                ), 0)
        reporting_base = indicator_base.order_by().values('program').filter(
            reporting=True
        )
        high = models.functions.Coalesce(
            models.Subquery(
                reporting_base.filter(
                    over_under=1
                ).annotate(
                    high_count=models.Count('*')
                ).values('high_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        on_scope = models.functions.Coalesce(
            models.Subquery(
                reporting_base.filter(
                    over_under=0
                ).annotate(
                    onscope_count=models.Count('*')
                ).values('onscope_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        low = models.functions.Coalesce(
            models.Subquery(
                reporting_base.filter(
                    over_under=-1
                ).annotate(
                    low_count=models.Count('*')
                ).values('low_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        return {
            'non_reporting_count': nonreporting,
            'high_count': high,
            'on_scope_count': on_scope,
            'low_count': low,
        }

    def get_defined_targets_filter(self):
        """returns a set of filters that filter out indicators without defined targets

        defined_targets is an annotation on IPTTIndicator.with_metrics that counts periodic_targets for this
        indicator with the 'target' field set to not null"""
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
        for frequency, _ in self.TIME_AWARE_FREQUENCIES:
            filters.append(models.Q(target_frequency=frequency) &
                           models.Q(defined_targets__isnull=False) &
                           models.Q(defined_targets__gte=models.OuterRef(
                               'periods_for_frequency_{0}'.format(frequency)
                           )))
        # combine filters with an OR filter:
        combined_filter = filters.pop()
        for filt in filters:
            combined_filter |= filt
        return combined_filter

    def get_metrics_annotations(self):
        """annotates programs with counts of metrics for program page

            defined_targets_count: # of indicators with all targets defined
            reported_results_count: # of indicators with at least one result reported
            results_evidence_count: # of indicators with at least one result with evidence attached
            indicator_count: # of indicators for the program"""
        # get indicators grouped by program:
        indicator_subquery_base = IPTTIndicator.with_metrics.filter(
            program__in=models.OuterRef('pk')
        ).order_by().values('program')
        # results reporting filter (at least one reported result):
        reported_results = models.functions.Coalesce(
            models.Subquery(
                indicator_subquery_base.filter(
                    reported_results__gte=1
                ).annotate(
                    reported_count=models.Count('*')
                ).values('reported_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        total_results = models.functions.Coalesce(
            models.Count('indicator__collecteddata'), 0)
        # evidence backing up results filter (at least one data point with evidence attached):
        results_evidence = models.functions.Coalesce(
            models.Subquery(
                indicator_subquery_base.filter(
                    evidence_count__gte=1
                ).annotate(
                    backed_up_count=models.Count('*')
                ).values('backed_up_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        # targets defined (ALL targets defined)
        targets_defined = models.functions.Coalesce(
            models.Subquery(
                indicator_subquery_base.filter(
                    self.get_defined_targets_filter()
                ).annotate(
                    defined_targets_count=models.Count('*')
                ).values('defined_targets_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        # raw count of indicators for this program:
        indicator_count = models.functions.Coalesce(
            models.Subquery(
                indicator_subquery_base.annotate(
                    overall_count=models.Count('*')
                ).values('overall_count')[:1],
                output_field=models.IntegerField()
            ), 0)
        return {
            'reported_results_count': reported_results,
            'reported_results_sum': total_results,
            'results_evidence_count': results_evidence,
            'targets_defined_count': targets_defined,
            'indicator_count': indicator_count
        }

    def get_periods_annotations(self, qs):
        """annotates the queryset with how many periods of each frequency are needed to be fully defined"""
        # annotate with the number of months in the reporting period:
        months_annotation = models.ExpressionWrapper(
            (
                (models.functions.ExtractYear('reporting_period_end') -
                 models.functions.ExtractYear('reporting_period_start')) * 12 +
                models.functions.ExtractMonth('reporting_period_end') -
                models.functions.ExtractMonth('reporting_period_start') + 1
            ),
            output_field=models.IntegerField()
        )
        qs = qs.annotate(
            months=months_annotation
        )
        # NOTE: this relies on the business logic that all reporting period dates are
        # truncated to the 1st of the month (mid month reporting periods break this logic)
        # use the months annotation to annotate the periods for different frequencies:
        period_annotations = {}
        for frequency, months_count in self.TIME_AWARE_FREQUENCIES:
            period_annotations['periods_for_frequency_{0}'.format(frequency)] = models.F('months')/months_count
        qs = qs.annotate(
            **period_annotations
        )
        return qs

    def get_queryset(self):
        metrics_annotations = self.get_metrics_annotations()
        scope_annotations = self.get_scope_annotations()
        qs = ProgramMetricsQuerySet(self.model, using=self._db)
        qs = self.get_periods_annotations(qs)
        qs = qs.annotate(**metrics_annotations)
        qs = qs.annotate(**scope_annotations)
        return qs

class ProgramWithMetrics(wf_models.Program):
    TIME_AWARE_FREQUENCIES = [
        Indicator.ANNUAL,
        Indicator.SEMI_ANNUAL,
        Indicator.TRI_ANNUAL,
        Indicator.QUARTERLY,
        Indicator.MONTHLY
    ]

    with_metrics = ProgramWithMetricsManager()

    class Meta:
        proxy = True

    def get_num_periods(self, frequency):
        """returns the expected number of target periods given a frequency based on reporting period"""
        start_date = self.reporting_period_start
        end_date = self.reporting_period_end
        if frequency == Indicator.ANNUAL:
            next_date_func = lambda x: datetime.date(
                x.year+1, x.month, x.day
            )
        else:
            magic_number = {
                Indicator.SEMI_ANNUAL: 6,
                Indicator.TRI_ANNUAL: 4,
                Indicator.QUARTERLY: 3,
                Indicator.MONTHLY: 1
            }[frequency]
            next_date_func = lambda x: datetime.date(
                x.year + 1 if x.month > (12-magic_number) else x.year,
                x.month - 12 + magic_number if x.month > (12-magic_number) else x.month + magic_number,
                x.day
            )
        periods = 0
        while start_date <= end_date:
            periods += 1
            start_date = next_date_func(start_date)
        return periods

    def get_defined_targets_filter(self):
        filters = []
        filters.append(models.Q(target_frequency=Indicator.LOP) & models.Q(lop_target__isnull=False))
        filters.append(models.Q(target_frequency=Indicator.MID_END) &
                       models.Q(defined_targets__isnull=False) &
                       models.Q(defined_targets__gte=2))
        filters.append(models.Q(target_frequency=Indicator.EVENT) &
                       models.Q(defined_targets__isnull=False) &
                       models.Q(defined_targets__gte=1))
        for frequency in self.TIME_AWARE_FREQUENCIES:
            num_periods = self.get_num_periods(frequency)
            filters.append(models.Q(target_frequency=frequency) &
                           models.Q(defined_targets__isnull=False) &
                           models.Q(defined_targets__gte=num_periods))
        combined_filter = filters.pop()
        for filt in filters:
            combined_filter |= filt
        return combined_filter

    def get_reporting_filters(self):
        """returns an array of filters based on program attributes to filter out indicators that should not be part
        of reporting metrics"""
        filters = []
        if self.reporting_period_end > datetime.date.today():
            # open program -> LOP targets are incomplete
            filters.append(models.Q(target_frequency=Indicator.LOP))
        # indicator with no periodic targets is incomplete (this field falls back to lop_target for lop indicators:
        filters.append(models.Q(lop_target_sum__isnull=True))
        filters.append(models.Q(lop_actual_sum__isnull=True))
        return filters

    @property
    def nonreporting(self):
        """returns indicators (annotated with target data) that are excluded from reporting metrics"""
        qs = self.get_indicators()
        filters = self.get_reporting_filters()
        if filters:
            filter_query = filters.pop()
            for filt in filters:
                filter_query |= filt
            qs = qs.filter(filter_query)
        return qs

    @property
    def reporting(self):
        """returns indicators (annotated with target data) that are included in reporting metrics"""
        qs = self.get_indicators()
        excludes = self.get_reporting_filters()
        if excludes:
            exclude_query = excludes.pop()
            for exclude in excludes:
                exclude_query |= exclude
            qs = qs.exclude(exclude_query)
        return qs

    @property
    def targets_defined(self):
        """returns indicators (annotated with target data) that have all their targets defined"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(self.get_defined_targets_filter())
        return indicators

    @property
    def targets_undefined(self):
        """returns indicators (annotated with target data) that have undefined targets"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.exclude(self.get_defined_targets_filter())
        return indicators

    @property
    def reported_results(self):
        """returns indicators that have reported results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(reported_results__gte=1)
        return indicators

    @property
    def no_reported_results(self):
        """returns indicators that have no reported results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(reported_results=0)
        return indicators

    @property
    def with_evidence(self):
        """returns indicators that have evidence to back up results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(evidence_count__gte=1)
        return indicators

    @property
    def with_no_evidence(self):
        """returns indicators that have no evidence backing up results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(evidence_count=0)
        return indicators

    def get_indicators(self):
        return IPTTIndicator.withtargets.filter(program__in=[self.id])

    @property
    def ontarget(self):
        indicators = self.reporting.filter(
            over_under=0
        )
        return indicators

    @property
    def undertarget(self):
        indicators = self.reporting.filter(
            over_under=-1
        )
        return indicators

    @property
    def overtarget(self):
        indicators = self.reporting.filter(
            over_under=1
        )
        return indicators

    @property
    def percent_complete(self):
        if self.reporting_period_end is None or self.reporting_period_start is None:
            return None
        total_days = (self.reporting_period_end - self.reporting_period_start).days
        complete = (datetime.date.today() - self.reporting_period_start).days
        return int(round(float(complete)*100/total_days))

    @property
    def metrics(self):
        denominator = self.indicator_count
        if denominator == 0:
            return {
                'reported_results': 0,
                'targets_defined': 0,
                'results_evidence': 0,
                'indicator_count': 0
            }
        make_percent = lambda x: int(round(float(x*100)/denominator))
        total_results = self.reported_results_sum
        percent_with_evidence = 0
        if total_results and total_results > 0 and self.results_evidence_count and self.results_evidence_count > 0:
            percent_with_evidence = int(round(float(self.results_evidence_count*100)/total_results))
        return {
            'reported_results': make_percent(self.reported_results_count),
            'targets_defined': make_percent(self.targets_defined_count),
            'results_evidence': percent_with_evidence,
            'indicator_count': denominator
        }

    @property
    def scope_percents(self):
        denominator = self.indicator_count
        if denominator == 0:
            return {
                'indicator_count': 0,
                'nonreporting': 0,
                'low': 0,
                'on_scope': 0,
                'high': 0
            }
        make_percent = lambda x: int(round(float(x)*100/denominator))
        return {
            'indicator_count': denominator,
            'nonreporting': make_percent(self.non_reporting_count),
            'low': make_percent(self.low_count),
            'on_scope': make_percent(self.on_scope_count),
            'high': make_percent(self.high_count)
        }

    def get_annotated_indicators(self):
        return IPTTIndicator.with_metrics.filter(program__in=[self.id])