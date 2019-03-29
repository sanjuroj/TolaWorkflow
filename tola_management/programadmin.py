# -*- coding: utf-8 -*-
import json
import csv
from StringIO import StringIO

from collections import OrderedDict
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status as httpstatus
from rest_framework.validators import UniqueValidator
from rest_framework.decorators import list_route, detail_route
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    ModelSerializer,
    CharField,
    IntegerField,
    ValidationError,
    PrimaryKeyRelatedField,
    BooleanField,
    HiddenField,
    JSONField,
    DateTimeField
)
from django.utils.translation import ugettext as _

from openpyxl import Workbook
from openpyxl.cell import Cell
from openpyxl.styles import Alignment, Font

from feed.views import SmallResultsSetPagination

from workflow.models import (
    Program,
    TolaUser,
    Organization,
    Country,
    Sector,
    ProgramAccess
)

from indicators.models import (
    Indicator
)

from .models import (
    ProgramAdminAuditLog,
    ProgramAuditLog
)

from .permissions import (
    HasProgramAdminAccess
)

class Paginator(SmallResultsSetPagination):
    def get_paginated_response(self , data):
        response = Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_count', self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
        ]))
        return response

class NestedSectorSerializer(Serializer):
    def to_representation(self, sector):
        return sector.id

    def to_internal_value(self, data):
        sector = Sector.objects.get(pk=data)
        return sector


class NestedCountrySerializer(Serializer):

    def to_representation(self, country):
        return country.id

    def to_internal_value(self, data):
        country = Country.objects.get(pk=data)
        return country

class ProgramAdminSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(required=True, max_length=255)
    funding_status = CharField(required=True)
    gaitid = CharField(required=False, allow_blank=True, allow_null=True, validators=[
        UniqueValidator(queryset=Program.objects.all())
    ])
    description = CharField(allow_blank=True)
    sector = NestedSectorSerializer(required=True, many=True)
    country = NestedCountrySerializer(required=True, many=True)

    def validate_country(self, values):
        if not values:
            raise ValidationError("This field may not be blank.")
        return values

    class Meta:
        model = Program
        fields = (
            'id',
            'name',
            'funding_status',
            'gaitid',
            'description',
            'sector',
            'country',
        )

    def to_representation(self, program, with_aggregates=True):
        ret = super(ProgramAdminSerializer, self).to_representation(program)
        if not with_aggregates:
            return ret
        # Some n+1 queries here. If this is slow, Fix in queryset either either with rawsql or remodel.
        program_users = (
            TolaUser.objects.filter(programs__id=program.id).select_related('organization')
            | TolaUser.objects.filter(countries__program=program.id).select_related('organization')
        ).distinct()

        organizations = set([tu.organization_id for tu in program_users if tu.organization_id])
        organization_count = len(organizations)

        ret['program_users'] = len(program_users)
        ret['organizations'] = organization_count
        ret['onlyOrganizationId'] = organizations.pop() if organization_count == 1 else None
        return ret

    @transaction.atomic
    def create(self, validated_data):
        country = validated_data.pop('country')
        sector = validated_data.pop('sector')
        if not validated_data['gaitid']:
            validated_data.pop('gaitid')
        program = super(ProgramAdminSerializer, self).create(validated_data)
        program.country.add(*country)
        program.sector.add(*sector)
        ProgramAdminAuditLog.created(
            program=program,
            created_by=self.context.get('request').user.tola_user,
            entry=program.admin_logged_fields,
        )
        return program

    @transaction.atomic
    def update(self, instance, validated_data):
        previous_state = instance.admin_logged_fields

        original_countries = instance.country.all()
        incoming_countries = validated_data.pop('country')
        added_countries = [x for x in incoming_countries if x not in original_countries]
        removed_countries = [x for x in original_countries if x not in incoming_countries]


        original_sectors = instance.sector.all()
        incoming_sectors = validated_data.pop('sector')
        added_sectors = [x for x in incoming_sectors if x not in original_sectors]
        removed_sectors = [x for x in original_sectors if x not in incoming_sectors]

        instance.country.remove(*removed_countries)
        instance.country.add(*added_countries)
        instance.sector.remove(*removed_sectors)
        instance.sector.add(*added_sectors)

        ProgramAccess.objects.filter(program=instance, country__in=removed_countries).delete()
        updated_instance = super(ProgramAdminSerializer, self).update(instance, validated_data)
        ProgramAdminAuditLog.updated(
            program=instance,
            changed_by=self.context.get('request').user.tola_user,
            old=previous_state,
            new=instance.admin_logged_fields,
        )
        return updated_instance

class ProgramAuditLogIndicatorSerializer(ModelSerializer):
    class Meta:
        model = Indicator
        fields = (
            'number',
            'name'
        )

class ProgramAuditLogSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    indicator = ProgramAuditLogIndicatorSerializer()
    user = CharField(source='user.name', read_only=True)
    organization = CharField(source='organization.name', read_only=True)
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = ProgramAuditLog
        fields = (
            'id',
            'date',
            'user',
            'organization',
            'indicator',
            'change_type',
            'rationale',
            'diff_list',
            'pretty_change_type',
        )

class ProgramAdminAuditLogSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    admin_user = CharField(source="admin_user.name", max_length=255)
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = ProgramAdminAuditLog
        fields = (
            'id',
            'date',
            'admin_user',
            'change_type',
            'diff_list',
            'pretty_change_type',
        )

class ProgramAdminViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramAdminSerializer
    pagination_class = Paginator
    permission_classes = [permissions.IsAuthenticated, HasProgramAdminAccess]

    def get_queryset(self):
        auth_user = self.request.user
        params = self.request.query_params

        #we have to handle this explicitly in case there are some programs without a country
        if auth_user.is_superuser:
            queryset = Program.objects.all()
        else:
            queryset = Program.objects.all().filter(country__in=auth_user.tola_user.managed_countries)

        if not auth_user.is_superuser:
            tola_user = auth_user.tola_user
            queryset = queryset.filter(
                Q(user_access=tola_user) | Q(country__users=tola_user)
            )

        programStatus = params.get('programStatus')
        if programStatus == 'Active':
            queryset = queryset.filter(funding_status='Funded')
        elif programStatus == 'Closed':
            queryset = queryset.exclude(funding_status='Funded')

        programParam = params.getlist('programs[]')
        if programParam:
            queryset = queryset.filter(pk__in=programParam)

        countryFilter = params.getlist('countries[]')
        if countryFilter:
            queryset = queryset.filter(country__in=countryFilter)

        sectorFilter = params.getlist('sectors[]')
        if sectorFilter:
            queryset = queryset.filter(sector__in=sectorFilter)

        usersFilter = params.getlist('users[]')
        if usersFilter:
            queryset = queryset.filter(Q(user_access__id__in=usersFilter) | Q(country__in=Country.objects.filter(users__id__in=usersFilter)))

        organizationFilter = params.getlist('organizations[]')
        if organizationFilter:
            queryset = queryset.filter(
                Q(user_access__organization__in=organizationFilter) | Q(country__users__organization__in=organizationFilter)
            )

        return queryset.distinct()

    @list_route(methods=["get"])
    def program_filter_options(self, request):
        """Provides a non paginated list of countries for the frontend filter"""
        auth_user = self.request.user
        params = self.request.query_params
        queryset = Program.objects

        if not auth_user.is_superuser:
            tola_user = auth_user.tola_user
            queryset = queryset.filter(
                Q(user_access=tola_user) | Q(country__users=tola_user)
            )

        countryFilter = params.getlist('countries[]')
        if countryFilter:
            queryset = queryset.filter(country__in=countryFilter)
        programs = [{
            'id': program.id,
            'name': program.name,
        } for program in queryset.distinct().all()]
        return Response(programs)


    @detail_route(methods=['get'])
    def history(self, request, pk=None):
        program = Program.objects.get(pk=pk)
        history = (ProgramAdminAuditLog
            .objects
            .filter(program=program)
            .select_related('admin_user')
            .order_by('-date'))
        serializer = ProgramAdminAuditLogSerializer(history, many=True)
        return Response(serializer.data)

    @list_route(methods=["post"])
    def bulk_update_status(self, request):
        ids = request.data.get("ids")
        new_funding_status = request.data.get("funding_status")
        new_funding_status = new_funding_status if new_funding_status in ["Completed", "Funded"] else None
        if new_funding_status:
            to_update = Program.objects.filter(pk__in=ids)
            to_update.update(funding_status=new_funding_status)
            updated = [{
                'id': p.pk,
                'funding_status': p.funding_status,
            } for p in to_update]
            return Response(updated)
        return Response({}, status=httpstatus.HTTP_400_BAD_REQUEST)

    @detail_route(methods=["get"])
    def audit_log(self, request, pk=None):
        program = Program.objects.get(pk=pk)

        queryset = program.audit_logs.all().order_by('-date')
        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = ProgramAuditLogSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @detail_route(methods=["get"])
    def export_audit_log(self, request, pk=None):
        program = Program.objects.get(pk=pk)
        workbook = Workbook()
        ws = workbook.active

        header = [
            Cell(ws, value=_("Date and Time")),
            Cell(ws, value=_('No.')),
            Cell(ws, value=_('Indicator')),
            Cell(ws, value=_('User')),
            Cell(ws, value=_('Organization')),
            Cell(ws, value=_('Change Type')),
            Cell(ws, value=_('Previous Entry')),
            Cell(ws, value=_('New Entry')),
            Cell(ws, value=_('Rationale'))
        ]

        header_font = Font(bold=True)

        for h in header:
            h.font = header_font

        ws.append(header)

        alignment = Alignment(
            horizontal='general',
            vertical='top',
            text_rotation=0,
            wrap_text=True,
            shrink_to_fit=False,
            indent=0
        )

        for row in program.audit_logs.all().order_by('-date'):
            prev_string = ''
            for entry in row.diff_list:
                if entry['name'] == 'targets':
                    for k, target in entry['prev'].iteritems():
                        prev_string += target['name']+": "+str(target['value'])+"\r\n"

                else:
                    prev_string += entry['pretty_name']+": "+str(entry['prev'] if entry['prev'] else _('N/A'))+"\r\n"

            new_string = ''
            for entry in row.diff_list:
                if entry['name'] == 'targets':
                    for k, target in entry['new'].iteritems():
                        new_string += target['name']+": "+str(target['value'])+"\r\n"

                else:
                    new_string += entry['pretty_name']+": "+str(entry['new'] if entry['new'] else _('N/A'))+"\r\n"

            xl_row = [
                Cell(ws, value=row.date),
                Cell(ws, value=row.indicator.number if row.indicator else _('N/A')),
                Cell(ws, value=row.indicator.name if row.indicator else _('N/A')),
                Cell(ws, value=row.user.name),
                Cell(ws, value=row.organization.name),
                Cell(ws, value=row.pretty_change_type),
                Cell(ws, value=prev_string),
                Cell(ws, value=new_string),
                Cell(ws, value=row.rationale)
            ]
            for cell in xl_row:
                cell.alignment = alignment
            ws.append(xl_row)

        for rd in ws.row_dimensions:
            rd.auto_size = True

        for cd in ws.column_dimensions:
            cd.auto_size = True


        response = HttpResponse(content_type='application/ms-excel')
        filename = u'{} Audit Log {}.xlsx'.format(program.name, timezone.now().strftime('%b %d, %Y'))
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
        workbook.save(response)
        return response
