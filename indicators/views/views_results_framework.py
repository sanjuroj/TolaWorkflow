import logging

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic.list import ListView

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from indicators.serializers import LevelTierSerializer, LevelSerializer
from indicators.models import Level, LevelTier
from workflow.models import Program


logger = logging.getLogger('django')

# TODO: add security
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
            'program_id': program.id,
            'levels': LevelSerializer(levels, many=True).data,
            'levelTiers': LevelTierSerializer(tiers, many=True).data,
            'tierPresets': LevelTier.PRESETS,
        }

        context_data = {
            'js_context': js_context,
        }
        return render(request, self.template_name, context_data)

# TODO: add security
class LevelViewSet (viewsets.ModelViewSet):

    serializer_class = LevelSerializer
    queryset = Level.objects.all()

# TODO: add security
@api_view(http_method_names=['POST'])
def insert_new_level(request):

    # Update new Level data in preparation for saving
    program = Program.objects.get(id=request.data['program'])
    parent = Level.objects.get(id=request.data['parent'])
    request.data['parent'] = parent
    request.data['program'] = program
    del request.data['ontology']
    del request.data['level_depth']

    # First update the customsort values of all Levels that getting pushed down by the new Level
    levels_to_shift = Level.objects\
        .filter(program=program, parent_id=parent.id, customsort__gte=request.data['customsort'])\
        .order_by('-customsort')
    for s_level in levels_to_shift:
        s_level.customsort += 1
        s_level.save()

    # Now the new level can be saved
    new_level = Level.objects.create(**request.data)
    new_level.save()

    # Return all Levels for the program. There shouldn't be so much that it slows things down much.
    return Response(LevelSerializer(Level.objects.filter(program=program), many=True).data)
