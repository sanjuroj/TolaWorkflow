"""Utilities used throughout for internationalization

"""

from django.utils import formats
import six
import decimal

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

def l10n_monthname(date):
    return _date_format(date, 'N')

def l10n_number(value):
    if isinstance(value, (decimal.Decimal, float) + six.integer_types):
        return formats.number_format(value, use_l10n=True)
    else:
        suffix = ''
        try:
            value = str(value).rstrip()
            if len(value) > 1 and value[-1] == '%':
                suffix = '%'
                value = value[:-1]
            if value.isdigit():
                value = int(value)
            elif value.replace('.', '', 1).isdigit():
                value = float(value)
            else:
                return str(value) + suffix
            return formats.number_format(value, use_l10n=True) + suffix
        except ValueError:
            return value
    return value