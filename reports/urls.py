from .views import (
    ReportHome,
    ProjectReportData,
    IndicatorReportData,
    ResultReportData,
    ReportData
)
from django.conf.urls import url

urlpatterns = [
    url(r'^report/$', ReportHome.as_view(), name='report_home'),
    url(r'^report_data/project/$', ProjectReportData.as_view(), name='project_report_data'),
    url(r'^report_data/indicator/$', IndicatorReportData.as_view(), name='indicator_report_data'),
    url(r'^report_data/collecteddata/$', ResultReportData.as_view(), name='collecteddata_report_data'),
    url(r'^report_data/$', ReportData.as_view(), name='report_data'),
]
