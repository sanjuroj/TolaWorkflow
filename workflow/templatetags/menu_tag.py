from collections import OrderedDict

from django import template
from django.db import models
from django.db.models import Q
from tola.util import getCountry
from workflow.models import Program, Country

register = template.Library()


@register.inclusion_tag('workflow/tags/program_menu.html', takes_context=True)
def program_menu(context):
    request = context['request']
    try:
        countries = request.user.tola_user.available_countries.distinct()
        programs = request.user.tola_user.available_programs.annotate(
            indicator_count=models.Count('indicator', distinct=True)
        ).filter(
            funding_status="Funded",
            indicator_count__gt=0
        ).prefetch_related('country').distinct()
    except AttributeError:
        countries = Country.objects.none()
        programs = Program.objects.none()

    programs_by_country = OrderedDict((country.country, []) for country in countries)

    if request.user.is_authenticated():
        if request.user.is_superuser:
            for program in programs:
                for country in program.country.all():
                    # a program can be in multiple countries, including a country a user is not privy to
                    if country.country in programs_by_country:
                        programs_by_country[country.country].append(program)
        else:
            admin_programs = programs.filter(country__in=Country.objects.filter(countryaccess__tolauser=request.user.tola_user)).prefetch_related('country')
            for program in admin_programs:
                for country in program.country.filter(countryaccess__tolauser=request.user.tola_user):
                    programs_by_country[country.country].append(program)

            for access in request.user.tola_user.programaccess_set.filter(program__in=programs).exclude(program__in=admin_programs).prefetch_related('country'):
                programs_by_country[access.country.country].append(access.program)

    return {
        'programs': programs,
        'countries': countries,
        'programs_by_country': programs_by_country,
    }
