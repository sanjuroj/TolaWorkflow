
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.db.models import Sum

from indicators.models import PeriodicTarget, Result

class ResultSerializer(serializers.ModelSerializer):
    cumsum = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = ('id', 'program', 'indicator', 'periodic_target', 'achieved',
                  'cumsum', 'date_collected', 'evidence', 'tola_table',
                  'agreement', 'complete', 'site', 'create_date', 'edit_date')

    def get_cumsum(self, obj):
      total_achieved = Result.objects.filter(
                indicator=obj.indicator,
                create_date__lt=obj.create_date)\
            .aggregate(Sum('achieved'))['achieved__sum']

      if total_achieved is None:
            total_achieved = 0
      total_achieved = total_achieved + obj.achieved
      return total_achieved


class PeriodictargetSerializer(serializers.ModelSerializer):
    result_set = ResultSerializer(many=True, read_only=True)
    result__achieved__sum = serializers.IntegerField()
    cumulative_sum = serializers.IntegerField()

    class Meta:
        model = PeriodicTarget
        fields = ('id', 'indicator', 'period', 'target', 'start_date',
                  'end_date', 'customsort', 'create_date', 'edit_date',
                  'result_set', 'result__achieved__sum',
                  'cumulative_sum')