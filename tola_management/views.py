# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import json

from rest_framework.generics import ListAPIView
from rest_framework.serializers import Serializer, CharField, IntegerField, PrimaryKeyRelatedField, BooleanField
from rest_framework.response import Response
from rest_framework import viewsets, mixins, pagination

from tola.util import (
    getCountry
)

from feed.views import (
    TolaUserViewSet, OrganizationViewSet, SmallResultsSetPagination
)

from feed.serializers import (
    OrganizationSerializer
)

from workflow.models import (
    TolaUser,
    Organization
)

def get_user_page_context(request):
    return {
        "available_countries": list(getCountry(request.user).values())
    }

# Create your views here.
@login_required(login_url='/accounts/login/')
def app_host_page(request, react_app_page):
    js_context = {}
    if react_app_page == 'user':
        js_context = get_user_page_context(request)

    json_context = json.dumps(js_context, cls=DjangoJSONEncoder)
    return render(request, 'react_app_base.html', {"bundle_name": "tola_management_"+react_app_page, "js_context": json_context, "report_wide": True})

class UserAdminSerializer(Serializer):
    id = IntegerField()
    name = CharField(max_length=100)
    organization_name = CharField(max_length=255)
    organization_id = IntegerField()
    user_programs = IntegerField()
    is_active = BooleanField()

    class Meta:
        fields = ('id', 'name', 'organization_name', 'organization_id', 'user_programs', 'is_active')

class UserAdminViewSet(viewsets.GenericViewSet):
    serializer_class = UserAdminSerializer
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        req = self.request

        params = []

        country_join = ''
        country_where = ''
        if req.GET.get('country'):
            params.append(req.GET.get('country'))
            params.append(req.GET.get('country'))
            country_join = 'INNER JOIN workflow_tolauser_countries wtuc ON wtuc.tolauser_id = wtu.id'
            country_where = 'AND (wtuc.country_id = %s OR wtu.country_id = %s)'

        print(country_join)

        base_country_where = ''
        if req.GET.get('base_country'):
            params.append(req.GET.get('base_country'))
            base_country_where = 'AND wtu.country_id = %s'

        return TolaUser.objects.raw("""
            SELECT
                wtu.id,
                au.is_active AS is_active,
                wtu.name,
                wo.name AS organization_name,
                wo.id AS organization_id,
                COUNT(z.program_id) AS user_programs
            FROM workflow_tolauser wtu
            INNER JOIN auth_user au ON wtu.user_id = au.id
            {country_join}
            LEFT JOIN (
                    SELECT
                        wpua.tolauser_id,
                        wpua.program_id
                    FROM workflow_program_user_access wpua
                UNION DISTINCT
                    SELECT
                        wtuc.tolauser_id,
                        wpc.program_id
                    FROM workflow_tolauser_countries wtuc
                    INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
            ) z ON z.tolauser_id = wtu.id
            LEFT JOIN workflow_organization wo ON wtu.organization_id = wo.id
            WHERE
                1=1
                {country_where}
                {base_country_where}
            GROUP BY wtu.id
        """.format(
            country_join=country_join,
            country_where=country_where,
            base_country_where=base_country_where
        ), params)

    def list(self, request):
        queryset = self.get_queryset()

        #TODO write a more performant paginator, rather than converting the
        #query to a list. For now, we're extremely performant with about 1000
        #rows, so just convert to a list and paginate that way
        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
