"""Querymanagers and proxymodels to abstract complex queries on indicator models

"""

from indicators.models import (
    Indicator,
    Level
)
from django.db import models
#from django.db.models import Sum, Avg, Subquery, OuterRef, Case, When, Q, F, Max

class NoTargetsIndicatorManager(models.Manager):
    
    def period(self, period_name, period_start, period_end):
        
        
    def add_level_name(self, qs):
        most_recent_level = Level.objects.filter(indicator__id=models.OuterRef('pk')).order_by('-id')
        return qs.annotate(
            level_name=models.Subquery(most_recent_level.values('name')[:1])
        )

    def get_queryset(self):
        qs = super(NoTargetsIndicatorManager, self).get_queryset()
        qs = self.add_level_name(qs)
        return qs

class IPTTIndicator(Indicator):
    SEPARATOR = '/'
    class Meta:
        proxy = True
        
    notargets = NoTargetsIndicatorManager()