from django.shortcuts import render

from tola_management.permissions import has_projects_access
from workflow.models import ProjectAgreement, ProjectComplete, Program, SiteProfile,Country

from django.db.models import Sum
from django.db.models import Q

from tola.util import getCountry

from django.contrib.auth.decorators import login_required


@login_required
@has_projects_access
def DefaultCustomDashboard(request,id=0,status=0):
    """
    This is used as the workflow program dashboard
    # of agreements, approved, rejected, waiting, archived and total for dashboard
    http://127.0.0.1:8000/customdashboard/65/
    """
    program_id = id

    countries = getCountry(request.user)

    #transform to list if a submitted country
    selected_countries_list = Country.objects.all().filter(program__id=program_id)

    getFilteredName=Program.objects.get(id=program_id)

    getProjectsCount = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries).count()
    getBudgetEstimated = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries).annotate(estimated=Sum('total_estimated_budget'))
    getAwaitingApprovalCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='awaiting approval', program__country__in=countries).count()
    getApprovedCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='approved', program__country__in=countries).count()
    getRejectedCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='rejected', program__country__in=countries).count()
    getInProgressCount = ProjectAgreement.objects.all().filter(program__id=program_id).filter(Q(Q(approval='in progress') | Q(approval=None)), program__country__in=countries).count()
    nostatus_count = ProjectAgreement.objects.all().filter(program__id=program_id).filter(Q(Q(approval=None) | Q(approval=""))).count()

    getSiteProfile = SiteProfile.objects.all().filter(projectagreement__program__id=program_id)
    getSiteProfileIndicator = SiteProfile.objects.all()

    if (status) =='Approved':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries, approval='approved').prefetch_related('projectcomplete')
    elif(status) =='Rejected':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries, approval='rejected').prefetch_related('projectcomplete')
    elif(status) =='In Progress':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries, approval='in progress').prefetch_related('projectcomplete')
    elif(status) =='Awaiting Approval':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries, approval='awaiting approval').prefetch_related('projectcomplete')
    else:
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries)

    get_project_completed = []

    totalBudgetted = 0.00
    totalActual = 0.00

    getProjectsComplete = ProjectComplete.objects.all()
    for project in getProjects:
        for complete in getProjectsComplete:
            if complete.actual_budget != None:
                if project.id == complete.project_agreement_id:
                    totalBudgetted = float(totalBudgetted) + float(project.total_estimated_budget)
                    totalActual = float(totalActual) + float(complete.actual_budget)

                    get_project_completed.append(project)

    return render(request, "customdashboard/customdashboard/visual_dashboard.html", {
        'getSiteProfile':getSiteProfile,
        'getBudgetEstimated': getBudgetEstimated,
        'country': countries,
        'getAwaitingApprovalCount':getAwaitingApprovalCount,
        'getFilteredName': getFilteredName,
        'getProjects': getProjects,
        'getApprovedCount': getApprovedCount,
        'getRejectedCount': getRejectedCount,
        'getInProgressCount': getInProgressCount,
        'nostatus_count': nostatus_count,
        'getProjectsCount': getProjectsCount,
        'selected_countries_list': selected_countries_list,
        'getSiteProfileIndicator': getSiteProfileIndicator,
        'get_project_completed': get_project_completed,
        'totalBudgetted': totalBudgetted,
        'totalActual': totalActual})
