import json
import logging
import re
from datetime import datetime, timedelta
from urlparse import urlparse

import dateparser
import requests
from dateutil.relativedelta import relativedelta
from django.contrib import messages
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse_lazy
from django.db import connection
from django.db.models import (
    Count, Min, Q, Sum, Avg, Max
)
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic.list import ListView

from indicators.serializers import LevelTierSerializer, LevelSerializer

from workflow.models import Program

from indicators.models import Level, LevelTier


logger = logging.getLogger(__name__)

class ResultsFrameworkBuilder(ListView):
    model = Level
    template_name = 'indicators/results_framework_page.html'
    metrics = False

    def get(self, request, *args, **kwargs):
        # TODO:  put in a try block
        program = Program.objects.get(pk=int(self.kwargs['program_id']))

        if request.user.is_anonymous or not request.user.tola_user.has_access(program_id=program.id):
            return HttpResponseRedirect('/')

        tiers = LevelTier.objects.filter(program=program)

        levels = Level.objects.filter(program=program)

        js_context = {
            'levels': LevelSerializer(levels, many=True).data,
            'levelTiers': LevelTierSerializer(tiers, many=True).data,
            'tierPresets': LevelTier.PRESETS,
        }

        context_data = {
            'js_context': js_context,
        }
        return render(request, self.template_name, context_data)


