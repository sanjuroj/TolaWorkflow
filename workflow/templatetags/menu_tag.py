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
    if request.user.is_authenticated():
        countries = request.user.tola_user.available_countries
    else:
        countries = Country.objects.none()
        programs = Program.objects.none()

    programs_by_country = OrderedDict((country.country, []) for country in countries)

    if request.user.is_authenticated():
        for program in programs:
            for country in program.country.all():
                # a program can be in multiple countries, including a country a user is not privy to
                if country.country in programs_by_country:
                    programs_by_country[country.country].append(program)

    return {
        'programs': programs,
        'countries': countries,
        'programs_by_country': programs_by_country,
    }
