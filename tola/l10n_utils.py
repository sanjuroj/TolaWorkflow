"""Utilities used throughout for internationalization

"""

from django.utils import formats
from django.conf import settings

def l10n_date(date):
    return formats.date_format(
        date,
        settings.DATE_AWARE_INDICATOR_DATE_FORMAT,
        use_l10n=True
    ).encode('UTF-8')

def l10n_monthly_date(date):
    return formats.date_format(
        date,
        settings.MONTHLY_INDICATOR_DATE_FORMAT,
        use_l10n=True
    ).encode('UTF-8')