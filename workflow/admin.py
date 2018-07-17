
import dateutil
import datetime

from admin_report.mixins import ChartReportAdmin
from django.contrib import admin
from django.contrib.auth.models import User

from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget
from import_export.admin import ImportExportModelAdmin, ExportMixin

from tola.util import getCountry, get_GAIT_data
from .models import (
    Documentation, ProjectAgreement, ProjectComplete, ProjectType, Country, SiteProfile,
    Office, Program, TolaUser, District, Province, ProfileType, AdminLevelThree, TolaUserProxy,
    Organization, Village, Sector, Capacity, Evaluate, Benchmarks, Budget, Template, Monitor,
    ApprovalAuthority, Checklist, ChecklistItem, Stakeholder, Contact, StakeholderType, TolaSites, FormGuidance,
    TolaBookmarks,
    OrganizationAdmin, ProvinceAdmin, AdminLevelThreeAdmin,
    DistrictAdmin, SiteProfileAdmin, ProjectTypeAdmin,
    ChecklistAdmin, StakeholderAdmin, ContactAdmin,
    ChecklistItemAdmin, TolaUserAdmin, TolaSitesAdmin, FormGuidanceAdmin, TolaBookmarksAdmin
)


class OfficeFilter(admin.SimpleListFilter):
    title = "office"
    parameter_name = 'office'

    def lookups(self, request, model_admin):
        user_country = request.user.tola_user.country
        countries = Country.objects.filter(country=user_country).values('id', 'country')
        countries_tuple = ()
        for p in countries:
            countries_tuple = [(c['id'], c['country']) for c in countries]
        return countries_tuple

    def queryset(self, request, queryset):
        if self.value():
            queryset = queryset.filter(province__country=self.value())
        return queryset


class OfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'province', 'create_date', 'edit_date')
    search_fields = ('name', 'province__name', 'code')
    list_filter = ('create_date', OfficeFilter,)  # ('province__country__country')
    display = 'Office'

    def get_queryset(self, request):
        queryset = super(OfficeAdmin, self).get_queryset(request)
        if request.user.is_superuser is False:
            user_country = request.user.tola_user.country
            queryset = queryset.filter(province__country=user_country)
        return queryset


# Resource for CSV export
class DocumentationResource(resources.ModelResource):
    country = fields.Field(column_name='country', attribute='country', widget=ForeignKeyWidget(Country, 'country'))
    program = fields.Field(column_name='program', attribute='program', widget=ForeignKeyWidget(Program, 'name'))
    project = fields.Field(column_name='project', attribute='project', widget=ForeignKeyWidget(ProjectAgreement, 'project_name'))

    class Meta:
        model = Documentation
        widgets = {
                'create_date': {'format': '%d/%m/%Y'},
                'edit_date': {'format': '%d/%m/%Y'},
                'expected_start_date': {'format': '%d/%m/%Y'},
                }


class DocumentationAdmin(ImportExportModelAdmin):
    resource_class = DocumentationResource
    list_display = ('program', 'project')
    list_filter = ('program__country',)


# Resource for CSV export
class ProjectAgreementResource(resources.ModelResource):

    class Meta:
        model = ProjectAgreement
        widgets = {
                'create_date': {'format': '%d/%m/%Y'},
                'edit_date': {'format': '%d/%m/%Y'},
                'expected_start_date': {'format': '%d/%m/%Y'},
                'expected_end_date': {'format': '%d/%m/%Y'},
                }


class ProjectAgreementAdmin(ImportExportModelAdmin):
    resource_class = ProjectAgreementResource
    list_display = ('program', 'project_name', 'short', 'create_date')
    list_filter = ('program__country', 'short')
    filter_horizontal = ('capacity', 'evaluate', 'site', 'stakeholder')

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        # Filter by logged in users allowable countries
        user_countries = getCountry(request.user)
        # if not request.user.user.is_superuser:
        return queryset.filter(country__in=user_countries)

    pass


# Resource for CSV export
class ProjectCompleteResource(resources.ModelResource):

    class Meta:
        model = ProjectComplete
        widgets = {
                'create_date': {'format': '%d/%m/%Y'},
                'edit_date': {'format': '%d/%m/%Y'},
                'expected_start_date': {'format': '%d/%m/%Y'},
                'expected_end_date': {'format': '%d/%m/%Y'},
                'actual_start_date': {'format': '%d/%m/%Y'},
                'actual_end_date': {'format': '%d/%m/%Y'},
                }


class ProjectCompleteAdmin(ImportExportModelAdmin):
    resource_class = ProjectCompleteResource
    list_display = ('program', 'project_name', 'activity_code','short','create_date')
    list_filter = ('program__country', 'office', 'short')
    display = 'project_name'

    def queryset(self, request, queryset):
        """
        Returns the filtered queryset based on the value
        provided in the query string and retrievable via
        `self.value()`.
        """
        # Filter by logged in users allowable countries
        user_countries = getCountry(request.user)
        # if not request.user.user.is_superuser:
        return queryset.filter(country__in=user_countries)


# Resource for CSV export
class CountryResource(resources.ModelResource):

    class Meta:
        model = Country


class CountryAdmin(ImportExportModelAdmin):
    resource_class = CountryResource
    list_display = ('country','code','organization','create_date', 'edit_date')
    list_filter = ('country','organization__name')


# Resource for CSV export
class SiteProfileResource(resources.ModelResource):
    country = fields.Field(column_name='country', attribute='country', widget=ForeignKeyWidget(Country, 'country'))
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(ProfileType, 'profile'))
    office = fields.Field(column_name='office', attribute='office', widget=ForeignKeyWidget(Office, 'code'))
    district = fields.Field(column_name='admin level 2', attribute='district',
                            widget=ForeignKeyWidget(District, 'name'))
    province = fields.Field(column_name='admin level 1', attribute='province',
                            widget=ForeignKeyWidget(Province, 'name'))
    admin_level_three = fields.Field(column_name='admin level 3', attribute='admin_level_three',
                                     widget=ForeignKeyWidget(AdminLevelThree, 'name'))

    class Meta:
        model = SiteProfile
        skip_unchanged = True
        report_skipped = False
        # import_id_fields = ['id']


class SiteProfileAdmin(ImportExportModelAdmin):
    resource_class = SiteProfileResource
    list_display = ('name', 'office', 'country', 'province', 'district', 'admin_level_three', 'village')
    list_filter = ('country__country',)
    search_fields = ('office__code', 'country__country')


class ProgramAdmin(admin.ModelAdmin):
    list_display = ('countries', 'name', 'gaitid', 'description', 'budget_check', 'funding_status')
    search_fields = ('name', 'gaitid')
    list_filter = ('funding_status', 'country', 'budget_check', 'funding_status')
    display = 'Program'
    readonly_fields = ('start_date', 'end_date', 'reporting_period_start', 'reporting_period_end', )

    # Non-destructively save the GAIT start and end dates based on the value entered in the ID field.
    # Non-destructively populate the reporting start and end dates based on the GAIT dates.
    def save_model(self, request, obj, form, change):
        gait_data = get_GAIT_data([obj.gaitid])
        if len(gait_data) == 1:
            if not obj.start_date:
                try:
                    obj.start_date = dateutil.parser.parse(gait_data[0]['start_date']).date()
                except TypeError:
                    obj.start_date = None

            if not obj.end_date:
                try:
                    obj.end_date = dateutil.parser.parse(gait_data[0]['end_date']).date()
                except TypeError:
                    obj.end_date = None

            if not obj.reporting_period_start:
                obj.reporting_period_start = obj.start_date

            if not obj.reporting_period_end:
                if obj.end_date is None:
                    obj.reporting_end_date = None
                else:
                    next_month = obj.end_date.replace(day=28) + datetime.timedelta(days=4)
                    obj.reporting_period_end = obj.end_date - datetime.timedelta(days=next_month.day)

        super(ProgramAdmin, self).save_model(request, obj, form, change)


class ApprovalAuthorityAdmin(admin.ModelAdmin):
    list_display = ('approval_user','budget_limit','fund','country')
    display = 'Approval Authority'
    search_fields = ('approval_user__user__first_name', 'approval_user__user__last_name', 'country__country')
    list_filter = ('create_date','country')


class StakeholderAdmin(ImportExportModelAdmin):
    list_display = ('name', 'type', 'country', 'approval', 'approved_by', 'filled_by', 'create_date')
    display = 'Stakeholder List'
    list_filter = ('country', 'type')


class TolaUserProxyResource(resources.ModelResource):
    country = fields.Field(column_name='country', attribute='country', widget=ForeignKeyWidget(Country, 'country'))
    user = fields.Field(column_name='user', attribute='user', widget=ForeignKeyWidget(User, 'username'))
    email = fields.Field()

    def dehydrate_email(self, user):
            return '%s' % (user.user.email)

    class Meta:
        model = TolaUserProxy
        fields = ('title', 'name', 'user', 'country','create_date', 'email')
        export_order = ('title', 'name', 'user', 'country', 'email', 'create_date')


class ReportTolaUserProxyAdmin(ChartReportAdmin, ExportMixin, admin.ModelAdmin):

    resource_class = TolaUserProxyResource

    def get_queryset(self, request):

        qs = super(ReportTolaUserProxyAdmin, self).get_queryset(request)
        return qs.filter(user__is_active=True)

    list_display = ('title', 'name', 'user', 'email', 'country', 'create_date')
    list_filter = ('country', 'create_date', 'user__is_staff')

    def email(self, data):
        auth_users = User.objects.all()
        for a_user in auth_users:
            if data.user == a_user:
                email = a_user.email
        return email


admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(Province, ProvinceAdmin)
admin.site.register(Office, OfficeAdmin)
admin.site.register(District, DistrictAdmin)
admin.site.register(AdminLevelThree, AdminLevelThreeAdmin)
admin.site.register(Village)
admin.site.register(Program, ProgramAdmin)
admin.site.register(Sector)
admin.site.register(ProjectAgreement, ProjectAgreementAdmin)
admin.site.register(ProjectComplete, ProjectCompleteAdmin)
admin.site.register(Documentation,DocumentationAdmin)
admin.site.register(Template)
admin.site.register(SiteProfile, SiteProfileAdmin)
admin.site.register(Capacity)
admin.site.register(Monitor)
admin.site.register(Benchmarks)
admin.site.register(Evaluate)
admin.site.register(ProjectType, ProjectTypeAdmin)
admin.site.register(Budget)
admin.site.register(ProfileType)
admin.site.register(ApprovalAuthority, ApprovalAuthorityAdmin)
admin.site.register(ChecklistItem, ChecklistItemAdmin)
admin.site.register(Checklist, ChecklistAdmin)
admin.site.register(Stakeholder, StakeholderAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(StakeholderType)
admin.site.register(TolaUser,TolaUserAdmin)
admin.site.register(TolaSites,TolaSitesAdmin)
admin.site.register(FormGuidance,FormGuidanceAdmin)
admin.site.register(TolaUserProxy, ReportTolaUserProxyAdmin)
admin.site.register(TolaBookmarks, TolaBookmarksAdmin)
