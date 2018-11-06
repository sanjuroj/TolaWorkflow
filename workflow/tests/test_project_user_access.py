from django import test

from factories import UserFactory, TolaUserFactory, CountryFactory


class TestProjectUserAccess(test.TestCase):
    def setUp(self):
        super(TestProjectUserAccess, self).setUp()

        # create and login user
        self.user = UserFactory(first_name="FN", last_name="LN", username="tester")
        self.user.set_password('password')
        self.user.save()

        self.tola_user = TolaUserFactory(user=self.user)

        self.client.login(username="tester", password='password')

        self.afghanistan = CountryFactory()

    def test_can_access_projects(self):
        self.assertEquals(self.tola_user.allow_projects_access, False)

        self.tola_user.countries.add(self.afghanistan)

        self.assertEquals(self.tola_user.allow_projects_access, True)
