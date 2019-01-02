from .views import *

from django.conf.urls import *

# place app url patterns here

urlpatterns = [
    url(r'^(?P<react_app_page>\w+)/$', app_host_page, name="tola_management"),
]
