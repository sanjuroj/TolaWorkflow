# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import json

from rest_framework.decorators import list_route, detail_route
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
    Organization,
    Program
)

def get_programs_for_user_queryset(user_id):
    return Program.objects.raw("""
        SELECT *
        FROM workflow_program wp
        INNER JOIN workflow_program_user_access wpuc ON wp.id = wpuc.program_id
        INNER JOIN workflow_program_country wpc ON wp.id = wpc.program_id
        INNER JOIN workflow_tolauser_countries wtc ON wtc.country_id = wpc.country_id
        WHERE wtc.tolauser_id = %s OR wpuc.tolauser_id = %s
    """, [user_id, user_id])

def get_user_page_context(request):
    programs_qs = get_programs_for_user_queryset(request.user.tola_user.id)

    programs = []
    for program in list(programs_qs):
        programs.append({"id": program.id, "name": program.name})

    return {
        "countries": list(getCountry(request.user).values()),
        "organizations": list(Organization.objects.all().values()),
        "programs": programs,
        "users": list(TolaUser.objects.all().values())
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
    is_admin = BooleanField()

    class Meta:
        fields = ('id', 'name', 'organization_name', 'organization_id', 'user_programs', 'is_active', 'is_admin')

class UserAdminViewSet(viewsets.ModelViewSet):
    serializer_class = UserAdminSerializer
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        req = self.request

        params = []

        country_join = ''
        country_where = ''
        if req.GET.getlist('countries[]'):
            params.extend(req.GET.getlist('countries[]'))
            params.extend(req.GET.getlist('countries[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('countries[]')))[:-1]

            country_join = 'INNER JOIN workflow_tolauser_countries wtuc ON wtuc.tolauser_id = wtu.id'
            country_where = 'AND (wtuc.country_id IN ({}) OR wtu.country_id IN ({}))'.format(in_param_string, in_param_string)

        base_country_where = ''
        if req.GET.getlist('base_countries[]'):
            params.extend(req.GET.getlist('base_countries[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('base_countries[]')))[:-1]

            base_country_where = 'AND wtu.country_id IN ({})'.format(in_param_string)

        program_join = ''
        program_where = ''
        if req.GET.getlist('programs[]'):
            params.extend(req.GET.getlist('programs[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('programs[]')))[:-1]

            program_join = """
                INNER JOIN (
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
                ) pz ON pz.tolauser_id = wtu.id
            """
            program_where = 'AND (pz.program_id IN ({}))'.format(in_param_string)

        user_status_where = ''
        if req.GET.get('user_status'):
            params.append(req.GET.get('user_status'))

            user_status_where = 'AND au.is_active = %s'

        admin_role_where = ''
        if req.GET.get('admin_role'):
            params.append(req.GET.get('admin_role'))

            admin_role_where = 'AND au.is_staff = %s'

        users_where = ''
        if req.GET.getlist('users[]'):
            params.extend(req.GET.getlist('users[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('users[]')))[:-1]

            users_where = 'AND wtu.id IN ({})'.format(in_param_string)

        return TolaUser.objects.raw("""
            SELECT
                wtu.id,
                au.is_active AS is_active,
                au.is_staff AS is_admin,
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
            {program_join}
            LEFT JOIN workflow_organization wo ON wtu.organization_id = wo.id
            WHERE
                1=1
                {country_where}
                {base_country_where}
                {program_where}
                {user_status_where}
                {admin_role_where}
                {users_where}
            GROUP BY wtu.id
        """.format(
            country_join=country_join,
            country_where=country_where,
            base_country_where=base_country_where,
            program_join=program_join,
            program_where=program_where,
            user_status_where=user_status_where,
            admin_role_where=admin_role_where,
            users_where=users_where
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

    @list_route(methods=['post'], url_path='create_user', url_name='create_user')
    def create_user(self, request):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return Response({
            'status': True
        })

    @detail_route(methods=['post'], url_path='update_user', url_name='update_user')
    def update_user(self, request, pk=None):
        print("??????????????????????????????????????")
