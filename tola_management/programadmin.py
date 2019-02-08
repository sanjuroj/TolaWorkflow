from collections import OrderedDict
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status as httpstatus
from rest_framework.validators import UniqueValidator
from rest_framework.decorators import list_route
from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    CharField,
    IntegerField,
    ValidationError,
)

from feed.views import SmallResultsSetPagination

from workflow.models import (
    Program,
    TolaUser,
    Organization,
    Country,
    Sector,
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

    def to_internal_value(id, data):
        sector = Sector.objects.get(pk=data)
        return sector


class NestedCountrySerializer(Serializer):

    def to_representation(self, country):
        return country.id

    def to_internal_value(id, data):
        country = Country.objects.get(pk=data)
        return country

class ProgramAdminSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(required=True, max_length=255)
    funding_status = CharField(required=True)
    gaitid = CharField(required=True, validators=[
        UniqueValidator(queryset=Program.objects.all())
    ])
    description = CharField(allow_blank=True)
    sector = NestedSectorSerializer(required=True, many=True)
    country = NestedCountrySerializer(required=True, many=True)

    def validate_country(self, values):
        if not values:
            raise ValidationError("This field may not be blank.")

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

    def create(self, validated_data):
        country = validated_data.pop('country')
        sector = validated_data.pop('sector')
        program = super(ProgramAdminSerializer, self).create(validated_data)
        program.country.add(*country)
        program.sector.add(*sector)
        return program

    def update(self, instance, validated_data):

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
        return super(ProgramAdminSerializer, self).update(instance, validated_data)

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

        programParam = params.getlist('programs[]')
        if programParam:
            queryset = queryset.filter(pk__in=programParam)

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
