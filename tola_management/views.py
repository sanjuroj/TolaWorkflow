# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.serializers.json import DjangoJSONEncoder
from django.core import serializers
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.template import loader
from django.shortcuts import render
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.conf import settings
import json

from rest_framework.decorators import list_route, detail_route
from rest_framework.generics import ListAPIView
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    CharField,
    IntegerField,
    PrimaryKeyRelatedField,
    BooleanField
)
from rest_framework.response import Response
from rest_framework import viewsets, mixins, pagination, status

from django.contrib.auth.models import User,Group

from feed.views import (
    TolaUserViewSet,
    OrganizationViewSet,
    SmallResultsSetPagination
)

from feed.serializers import (
    OrganizationSerializer
)

from workflow.models import (
    TolaUser,
    Organization,
    Program,
    Sector,
    Country,
    TolaUserCountryRoles,
    TolaUserProgramRoles,
    Sector,
    COUNTRY_ROLE_CHOICES,
    PROGRAM_ROLE_CHOICES
)

from .models import (
    UserManagementAuditLog
)

def get_programs_for_user_queryset(user_id):
    return Program.objects.raw("""
            SELECT wp.id, wp.name, wc.id AS country_id, wc.country AS country_name
            FROM workflow_program wp
            INNER JOIN workflow_program_user_access wpuc ON wp.id = wpuc.program_id
            INNER JOIN workflow_program_country wpc ON wp.id = wpc.program_id
            INNER JOIN workflow_country wc ON wpc.country_id = wc.id
            WHERE wpuc.tolauser_id = %s
        UNION DISTINCT
            SELECT wp.id, wp.name, wc.id AS country_id, wc.country AS country_name
            FROM workflow_program wp
            INNER JOIN workflow_program_country wpc ON wp.id = wpc.program_id
            INNER JOIN workflow_country wc ON wpc.country_id = wc.id
            INNER JOIN workflow_tolauser_countries wtc ON wtc.country_id = wpc.country_id
            WHERE wtc.tolauser_id = %s
        UNION DISTINCT
            SELECT wp.id, wp.name, wc.id AS country_id, wc.country AS country_name
            FROM workflow_program wp
            INNER JOIN workflow_program_country wpc ON wp.id = wpc.program_id
            INNER JOIN workflow_country wc ON wpc.country_id = wc.id
            INNER JOIN workflow_tolauser wtu ON wtu.country_id = wc.id
            WHERE wtu.id = %s
    """, [user_id, user_id, user_id])

def get_user_page_context(request):
    countries = {}
    for country in Country.objects.all():
        countries[country.id] = {"id": country.id, "name": country.country, "programs": []}

    programs_qs = get_programs_for_user_queryset(request.user.tola_user.id)
    programs = {}
    for program in list(programs_qs):
        programs[program.id] = {"id": program.id, "name": program.name, "country_id": program.country_id}
        countries[program.country_id]["programs"].append(program.id)

    program_roles = {}
    for role in list(request.user.tola_user.program_roles.all()):
        program_roles[role.program_id] = {"id": role.program_id, "role": role.role}

    country_roles = {}
    for role in list(request.user.tola_user.country_roles.all()):
        country_roles[role.country_id] = {"id": role.country_id, "role": role.role}

    return {
        "countries": countries,
        "organizations": list(Organization.objects.all().values()),
        "programs": programs,
        "users": list(TolaUser.objects.all().values()),
        "program_roles": program_roles,
        "country_roles": country_roles,
        "is_superuser": request.user.is_superuser
    }

def get_organization_page_context(request):
    programs_qs = get_programs_for_user_queryset(request.user.tola_user.id)
    programs = {}
    for program in list(programs_qs):
        programs[program.id] = {"id": program.id, "name": program.name, "country_id": program.country_id}

    organizations = {}
    for o in Organization.objects.all():
        organizations[o.id] = {"id": o.id, "name": o.name}

    sectors = {}
    for sector in Sector.objects.all():
        sectors[sector.id] = {"id": sector.id, "name": sector.sector}

    return {
        "programs": programs,
        "organizations": organizations,
        "sectors": sectors
    }

def get_program_page_context(request):
    countries = {
        country.id : {
            'id': country.id,
            'name': country.country,
        } for country in Country.objects.all()
    }

    organizations = {
        organization.id : {
            'id': organization.id,
            'name': organization.name,
        } for organization in Organization.objects.all()
    }

    programs = [
        {
            'id': program.id,
            'name': program.name,
        } for program in Program.objects.all()
    ]

    # excluding sectors with no name (sector) set.
    sectors = [
        {
            'id': sector.id,
            'name': sector.sector,
        } for sector in Sector.objects.all() if sector.sector
    ]

    return {
        'countries': countries,
        'organizations': organizations,
        'programs': programs,
        'sectors': sectors,
    }

def send_new_user_registration_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    one_time_url = request.build_absolute_uri(reverse('one_time_registration', kwargs={"uidb64": uid, "token": token}))
    #fire off registration link email
    c = {'one_time_link': one_time_url, 'user': user}
    subject='Mercy Corps - Tola New Account Registration'
    email_template_name='registration/one_time_login_email.html'
    email = loader.render_to_string(email_template_name, c)
    send_mail(subject, email, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False, html_message=email)

# Create your views here.
@login_required(login_url='/accounts/login/')
def app_host_page(request, react_app_page):
    js_context = {}
    if react_app_page == 'user':
        js_context = get_user_page_context(request)
    elif react_app_page == 'organization':
        js_context = get_organization_page_context(request)
    elif react_app_page == 'program':
        js_context = get_program_page_context(request)

    json_context = json.dumps(js_context, cls=DjangoJSONEncoder)
    return render(request, 'react_app_base.html', {"bundle_name": "tola_management_"+react_app_page, "js_context": json_context, "report_wide": True})

class UserAdminSerializer(Serializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(max_length=100)
    organization_name = CharField(max_length=255, allow_null=True, allow_blank=True, required=False)
    email = CharField(max_length=255)
    phone_number = CharField(max_length=50, allow_null=True, allow_blank=True, required=False)
    mode_of_address = CharField(max_length=255, allow_null=True, allow_blank=True, required=False)
    mode_of_contact = CharField(max_length=3, allow_null=True, allow_blank=True, required=False)
    title = CharField(max_length=255, allow_null=True, allow_blank=True, required=False)
    organization_id = IntegerField()
    user_programs = IntegerField(required=False)
    is_active = BooleanField()
    is_admin = BooleanField(required=False)

    class Meta:
        fields = (
            'id',
            'name',
            'organization_name',
            'organization_id',
            'user_programs',
            'is_active',
            'is_admin',
            'title',
            'phone_number',
            'mode_of_address',
            'mode_of_contact',
            'email'
        )

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
                wtu.mode_of_contact,
                wtu.mode_of_address,
                wtu.phone_number,
                wtu.title,
                au.is_active AS is_active,
                au.is_staff AS is_admin,
                au.email AS email,
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

    def create(self, request):
        request.data["id"] = None
        request.data["is_active"] = True
        serializer = UserAdminSerializer(data=request.data)
        if(serializer.is_valid()):
            d = serializer.validated_data

            #create auth user
            new_django_user = User(
                username=d["email"],
                email=d["email"],
                is_active=d["is_active"]
            )
            new_django_user.save()

            #create tola user
            organization = Organization.objects.get(pk=d["organization_id"])
            new_user = TolaUser(
                name=d["name"],
                organization=organization,
                user=new_django_user,
                mode_of_address=d["mode_of_address"],
                mode_of_contact=d["mode_of_contact"],
                phone_number=d["phone_number"],
                title=d["title"]
            )
            new_user.save()

            send_new_user_registration_email(new_django_user, request)

            return Response({})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        user = TolaUser.objects.get(pk=pk)

        if not user:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserAdminSerializer(data=request.data)
        if(serializer.is_valid()):
            data = serializer.validated_data
            audit_entry = UserManagementAuditLog()
            audit_entry.change_type = 'user_profile_modified'
            audit_entry.previous_entry = serializers.serialize('json', [user])

            user.name = data["name"]
            user.email = data["email"]
            user.organization = Organization.objects.get(pk=data["organization_id"])
            user.mode_of_address = data["mode_of_address"]
            user.mode_of_contact = data["mode_of_contact"]
            user.title = data["title"]
            user.phone_number = data["phone_number"]
            user.save()
            user.user.is_active = data["is_active"]
            user.user.save()

            audit_entry.new_entry = serializers.serialize('json', [user])
            audit_entry.admin_user = request.user.tola_user
            audit_entry.modified_user = user
            audit_entry.save()

            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['post'])
    def resend_registration_email(self, request, pk=None):
        tola_user = TolaUser.objects.get(pk=pk)
        send_new_user_registration_email(tola_user.user, request)
        return Response({})

    @detail_route(methods=['get'])
    def history(self, request, pk=None):
        user = TolaUser.objects.get(pk=pk)
        history_log = UserManagementAuditLog.objects.filter(modified_user=user).select_related('admin_user').order_by('-date')
        return Response([{"date": entry.date, "admin_name": entry.admin_user.name, "change_type": entry.change_type, "previous": entry.previous_entry, "new": entry.new_entry} for entry in history_log])

    @detail_route(methods=['get', 'put'])
    def program_access(self, request, pk=None):
        user = TolaUser.objects.get(pk=pk)

        if request.method == 'PUT':

            audit_entry = UserManagementAuditLog()
            audit_entry.change_type = 'user_programs_modified'
            audit_entry.previous_entry = serializers.serialize('json', [user])
            audit_entry.admin_user = request.user.tola_user
            audit_entry.modified_user = user

            audit_entry.previous_entry = json.dumps({"countries": [country.id for country in user.countries.all()], "programs": [program.id for program in user.program_access.all()]}, cls=DjangoJSONEncoder)

            country_data = request.data["country"]
            added_countries = []
            removed_countries = []
            for country_id, permissions in country_data.iteritems():
                if "has_access" in permissions and permissions["has_access"]:
                    added_countries.append(country_id)
                else:
                    removed_countries.append(country_id)

                if "permission_level" in permissions:
                    TolaUserCountryRoles.objects.update_or_create(
                        user_id=user.id,
                        country_id=country_id,
                        defaults={
                            "role": permissions["permission_level"],
                        }
                    )

            user.countries.add(*list(Country.objects.filter(pk__in=added_countries)))
            user.countries.remove(*list(Country.objects.filter(pk__in=removed_countries)))

            program_data = request.data["program"]
            added_programs = []
            removed_programs = []
            for program_id, permissions in program_data.iteritems():
                if "has_access" in permissions and permissions["has_access"]:
                    added_programs.append(program_id)
                else:
                    removed_programs.append(program_id)

                if "permission_level" in permissions:
                    TolaUserProgramRoles.objects.update_or_create(
                        user_id=user.id,
                        program_id=program_id,
                        defaults={
                            "role": permissions["permission_level"],
                        }
                    )

            user.program_access.add(*list(Program.objects.filter(pk__in=added_programs)))
            user.program_access.remove(*list(Program.objects.filter(pk__in=removed_programs)))

            audit_entry.new_entry = json.dumps({"countries": [country.id for country in user.countries.all()], "programs": [program.id for program in user.program_access.all()]}, cls=DjangoJSONEncoder)
            audit_entry.save()

            return Response({}, status=status.HTTP_200_OK)

        elif request.method == 'GET':

            country_access = {}
            for country in user.countries.all():
                country_access[country.id] = {
                    "has_access": True
                }

            for country_role in user.country_roles.all():
                if country_role.country.id in country_access:
                    country_access[country_role.country.id]["permission_level"] = country_role.role

            program_access = {}
            for program in user.program_access.all():
                program_access[program.id] = {
                    "has_access": True
                }

            for program_role in user.program_roles.all():
                if program_role.program.id in program_access:
                    program_access[program_role.program.id]["permission_level"] = program_role.role

            return Response({
                "country": country_access,
                "program": program_access
            })

    @list_route(methods=["post"])
    def bulk_update_status(self, request):

        tola_users = TolaUser.objects.filter(pk__in=request.data["user_ids"])
        User.objects.filter(pk__in=[t_user.user_id for t_user in tola_users]).update(is_active=bool(request.data["new_status"]))
        return Response({})


    @list_route(methods=["post"])
    def bulk_add_programs(self, request):
        added_programs = request.data["added_programs"]

        for user_id in request.data["user_ids"]:
            user = TolaUser.objects.get(pk=user_id)
            user.program_access.add(*list(Program.objects.filter(pk__in=added_programs)))

        return Response({})

    @list_route(methods=["post"])
    def bulk_remove_programs(self, request):
        removed_programs = request.data["removed_programs"]

        for user_id in request.data["user_ids"]:
            user = TolaUser.objects.get(pk=user_id)
            user.program_access.remove(*list(Program.objects.filter(pk__in=removed_programs)))

        return Response({})


class OrganizationAdminSerializer(Serializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(max_length=100)
    primary_address = CharField(max_length=255)
    primary_contact_name = CharField(max_length=255)
    primary_contact_email = CharField(max_length=255)
    primary_contact_phone = CharField(max_length=255)
    mode_of_contact = CharField(required=False, allow_null=True, allow_blank=True, max_length=255)
    program_count = IntegerField(allow_null=True, required=False)
    user_count = IntegerField(allow_null=True, required=False)
    is_active = BooleanField()

    class Meta:
        fields = (
            'id',
            'name',
            'primary_address',
            'primary_contact_name',
            'primary_contact_email',
            'primary_contact_phone',
            'mode_of_contact',
            'program_count',
            'user_count',
            'is_active',
        )

class SectorSerializer(ModelSerializer):
    id = IntegerField(required=False)

    class Meta:
        model = Sector
        fields = "__all__"

class OrganizationSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(required=True)
    primary_address = CharField(required=True)
    primary_contact_name = CharField(required=True)
    primary_contact_email = CharField(required=True)
    primary_contact_phone = CharField(required=True)
    sectors = SectorSerializer(many=True, default={})

    def update(self, instance, validated_data):
        sectors = validated_data.pop('sectors')
        print(sectors)
        instance.sectors.add(*[sector["id"] for sector in sectors])
        return super(OrganizationSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        sectors = validated_data.pop('sectors')
        org = Organization.objects.create(**validated_data)
        org.sectors.add(*[sector["id"] for sector in sectors])
        return org

    class Meta:
        model = Organization
        fields = (
            'id',
            'name',
            'primary_address',
            'primary_contact_name',
            'primary_contact_email',
            'primary_contact_phone',
            'mode_of_contact',
            'is_active',
            'sectors'
        )

class OrganizationAdminViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()
    pagination_class = SmallResultsSetPagination

    def get_listing_queryset(self):
        req = self.request

        params = []

        country_where = ''
        if req.GET.getlist('countries[]'):
            params.extend(req.GET.getlist('countries[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('countries[]')))[:-1]

            country_where = 'AND wtu.country_id IN ({})'.format(in_param_string)

        program_where = ''
        program_join = ''
        if req.GET.getlist('programs[]'):
            params.extend(req.GET.getlist('programs[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('programs[]')))[:-1]

            program_join = """
                LEFT JOIN (
                    SELECT
                        wo.id AS organization_id,
                        pz.program_id AS program_id
                    FROM workflow_organization wo
                    INNER JOIN workflow_tolauser wtu ON wo.id = wtu.organization_id
                    INNER JOIN (
                        SELECT MAX(tu_p.tolauser_id) as tolauser_id, tu_p.program_id
                        FROM (
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
                        ) tu_p
                        GROUP BY tu_p.program_id
                    ) pz ON pz.tolauser_id = wtu.id
                    GROUP BY wo.id, pz.program_id
                ) pzz ON pzz.organization_id = wo.id
            """

            program_where = 'AND (pzz.program_id IN ({}))'.format(in_param_string)

        organization_where = ''
        if req.GET.getlist('organizations[]'):
            params.extend(req.GET.getlist('organizations[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('organizations[]')))[:-1]

            organization_where = 'AND (wo.id IN ({}))'.format(in_param_string)

        organization_status_where = ''
        if req.GET.get('organization_status'):
            params.append(req.GET.get('organization_status'))

            user_status_where = 'AND au.is_active = %s'

        sector_join = ''
        sector_where = ''
        if req.GET.get('sectors[]'):
            params.extend(req.GET.getlist('sectors[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('sectors[]')))[:-1]
            sector_join = 'INNER JOIN workflow_organization_sectors wos ON wos.organization_id = wo.id'

            sector_where = 'AND (wos.sector_id IN ({}))'.format(in_param_string)

        return Organization.objects.raw("""
            SELECT
                wo.id,
                wo.name,
                wo.primary_address,
                wo.primary_contact_name,
                wo.primary_contact_email,
                wo.primary_contact_phone,
                wo.mode_of_contact,
                COUNT(DISTINCT wtu.id) AS user_count,
                COUNT(DISTINCT pz.program_id) AS program_count,
                wo.is_active
            FROM workflow_organization wo
            LEFT JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
            LEFT JOIN (
                SELECT
                    wo.id AS organization_id,
                    pz.program_id AS program_id
                FROM workflow_organization wo
                INNER JOIN workflow_tolauser wtu ON wo.id = wtu.organization_id
                INNER JOIN (
                    SELECT MAX(tu_p.tolauser_id) as tolauser_id, tu_p.program_id
                    FROM (
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
                    ) tu_p
                    GROUP BY tu_p.program_id
                ) pz ON pz.tolauser_id = wtu.id
                GROUP BY wo.id, pz.program_id
            ) pz ON pz.organization_id = wo.id
            {program_join}
            {sector_join}
            WHERE
                1=1
                {program_where}
                {country_where}
                {organization_where}
                {sector_where}
            GROUP BY wo.id
        """.format(
            program_where=program_where,
            program_join=program_join,
            country_where=country_where,
            organization_where=organization_where,
            sector_join=sector_join,
            sector_where=sector_where
        ), params)

    def list(self, request):
        queryset = self.get_listing_queryset()

        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = OrganizationAdminSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = OrganizationAdminSerializer(queryset, many=True)
        return Response(serializer.data)

    @detail_route(methods=["get"])
    def aggregate_data(self, request, pk=None):
        if not pk:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        result = list(Organization.objects.raw("""
            SELECT
                wo.id,
                COUNT(DISTINCT wtu.id) AS user_count,
                COUNT(DISTINCT pz.program_id) AS program_count
            FROM workflow_organization wo
            LEFT JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
            LEFT JOIN (
                SELECT
                    wo.id AS organization_id,
                    pz.program_id AS program_id
                FROM workflow_organization wo
                INNER JOIN workflow_tolauser wtu ON wo.id = wtu.organization_id
                INNER JOIN (
                    SELECT MAX(tu_p.tolauser_id) as tolauser_id, tu_p.program_id
                    FROM (
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
                    ) tu_p
                    GROUP BY tu_p.program_id
                ) pz ON pz.tolauser_id = wtu.id
                GROUP BY wo.id, pz.program_id
            ) pz ON pz.organization_id = wo.id
            WHERE
                wo.id = %s
            GROUP BY wo.id
        """, [pk]))

        if len(result) < 1:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "user_count": result[0].user_count,
            "program_count": result[0].program_count
        })
