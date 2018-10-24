"""Utilities used throughout for internationalization

"""

from django.utils import formats


def _date_format(date, format):
    return formats.date_format(
        date,
        format,
        use_l10n=True
    ).encode('UTF-8')


def l10n_date_iso(date):
    return _date_format(date, 'DATE_FORMAT')


def l10n_date_short(date):
    return _date_format(date, 'SHORT_DATE_FORMAT')


def l10n_date_medium(date):
    return _date_format(date, 'MEDIUM_DATE_FORMAT')


def l10n_date_long(date):
    return _date_format(date, 'LONG_DATE_FORMAT')


def l10n_date_year_month(date):
    return _date_format(date, 'YEAR_MONTH_FORMAT')
