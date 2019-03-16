"""Querymanagers and proxymodels to abstract complex queries on indicator models

"""

from indicators.models import (
    Indicator,
    Level,
    PeriodicTarget,
    Result,
    IndicatorSortingManagerMixin,
    IndicatorSortingQSMixin
)
from indicators.queries import utils
from django.db import models
from django.db.models.functions import Concat
from django.utils.functional import cached_property

# class OldIPTTIndicatorQuerySet(models.QuerySet, IndicatorSortingQSMixin):
#     """This overrides the count method because ONLY_FULL_GROUP_BY errors appear otherwise on this custom query"""
#     def count(self):
#         return self.values('id').aggregate(total=models.Count('id', distinct=True))['total']
# 
# 
# class OldIPTTIndicatorManager(models.Manager, IndicatorSortingManagerMixin):
#     """this is the general manager for all IPTT (annotated) indicators - generates totals over LOP"""
# 
#     def add_labels(self, qs):
#         most_recent_level = Level.objects.filter(indicator__id=models.OuterRef('pk')).order_by('-id')
#         return qs.annotate(
#             level_name=models.Subquery(most_recent_level.values('name')[:1])
#         )
# 
#     def add_scope_annotations(self, qs):
#         # set the margins for reporting as over or under scope:
#         over_scope = 1 + Indicator.ONSCOPE_MARGIN
#         under_scope = 1 - Indicator.ONSCOPE_MARGIN
#         return qs.annotate(
#             # first establish the real lop-to-date progress against targets:
#             lop_met_real=models.Case(
#                 models.When(
#                     models.Q(lop_target_sum__isnull=True) |
#                     models.Q(lop_actual_sum__isnull=True),
#                     then=models.Value(None)
#                     ),
#                 default=models.ExpressionWrapper(
#                     models.F('lop_actual_sum') / models.F('lop_target_sum'),
#                     output_field=models.FloatField()
#                 )
#             )
#         ).annotate(
#             over_under=models.Case(
#                 # None for indicators missing targets or data:
#                 models.When(
#                     lop_met_real__isnull=True,
#                     then=models.Value(None)
#                     ),
#                 models.When(
#                     # over is negative if DOC is Negative
#                     models.Q(lop_met_real__gt=over_scope) &
#                     models.Q(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE),
#                     then=models.Value(-1)
#                     ),
#                 models.When(
#                     lop_met_real__gt=over_scope,
#                     then=models.Value(1)
#                 ),
#                 models.When(
#                     # under is positive if DOC is Negative:
#                     models.Q(lop_met_real__lt=under_scope) &
#                     models.Q(direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE),
#                     then=models.Value(1)
#                 ),
#                 models.When(
#                     lop_met_real__lt=under_scope,
#                     then=models.Value(-1)
#                 ),
#                 default=models.Value(0),
#                 output_field=models.IntegerField(null=True)
#             )
#         )
# 
#     def get_queryset(self):
#         return self._get_annotated_queryset()
# 
#     def _get_annotated_queryset(self, label=False, lop=False, report=False, scope=False):
#         qs = IPTTIndicatorQuerySet(self.model, using=self._db)
#         # add labels such as "level:"
#         if label:
#             qs = self.add_labels(qs)
#         if lop:
#             # add lop annotations (target_sum and actual_sum):
#             qs = qs.annotate(lop_target_calculated=utils.indicator_lop_target_calculated_annotation())
#             # add lop_actual annotation (for results display):
#             qs = qs.annotate(lop_actual=utils.indicator_lop_actual_annotation())
#             # add lop_met_real annotation:
#             qs = qs.annotate(lop_percent_met=utils.indicator_lop_percent_met_annotation())
#         if report:
#             # add reporting annotations (whether this indicator should be counted for on-target reporting)
#             qs = qs.annotate(reporting=utils.indicator_reporting_annotation())
#         if report and scope:
#             # add over_under calculation:
#             qs = self.add_scope_annotations(qs)
#         return qs
# 
# class NoTargetsIndicatorManager(IPTTIndicatorManager):
#     def periods(self, periods):
#         """annotate a query with actual data sums for a set of time periods"""
#         period_annotations = {}
#         for c, period in enumerate(periods):
#             date_range = "{0}-{1}".format(
#                 period['start_date'].strftime('%Y-%m-%d'),
#                 period['end_date'].strftime('%Y-%m-%d')
#             )
#             period_annotations[date_range] = models.Case(
#                 models.When(
#                     unit_of_measure_type=Indicator.PERCENTAGE,
#                     then=models.Subquery(
#                         Result.objects.filter(
#                             indicator_id=models.OuterRef('pk'),
#                             date_collected__lte=period['end_date']
#                         ).order_by('-date_collected').values('achieved')[:1],
#                         output_field=models.FloatField()
#                     )),
#                 default=models.Subquery(
#                     Result.objects.filter(
#                         indicator_id=models.OuterRef('pk'),
#                         date_collected__lte=period['end_date']
#                     ).filter(
#                         models.Q(date_collected__gte=period['start_date']) |
#                         models.Q(indicator__is_cumulative=True)
#                     ).order_by().values('indicator_id').annotate(
#                         total=models.Sum('achieved')).values('total'),
#                     output_field=models.FloatField())
#             )
#             period_annotations["period_{0}".format(c)] = models.Value(
#                 date_range, output_field=models.CharField())
#         return self.get_queryset().annotate(**period_annotations)
# 
#     def get_queryset(self):
#         # pylint: disable=E1124
#         qs = self._get_annotated_queryset(label=True, lop=True)
#         return qs
# 
# 
# class WithTargetsIndicatorManager(IPTTIndicatorManager):
#     """Manager for Indicator with PeriodicTargets and Result
# 
#     automatically annotates for lop target and actual lop sum of results
#     also can self-annotate for periodic target and actual sum
#     returns % met for the above"""
# 
#     def get_target_prefetch(self):
#         # inner query to apply target_id to data collected within target range
#         target_inner_query = PeriodicTarget.objects.filter(
#             indicator_id=models.OuterRef('indicator_id'),
#             start_date__lte=models.OuterRef('date_collected'),
#             end_date__gte=models.OuterRef('date_collected')
#         ).order_by().values('id')[:1]
#         # inner query to collect data annotated by target_id
#         data_with_periods_non_cumulative = Result.objects.filter(
#             indicator_id=models.OuterRef('indicator_id')
#         ).annotate(
#             target_id=models.Subquery(target_inner_query)
#         ).filter(
#             target_id=models.OuterRef('id')
#         ).order_by().values('target_id')
#         data_with_periods_cumulative = Result.objects.filter(
#             indicator_id=models.OuterRef('indicator_id'),
#             date_collected__lte=models.OuterRef('end_date')
#         ).order_by().values('indicator_id')
#         # targets with data sums attached
#         targets = PeriodicTarget.objects.annotate(
#             data_sum=models.Case(
#                 models.When(
#                     indicator__unit_of_measure_type=Indicator.PERCENTAGE,
#                     then=models.Subquery(
#                         data_with_periods_non_cumulative.order_by(
#                             '-date_collected'
#                             ).values('achieved')[:1],
#                         output_field=models.FloatField()
#                     )
#                 ),
#                 models.When(
#                     indicator__is_cumulative=True,
#                     then=models.Subquery(
#                         data_with_periods_cumulative.annotate(
#                             total=models.Sum('achieved')
#                         ).values('total'),
#                         output_field=models.FloatField()
#                     )
#                 ),
#                 default=models.Subquery(
#                     data_with_periods_non_cumulative.annotate(
#                         total=models.Sum('achieved')
#                     ).values('total'),
#                     output_field=models.FloatField()
#                 )
#             )
#         ).annotate(
#             met_real=models.ExpressionWrapper(
#                 models.F('data_sum')/models.F('target'),
#                 output_field=models.FloatField()
#             ),
#             met=models.ExpressionWrapper(
#                 Concat(utils.Round(models.F('data_sum')*100/models.F('target')), models.Value("%")),
#                 output_field=models.CharField()
#             )
#         ).annotate(
#             within_target_range=models.Case(
#                 models.When(
#                     met_real__gt=1.15,
#                     then=models.Case(
#                         models.When(
#                             indicator__direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE,
#                             then=models.Value(-1)
#                         ),
#                         default=models.Value(1)
#                     )
#                 ),
#                 models.When(
#                     met_real__lt=0.85,
#                     then=models.Case(
#                         models.When(
#                             indicator__direction_of_change=Indicator.DIRECTION_OF_CHANGE_NEGATIVE,
#                             then=models.Value(1)
#                         ),
#                         default=models.Value(-1)
#                     )
#                 ),
#                 models.When(
#                     met_real__isnull=True,
#                     then=models.Value(None)
#                 ),
#                 default=models.Value(0),
#                 output_field=models.IntegerField()
#             )
#         )
#         prefetch = models.Prefetch(
#             'periodictargets',
#             queryset=targets,
#             to_attr='data_targets'
#         )
#         return prefetch
# 
#     def get_queryset(self):
#         # pylint: disable=E1124
#         qs = self._get_annotated_queryset(label=True, lop=True).prefetch_related(
#             self.get_target_prefetch()
#         )
#         return qs
# 
# class WithMetricsIndicatorManager(IPTTIndicatorManager):
#     """queryset annotated to provide counts to the with_metrics Program call
# 
#     Attributes used by program page for filtering:
#         indicator.reporting: T/F whether it is counted towards scope
#         indicator.on_scope: 1/0/-1 (1=high, 0=on-target, -1=low)
#         indicator.all_targets_defined: T/F whether all targets are defined
#         indicator.has_reported_results: T/F indicator has SOME results reported
#         indicator.all_results_backed_up: T/F
#             # True = either has targets and results and all results have evidence, or has no results,
#             # False = has targets AND results AND at least one result is missing evidence
#         """
# 
#     def with_filter_labels(self, program):
#         """Booleans for program page filters:
# 
#             indicator.reporting and on_scope are part of IPTTIndicatorManager"""
#         qs = self.get_queryset()
#         # needs repair:
#         # defined_targets_filter = get_defined_targets_filter(program)
#         # qs = qs.annotate(
#         #     all_targets_defined=models.Case(
#         #         models.When(
#         #             defined_targets_filter,
#         #             then=models.Value(True)
#         #         ),
#         #         default=models.Value(False),
#         #         output_field=models.BooleanField()
#         #     )
#         # )
#         return qs
# 
#     def get_evidence_count(self, qs):
#         """annotates qs with evidence_count= # of results that have evidence, and all_results_backed_up=Boolean"""
#         data_with_evidence = Result.objects.filter(
#             models.Q(indicator_id=models.OuterRef('pk')) |
#             models.Q(periodic_target__indicator_id=models.OuterRef('pk')),
#         ).exclude(
#             evidence_url=''
#         ).order_by().values('indicator_id')
#         qs = qs.annotate(
#             evidence_count=models.functions.Coalesce(
#                 models.Subquery(
#                     data_with_evidence.annotate(
#                         total_count=models.Count('date_collected')
#                         ).order_by().values('total_count')[:1],
#                     output_field=models.IntegerField()
#                 ), 0)
#         )
#         qs = qs.annotate(
#             all_results_backed_up=models.Case(
#                 models.When(
#                     # if no results, then it isn't "missing" data, so we count this as all_backed_up
#                     models.Q(reported_results=0) |
#                     models.Q(
#                         #models.Q(reported_results__isnull=False) &
#                         models.Q(evidence_count__isnull=False) &
#                         models.Q(evidence_count=models.F('reported_results'))
#                         ),
#                     then=models.Value(True)
#                 ),
#                 default=models.Value(False),
#                 output_field=models.BooleanField()
#             )
#         )
#         return qs
# 
#     def get_defined_targets(self, qs):
#         periodic_targets_with_target_values = PeriodicTarget.objects.filter(
#             indicator_id=models.OuterRef('pk'),
#             target__isnull=False
#         ).order_by().values('indicator_id')
#         qs = qs.annotate(
#             defined_targets=models.functions.Coalesce(
#                 models.Subquery(
#                     periodic_targets_with_target_values.annotate(
#                         target_count=models.Count('period')).values('target_count')[:1],
#                     output_field=models.IntegerField()
#                 ), 0)
#         )
#         return qs
# 
#     def get_reported_results(self, qs):
#         results_with_achieved_values = Result.objects.filter(
#             models.Q(indicator_id=models.OuterRef('pk')),
#             models.Q(achieved__isnull=False)
#         ).order_by().values('indicator_id')
#         qs = qs.annotate(
#             reported_results=models.functions.Coalesce( # coalesce to return 0 if the subquery is empty (not None)
#                 models.Subquery(
#                     results_with_achieved_values.annotate(
#                         result_count=models.Count('date_collected')).values('result_count')[:1],
#                     output_field=models.IntegerField()
#                 ), 0)
#         ).annotate(
#             has_reported_results=models.Case(
#                 models.When(
#                     reported_results__gte=1,
#                     then=models.Value(True)
#                 ),
#                 default=models.Value(False),
#                 output_field=models.BooleanField()
#             ))
#         return qs
# 
#     def get_queryset(self):
#         qs = self._get_annotated_queryset(lop=True, report=True, scope=True)
#         qs = self.get_defined_targets(qs)
#         qs = self.get_reported_results(qs)
#         qs = self.get_evidence_count(qs)
#         return qs
#     
class IPTTIndicatorQueryset(models.QuerySet, IndicatorSortingQSMixin):
    def with_annotations(self):
        qs = self.all()
        # add lop_target_calculated annotation (not used yet, but will replace deprecated lop_target value):
        qs = qs.annotate(lop_target_calculated=utils.indicator_lop_target_calculated_annotation())
        # add lop_actual annotation
        qs = qs.annotate(lop_actual=utils.indicator_lop_actual_annotation())
        # add lop_met_real annotation (this is a float, formatting delivered on front end): 
        qs = qs.annotate(lop_percent_met=utils.indicator_lop_percent_met_annotation())
        return qs

    def get_periods(self, frequency, start, end):
        return [{'start': p['start'], 'end': p['end']} for p in PeriodicTarget.generate_for_frequency(frequency)(start, end)]

class TVAIPTTQueryset(IPTTIndicatorQueryset):
    def with_frequency_annotations(self, frequency, start, end):
        qs = self
        if frequency == Indicator.LOP:
            return qs
        elif frequency in Indicator.TIME_AWARE_TARGET_FREQUENCIES:
            periods = self.get_periods(frequency, start, end)
            qs = qs.annotate(
                **{'frequency_{0}_count'.format(frequency): models.Value(len(periods), output_field=models.IntegerField()),
                   'targets_count': utils.targets_count_annotation()})
            annotations = {}
            for c, period in enumerate(periods):
                annotations['frequency_{0}_period_{1}'.format(frequency, c)] = utils.timeaware_value_annotation(period)
                annotations['frequency_{0}_period_{1}_target'.format(frequency, c)] = utils.timeaware_target_annotation(c)
            qs = qs.annotate(**annotations)
        elif frequency == Indicator.MID_END:
            qs = qs.annotate(
                **{'frequency_{0}_count'.format(frequency): models.Value(2, output_field=models.IntegerField())}
            )
            annotations = {}
            for c in range(2):
                annotations['frequency_{0}_period_{1}'.format(frequency, c)] = utils.mid_end_value_annotation(c)
                annotations['frequency_{0}_period_{1}_target'.format(frequency, c)] = utils.mid_end_target_annotation(c)
            qs = qs.annotate(**annotations)
        return qs

class TimeperiodsIPTTQueryset(IPTTIndicatorQueryset):
    def with_frequency_annotations(self, frequency, start, end):
        qs = self
        if frequency in [Indicator.LOP, Indicator.MID_END, Indicator.EVENT]:
            # LOP target timeperiods require no annotations
            return qs
        #periods = [{'start': p['start'], 'end': p['end']} for p in PeriodicTarget.generate_for_frequency(frequency)(start, end)]
        periods = self.get_periods(frequency, start, end)
        qs = qs.annotate(
            **{'frequency_{0}_count'.format(frequency): models.Value(len(periods), output_field=models.IntegerField())})
        annotations = {}
        for c, period in enumerate(periods):
            annotations['frequency_{0}_period_{1}'.format(frequency, c)] = utils.timeaware_value_annotation(period)
        qs = qs.annotate(**annotations)
        return qs


class TVAManager(models.Manager):
    def get_queryset(self):
        return TVAIPTTQueryset(self.model, using=self._db).with_logframe_sorting().with_annotations()

class TimeperiodsManager(models.Manager):
    def get_queryset(self):
        return TimeperiodsIPTTQueryset(self.model, using=self._db).with_logframe_sorting().with_annotations()

class IPTTIndicator(Indicator):
    SEPARATOR = '/' # this is used by CSV output as a default joiner for multiple values
    class Meta:
        proxy = True

    tva = TVAManager()
    timeperiods = TimeperiodsManager()
    #notargets = NoTargetsIndicatorManager()
    #withtargets = WithTargetsIndicatorManager()
    #with_metrics = WithMetricsIndicatorManager()
    
    @property
    def levelname(self):
        return self.level.name if self.level else ''
    
    @property
    def sites(self):
        return [{'pk': site.pk, 'name': site.name} for result in self.result_set.all() for site in result.site.all()]
    
    @property
    def indicator_types(self):
        return [{'pk': indicator_type.pk,
                 'name': indicator_type.indicator_type} for indicator_type in self.indicator_type.all()]

    @property
    def lop_met_target(self):
        return str(int(round(float(self.lop_actual_sum)*100/self.lop_target_sum))) + "%"

    @property
    def old_timeperiods(self):
        if self.unit_of_measure_type == self.PERCENTAGE and not self.is_cumulative:
            return
        else:
            count = 0
            while getattr(self, "period_{0}".format(count), None) is not None:
                yield getattr(self, "period_{0}".format(count))
                count += 1

# 
# class ProgramMetricsQuerySet(models.QuerySet):
#     def count(self):
#         return self.values('id').aggregate(total=models.Count('id', distinct=True))['total']
# 
#     def add_target_annotations(self):
#         """adds annotations for the target_period_info stats on the Program Page and Home Page"""
#         lop_targets = Indicator.objects.filter(
#             program=models.OuterRef('pk'),
#             target_frequency=Indicator.LOP
#         )
#         midend_targets = Indicator.objects.filter(
#             program=models.OuterRef('pk'),
#             target_frequency=Indicator.MID_END
#         )
#         event_targets = Indicator.objects.filter(
#             program=models.OuterRef('pk'),
#             target_frequency=Indicator.EVENT
#         )
#         annual_targets = PeriodicTarget.objects.filter(
#             indicator__program=models.OuterRef('pk'),
#             indicator__target_frequency=Indicator.ANNUAL
#         )
#         semi_annual_targets = PeriodicTarget.objects.filter(
#             indicator__program=models.OuterRef('pk'),
#             indicator__target_frequency=Indicator.SEMI_ANNUAL
#         )
#         tri_annual_targets = PeriodicTarget.objects.filter(
#             indicator__program=models.OuterRef('pk'),
#             indicator__target_frequency=Indicator.TRI_ANNUAL
#         )
#         quarterly_targets = PeriodicTarget.objects.filter(
#             indicator__program=models.OuterRef('pk'),
#             indicator__target_frequency=Indicator.QUARTERLY
#         )
#         monthly_targets = PeriodicTarget.objects.filter(
#             indicator__program=models.OuterRef('pk'),
#             indicator__target_frequency=Indicator.MONTHLY
#         )
#         return self.annotate(
#             has_lop=models.Exists(lop_targets),
#             has_midend=models.Exists(midend_targets),
#             has_event=models.Exists(event_targets),
#             has_annual=models.Exists(annual_targets),
#             annual_period=models.Subquery(
#                 annual_targets.filter(
#                     end_date__lte=models.functions.Now()
#                 ).order_by('-end_date').values('end_date')[:1],
#                 output_field=models.DateField()
#             ),
#             has_semi_annual=models.Exists(semi_annual_targets),
#             semi_annual_period=models.Subquery(
#                 semi_annual_targets.filter(
#                     end_date__lte=models.functions.Now()
#                 ).order_by('-end_date').values('end_date')[:1],
#                 output_field=models.DateField()
#             ),
#             has_tri_annual=models.Exists(tri_annual_targets),
#             tri_annual_period=models.Subquery(
#                 tri_annual_targets.filter(
#                     end_date__lte=models.functions.Now()
#                 ).order_by('-end_date').values('end_date')[:1],
#                 output_field=models.DateField()
#             ),
#             has_quarterly=models.Exists(quarterly_targets),
#             quarterly_period=models.Subquery(
#                 quarterly_targets.filter(
#                     end_date__lte=models.functions.Now()
#                 ).order_by('-end_date').values('end_date')[:1],
#                 output_field=models.DateField()
#             ),
#             has_monthly=models.Exists(monthly_targets),
#             monthly_period=models.Subquery(
#                 monthly_targets.filter(
#                     end_date__lte=models.functions.Now()
#                 ).order_by('-end_date').values('end_date')[:1],
#                 output_field=models.DateField()
#             ),
#         )
# 
# 
# 
# class ProgramForHomePageQuerySet(ProgramMetricsQuerySet):
#     @property
#     def program_count(self):
#         return self.count()
# 
#     @property
#     def all_targets_defined_for_all_indicators_count(self):
#         return len([program for program in self if program.all_targets_defined_for_all_indicators])
# 
#     @property
#     def indicators_count(self):
#         return sum([program.indicator_count for program in self])
# 
#     @property
#     def results_count(self):
#         return sum([program.total_results_count for program in self])
# 
#     @property
#     def indicators_with_results_count(self):
#         return sum([program.reported_results_count for program in self])
# 
#     @property
#     def results_with_evidence_count(self):
#         return sum([program.results_evidence_count for program in self])
# 
#     def with_annotations(self, *annotations):
#         if not annotations:
#             annotations = ['targets', 'results', 'evidence', 'scope']
#         qs = self
#         if any(key in annotations for key in ['count', 'targets', 'results', 'evidence', 'reporting', 'scope']):
#             qs = qs.annotate(indicator_count=models.Count('indicator'))
#         if any(key in annotations for key in ['results_count', 'results', 'evidence']):
#             qs = qs.annotate(reported_results_sum=program_results_annotation(False))
#         if 'targets' in annotations:
#             qs = qs.annotate(program_months=program_get_program_months_annotation())
#             qs = qs.annotate(targets_defined_count=program_all_targets_defined_annotation())
#         if 'results' in annotations:
#             qs = qs.annotate(total_results_count=program_results_annotation(False))
#             qs = qs.annotate(reported_results_count=program_results_annotation(True))
#         if 'evidence' in annotations:
#             qs = qs.annotate(results_evidence_count=program_evidence_annotation())
#         if 'reporting' in annotations or 'scope' in annotations:
#             qs = qs.prefetch_related(program_scope_annotations(*annotations))
#         return qs
# 
# class ProgramForHomePageManager(models.Manager):
#     def get_queryset(self):
#         qs = ProgramForHomePageQuerySet(self.model, using=self._db)
#         # add target_info annotations (for determining helptext on indicator reporting explainers):
#         qs = qs.add_target_annotations()
#         return qs
# 
#     def with_annotations(self, *annotations):
# #         return self.get_queryset().with_annotations(*annotations)
# 
# class ProgramWithMetrics(wf_models.Program):
#     metrics_set = None
#     cached_annotated_indicators = None
#     program_page = ProgramForProgramPageManager()
#     home_page = ProgramForHomePageManager()
#     indicator_filters = {}
# 
#     class Meta:
#         proxy = True
# 
#     def set_metrics(self, indicators=None):
#         if indicators is None:
#             indicators = self.annotated_indicators
#         self.metrics_set = {
#             'indicator_count': len(indicators),
#             'targets_defined': len(
#                 [indicator for indicator in indicators
#                  if indicator.all_targets_defined]
#             ),
#             'reported_results': len(
#                 [indicator for indicator in indicators
#                  if indicator.has_reported_results]
#             ),
#             'results_evidence': sum(
#                 [indicator.results_with_evidence_count for indicator in indicators]
#             ),
#             'results_count': sum(
#                 [indicator.results_count for indicator in indicators]
#             ),
#             'needs_evidence': len(
#                 [indicator for indicator in indicators
#                  if indicator.results_count > indicator.results_with_evidence_count]
#             ),
#         }
# 
#     @cached_property
#     def all_targets_defined_for_all_indicators(self):
#         """note: we define a program with 0 indicators as _not_ having all targets defined"""
#         return self.indicator_count == self.metrics['targets_defined'] and self.indicator_count != 0
# 
#     @cached_property
#     def indicator_count(self):
#         return self.indicator_set.count()
# 
#     @cached_property
#     def annotated_indicators(self):
#         if self.cached_annotated_indicators is None:
#             self.indicator_filters['program'] = self
#             program_page_annotations = ['targets', 'results', 'evidence', 'scope', 'table']
#             self.cached_annotated_indicators = MetricsIndicator.objects.filter(
#                 **self.indicator_filters
#             ).with_annotations(
#                 *program_page_annotations
#             ).with_logframe_sorting()
#         return self.cached_annotated_indicators
# 
# 
#     @property
#     def percent_complete(self):
#         if self.reporting_period_end is None or self.reporting_period_start is None:
#             return -1 # otherwise the UI might show "None% complete"
#         if self.reporting_period_start > datetime.date.today():
#             return 0
#         total_days = (self.reporting_period_end - self.reporting_period_start).days
#         complete = (datetime.date.today() - self.reporting_period_start).days
#         return int(round(float(complete)*100/total_days)) if complete < total_days else 100
# 
#     @property
#     def metrics(self):
#         """ 'reported_results': # of indicators with any results
#             'targets_defined': # of indicators with all targets defined
#             'indicator_count': # of indicators total
#             'results_evidence': # of _results_ with evidence provided
#             'results_count': # of_results_ total for all indicators in the program
#         """
#         if not hasattr(self, 'targets_defined_count'):
#             if self.metrics_set is None:
#                 self.set_metrics()
#             return self.metrics_set
#         if self.indicator_count == 0:
#             return {
#                 'reported_results': 0,
#                 'targets_defined': 0,
#                 'indicator_count': 0,
#                 'results_evidence': 0,
#                 'results_count': 0,
#                 'needs_evidence': 0
#             }
#         return {
#             'reported_results': getattr(self, 'reported_results_count', None),
#             'targets_defined': getattr(self, 'targets_defined_count', None),
#             'indicator_count': getattr(self, 'indicator_count', None),
#             'results_evidence': getattr(self, 'results_evidence_count', None),
#             'results_count': getattr(self, 'reported_results_sum', None),
#             'needs_evidence': getattr(self, 'needs_evidence_count', None)
#         }
# 
#     @property
#     def scope_counts(self):
#         if self.indicator_count == 0:
#             return {
#                 'indicator_count': 0,
#                 'nonreporting_count': 0,
#                 'reporting_count': 0,
#                 'low': 0,
#                 'on_scope': 0,
#                 'high': 0
#             }
#         if hasattr(self, 'scope_indicators'):
#             scope_indicators = self.scope_indicators
#         else:
#             scope_indicators = self.annotated_indicators
#         return {
#             'indicator_count': getattr(self, 'indicator_count', None),
#             'nonreporting_count': len(
#                 [indicator for indicator in scope_indicators if not indicator.reporting]
#             ),
#             'reporting_count': len(
#                 [indicator for indicator in scope_indicators if indicator.reporting]
#             ),
# 
#             'low': len(
#                 [indicator for indicator in scope_indicators
#                  if indicator.reporting and hasattr(indicator, 'over_under') and indicator.over_under == -1]
#                 ),
#             'on_scope': len(
#                 [indicator for indicator in scope_indicators
#                  if indicator.reporting and hasattr(indicator, 'over_under') and indicator.over_under == 0]
#                 ),
#             'high': len(
#                 [indicator for indicator in scope_indicators
#                  if indicator.reporting and hasattr(indicator, 'over_under') and indicator.over_under == 1]
#                 ),
#         }
# 
#     @property
#     def target_period_info(self):
#         """for determining help text on program page:
#             - has_lop/midend/event: T/F whether a program has any lop indicators
#             - time_targets: T/F whether a program has any time-based indicators
#             - annual/semi_annual/tri_annual/quarterly/monthly: date that most recently completed period ended for each
#                 frequency
#         """
#         return {
#             'lop': self.has_lop,
#             'midend': self.has_midend,
#             'event': self.has_event,
#             'time_targets': any(
#                 [self.has_annual, self.has_semi_annual, self.has_tri_annual, self.has_quarterly, self.has_monthly]
#             ),
#             'annual': self.annual_period,
#             'semi_annual': self.semi_annual_period,
#             'tri_annual': self.tri_annual_period,
#             'quarterly': self.quarterly_period,
#             'monthly': self.monthly_period
#         }
