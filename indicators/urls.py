from indicators.views.views_indicators import (
    indicator_create,
    ResultCreate,
    ResultUpdate,
    ResultDelete,
    IndicatorCreate,
    IndicatorDelete,
    IndicatorUpdate,
    IndicatorExport,
    IndicatorReportData,
    ResultReportData,
    service_json,
    PeriodicTargetView,
    PeriodicTargetDeleteView,
    result_view,
    program_indicators_json,
    indicator_plan,
    indicator_report,
    IndicatorReport,
    TVAReport,
    DisaggregationReport,
    TVAPrint,
    DisaggregationPrint,
    api_indicator_view)

from indicators.views.views_reports import (
    IPTTReport,
    IPTT_ExcelExport,
    create_pinned_report,
    delete_pinned_report,
    IPTTQuickstart,
    IPTTReportData
)

from django.conf.urls import url


urlpatterns = [
    url(r'^indicator_create/(?P<id>\d+)/$', indicator_create, name='indicator_create'),

    url(r'^indicator_add/(?P<id>\d+)/$', IndicatorCreate.as_view(), name='indicator_add'),

    url(r'^indicator_update/(?P<pk>\d+)/$', IndicatorUpdate.as_view(), name='indicator_update'),

    url(r'^indicator_delete/(?P<pk>\d+)/$', IndicatorDelete.as_view(), name='indicator_delete'),

    url(r'^periodic_target_delete/(?P<pk>\d+)/$', PeriodicTargetDeleteView.as_view(), name='pt_delete'),

    url(r'^periodic_target_generate/(?P<indicator>\d+)/$', PeriodicTargetView.as_view(), name='pt_generate'),

    url(r'^periodic_target_deleteall/(?P<indicator>\d+)/(?P<deleteall>\w+)/$',
        PeriodicTargetView.as_view(), name='pt_deleteall'),

    url(r'^result_add/(?P<program>\d+)/(?P<indicator>\d+)/$',
        ResultCreate.as_view(), name='result_add'),

    url(r'^result_update/(?P<pk>\d+)/$', ResultUpdate.as_view(), name='result_update'),

    url(r'^result_delete/(?P<pk>\d+)/$', ResultDelete.as_view(), name='result_delete'),

    url(r'^report/(?P<program>\d+)/(?P<indicator>\d+)/(?P<type>\d+)/$', indicator_report, name='indicator_report'),

    url(r'^tvareport/$', TVAReport.as_view(), name='tvareport'),

    url(r'^tvaprint/(?P<program>\d+)/$', TVAPrint.as_view(), name='tvaprint'),

    url(r'^disrep/(?P<program>\d+)/$', DisaggregationReport.as_view(), name='disrep'),

    url(r'^disrepprint/(?P<program>\d+)/$', DisaggregationPrint.as_view(), name='disrepprint'),

    url(r'^report_table/(?P<program>\d+)/(?P<indicator>\d+)/(?P<type>\d+)/$',
        IndicatorReport.as_view(), name='indicator_table'),

    url(r'^indicator_plan/(?P<program_id>\d+)/$', indicator_plan, name='indicator_plan'),

    url(r'^indicator_plan/export/(?P<program>\d+)/$',
        IndicatorExport.as_view(), name='indicator_export'),

    url(r'^service/(?P<service>[-\w]+)/service_json/', service_json, name='service_json'),

    url(r'^result_table/(?P<indicator>\d+)/(?P<program>\d+)/',
        result_view, name='result_view'),

    url(r'^program_indicators/(?P<program>\d+)/(?P<indicator>\d+)/'
        r'(?P<type>\d+)', program_indicators_json, name='program_indicators_json'),

    url(r'^report_data/(?P<id>\w+)/(?P<program>\d+)/(?P<type>\d+)/$',
        IndicatorReportData.as_view(), name='indicator_report_data'),

    url(r'^result_report_data/(?P<program>\d+)/(?P<indicator>\d+)/'
        r'(?P<type>\d+)/$',
        ResultReportData.as_view(),
        name='result_report_data'),

    url(r'^iptt_quickstart/', IPTTQuickstart.as_view(), name='iptt_quickstart'),
    url(r'^iptt_report/(?P<program_id>\d+)/(?P<reporttype>\w+)/$', IPTTReport.as_view(), name='iptt_report'),
    url(r'^iptt_report_data/$', IPTTReportData.as_view(), name='iptt_ajax'),

    url(r'^iptt_excel/(?P<program_id>\d+)/(?P<reporttype>\w+)/$', IPTT_ExcelExport.as_view(), name='iptt_excel'),

    url(r'^pinned_report/$', create_pinned_report, name='create_pinned_report'),
    url(r'^pinned_report/delete/$', delete_pinned_report, name='delete_pinned_report'),

    # API call for program page
    url(r'^api/indicator/(?P<indicator_id>\d+)', api_indicator_view, name='api_indicator_view'),
]
