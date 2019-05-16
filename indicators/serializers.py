from rest_framework import serializers

from workflow.models import Program
from indicators.models import Indicator, Level, LevelTier


class LevelSerializer(serializers.ModelSerializer):
    """
    Level serializer for Program Page
    """
    level_depth = serializers.CharField(source='get_level_depth', read_only=True)

    class Meta:
        model = Level
        fields = [
            'id',
            'parent',
            'name',
            'assumptions',
            'customsort',
            'ontology',
            'level_depth'
        ]
        read_only_fields = ['level_depth', 'ontology']


class LevelTierSerializer(serializers.ModelSerializer):
    """
    Level serializer for Program Page
    """
    class Meta:
        model = LevelTier
        fields = [
            'id',
            'name',
            'tier_depth'
        ]


class IndicatorSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    reporting = serializers.BooleanField()
    all_targets_defined = serializers.IntegerField()
    results_count = serializers.IntegerField()
    results_with_evidence_count = serializers.IntegerField()
    over_under = serializers.IntegerField()
    target_period_last_end_date = serializers.DateField()
    level = LevelSerializer(read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'number',
            'level',
            'unit_of_measure',
            'baseline_display',
            'lop_target_display',
            'key_performance_indicator',
            'just_created',

            # DB annotations
            #  whether indicator progress towards targets is reported
            #  (min. one target period complete, one result reported):
            'reporting',
            'all_targets_defined',  # whether all targets are defined for this indicator
            'results_count',
            'results_with_evidence_count',
            'target_period_last_end_date', # last end date of last target period, for time-aware indicators
            'over_under',  # indicator progress towards targets (1: over, 0: within 15% of target, -1: under, "None": non reporting
        ]


class ProgramSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    class Meta:
        model = Program
        fields = [
            'id',
            'does_it_need_additional_target_periods',
            'reporting_period_start',
            'reporting_period_end',
        ]
