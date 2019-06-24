import logging
import copy
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic.list import ListView

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from indicators.serializers import LevelTierSerializer, LevelSerializer, IndicatorSerializerMinimal, \
    ProgramObjectiveSerializer
from indicators.models import Level, LevelTier, Indicator
from workflow.models import Program


logger = logging.getLogger('__name__')

# TODO: add security
class ResultsFrameworkBuilder(ListView):
    model = Level
    template_name = 'indicators/results_framework_page.html'
    metrics = False

    def get(self, request, *args, **kwargs):
        # TODO:  put in a try block
        program = Program.objects.prefetch_related('level_tiers').get(pk=int(self.kwargs['program_id']))
        role = request.user.tola_user.program_role(program.id)

        if request.user.is_anonymous \
                or not role \
                or (role in ['low', 'medium'] and program.level_tiers.count() == 0):
            return HttpResponseRedirect('/')

        tiers = LevelTier.objects.filter(program=program)
        levels = Level.objects.filter(program=program)
        # All indicators associated with the program should be passed to the front-end, not just the ones
        # associated with the rf levels.  The front-end uses the overall count to determine whether
        # the program name in the header should be plain text or a link.
        indicators = Indicator.objects.filter(program=program, deleted__isnull=True)

        js_context = {
            'program_id': program.id,
            'levels': LevelSerializer(levels, many=True).data,
            'indicators': IndicatorSerializerMinimal(indicators, many=True).data,
            'levelTiers': LevelTierSerializer(tiers, many=True).data,
            'tierTemplates': LevelTier.TEMPLATES,
            'programObjectives': ProgramObjectiveSerializer(program.objective_set.all(), many=True).data,
            'accessLevel': role,
        }

        context_data = {
            'program': program,
            'indicator_count': indicators.count(),
            'js_context': js_context,
        }
        return render(request, self.template_name, context_data)

# TODO: add security
class LevelViewSet (viewsets.ModelViewSet):

    serializer_class = LevelSerializer
    queryset = Level.objects.all()

    def destroy(self, request, pk=None):
        instance = self.get_object()
        program = instance.program
        parent = instance.parent

        role = request.user.tola_user.program_role(program.id)
        if request.user.is_anonymous or role != 'high':
            return HttpResponseRedirect('/')

        self.perform_destroy(instance)
        try:
            levels_to_shift = Level.objects \
                .filter(program=program, parent=parent) \
                .order_by('customsort')
            for i, s_level in enumerate(levels_to_shift):
                s_level.customsort = i + 1
                s_level.save()

            all_levels = Level.objects.filter(program=instance.program)

            # Need to delete the leveltiers associated with the program when the last level is deleted.
            if len(all_levels) == 0:
                for tier in LevelTier.objects.filter(program=program):
                    tier.delete()
            return Response(LevelSerializer(all_levels, many=True).data)
        except Exception as e:
            logger.error(e)
            return render(request, '500.html', status=500)


# TODO: add security
@api_view(http_method_names=['POST'])
def insert_new_level(request):
    level_data = copy.copy(request.data)
    program = Program.objects.get(id=request.data['program'])

    role = request.user.tola_user.program_role(program.id)
    if request.user.is_anonymous or role != 'high':
        return HttpResponseRedirect('/')

    # Update new Level data in preparation for saving
    if request.data['parent'] == "root":
        parent = None
    else:
        parent = Level.objects.get(id=request.data['parent'])
    level_data['parent'] = parent
    level_data['program'] = program
    if 'ontology' in request.data:
        del level_data['ontology']
    del level_data['level_depth']

    # First update the customsort values of all Levels that getting pushed down by the new Level.
    # No need to do it if the top tier level is being saved
    if request.data['parent'] != "root":
        levels_to_shift = Level.objects\
            .filter(program=program, parent_id=parent.id, customsort__gte=request.data['customsort'])\
            .order_by('-customsort')
        for s_level in levels_to_shift:
            s_level.customsort += 1
            s_level.save()

    # Now the new level can be saved
    new_level = Level.objects.create(**level_data)
    new_level.save()

    # Return all Levels for the program. There shouldn't be so much that it slows things down much.
    # Also return the newly created Level.
    all_data = LevelSerializer(Level.objects.filter(program=program), many=True).data
    return Response({'all_data': all_data, 'new_level': LevelSerializer(new_level).data})

# TODO: add security
@api_view(http_method_names=['POST'])
def save_leveltiers(request):
    program = Program.objects.get(id=request.data['program_id'])
    role = request.user.tola_user.program_role(program.id)
    if request.user.is_anonymous or role != 'high':
        return HttpResponseRedirect('/')

    for n, tier in enumerate(request.data['tiers']):
        tierObj = LevelTier.objects.create(
            program=program,
            tier_depth=n+1,
            name=tier
        )
        tierObj.save()
    return Response({"message": "success"})

# TODO: add security
@login_required
@api_view(http_method_names=['POST'])
def reorder_indicators(request):
    program_ids = list({Indicator.objects.get(pk=i['id']).program.id for i in request.data})
    role = request.user.tola_user.program_role(program_ids[0])
    if request.user.is_anonymous or len(program_ids) > 1 or role != 'high':
        return HttpResponseRedirect('/')

    level_order_map = {i['id']:i['level_order'] for i in request.data}
    for indicator in Indicator.objects.filter(id__in=level_order_map.keys()):
        indicator.level_order = level_order_map[indicator.id]
        indicator.save()
    return Response({"message": "success"})


@login_required
def indicator_list(request, program_id):

    program = Program.objects.get(pk=program_id)
    if not request.user.tola_user.program_role(program.id):
        return Response({"message": "Request failed"}, status=400)

    filterNameMap = {'levelId': 'level_id', 'indicatorId': 'pk'}
    filters = {filterNameMap[key]: request.GET.get(key) for key in filterNameMap.keys() if request.GET.get(key, None)}

    indicators = Indicator.objects.filter(program=program, **filters)

    return JsonResponse(IndicatorSerializerMinimal(indicators, many=True).data, safe=False, status=200)
