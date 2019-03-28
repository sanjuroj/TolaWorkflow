import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic.list import ListView

from indicators.serializers import LevelTierSerializer, LevelSerializer
from indicators.models import Level, LevelTier
from workflow.models import Program


logger = logging.getLogger('django')


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
