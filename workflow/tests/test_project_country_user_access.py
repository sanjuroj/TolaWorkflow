from django import test

from factories import UserFactory, TolaUserFactory, CountryFactory, CountryAccessFactory


class TestProjectCountryUserAccess(test.TestCase):
    def setUp(self):
        super(TestProjectCountryUserAccess, self).setUp()

        # create and login user
        self.user = UserFactory(first_name="FN", last_name="LN", username="tester")
        self.user.set_password('password')
        self.user.save()

        self.tola_user = TolaUserFactory(user=self.user)

        self.client.login(username="tester", password='password')

        self.afghanistan = CountryFactory(country='Afghanistan', code='AF')

    def test_can_access_projects_countries(self):
        self.assertEquals(self.tola_user.allow_projects_access, False)
        self.assertEquals(len(self.tola_user.access_data['countries']), 1)
        self.assertEquals(len(self.tola_user.logged_program_fields['countries']), 1)

        self.tola_user.countryaccess_set.add(CountryAccessFactory(country=self.afghanistan, tolauser=self.tola_user))

        self.assertEquals(self.tola_user.allow_projects_access, True)
        self.assertEquals(len(self.tola_user.access_data['countries']), 2)
        self.assertEquals(len(self.tola_user.logged_program_fields['countries']), 2)

    def test_can_access_projects_country(self):
        self.assertEquals(self.tola_user.allow_projects_access, False)

        # Tola user defaults to US for country in factory
        self.tola_user.country = self.afghanistan
        self.tola_user.save()

        self.assertEquals(self.tola_user.allow_projects_access, True)

