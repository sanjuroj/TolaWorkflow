from rest_framework import serializers

from workflow.models import Program, Documentation, ProjectAgreement


class RecordListProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            'id',
            'gaitid',
            'name',
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
