"""A program page accessed by URL should redirect the user to home if they do not have access to that program"""

from django import test
from factories import (
    workflow_models as w_factories
)
from django.shortcuts import reverse


class TestProgramPageRedirects(test.TestCase):
    def setUp(self):
        self.country_a = w_factories.CountryFactory(
            country="Test A",
            code="TA"
        )
        self.country_b = w_factories.CountryFactory(
            code="TB"
        )
        self.program_a = w_factories.ProgramFactory()
        self.program_a.country.set([self.country_a])
        self.program_a.save()
        self.program_b = w_factories.ProgramFactory()
        self.program_b.country.set([self.country_b])
        self.program_b.save()
        self.tola_user = w_factories.TolaUserFactory()
        self.tola_user.countries.set([self.country_a])
        self.tola_user.save()
        self.user = self.tola_user.user
        self.client = test.Client()

    def test_unit_test_user_has_access_to_program_in_country(self):
        self.assertTrue(self.tola_user.has_access(program_id=self.program_a.pk))

    def test_user_is_able_to_access_program_in_country(self):
        """User should get a program page back for a program in one of their countries"""
        self.client.force_login(self.user)
        url = reverse('program_page', kwargs={'program_id': self.program_a.id,
                                              'indicator_id': 0,
                                              'type_id': 0})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_unit_test_user_has_no_access_to_program_out_of_country(self):
        self.assertFalse(self.tola_user.has_access(program_id=self.program_b.pk))

    def test_user_is_redirected_from_program_not_in_country(self):
        """User should be redirected to home page for a program not in one of their countries"""
        self.client.force_login(self.user)
        url = reverse('program_page', kwargs={'program_id': self.program_b.id,
                                              'indicator_id': 0,
                                              'type_id': 0})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)

    def test_anonymous_user_is_redirected_from_program_page(self):
        """Anonymous user should be redirected to home page for any program page"""
        url = reverse('program_page', kwargs={'program_id': self.program_a.id,
                                              'indicator_id': 0,
                                              'type_id': 0})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        url = reverse('program_page', kwargs={'program_id': self.program_b.id,
                                              'indicator_id': 0,
                                              'type_id': 0})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
