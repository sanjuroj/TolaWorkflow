from django.conf.urls import url

from indicators.views import (
    IndicatorCreate,
    IndicatorUpdate,
    IndicatorDelete,
    PeriodicTargetView,
    PeriodicTargetDeleteView
)

from .views.views_indicators import (
    ResultCreate,
    ResultUpdate,
    ResultDelete,
    IndicatorExport,
    service_json,
    PeriodicTargetView,
    PeriodicTargetDeleteView,
    result_view,
    indicator_plan,
    DisaggregationReport,
    DisaggregationReportQuickstart,
    DisaggregationPrint,
    api_indicator_view,
    periodic_targets_form
)

from .views.views_reports import (
    IPTTReportQuickstartView,
    IPTT_ReportView,
    IPTT_ReportIndicatorsWithVariedStartDate,
    create_pinned_report,
    delete_pinned_report,
    IPTT_ExcelExport,
)

from .views.views_results_framework import ResultsFrameworkBuilder


urlpatterns = [
    url(r'^periodic_targets_form/(?P<program>\d+)/$', periodic_targets_form, name='periodic_targets_form'),

    url(r'^indicator_create/(?P<program>\d+)/$', IndicatorCreate.as_view(), name='indicator_create'),

    url(r'^indicator_update/(?P<pk>\d+)/$', IndicatorUpdate.as_view(), name='indicator_update'),

    url(r'^indicator_delete/(?P<pk>\d+)/$', IndicatorDelete.as_view(), name='indicator_delete'),

    url(r'^periodic_target_generate/(?P<indicator>\d+)/$', PeriodicTargetView.as_view(), name='pt_generate'),  # create event

    url(r'^periodic_target_delete/(?P<pk>\d+)/$', PeriodicTargetDeleteView.as_view(), name='pt_delete'),  # delete event

    url(r'^periodic_target_deleteall/(?P<indicator>\d+)/(?P<deleteall>\w+)/$',  # delete all targets button
        PeriodicTargetView.as_view(), name='pt_deleteall'),

    url(r'^result_add/(?P<indicator>\d+)/$', ResultCreate.as_view(), name='result_add'),

    url(r'^result_update/(?P<pk>\d+)/$', ResultUpdate.as_view(), name='result_update'),

    url(r'^result_delete/(?P<pk>\d+)/$', ResultDelete.as_view(), name='result_delete'),

    url(r'^disrep_quickstart/$', DisaggregationReportQuickstart.as_view(), name='disrep_quickstart'),
    url(r'^disrep/(?P<program>\d+)/$', DisaggregationReport.as_view(), name='disrep'),

    url(r'^disrepprint/(?P<program>\d+)/$', DisaggregationPrint.as_view(), name='disrepprint'),

    url(r'^indicator_plan/(?P<program>\d+)/$', indicator_plan, name='indicator_plan'),

    url(r'^indicator_plan/export/(?P<program>\d+)/$',
        IndicatorExport.as_view(), name='indicator_export'),

    url(r'^service/(?P<service>[-\w]+)/service_json/', service_json, name='service_json'),

    url(r'^result_table/(?P<indicator>\d+)/',
        result_view, name='result_view'),

    url(r'^iptt_quickstart/', IPTTReportQuickstartView.as_view(), name='iptt_quickstart'),

    url(r'^iptt_report/(?P<program>\d+)/(?P<reporttype>\w+)/$', IPTT_ReportView.as_view(), name='iptt_report'),

    url(r'^iptt_redirect/(?P<program>\d+)/$', IPTT_ReportIndicatorsWithVariedStartDate.as_view(),
        name='iptt_redirect'),

    url(r'^iptt_excel/(?P<program>\d+)/(?P<reporttype>\w+)/$', IPTT_ExcelExport.as_view(), name='iptt_excel'),

    url(r'^pinned_report/$', create_pinned_report, name='create_pinned_report'),
    url(r'^pinned_report/delete/$', delete_pinned_report, name='delete_pinned_report'),

    # Results framework builder
    url(r'^results_framework_builder/(?P<program_id>\d+)', ResultsFrameworkBuilder.as_view(), name='results_framework_builder'),

    # API call for program page
    url(r'^api/indicator/(?P<indicator>\d+)', api_indicator_view, name='api_indicator_view'),
]
