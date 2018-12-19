import django_tables2 as tables

from django.utils.translation import ugettext_lazy as _
from indicators.models import Result
from django_tables2.utils import A
from django.template.defaultfilters import floatformat

class AchievedColumn(tables.Column):
    def render(self, value):
        return floatformat(value, -2)

class ResultTable(tables.Table):

    agreement = tables.LinkColumn('projectagreement_update', args=[A('agreement_id')])

    class Meta:
        model = Result
        attrs = {"class": "paleblue"}
        fields = ('targeted', 'achieved', 'description', 'logframe_indicator',
                  'sector', 'community', 'agreement', 'complete')
        sequence = ('targeted', 'achieved', 'description',
                    'logframe_indicator', 'sector', 'community', 'agreement', 'complete')
