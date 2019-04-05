""" Tests for endpoints in indicators.urls for access depending on access level
indicators/
    indicator_create/<program> indicator_create
    indicator_update/<pk> indicator_update
    indicator_delete/<pk> indicator_delete
    periodic_target_generate/<indicator> pt_generate
    periodic_target_delete/<pk> pt_delete
    periodic_target_deleteall/<indicator>/<deleteall> pt_deleteall (deleteall = true)
    result_add/<indicator> result_add
    result_update/<pk> result_update
    result_delete/<pk> result_delete
"""
from django import test
from django.urls import reverse
from tola.test.endpoint_permissions_test_utils import EndpointTestBase


class TestIndicatorCreateEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_create'
    url_kwargs = {'program': None}
    access_level = 'high'
    post_data = {
        'services': 0,
        'name': 'endpoint test indicator',
        'program': '2'
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()

class TestIndicatorUpdateEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_update'
    url_kwargs = {'pk': 'indicator'}
    access_level = None # access level changes get / post
    post_data = {
        'name': 'endpoint test indicator name change'
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.access_level = 'low'
        self.run_get_tests()
        self.access_level = 'high'
        self.run_post_tests()

class TestIndicatorDeleteEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_delete'
    url_kwargs = {'pk': 'indicator'}
    access_level = 'high'
    post_data = {
        'rationale': 'end point test deletion'
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests(method='delete')