from django import template
from workflow.models import Program

register = template.Library()

@register.inclusion_tag('workflow/tags/program_menu.html', takes_context=True)
def program_menu(context):
    request = context['request']
    countries = request.user.tola_user.countries.all()
    programs = Program.objects.filter(funding_status="Funded", country__in=countries).distinct()
    return {
        'programs': programs,
        'countries': countries,
    }
