from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect

from workflow.models import (
    Program,
    TolaUser,
    Country,
    SiteProfile
)

from indicators.models import (
    Result,
    Indicator
)


def user_has_basic_or_super_admin(user):
    return (
        user.is_superuser
        or (
            user.tola_user.organization_id == 1
            and user.tola_user.countryaccess_set.filter(
                role='basic_admin'
            ).count() > 0
        )
    )

#wrap a decorator to unify interface between various read/write operations,
#some of which only have a pk and some of which use a program and indicator id
def result_pk_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            result = get_object_or_404(Result, pk=kwargs.get('pk'))
            indicator_id = result.indicator_id
            program_id = result.program_id
            kwargs['program'] = program_id
            kwargs['indicator'] = indicator_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def indicator_pk_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            indicator = Indicator.objects.get(pk=kwargs['pk'])
            kwargs['program'] = indicator.program_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def periodic_target_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            indicator = Indicator.objects.get(pk=kwargs['indicator'])
            kwargs['program'] = indicator.program_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def user_has_program_access(user, program):
    return user.is_authenticated() and (
        Program.objects.filter(pk=program, user_access=user.tola_user)
        | Program.objects.filter(pk=program, country__in=user.tola_user.countries.all())
        | Program.objects.filter(pk=program, country=user.tola_user.country)
    ).exists()

def user_has_program_roles(user, programs, roles):
    return user.is_authenticated() and user.tola_user.programaccess_set.filter(program_id__in=programs, role__in=roles).count() > 0

def has_iptt_read_access(func):
    def wrapper(request, *args, **kwargs):
        program = kwargs['program_id']

        if user_has_program_access(request.user, program) or request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def user_has_site_access(user, site):
    return user.is_authenticated() and (SiteProfile.objects.filter(
        country__in=user.tola_user.available_countries,
        pk=site
    ).exists() or user.is_superuser())

def has_site_create_access(func):
    def wrapper(request, *args, **kwargs):
        request.has_write_access = request.user.tola_user.programaccess_set.filter(role='high').exists() or request.user.is_superuser
        if request.has_write_access:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_site_delete_access(func):
    def wrapper(request, *args, **kwargs):
        site = SiteProfile.objects.get(pk=kwargs['pk'])
        high_role_programs = request.user.tola_user.programaccess_set.filter(role='high', country=site.country)
        request.has_write_access = Program.objects.filter(
            Q(agreement__in=site.projectagreement_set.all())
            | Q(i_program__in=site.result_set.all())
            | Q(country=site.country),
            id__in=high_role_programs.values('program_id')
        ).exists() or request.user.is_superuser
        if request.has_write_access:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_site_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_site_access(request.user, kwargs['pk']) or request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_site_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_site_access(request.user, kwargs['pk']) or request.user.is_superuser:
            site = SiteProfile.objects.get(pk=kwargs['pk'])
            high_role_programs = request.user.tola_user.programaccess_set.filter(role='high', country=site.country)
            request.has_write_access = Program.objects.filter(
                Q(agreement__in=site.projectagreement_set.all())
                | Q(i_program__in=site.result_set.all())
                | Q(country=site.country),
                id__in=high_role_programs.values('program_id')
            ).exists() or request.user.is_superuser
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_result_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['medium', 'high']) or request.user.is_superuser)
            request.has_write_access = write_access
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_result_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['medium', 'high']) or request.user.is_superuser)
            request.has_write_access = write_access
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_indicator_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_indicator_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['high']) or request.user.is_superuser)
            request.has_write_access = write_access
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_program_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['pk']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['pk']], ['high']) or request.user.is_superuser)
            request.has_write_access = write_access
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_program_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program_id']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program_id']], ['high']) or request.user.is_superuser)
            request.has_write_access = write_access
            return func(request, *args, **kwargs)
        else:
            return redirect('index')
    return wrapper


class HasUserAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return user_has_basic_or_super_admin(request.user)


class HasOrganizationAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return user_has_basic_or_super_admin(request.user)


class HasProgramAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'audit_log' or view.action=='export_audit_log':
            return request.user.tola_user.available_programs.filter(id=view.kwargs["pk"]).exists()

        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or request.user.tola_user.managed_programs.filter(id=obj.id).exists()


class HasCountryAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.is_superuser
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        tola_user = request.user.tola_user
        return request.user.is_superuser or obj in tola_user.managed_countries


class HasRelatedCountryAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        tola_user = request.user.tola_user
        if view.action == 'create':
            country_id = request.data.get('country')
            return (request.user.is_superuser or
                Country.objects.get(pk=country_id) in tola_user.managed_countries
            )
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        tola_user = request.user.tola_user
        return request.user.is_superuser or obj.country in tola_user.managed_countries
