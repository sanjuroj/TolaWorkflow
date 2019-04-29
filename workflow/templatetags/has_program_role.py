from django import template

register = template.Library()


@register.simple_tag
def has_program_role(user, program, role):
    if not user.is_authenticated:
        return False
    else:
        return user.is_superuser or user.tola_user.programaccess_set.filter(program=program, role=role).exists()
