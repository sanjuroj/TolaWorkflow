from django import test
from django.urls import reverse

from factories import UserFactory, TolaUserFactory, CountryFactory, CountryAccessFactory


class TestProfileUpdates(test.TestCase):
    def setUp(self):
        super(TestProfileUpdates, self).setUp()

        self.afghanistan = CountryFactory(country='Afghanistan', code='AF')
        self.myanmar = CountryFactory(country='Myanmar', code='MM')
        self.usa = CountryFactory(country='United States', code='US')

        self.user = UserFactory(first_name="FN", last_name="LN", username="tester")
        self.user.set_password('password')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user, country=self.usa)
        self.af_access = CountryAccessFactory(country=self.afghanistan, tolauser=self.tola_user)
        self.us_access = CountryAccessFactory(country=self.usa, tolauser=self.tola_user)
        self.tola_user.countryaccess_set.add(self.af_access, self.us_access)
        self.tola_user.save()

        self.countries_assigned = {self.afghanistan.id, self.usa.id}

    def test_superuser_can_save(self):
        self.user.is_superuser = True
        self.user.is_staff = True
        self.user.save()

        client = test.Client()
        client.login(username="tester", password='password')

        response = client.post(reverse('profile'), data={
            'language': 'fr',
            'submit': 'Save + changes'
        })
        self.tola_user.refresh_from_db()

        self.assertEquals(response.status_code, 302)
        self.assertEquals(self.tola_user.language, 'fr')

    def test_user_can_save(self):
        self.user.is_superuser = False
        self.user.is_staff = False
        self.user.save()

        client = test.Client()
        client.login(username="tester", password='password')

        response = client.post(reverse('profile'), data={
            'language': 'fr',
            'submit': 'Save + changes'
        })
        self.tola_user.refresh_from_db()

        self.assertEquals(response.status_code, 302)
        self.assertEquals(self.tola_user.language, 'fr')
