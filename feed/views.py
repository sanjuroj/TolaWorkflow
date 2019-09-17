from tola_management.permissions import verify_program_access_level
from .serializers import (
    ProgramSerializer, UserSerializer, SectorSerializer, ProjectTypeSerializer, OfficeSerializer,
    SiteProfileSerializer, CountrySerializer, AgreementSerializer, CompleteSerializer,
    TolaUserSerializer, StakeholderSerializer, CapacitySerializer, StakeholderTypeSerializer,
    EvaluateSerializer, ProfileTypeSerializer, ProvinceSerializer, DistrictSerializer,
    AdminLevelThreeSerializer, VillageSerializer, ContactSerializer, DocumentationSerializer,
    LoggedUserSerializer, ChecklistSerializer, OrganizationSerializer, SiteProfileLightSerializer,
    SectorIdAndNameSerializer
)

from workflow.models import (
    Program, Sector, ProjectType, Office, SiteProfile, Country, ProjectComplete, Organization,
    ProjectAgreement, Stakeholder, Capacity, Evaluate, ProfileType, LoggedUser,
    Province, District, AdminLevelThree, Village, StakeholderType, Contact, Documentation, Checklist,
    TolaUser
)
from tola_management.permissions import verify_program_access_level
from django.contrib.auth.models import User
from django.db import models
from tola.util import getCountry
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
import django_filters

from workflow.mixins import APIDefaultsMixin


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class SmallResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50


# API Classes
class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for listing or retrieving users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # @list_route(methods=["get"])
    # def full_users(self, request):
    #     full_users = TolaUser.objects.all()
    #     page = self.paginate_queryset(full_users)
    #     if page is not None:
    #         serializer = TolaUserSerializer(page, many=True, context={"request": request})
    #         return self.get_paginated_response(serializer.data)

    #     serializer = TolaUserSerializer(full_users, many=True, context={"request": request})
    #     return Response(serializer.data)


class ProgramViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    search by country name and program name
    limit to users logged in country permissions
    """
    def list(self, request):
        user_countries = getCountry(request.user)
        queryset = Program.objects.all().filter(country__in=user_countries)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    filter_fields = ('country__country','name')
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer


class SectorViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    def get_serializer_class(self):
        if self.request.query_params.get('program', None):
            return SectorIdAndNameSerializer
        return SectorSerializer

    def get_queryset(self):
        program_id = self.request.query_params.get('program', None)
        if program_id:
            queryset = Sector.objects.filter(indicator__program__in=[program_id]).values('id', 'sector').distinct()
        else:
            queryset = Sector.objects.all()
        return queryset


class ProjectTypeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = ProjectType.objects.all()
    serializer_class = ProjectTypeSerializer


class OfficeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer


class SiteProfileViewSet(viewsets.ModelViewSet):
    """
    Search by country name and program name
    limit to users logged in country permissions
    """
    def get_serializer_class(self):
        if self.request.query_params.get('program', None):
            return SiteProfileLightSerializer
        return SiteProfileSerializer

    def list(self, request):
        user_countries = getCountry(request.user)
        queryset = SiteProfile.objects.all().filter(country__in=user_countries)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    filter_fields = ('country__country',)
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    queryset = SiteProfile .objects.all()


class CountryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class AgreementViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    Search by country name and program name
    limit to users logged in country permissions
    """
    def list(self, request):
        user_countries = getCountry(request.user)
        queryset = ProjectAgreement.objects.all().filter(program__country__in=user_countries)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    """
    def post(self,request):

        for each agreement
            insert int and string fields direct
            if FK field

        return blank
    """

    filter_fields = ('program__country__country', 'program__name')
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    queryset = ProjectAgreement.objects.all()
    serializer_class = AgreementSerializer
    pagination_class = SmallResultsSetPagination


class CompleteViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    Search by country name and program name
    limit to users logged in country permissions
    """
    def list(self, request):
        user_countries = getCountry(request.user)
        queryset = ProjectComplete.objects.all().filter(program__country__in=user_countries)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    filter_fields = ('program__country__country', 'program__name')
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    queryset = ProjectComplete.objects.all()
    serializer_class = CompleteSerializer
    pagination_class = SmallResultsSetPagination


class TolaUserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for listing or retrieving TolaUsers.

    """
    def list(self, request):
        queryset = TolaUser.objects.all()
        serializer = TolaUserSerializer(instance=queryset, context={'request': request}, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = TolaUser.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = TolaUserSerializer(instance=user, context={'request': request})
        return Response(serializer.data)

    queryset = TolaUser.objects.all()
    serializer_class = TolaUserSerializer


class StakeholderViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    Search by Country
    Limited to logged in users accessible countires
    """
    def list(self, request):
        user_countries = getCountry(request.user)
        queryset = Stakeholder.objects.all().filter(country__in=user_countries)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    filter_fields = ('country__country',)
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    queryset = Stakeholder.objects.all()
    serializer_class = StakeholderSerializer


class StakeholderTypeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = StakeholderType.objects.all()
    serializer_class = StakeholderTypeSerializer


class CapacityViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Capacity.objects.all()
    serializer_class = CapacitySerializer


class EvaluateViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Evaluate.objects.all()
    serializer_class = EvaluateSerializer


class ProfileTypeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = ProfileType.objects.all()
    serializer_class = ProfileTypeSerializer


class ProvinceViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer


class DistrictViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = District.objects.all()
    serializer_class = DistrictSerializer


class AdminLevelThreeViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = AdminLevelThree.objects.all()
    serializer_class = AdminLevelThreeSerializer


class VillageViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Village.objects.all()
    serializer_class = VillageSerializer


class ContactViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer


class DocumentationViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Documentation.objects.all()
    serializer_class = DocumentationSerializer


class ProjectAgreementViewSet(APIDefaultsMixin, viewsets.ModelViewSet):
    """API endpoint for getting ProjectAgreement."""

    queryset = ProjectAgreement.objects.order_by('create_date')
    serializer_class = AgreementSerializer


class LoggedUserViewSet(APIDefaultsMixin, viewsets.ModelViewSet):
    """API endpoint for getting Logged Users."""

    queryset = LoggedUser.objects.all()
    serializer_class = LoggedUserSerializer


class ChecklistViewSet(APIDefaultsMixin, viewsets.ModelViewSet):
    queryset = Checklist.objects.all()
    serializer_class = ChecklistSerializer


class OrganizationViewSet(APIDefaultsMixin, viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
