from rest_framework import serializers
from django.shortcuts import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _


from workflow.models import Program, Documentation, ProjectAgreement


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

