from rest_framework import serializers
from django.shortcuts import reverse
from django.db import models

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
    level = serializers.PrimaryKeyRelatedField(read_only=True)
    level_order_display = serializers.CharField(read_only=True)
    class Meta:
        model = Indicator
        fields = [
            'pk',
            'name',
            'means_of_verification',
            'level',
            'level_order_display',
            'level_order',
        ]



class LogframeLevelSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField()
    get_level_depth = serializers.IntegerField()
    indicators = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='indicator_set')
    child_levels = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Level
        fields = [
            'pk',
            'display_name',
            'get_level_depth',
            'ontology',
            'display_ontology',
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

    needed_fields = [
        'pk',
        'name',
        'using_results_framework'
    ]
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
        program = Program.active.only(
            *cls._needed_fields
        ).get(pk=pk)
        return cls(program)

    def get_results_framework_url(self, obj):
        return reverse('results_framework_builder', kwargs={'program_id': obj.pk})