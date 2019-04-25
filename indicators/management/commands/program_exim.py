"""
Provides a way to export and import program data
"""
import sys
import itertools
import json

from django.core.management.base import BaseCommand
from datetime import timedelta, date, timedelta
import calendar

from django.db import transaction
from rest_framework import serializers

from workflow.models import Program, Sector, FundCode, Country, SiteProfile
from indicators.models import PeriodicTarget, Indicator, Result, IndicatorType, Level, Objective, \
    DataCollectionFrequency, StrategicObjective, ReportingFrequency, ExternalService


class Command(BaseCommand):
    help = """
        Provides a way to export and import program data.
        """

    def add_arguments(self, parser):
        parser.add_argument('--program_id', help="The id of the program you wish to export")
        parser.add_argument('--json_filepath', help="The JSON file you wish to imoport")

    def handle(self, *args, **options):
        if not options['program_id']  and not options['json_filepath']:
            print "You need to provide either --program_id or --filepath parameters.  Exiting"
            sys.exit()

        program = Program.objects.get(id=options['program_id'])

        serialized = ProgramSerializer(program).data

        with open('outfile.json', 'w') as fh:
            fh.write(json.dumps(serialized))


class IndicatorTypeNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.indicator_type


class LevelNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class ObjectiveNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class StrategicObjectiveNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class DataCollectionFrequencyNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.frequency


class ReportingFrequencyNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.frequency


class SectorNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.sector


class ExternalServiceNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class CountryNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.country


class FundCodeNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class SiteProfileNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class ResultNameSerializer(serializers.ModelSerializer):
    # TODO: implement disaggregation serializier
    site = SiteProfileNameSerializer(queryset=SiteProfile.objects.all, many=True)

    class Meta:

        model = Result
        all_fields = set([f.name for f in Result._meta.get_fields()])
        skipped_fields = {
            'agreeement', 'complete', 'approved_by', 'tola_table', 'indicator',
            'update_count_tola_table', 'agreement', 'complete', 'approved_by', 'id',
            'periodic_target', 'program', 'evidence',
        }
        extra_fields = ['site']
        fields = list(all_fields - skipped_fields) + extra_fields


class PeriodicTargetNameSerializer(serializers.ModelSerializer):
    result_set = ResultNameSerializer(many=True)

    class Meta:
        model = PeriodicTarget

        all_fields = set([f.name for f in model._meta.get_fields()])
        skipped_fields = {'indicator', 'result', 'id'}
        extra_fields = ['result_set']
        fields = list(all_fields - skipped_fields) + extra_fields


class IndicatorNameSerializer(serializers.ModelSerializer):
    # TODO: include disaggregations
    periodictargets = PeriodicTargetNameSerializer(many=True)
    indicator_type = IndicatorTypeNameSerializer(queryset=IndicatorType.objects.all, many=True)
    level = LevelNameSerializer(queryset=Level.objects.all)
    objectives = ObjectiveNameSerializer(queryset=Objective.objects.all, many=True)
    strategic_objectives = StrategicObjectiveNameSerializer(queryset=StrategicObjective.objects.all, many=True)
    data_collection_frequency = DataCollectionFrequencyNameSerializer(queryset=DataCollectionFrequency.objects.all)
    reporting_frequency = ReportingFrequencyNameSerializer(queryset=ReportingFrequency.objects.all)
    sector = SectorNameSerializer(queryset=Sector.objects.all)
    external_service_record = ExternalServiceNameSerializer(queryset=ExternalService.objects.all)
    result_set = serializers.SerializerMethodField()

    class Meta:
        model = Indicator

        all_fields = set([f.name for f in Indicator._meta.get_fields()])
        skipped_fields = {'result', 'id', 'program', 'indicator_changes'}
        extra_fields = ['periodictargets', 'result_set']
        fields = list(all_fields - skipped_fields) + extra_fields

    def get_result_set(self, obj):
        results = Result.objects.filter(periodic_target_id__isnull=True, indicator=obj.id)
        return ResultNameSerializer(instance=results, many=True).data


class ProgramSerializer(serializers.ModelSerializer):
    sector = SectorNameSerializer(queryset=Sector.objects.all, many=True)
    country = CountryNameSerializer(queryset=Country.objects.all, many=True)
    fund_code = CountryNameSerializer(queryset=FundCode.objects.all, many=True)
    indicator_set = IndicatorNameSerializer(many=True)

    class Meta:
        model = Program
        # have to list individually because adding both overrides and related fields
        all_fields = set([f.name for f in Program._meta.get_fields()])
        skipped_fields = {
            'indicator', 'complete', 'agreement', 'country', 'public_dashboard', 'user_access', 'audit_logs',
            'beneficiary', 'programaccess', 'documentation', 'distribution', 'objective', 'trainingattendance',
            'i_program', 'pinned_reports', 'id',
        }
        extra_fields = ['sector', 'country', 'fund_code', 'indicator_set']
        fields = list(all_fields - skipped_fields) + extra_fields
