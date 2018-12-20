"""Unit tests for result_form_functional_tests.py
Systems:
    - indicators.views.ResultCreate
        - bad indicator id 404
        - get with good ids gives form
        - initial form data is correct
        - correct disaggregation values
        - form valid returns appropriate response
        - form invalid returns appropriate response
    - indicators.views.ResultUpdate
    - indicators.forms.ResultForm
"""
import datetime
from indicators.views import ResultCreate, ResultUpdate
from indicators.forms import ResultForm
from indicators.models import Indicator, Result
from factories import (
    indicators_models as i_factories,
    workflow_models as w_factories
)
from django.urls import reverse
from django.http import Http404
from django import test

class MockObject(object):
    pass

class TestResultCreateUpdate404(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory()
        self.indicator = i_factories.IndicatorFactory(
            program=self.program
        )
        self.result = i_factories.ResultFactory(
            indicator=self.indicator
        )
        self.factory = test.RequestFactory()
        tola_user = w_factories.TolaUserFactory()
        self.user = tola_user.user

    def test_create_view_raises_404_with_bad_indicator_id(self):
        kwargs = {
            'program': self.program.id,
            'indicator': self.indicator.id + 1
        }
        bad_url = reverse('result_add', kwargs=kwargs)
        request = self.factory.get(bad_url)
        request.user = self.user
        with self.assertRaises(Http404):
            ResultCreate.as_view()(request, **kwargs)

    def test_update_view_raises_404_with_bad_result_id(self):
        kwargs = {
            'pk': self.result.id + 1
        }
        bad_url = reverse('result_update', kwargs=kwargs)
        request = self.factory.get(bad_url)
        request.user = self.user
        with self.assertRaises(Http404):
            ResultUpdate.as_view()(request, **kwargs)

class TestUpdateFormInitialValues(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory()
        self.indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.ANNUAL
        )
        self.evidence = w_factories.DocumentationFactory()
        self.result = i_factories.ResultFactory(
            indicator=self.indicator,
            evidence=self.evidence
        )
        self.blank_result = i_factories.ResultFactory(
            indicator=self.indicator
        )
        self.tola_user = w_factories.TolaUserFactory()
        self.user = self.tola_user.user

    def test_initial_values(self):
        mockrequest = MockObject()
        mockrequest.user = self.user
        form = ResultForm(request=mockrequest, indicator=self.indicator, instance=self.result)
        self.assertEqual(form['achieved'].value(), self.result.achieved)
        self.assertEqual(form['evidence'].value(), self.evidence.id)
        self.assertEqual(form['target_frequency'].value(), Indicator.ANNUAL)
        self.assertEqual(form['indicator'].value(), self.indicator.id)
        self.assertEqual(form['date_collected'].value(), self.result.date_collected)
        self.assertEqual(form['submitted_by'].value(), self.tola_user.display_with_organization)
        self.assertEqual(form['record_name'].value(), self.evidence.name)
        self.assertEqual(form['record_url'].value(), self.evidence.url)
        self.assertEqual(form['record_description'].value(), self.evidence.description)

    def test_initial_values_no_evidence(self):
        mockrequest = MockObject()
        mockrequest.user = self.user
        form = ResultForm(request=mockrequest, indicator=self.indicator, instance=self.blank_result)
        self.assertEqual(form['achieved'].value(), self.result.achieved)
        self.assertEqual(form['evidence'].value(), None)
        self.assertEqual(form['target_frequency'].value(), Indicator.ANNUAL)
        self.assertEqual(form['indicator'].value(), self.indicator.id)
        self.assertEqual(form['record_name'].value(), None)
        self.assertEqual(form['record_url'].value(), None)
        self.assertEqual(form['record_description'].value(), None)

    def test_create_form_initial_values(self):
        mockrequest = MockObject()
        mockrequest.user = self.user
        form = ResultForm(request=mockrequest, indicator=self.indicator)
        self.assertEqual(form['indicator'].value(), self.indicator.id)
        self.assertEqual(form['program'].value(), self.program.id)
        self.assertEqual(form['achieved'].value(), None)
        self.assertEqual(form['evidence'].value(), None)

class TestCreateValidation(test.TestCase):
    def setUp(self):
        self.program = w_factories.ProgramFactory()
        self.indicator = i_factories.IndicatorFactory(
            program=self.program,
            target_frequency=Indicator.LOP
        )
        self.evidence = w_factories.DocumentationFactory(
            program=self.program,
            name="test 1"
        )
        self.tola_user = w_factories.TolaUserFactory()
        self.user = self.tola_user.user
        self.mockrequest = MockObject()
        self.mockrequest.user = self.user

    def test_good_data_validates(self):
        minimal_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
        }
        form = ResultForm(minimal_data, request=self.mockrequest, indicator=self.indicator)
        self.assertTrue(form.is_valid(), "errors {0}".format(form.errors))
        new_result = form.save()
        self.assertIsNotNone(new_result.id)
        db_result = Result.objects.get(pk=new_result.id)
        self.assertEqual(db_result.date_collected, datetime.date(2016, 3, 31))
        self.assertEqual(db_result.achieved, 30)

    def test_good_data_with_evidence_validates(self):
        minimal_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'record_name': 'new record',
            'record_url': 'http://google.com',
            'record_description': 'new description'
        }
        form = ResultForm(minimal_data, request=self.mockrequest, indicator=self.indicator)
        self.assertTrue(form.is_valid(), "errors {0}".format(form.errors))
        new_result = form.save()
        self.assertIsNotNone(new_result.id)
        db_result = Result.objects.get(pk=new_result.id)
        self.assertIsNotNone(db_result.evidence)
        self.assertEqual(db_result.evidence.name, 'new record')

    def test_good_data_updating_evidence_validates(self):
        minimal_data = {
            'date_collected': '2016-03-31',
            'achieved': '30',
            'indicator': self.indicator.id,
            'program': self.program.id,
            'evidence': self.evidence.id
        }
        form = ResultForm(minimal_data, request=self.mockrequest, indicator=self.indicator)
        self.assertTrue(form.is_valid(), "errors {0}".format(form.errors))
        new_result = form.save()
        self.assertIsNotNone(new_result.id)
        db_result = Result.objects.get(pk=new_result.id)
        self.assertIsNotNone(db_result.evidence)
        self.assertEqual(db_result.evidence.name, 'test 1')
        