from django.views.generic.list import ListView
from django.views.generic import TemplateView
from django.contrib.auth.models import User

from django.shortcuts import render
from activitydb.models import ProjectAgreement, ProjectComplete, CustomDashboard, Program, SiteProfile,Country, TolaSites
from customdashboard.models import OverlayGroups, OverlayNarratives
from .models import ProjectStatus, Gallery
from indicators.models import CollectedData

from django.db.models import Sum
from django.db.models import Q

from tola.util import getCountry

from django.contrib.auth.decorators import login_required
import uuid
import requests
import json

@login_required(login_url='/accounts/login/')

def DefaultCustomDashboard(request,id=0,sector=0,status=0):
    """
    # of agreements, approved, rejected, waiting, archived and total for dashboard
    """
    program_id = id

    countries = getCountry(request.user)

    #transform to list if a submitted country
    selected_countries_list = Country.objects.all().filter(program__id=program_id)

    getQuantitativeDataSums = CollectedData.objects.all().filter(indicator__program__id=program_id,achieved__isnull=False, indicator__key_performance_indicator=True).exclude(achieved=None,targeted=None).order_by('indicator__number').values('indicator__number','indicator__name','indicator__id').annotate(targets=Sum('targeted'), actuals=Sum('achieved'))
    getFilteredName=Program.objects.get(id=program_id)
    getProjectStatus = ProjectStatus.objects.all()

    getProjectsCount = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries).count()
    getBudgetEstimated = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries).annotate(estimated=Sum('total_estimated_budget'))
    getAwaitingApprovalCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='', program__country__in=countries).count()
    getApprovedCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='approved', program__country__in=countries).count()
    getRejectedCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='rejected', program__country__in=countries).count()
    getInProgressCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='in progress', program__country__in=countries).count()

    getSiteProfile = SiteProfile.objects.all().filter(Q(projectagreement__program__id=program_id) | Q(collecteddata__program__id=program_id))
    getSiteProfileIndicator = SiteProfile.objects.all().filter(Q(collecteddata__program__id=program_id))


    if (status) =='Approved':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='approved')
    elif(status) =='Rejected':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='rejected')
    elif(status) =='In Progress':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='in progress')
    elif(status) =='Awaiting Approval':
       getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='awaiting approval')
    else:
        getProjects = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries)

    getCustomDashboard = CustomDashboard.objects.all()


    return render(request, "customdashboard/visual_dashboard.html", {'getSiteProfile':getSiteProfile, 'getBudgetEstimated': getBudgetEstimated, 'getQuantitativeDataSums': getQuantitativeDataSums,
                                                                     'country': countries, 'getProjectStatus': getProjectStatus, 'getAwaitingApprovalCount':getAwaitingApprovalCount,
                                                                     'getFilteredName': getFilteredName,'getProjects': getProjects, 'getApprovedCount': getApprovedCount,
                                                                     'getRejectedCount': getRejectedCount, 'getInProgressCount': getInProgressCount,
                                                                     'getCustomDashboard': getCustomDashboard, 'getProjectsCount': getProjectsCount, 'selected_countries_list': selected_countries_list,
                                                                     'getSiteProfileIndicator': getSiteProfileIndicator})


def PublicDashboard(request,id=0):
    program_id = id
    getQuantitativeDataSums_2 = CollectedData.objects.all().filter(indicator__key_performance_indicator=True, indicator__program__id=program_id,achieved__isnull=False).order_by('indicator__source').values('indicator__number','indicator__source','indicator__id')
    getQuantitativeDataSums = CollectedData.objects.all().filter(indicator__key_performance_indicator=True, indicator__program__id=program_id,achieved__isnull=False).exclude(achieved=None,targeted=None).order_by('indicator__number').values('indicator__number','indicator__name','indicator__id').annotate(targets=Sum('targeted'), actuals=Sum('achieved'))
    getProgram = Program.objects.all().get(id=program_id)
    getOverlayGroups = OverlayGroups.objects.all()
    getOverlayNarrative = OverlayNarratives.objects.all()
    getProjects = ProjectComplete.objects.all().filter(program_id=program_id)
    getSiteProfile = SiteProfile.objects.all().filter(projectagreement__program__id=program_id)
    getSiteProfileIndicator = SiteProfile.objects.all().filter(Q(collecteddata__program__id=program_id))

    getProjectsCount = ProjectAgreement.objects.all().filter(program__id=program_id).count()
    getAwaitingApprovalCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='awaiting approval').count()
    getApprovedCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='approved').count()
    getRejectedCount = ProjectAgreement.objects.all().filter(program__id=program_id, approval='rejected').count()
    getInProgressCount = ProjectAgreement.objects.all().filter(Q(program__id=program_id) & Q(Q(approval='in progress') | Q(approval=None) | Q(approval=""))).count()

    #get all countires
    countries = Country.objects.all().filter(program__id=program_id)

    return render(request, "customdashboard/themes/public_dashboard.html", {'getProgram':getProgram,'getProjects':getProjects,
                                                                     'getSiteProfile':getSiteProfile, 'getOverlayGroups':getOverlayGroups,
                                                                     'countries': countries, 'getOverlayNarrative': getOverlayNarrative,
                                                                     'awaiting':getAwaitingApprovalCount,'getQuantitativeDataSums_2':getQuantitativeDataSums_2,
                                                                     'approved': getApprovedCount,
                                                                     'rejected': getRejectedCount,
                                                                     'in_progress': getInProgressCount,
                                                                     'total_projects': getProjectsCount,
                                                                     'getQuantitativeDataSums': getQuantitativeDataSums,
                                                                     'getSiteProfileIndicator': getSiteProfileIndicator})


def SurveyPublicDashboard(request,id=0):

    # get all countires
    countries = Country.objects.all()

    filter_url = "https://tola-tables.mercycorps.org/api/silo/430/data/"
    token = TolaSites.objects.get(site_id=1)
    if token.tola_tables_token:
        headers = {'content-type': 'application/json',
                   'Authorization': 'Token ' + token.tola_tables_token}
    else:
        headers = {'content-type': 'application/json'}
        print "Token Not Found"

    response = requests.get(filter_url, headers=headers, verify=False)
    get_json = json.loads(response.content)
    data = get_json
    # print data
    meaning = []
    join = []
    tola_is = []
    for item in data:
        meaning.append(item['tola_is_a_pashto_word_meaning_'])
        # multiple choice
        join.append(list(x for x in item['thanks_for_coming_what_made_you_join_us_today_'].split()))
        # multiple choice
        tola_is.append(list(x for x in item['tola_is_a_system_for_'].split()))
    """
    meaning: all_or_complet,peaceful,global,i_give_up
    join: tola_is_a_myst, i_like_beer,to_meet_the_team,not_sure_what_
    tola_is: adaptive_manag an_indicator_t a_data_managem option_4 all_of_the_abo
    """
    meaningcount = {}
    meaningcount['peaceful'] = 0
    meaningcount['is_global'] = 0
    meaningcount['i_give_up'] = 0
    meaningcount['all_or_complete'] = 0
    for answer in meaning:
        if answer == "all_or_complet":
            meaningcount['all_or_complete'] = meaningcount['all_or_complete'] + 1
        if answer == "global":
            meaningcount['is_global'] = meaningcount['is_global'] + 1
        if answer == "i_give_up":
            meaningcount['i_give_up'] = meaningcount['i_give_up'] + 1
        if answer == "peaceful":
            meaningcount['peaceful'] = meaningcount['peaceful'] + 1

    joincount = {}
    joincount['tola_is_a_mystery'] = 0
    joincount['i_like_beer'] = 0
    joincount['to_meet_the_team'] = 0
    joincount['not_sure'] = 0
    for answer in join:
        if "tola_is_a_myst" in answer:
            joincount['tola_is_a_mystery'] = joincount['tola_is_a_mystery'] + 1
        if "i_like_beer" in answer:
            joincount['i_like_beer'] = joincount['i_like_beer'] + 1
        if "to_meet_the_team" in answer:
            joincount['to_meet_the_team'] = joincount['to_meet_the_team'] + 1
        if "not_sure_what_" in answer:
            joincount['not_sure'] = joincount['not_sure'] + 1

    tolacount = {}
    tolacount['adaptive_manag'] = 0
    tolacount['an_indicator_t'] = 0
    tolacount['a_data_managem'] = 0
    tolacount['option_4'] = 0
    tolacount['all_of_the_abo'] = 0
    for answer in tola_is:
        if "adaptive_manag" in answer:
            tolacount['adaptive_manag'] = tolacount['adaptive_manag'] + 1
        if "an_indicator_t" in answer:
            tolacount['an_indicator_t'] = tolacount['an_indicator_t'] + 1
        if "a_data_managem" in answer:
            tolacount['a_data_managem'] = tolacount['a_data_managem'] + 1
        if "option_4" in answer:
            tolacount['option_4'] = tolacount['option_4'] + 1
        if "all_of_the_abo" in answer:
            tolacount['all_of_the_abo'] = tolacount['all_of_the_abo'] + 1

    dashboard = True

    return render(request, "customdashboard/themes/survey_public_dashboard.html", {'meaning':meaningcount,'join':joincount,'tola_is':tolacount, 'countries': countries, 'dashboard':dashboard})


def SurveyTalkPublicDashboard(request,id=0):

    # get all countires
    countries = Country.objects.all()

    filter_url = "http://tables.toladata.io/api/silo/9/data/"

    headers = {'content-type': 'application/json',
               'Authorization': 'Token bd43de0c16ac0400bc404c6598a6fe0e4ce73aa2'}


    response = requests.get(filter_url, headers=headers, verify=False)
    get_json = json.loads(response.content)
    data = get_json
    # print data
    meaning = []
    join = []
    tola_is = []
    country_from = []
    for item in data:
        meaning.append(item['tola_is_a_pashto_word_meaning_'])
        # multiple choice
        join.append(list(x for x in item['thanks_for_coming_what_made_you_join_us_today_'].split()))
        # multiple choice
        tola_is.append(list(x for x in item['tola_is_a_system_for_'].split()))
        # country
        country_from.append(item['what_country_were_you_in_last'])
    """
    meaning: all_or_complet,peaceful,global,i_give_up
    join: tola_is_a_myst, i_like_a_good_power_point,data_is_king,not_sure_what_
    tola_is: adaptive_manag an_indicator_t a_data_managem option_4 all_of_the_abo
    """
    meaningcount = {}
    meaningcount['peaceful'] = 0
    meaningcount['is_global'] = 0
    meaningcount['i_give_up'] = 0
    meaningcount['all_or_complete'] = 0
    for answer in meaning:
        if answer == "all_or_complet":
            meaningcount['all_or_complete'] = meaningcount['all_or_complete'] + 1
        if answer == "global":
            meaningcount['is_global'] = meaningcount['is_global'] + 1
        if answer == "i_give_up":
            meaningcount['i_give_up'] = meaningcount['i_give_up'] + 1
        if answer == "peaceful":
            meaningcount['peaceful'] = meaningcount['peaceful'] + 1

    joincount = {}
    joincount['tola_is_a_mystery'] = 0
    joincount['i_like_power_point_templates'] = 0
    joincount['data_is_king'] = 0
    joincount['not_sure'] = 0
    for answer in join:
        if "tola_is_a_mystery" in answer:
            joincount['tola_is_a_mystery'] = joincount['tola_is_a_mystery'] + 1
        if "i_like_power_point_templates" in answer:
            joincount['i_like_power_point_templates'] = joincount['i_like_power_point_templates'] + 1
        if "data_is_king" in answer:
            joincount['data_is_king'] = joincount['data_is_king'] + 1
        if "not_sure_what_" in answer:
            joincount['not_sure'] = joincount['not_sure'] + 1

    tolacount = {}
    tolacount['adaptive_manag'] = 0
    tolacount['an_indicator_t'] = 0
    tolacount['a_data_managem'] = 0
    tolacount['option_4'] = 0
    tolacount['all_of_the_abo'] = 0
    for answer in tola_is:
        if "adaptive_manag" in answer:
            tolacount['adaptive_manag'] = tolacount['adaptive_manag'] + 1
        if "an_indicator_t" in answer:
            tolacount['an_indicator_t'] = tolacount['an_indicator_t'] + 1
        if "a_data_managem" in answer:
            tolacount['a_data_managem'] = tolacount['a_data_managem'] + 1
        if "option_4" in answer:
            tolacount['option_4'] = tolacount['option_4'] + 1
        if "all_of_the_abo" in answer:
            tolacount['all_of_the_abo'] = tolacount['all_of_the_abo'] + 1

    dashboard = True

    return render(request, "customdashboard/themes/survey_talk_public_dashboard.html", {'meaning':meaningcount,'join':joincount,'tola_is':tolacount, 'country_from': country_from, 'countries': countries, 'dashboard':dashboard})


def ReportPublicDashboard(request,id=0):

    # get all countires
    countries = Country.objects.all()
    report = True

    return render(request, "customdashboard/themes/survey_public_dashboard.html", {'countries': countries, 'report':report})


def Gallery(request,id=0):
    program_id = id
    getProgram = Program.objects.all().filter(id=program_id)
    getGallery = Gallery.objects.all().filter(program_name__id=program_id)
    return render(request, "gallery/gallery.html", {'getGallery':getGallery, 'getProgram':getProgram})


class ProgramList(ListView):
    """
    Documentation
    """
    model = Program
    template_name = 'customdashboard/themes/program_list.html'

    def get(self, request, *args, **kwargs):
        getCountry = Country.objects.all()

        if int(self.kwargs['pk']) == 0:
            getProgram = Program.objects.all().filter(dashboard_name__is_public=1)
        else:
            getProgram = Program.objects.all().filter(dashboard_name__is_public=1, country__id=self.kwargs['pk'])

        return render(request, self.template_name, {'getProgram': getProgram, 'getCountry': getCountry})


class InternalDashboard(ListView):
    """
    Internal Dashboard for user.is_authenticated
    """
    model = Program
    template_name = 'customdashboard/themes/internal_dashboard.html'

    def get(self, request, *args, **kwargs):
        getCountry = Country.objects.all()

        if int(self.kwargs['pk']) == 0:
            getProgram = Program.objects.all().filter(dashboard_name__is_public=0)
        else:
            getProgram = Program.objects.all().filter(dashboard_name__is_public=0, country__id=self.kwargs['pk'])

        return render(request, self.template_name, {'getProgram': getProgram, 'getCountry': getCountry})

def AnalyticsDashboard(request,id=0):

    ## retrieve program
    model = Program
    program_id = id
    getProgram = Program.objects.all().filter(id=program_id)

    ## retrieve the coutries the user has data access for
    countries = getCountry(request.user)

    #retrieve projects for a program
    getProjects = ProjectAgreement.objects.all()##.filter(program__id=1, program__country__in=1)

    ## retrieve data --  this is an example of a tola tables request
    ## TODO: with forms, allow user to select the table that populates related filter_url, right?
    ## TODO: this should allow for up to 3 data sources (one per chart)
    filter_url = "http://tables.toladata.io/api/silo/9/data/"
    headers = {'content-type': 'application/json',
               'Authorization': 'Token bd43de0c16ac0400bc404c6598a6fe0e4ce73aa2'}
    response = requests.get(filter_url, headers=headers, verify=False)
    get_json = json.loads(response.content)
    data = get_json

    #Parse the JSON(s) into datasets that will feed the templates for this example 
    ## -- parsing might not be immediately relevant for live example 

    dataset1 = []
    key1 = 'what_country_were_you_in_last'  
    for answer in data:
        dataset1.append(answer[key1])

    dataset2 = []
    key2 = 'tola_is_a_pashto_word_meaning_'  
    for answer in data:
        dataset2.append(answer[key2])

    dataset3 = []
    key3 = 'thanks_for_coming_what_made_you_join_us_today_'  
    for answer in data:
        dataset3.append(answer[key3])

    #Programmatically defined table titles  -- 
    ## TODO: these should come from a form that allows text entry of what the charts should be called; 
    # form should have char limits on title length
    
    tableHeaders = {}
    tableHeaders['title1']= key1.title##getProgram[0]
    tableHeaders['title2']= key2.title
    tableHeaders['title3']= key3.title
 
    #Programmatically defined data sets -- these should be (1) selected from a drop down.
    # TODO: open question --  how do we define which values in a table's data are going to be used?  
    # and how does that differ based on chart selection?  
    ## bar graph needs table information to resolve to 1-2 sets of numerical values

    tableData = {}
    tableData1= [1000,2000,3000]#dataset1 -- this data is nonumerical so using a hardcoded data set as a placeholder
    
    tableLabels2= ['Approved', 'Waiting', 'Rejected', 'In Progress']
    tableDataset2= [1000,1000,2000,3000]#dataset2

    tableLabels3= ['Eating','Drinking','Sleeping','Designing','Coding','Partying','Running']
    tableDataset3_1= [1,16,7,3,14,55,40]
    tableDataset3_2= [28,48,40,19,96,27,100]            

    table2= {
    "column_heading": "title for placeholder", 
    "labels": tableLabels2, 
    "data_set": tableDataset2, 
    "component_id" : "testBarId",
    "component_id_2" : "testBarId2"
    }#dataset3

    table3= {
    "column_heading": tableHeaders['title3'], 
    "labels": tableLabels3, 
    "first_data_set": tableDataset3_1, 
    "second_data_set": tableDataset3_2
    }#dataset3

    table4= {
    "column_heading": "title for placeholder", 
    "labels": tableLabels2, 
    "data_set": tableDataset2, 
    "component_id" : "testBarId2",
    }#dataset3

    colorPalettes = {
    'bright':['#82BC00','#C8C500','#10A400','#CF102E','#DB5E11','#A40D7A','#00AFA8','#1349BB','#FFD200 ','#FF7100','#FFFD00','#ABABAB','#7F7F7F','#7B5213','#C18A34'],
    'light':['#BAEE46','#FDFB4A','#4BCF3D','#F2637A','#FFA268','#C451A4','#4BC3BE','#5B7FCC','#9F54CC','#FFE464','#FFA964','#FFFE64','#D7D7D7','#7F7F7F','#D2A868','#FFD592']
    };
    
    return render(request, 'customdashboard/themes/analytics_dashboard.html', 
        {'colorPalettes': colorPalettes, 'tableData1': tableData1,'table4': table4,'table2': table2,'table3': table3,'tableHeaders': tableHeaders,'getProgram': getProgram, 'countries': countries, 'getProjects': getProjects})

def NarrativeDashboard(request,id=0):
    ## retrieve program
    model = Program
    program_id = id
    getProgram = Program.objects.all().filter(id=program_id)

    ## retrieve the coutries the user has data access for
    countries = getCountry(request.user)

    #retrieve projects for a program
    getProjects = ProjectAgreement.objects.all()##.filter(program__id=1, program__country__in=1)

    filter_url = "http://tables.toladata.io/api/silo/9/data/"
    headers = {'content-type': 'application/json',
               'Authorization': 'Token bd43de0c16ac0400bc404c6598a6fe0e4ce73aa2'}
    response = requests.get(filter_url, headers=headers, verify=False)
    get_json = json.loads(response.content)
    data = get_json

    #Parse the JSON(s) into datasets that will feed the templates for this example 
    ## -- parsing might not be immediately relevant for live example 

    tableData1 = {}
    dataset1 = []
    key1 = 'what_country_were_you_in_last'  
    for answer in data:
        dataset1.append(answer[key1])    
    tableData1['title'] = key1.title
    tableData1['dataset1'] = dataset1
    tableData1['dataset2'] = [dataset1.count(dataset1[0]),dataset1.count(dataset1[1]), dataset1.count(dataset1[2])]

    # Borrowed data for bar graph
    tableData2 = {}
    tableData2['approved'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='approved')
    tableData2['rejected'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='rejected')
    tableData2['in_progress'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='in progress')
    tableData2['awaiting_approval'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='awaiting approval')
    tableData2['dataset'] = [len(tableData2['approved']),len(tableData2['rejected']),len(tableData2['in_progress']),len(tableData2['awaiting_approval'])]

    colorPalettes = {
    'bright':['#82BC00','#C8C500','#10A400','#CF102E','#DB5E11','#A40D7A','#00AFA8','#1349BB','#FFD200 ','#FF7100','#FFFD00','#ABABAB','#7F7F7F','#7B5213','#C18A34'],
    'light':['#BAEE46','#FDFB4A','#4BCF3D','#F2637A','#FFA268','#C451A4','#4BC3BE','#5B7FCC','#9F54CC','#FFE464','#FFA964','#FFFE64','#D7D7D7','#7F7F7F','#D2A868','#FFD592']
    };

    return render(request, 'customdashboard/themes/narrative_dashboard.html', 
        {'tableData1': tableData1,'tableData2': tableData2, 'getProgram': getProgram, 'countries': countries, 'getProjects': getProjects}) #add data 


def MapDashboard(request,id=0):
    ## retrieve program
    model = Program
    program_id = id
    getProgram = Program.objects.all().filter(id=program_id)

    ## retrieve the coutries the user has data access for
    countries = getCountry(request.user)

    #retrieve projects for a program
    getProjects = ProjectAgreement.objects.all()##.filter(program__id=1, program__country__in=1)

    filter_url = "http://tables.toladata.io/api/silo/9/data/"
    headers = {'content-type': 'application/json',
               'Authorization': 'Token bd43de0c16ac0400bc404c6598a6fe0e4ce73aa2'}
    response = requests.get(filter_url, headers=headers, verify=False)
    get_json = json.loads(response.content)
    data = get_json

    #Parse the JSON(s) into datasets that will feed the templates for this example 
    ## -- parsing might not be immediately relevant for live example 

    tableData1 = {}
    dataset1 = []
    key1 = 'what_country_were_you_in_last'  
    for answer in data:
        dataset1.append(answer[key1])    
    tableData1['title'] = key1.title
    tableData1['dataset1'] = dataset1
    tableData1['dataset2'] = [dataset1.count(dataset1[0]),dataset1.count(dataset1[1]), dataset1.count(dataset1[2])]

    # Borrowed data for bar graph
    tableData2 = {}
    tableData2['approved'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='approved')
    tableData2['rejected'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='rejected')
    tableData2['in_progress'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='in progress')
    tableData2['awaiting_approval'] = ProjectAgreement.objects.all().filter(program__id=program_id, program__country__in=countries,approval='awaiting approval')
    tableData2['dataset'] = [len(tableData2['approved']),len(tableData2['rejected']),len(tableData2['in_progress']),len(tableData2['awaiting_approval'])]

    colorPalettes = {
    'bright':['#82BC00','#C8C500','#10A400','#CF102E','#DB5E11','#A40D7A','#00AFA8','#1349BB','#FFD200 ','#FF7100','#FFFD00','#ABABAB','#7F7F7F','#7B5213','#C18A34'],
    'light':['#BAEE46','#FDFB4A','#4BCF3D','#F2637A','#FFA268','#C451A4','#4BC3BE','#5B7FCC','#9F54CC','#FFE464','#FFA964','#FFFE64','#D7D7D7','#7F7F7F','#D2A868','#FFD592']
    };

    return render(request, 'customdashboard/themes/map_dashboard.html', 
        {'tableData1': tableData1,'tableData2': tableData2, 'getProgram': getProgram, 'countries': countries, 'getProjects': getProjects}) #add data 

