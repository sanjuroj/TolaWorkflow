import json
from collections import OrderedDict
from django.db.models import Value, Count, F, OuterRef, Subquery
from django.db.models import Q
from django.db.models import CharField as DBCharField
from django.db.models import IntegerField as DBIntegerField
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status as httpstatus
from rest_framework.decorators import list_route, detail_route
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    CharField,
    IntegerField,
    PrimaryKeyRelatedField,
    BooleanField,
    HiddenField,
    JSONField,
)

from feed.views import SmallResultsSetPagination

from workflow.models import (
    Program,
    TolaUser,
    Organization,
)

from indicators.models import (
    Indicator
)

from .models import (
    ProgramAuditLog
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

class NestedCountrySerializer(Serializer):
    def to_representation(self, country):
        return country.id

class ProgramAdminSerializer(Serializer):
    id = IntegerField()
    name = CharField(required=True, max_length=255)
    funding_status = CharField(required=True)
    gaitid = CharField(required=True)
    description = CharField()
    sector = NestedSectorSerializer(many=True)
    country = NestedSectorSerializer(many=True)

    class Meta:
        fields = (
            'id',
            'name',
            'funding_status',
        )

    def to_representation(self, program):
        ret = super(ProgramAdminSerializer, self).to_representation(program)
        # Some n+1 queries here. If this is slow, Fix in queryset either either with rawsql or remodel.
        user_query1 = TolaUser.objects.filter(program_access__id=program.id).select_related('organization')
        user_query2 = TolaUser.objects.filter(countries__program=program.id).select_related('organization').distinct()
        program_users = user_query1.union(user_query2)

        organizations = set([tu.organization_id for tu in program_users if tu.organization_id])
        organization_count = len(organizations)

        ret['program_users'] = len(program_users)
        ret['organizations'] = organization_count
        ret['onlyOrganizationId'] = organizations.pop() if organization_count > 0 else None
        return ret

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

    def to_representation(self, instance):
        ret = super(ProgramAuditLogSerializer, self).to_representation(instance)

        #we need the unescaped entry data
        ret["previous_entry"] = json.loads(instance.previous_entry) if instance.previous_entry else None
        ret["new_entry"] = json.loads(instance.new_entry) if instance.new_entry else None
        return ret

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
            'previous_entry',
            'new_entry'
        )

class ProgramAdminViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramAdminSerializer
    pagination_class = Paginator

    def get_queryset(self):
        viewing_user = self.request.user
        params = self.request.query_params

        queryset = Program.objects.all()

        if not viewing_user.is_superuser:
            queryset = queryset.filter(
                Q(user_access__id=viewing_user.id) | Q(country__users__id=viewing_user.id)
            )

        programStatus = params.get('programStatus')
        if programStatus == 'Active':
            queryset = queryset.filter(funding_status='Funded')
        elif programStatus == 'Closed':
            queryset = queryset.exclude(funding_status='Funded')

        programParam = params.get('programs')
        if programParam:
            queryset = queryset.filter(id=programParam)

        countryFilter = params.getlist('countries[]')
        if countryFilter:
            queryset = queryset.filter(country__in=countryFilter)

        sectorFilter = params.getlist('sectors[]')
        if sectorFilter:
            queryset = queryset.filter(sector__in=sectorFilter)

        organizationFilter = params.getlist('organizations[]')
        if organizationFilter:
            queryset = queryset.filter(
                Q(user_access__organization__in=organizationFilter) | Q(country__users__organization__in=organizationFilter)
            )

        return queryset.distinct()

    def list(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, validated_data):
        return Response({'d': validated_data})


    def update(self, instance, validated_data):
        return Response({'d': validated_data})


    @list_route(methods=["post"])
    def bulk_update_status(self, request):
        ids = request.data.get("ids")
        new_funding_status = request.data.get("funding_status")
        new_funding_status = new_funding_status if new_funding_status in ["Completed", "Funded"] else None
        if new_funding_status:
            to_update = Program.objects.filter(pk__in=ids)
            to_update.update(funding_status=new_funding_status)
            return Response({})
        return Response({}, status=httpstatus.HTTP_400_BAD_REQUEST)

    @detail_route(methods=["get"])
    def audit_log(self, request, pk=None):
        program = Program.objects.get(pk=pk)

        queryset = program.audit_logs.all()
        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = ProgramAuditLogSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
