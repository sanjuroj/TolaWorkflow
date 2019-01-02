# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.decorators import login_required

from django.shortcuts import render

# Create your views here.
@login_required(login_url='/accounts/login/')
def app_host_page(request, react_app_page):
    return render(request, 'react_app_base.html', {"bundle_name": "tola_management_"+react_app_page, "js_context": {}})
