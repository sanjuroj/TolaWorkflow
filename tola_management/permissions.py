from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.db.models import Q

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
        or user.tola_user.countryaccess_set.filter(
            role='basic_admin'
        ).count() > 0
    )

#wrap a decorator to unify interface between various read/write operations,
#some of which only have a pk and some of which use a program and indicator id
def result_pk_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            result = Result.objects.get(pk=kwargs['pk'])
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
    return user.is_authenticated() and (Program.objects.filter(pk=program, user_access=user.tola_user).count() > 0 or Program.objects.filter(pk=program, country__in=user.tola_user.countries.all()).count() > 0)

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

def user_has_site_access(tola_user, site):
    site_access_count = (
        SiteProfile.objects.filter(
            Q(projectagreement__program__in=tola_user.program_access.all())
            | Q(result__program__in=tola_user.program_access.all())
            | Q(country__in=tola_user.countries.all()),
            pk=site
        ).count()
    )
    return site_access_count > 0

def has_site_create_access(func):
    def wrapper(request, *args, **kwargs):
        site = SiteProfile.objects.get(pk=kwargs['pk'])
        programs = Program.objects.filter(country__in=[request.POST.get('country')]).distinct()
        write_access = (user_has_program_roles(request.user, [program.id for program in programs], ['high']) or request.user.is_superuser)
        request.has_write_access = write_access
        if  write_access:
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
            programs = Program.objects.filter(
                Q(agreement__in=site.projectagreement_set.all())
                | Q(i_program__in=site.result_set.all())
                | Q(country__in=[site.country])).distinct()
            write_access = (user_has_program_roles(request.user, [program.id for program in programs], ['high']) or request.user.is_superuser)
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

def has_result_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
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
            raise PermissionDenied
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
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return request.user.is_superadmin or request.user.tola_user.managed_programs.filter(id=obj.id).exists()


class HasCountryAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superadmin

    def has_object_permission(self, request, view, obj):
        return request.user.is_superadmin
