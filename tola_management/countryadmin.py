import json
from collections import OrderedDict
from django.db import transaction
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response

from rest_framework import serializers

from feed.views import SmallResultsSetPagination

from workflow.models import (
    Country,
    Organization,
    Program,
    TolaUser,
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


class CountryAdminSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(allow_null=True, required=False)
    country = serializers.CharField(required=True, max_length=255)
    description = serializers.CharField(allow_blank=True, required=False)
    code = serializers.CharField(max_length=4, allow_blank=True, required=False)

    class Meta:
        model = Country
        fields = (
            'id',
            'country',
            'description',
            'code',
        )

    def to_representation(self, country, with_aggregates=True):
        ret = super(CountryAdminSerializer, self).to_representation(country)
        if not with_aggregates:
            return ret

        # users to country by way of program access
        user_query1 = TolaUser.objects.filter(program_access__country__id=country.id).select_related('organization').distinct()
        # users to country by way of country access
        user_query2 = TolaUser.objects.filter(country__id=country.id).select_related('organization')
        country_users = user_query1.union(user_query2)

        organizations = set([tu.organization_id for tu in country_users if tu.organization_id])

        # users directly associated with the country (base country)
        user_count = TolaUser.objects.filter(country=country).count()

        program_ids = [program.id for program in Program.objects.filter(country__pk=country.id)]
        program_count = len(program_ids)
        ret['programCount'] = program_count
        #ret['users_count'] = len(country_users)
        ret['user_count'] = user_count
        ret['organizations'] = organizations
        return ret


class CountryAdminViewSet(viewsets.ModelViewSet):
    serializer_class = CountryAdminSerializer
    pagination_class = Paginator

    def get_queryset(self):
        viewing_user = self.request.user
        params = self.request.query_params

        queryset = Country.objects.all()

        if not viewing_user.is_superuser:
            #TODO limit queryset for viewing user
            pass

        countryFilter = params.getlist('countries[]')
        if countryFilter:
            queryset = queryset.filter(pk__in=countryFilter)

        programParam = params.getlist('programs[]')
        if programParam:
            queryset = queryset.filter(program__in=programParam)


        organizationFilter = params.getlist('organizations[]')
        if organizationFilter:
            queryset = queryset.filter(
                Q(program__user_access__organization__in=organizationFilter) | Q(users__organization__in=organizationFilter)
            )

        return queryset.distinct()
