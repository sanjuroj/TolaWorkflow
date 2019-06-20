from rest_framework import serializers
from django.shortcuts import reverse

from workflow.models import Program, Documentation, ProjectAgreement

from indicators.models import Level, Indicator


class DocumentListProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            'id',
            'gaitid',
            'name',
        ]


class DocumentListProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAgreement
        fields = [
            'id',
            'project_name',
        ]


class DocumentListDocumentSerializer(serializers.ModelSerializer):
    project = DocumentListProjectSerializer(read_only=True)

    class Meta:
        model = Documentation
        fields = [
            'id',
            'name',
            'create_date',
            'program',
            'project',
            'url',
        ]

class LogframeIndicatorSerializer(serializers.ModelSerializer):
    number_display = serializers.SerializerMethodField()
    level = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Indicator
        fields = [
            'pk',
            'name',
            'means_of_verification',
            'level',
            'number_display',
            'old_level',
        ]

    def get_number_display(self, obj):
        if obj.results_framework and obj.auto_number_indicators:
            return ''.join([p for p in [obj.level_display_ontology, obj.level_order_display] if p])
        return obj.number



class LogframeLevelSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField()
    get_level_depth = serializers.IntegerField()
    indicators = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='indicator_set')
    child_levels = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Level
        fields = [
            'pk',
            'name',
            'display_name',
            'get_level_depth',
            'customsort',
            'indicators',
            'assumptions',
            'child_levels'
        ]


class LogframeProgramSerializer(serializers.ModelSerializer):
    results_framework_url = serializers.SerializerMethodField()
    program_page_url = serializers.CharField()
    results_framework = serializers.BooleanField()
    rf_chain_sort_label = serializers.CharField()
    levels = LogframeLevelSerializer(many=True, read_only=True)
    indicators = LogframeIndicatorSerializer(source='indicator_set', many=True, read_only=True)

    class Meta:
        model = Program
        fields = [
            'pk',
            'name',
            'results_framework_url',
            'program_page_url',
            'results_framework',
            'rf_chain_sort_label',
            'levels',
            'indicators',
        ]

    @classmethod
    def load(cls, pk):
        program = Program.objects.get(pk=pk)
        return cls(program)

    def get_results_framework_url(self, obj):
        return reverse('results_framework_builder', kwargs={'program_id': obj.pk})