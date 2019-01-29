"""
Data definitions and code related to Indicator Plan table view and XLS export
"""
from django.utils.translation import ugettext_lazy as _

# Column groupings
from indicators import models

PERFORMANCE_INDICATOR = _('Performance Indicator')
TARGETS = _('Targets')
DATA_ACQUISITION = _('Data Acquisition')
ANALYSES_AND_REPORTING = _('Analyses and Reporting')

# fields are either an Indicator attribute name (as str), or a callable
COLUMNS = [
    {
        'header': _('Level'),
        'group': PERFORMANCE_INDICATOR,
        'field': 'level',
    },
    {
        'header': _('No.'),
        'group': PERFORMANCE_INDICATOR,
        'field': 'number',
    },
    {
        'header': _('Performance Indicator'),
        'group': PERFORMANCE_INDICATOR,
        'field': 'name',
    },
    {
        'header': _('Indicator Source'),
        'group': PERFORMANCE_INDICATOR,
        'field': 'source',
    },
    {
        'header': _('Indicator Definition'),
        'group': PERFORMANCE_INDICATOR,
        'field': 'definition',
    },
    {
        'header': _('Disaggregation'),
        'group': PERFORMANCE_INDICATOR,
        'field': 'disaggregations',
    },

    {
        'header': _('Unit of Measure'),
        'group': TARGETS,
        'field': 'unit_of_measure',
    },
    {
        'header': _('Direction of Change'),
        'group': TARGETS,
        'field': lambda i: i.get_direction_of_change_display(),
    },
    {
        'header': _('# / %'),
        'group': TARGETS,
        'field': lambda i: i.get_unit_of_measure_type_display(),
    },
    {
        'header': _('Calculation'),
        'group': TARGETS,
        'field': lambda i: 'C' if i.is_cumulative else 'NC',
    },
    {
        'header': _('Baseline Value'),
        'group': TARGETS,
        'field': 'baseline',
    },
    {
        'header': _('LOP Target'),
        'group': TARGETS,
        'field': 'lop_target',
    },
    {
        'header': _('Rationale for target'),
        'group': TARGETS,
        'field': 'rationale_for_target',
    },
    {
        'header': _('Target frequency'),
        'group': TARGETS,
        'field': lambda i: i.get_target_frequency_display(),
    },

    {
        'header': _('Means of Verification'),
        'group': DATA_ACQUISITION,
        'field': 'means_of_verification',
    },
    {
        'header': _('Data collection method'),
        'group': DATA_ACQUISITION,
        'field': 'data_collection_method',
    },
    {
        'header': _('Frequency of data collection'),
        'group': DATA_ACQUISITION,
        'field': 'data_collection_frequency',
    },
    {
        'header': _('Data points'),
        'group': DATA_ACQUISITION,
        'field': 'data_points',
    },
    {
        'header': _('Responsible person(s) & team'),
        'group': DATA_ACQUISITION,
        'field': 'responsible_person',
    },

    {
        'header': _('Method of analysis'),
        'group': ANALYSES_AND_REPORTING,
        'field': 'method_of_analysis',
    },
    {
        'header': _('Information use'),
        'group': ANALYSES_AND_REPORTING,
        'field': 'information_use',
    },
    {
        'header': _('Frequency of reporting'),
        'group': ANALYSES_AND_REPORTING,
        'field': 'reporting_frequency',
    },
    {
        'header': _('Quality Assurance Measures'),
        'group': ANALYSES_AND_REPORTING,
        'field': 'quality_assurance',
    },
    {
        'header': _('Data Issues'),
        'group': ANALYSES_AND_REPORTING,
        'field': 'data_issues',
    },
    {
        'header': _('Comments'),
        'group': ANALYSES_AND_REPORTING,
        'field': 'comments',
    },
]


def row(indicator):
    """
    Return a row of the plan for an indicator with display values
    """
    r = []
    for col in COLUMNS:
        field = col['field']
        r.append(field(indicator) if callable(field) else getattr(indicator, field))
    return r


def column_names():
    """
    A list of column names
    """
    return [c['header'] for c in COLUMNS]


def indicator_queryset(program_id):
    """
    A QS of indicators to create the indicator plan from
    """
    return models.Indicator.objects.filter(program_id=program_id).select_related().order_by('level', 'number')
