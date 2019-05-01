from .views import *

from django.conf.urls import *

# place app url patterns here

urlpatterns = [
    url(r'^audit_log/(?P<program_id>\d+)/$', audit_log_host_page, name="tola_management_audit_log"),
    url(r'^(?P<react_app_page>\w+)/$', app_host_page, name="tola_management"),
]
