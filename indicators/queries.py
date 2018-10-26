"""Querymanagers and proxymodels to abstract complex queries on indicator models

"""

from indicators.models import (
    Indicator,
    Level,
    PeriodicTarget,
    CollectedData
)
from workflow.models import Documentation
from datetime import date, timedelta
from workflow import models as wf_models
from django.db import models
from django.db.models.functions import Concat
from django.utils.functional import cached_property

class Round(models.Func):
    function = 'ROUND'
    template = '%(function)s(%(expressions)s, 0)'


class IPTTIndicatorQuerySet(models.QuerySet):
    pass


class IPTTIndicatorManager(models.Manager):
    def get_lop_target_annotations(self):
        """generates annotations for LOP target and actual data

        takes into account cumulative/noncumulative and number/percent"""
        # we only want targets that are either time naive or for completed periods:
        data_subquery = CollectedData.objects.filter(
            periodic_target_id=models.OuterRef('pk')
        )
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
            ) | models.Q(end_date__lte=date.today())
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

    def get_queryset(self):
        annotations = self.get_labeling_annotations()
        annotations.update(self.get_lop_target_annotations())
        return IPTTIndicatorQuerySet(self.model, using=self._db).annotate(
            **annotations
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

class WithMetricsIndicatorManager(IPTTIndicatorManager):
    def get_evidence_count(self, qs):
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
            models.Q(indicator_id=models.OuterRef('pk')) |
            models.Q(periodic_target__indicator_id=models.OuterRef('pk')),
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

class ProgramWithMetrics(wf_models.Program):
    TIME_AWARE_FREQUENCIES = [
        Indicator.ANNUAL,
        Indicator.SEMI_ANNUAL,
        Indicator.TRI_ANNUAL,
        Indicator.QUARTERLY,
        Indicator.MONTHLY
    ]
    class Meta:
        proxy = True

    def get_num_periods(self, frequency):
        """returns the expected number of target periods given a frequency based on reporting period"""
        start_date = self.reporting_period_start
        end_date = self.reporting_period_end
        if frequency == Indicator.ANNUAL:
            next_date_func = lambda x: date(
                x.year+1, x.month, x.day
            )
        else:
            magic_number = {
                Indicator.SEMI_ANNUAL: 6,
                Indicator.TRI_ANNUAL: 4,
                Indicator.QUARTERLY: 3,
                Indicator.MONTHLY: 1
            }[frequency]
            next_date_func = lambda x: date(
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
        if self.reporting_period_end > date.today():
            # open program -> LOP targets are incomplete
            filters.append(models.Q(target_frequency=Indicator.LOP))
        # indicator with no periodic targets is incomplete (this field falls back to lop_target for lop indicators:
        filters.append(models.Q(lop_target_sum__isnull=True))
        filters.append(models.Q(lop_actual_sum__isnull=True))
        return filters

    @cached_property
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

    @cached_property
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

    @cached_property
    def targets_defined(self):
        """returns indicators (annotated with target data) that have all their targets defined"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(self.get_defined_targets_filter())
        return indicators

    @cached_property
    def targets_undefined(self):
        """returns indicators (annotated with target data) that have undefined targets"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.exclude(self.get_defined_targets_filter())
        return indicators

    @cached_property
    def reported_results(self):
        """returns indicators that have reported results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(reported_results__gte=1)
        return indicators

    @cached_property
    def no_reported_results(self):
        """returns indicators that have no reported results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(reported_results=0)
        return indicators

    @cached_property
    def with_evidence(self):
        """returns indicators that have evidence to back up results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(evidence_count__gte=1)
        return indicators

    @cached_property
    def with_no_evidence(self):
        """returns indicators that have no evidence backing up results"""
        indicators = IPTTIndicator.with_metrics.filter(program__in=[self.id])
        indicators = indicators.filter(evidence_count=0)
        return indicators

    @cached_property
    def targets_percentages(self):
        """returns percentage of defined and undefined targets"""
        indicator_count = self.indicator_set.count()
        if indicator_count == 0:
            return {
                'defined': None,
                'undefined': None
            }
        defined = self.targets_defined.count()
        return {
            'defined': int(round(float(defined*100)/indicator_count)),
            'undefined': int(round(float(indicator_count-defined)*100/indicator_count))
        }

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
    def scope_percentages(self):
        denominator = self.reporting.count()
        if denominator == 0:
            return {
                'low': None,
                'on_scope': None,
                'high': None
            }
        make_percent = lambda x: int(round(float(x.count()*100)/denominator))
        return {
            'low': make_percent(self.undertarget),
            'on_scope': make_percent(self.ontarget),
            'high': make_percent(self.overtarget)
        }

    @cached_property
    def metrics(self):
        denominator = self.indicator_set.count()
        if denominator == 0:
            return {
                'no_indicators': True
            }
        make_percent = lambda x: int(round(float(x.count()*100)/denominator))
        return {
            'reported_results': make_percent(self.reported_results),
            'targets_defined': make_percent(self.targets_defined),
            'results_evidence': make_percent(self.with_evidence)
        }