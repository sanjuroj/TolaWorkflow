from rest_framework import serializers

from indicators.models import Indicator
from workflow.models import Program, Documentation, ProjectAgreement


class RecordListIndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
        ]


class RecordListProgramSerializer(serializers.ModelSerializer):
    indicator_set = RecordListIndicatorSerializer(many=True, read_only=True)

    class Meta:
        model = Program
        fields = [
            'id',
            'gaitid',
            'name',
            'indicator_set',
        ]


class RecordListProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAgreement
        fields = [
            'id',
            'project_name',
        ]


class RecordListRecordSerializer(serializers.ModelSerializer):
    project = RecordListProjectSerializer(read_only=True)

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
