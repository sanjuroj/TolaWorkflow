import simplejson
from datetime import datetime
from django.core.serializers import serialize
from django import template
from django.db.models import QuerySet
from django.utils.translation import ugettext_lazy as _
from django.utils.safestring import mark_safe
from indicators.models import Indicator
from django.conf import settings

register = template.Library()

@register.filter('convert2dateobject')
def convert2dateobject(value):
    try:
        return datetime.strptime(value, '%Y-%m-%d')
    except AttributeError:
        return value
    except Exception:
        return value

@register.filter
def concat_string(value1, value2):
    """
    concatenates two strings together
    Usage: <a href="{{ SOME_LINK|concat_string:object.pk }}">LINK</a>
    """
    return "%s%s" % (value1, value2)

@register.filter('jsonify')
def jsonify(object):
    if isinstance(object, QuerySet):
        return serialize('json', object)
    return simplejson.dumps(object)


@register.filter('symbolize_change')
def symbolize_change(value):
    """
    Returns corresponding math symbol for Direction of change
    Usage:
    {{ indicator.direction_of_change|symbolize_change}}
    """
    if value == Indicator.DIRECTION_OF_CHANGE_NEGATIVE:
        return _("-")

    if value == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
        return _("+")

    return _("N/A")


@register.filter('target_frequency_label')
def target_frequency_label(value):
    """
    Returns corresponding math symbol for Direction of change
    Usage:
    {{ indicator.target_frequency|target_frequency_label}}
    """
    try:
        value = value - 1
        return Indicator.TARGET_FREQUENCIES[value][1]
    except Exception:
        return value


@register.filter('symbolize_measuretype')
def symbolize_measuretype(value):
    """
    Returns corresponding math symbol for Direction of change
    Usage:
    {{ indicator.direction_of_change|symbolize_measuretype}}
    """
    if value == Indicator.NUMBER:
        return _("#")

    if value == Indicator.PERCENTAGE:
        return _("%")

    return ""


@register.filter('hash')
def hash(obj, attr):
    """
    Extracts an attributes's value from the object
    Usage:
    {{ object|getattr:attribute }}
    """
    # try:
    #     return obj.get(attr)
    # except Exception:
    #     return None
    if hasattr(obj, attr):
        return getattr(obj, attr)
    elif hasattr(obj, 'has_key') and attr in obj:
        return obj.get(attr)
    else:
        return None


@register.filter('js', is_safe=True)
def js(obj):
    """
    Render out JSON to get context data to JS

    Ex.

        <script type="text/javascript">
            var someVar = {{ some_var | js }};
        </script>
    """
    return mark_safe(jsonify(obj))


@register.inclusion_tag('indicators/tags/gauge-tank.html')
def gauge_tank(filled, filled_label, unfilled_label, title):
    return {
        'title': title,
        'filled': filled,
        'unfilled': 100 - filled,
        'filled_label': filled_label,
        'unfilled_label': unfilled_label,
        'ticks': list(range(1,11)),
        'margin': int(Indicator.ONSCOPE_MARGIN * 100),
    }


@register.inclusion_tag('indicators/tags/gauge-band.html')
def gauge_band(scope_percents):
    return {
        'scope_percents': scope_percents,
        'ticks': list(range(1,11)),
        'margin': int(Indicator.ONSCOPE_MARGIN * 100),
    }
