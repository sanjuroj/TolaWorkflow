from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from workflow.serializers import LogframeProgramSerializer
from tola_management.permissions import (
    indicator_adapter,
    has_program_read_access,
)

@login_required
@has_program_read_access
def logframe_view(request, program):
    """
    Logframe view
    """
    serialized_program = LogframeProgramSerializer.load(program)
    context = {
        'js_context': serialized_program.data
    }
    return render(request, 'indicators/logframe/logframe.html', context)
