from .views import DefaultCustomDashboard

from django.conf.urls import *

# the following view is referenced by the workflow app in
# site_indicatordata.html
# programdashboard_list.html

# delete these links in those 2 files and this whole app can go!
# (you can also delete templates/customdashboard and tola/static/publicdashboard)

urlpatterns = [
    # display default custom dashboard
    url(r'^(?P<id>\w+)/$', DefaultCustomDashboard, name='default_custom_dashboard'),
    url(r'^(?P<id>\w+)/([0-9]+)/$', DefaultCustomDashboard, name='default_custom_dashboard'),
]
