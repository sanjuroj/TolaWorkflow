from rest_framework import serializers

from workflow.models import Program, Documentation


class RecordListProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            'id',
            'gaitid',
            'name',
        ]


class RecordListRecordSerializer(serializers.ModelSerializer):
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
