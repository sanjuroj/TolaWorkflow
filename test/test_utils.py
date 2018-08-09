from django.test import TestCase, RequestFactory, Client

from factory import Sequence

from factories import UserFactory
from factories.indicators_models import IndicatorFactory
from factories.workflow_models import ProgramFactory, TolaUserFactory, CountryFactory


class TestBase(TestCase):
    fixtures = ['indicatortype.json', 'levels.json']

    def setUp(self):
        self.user = UserFactory(first_name="Indicator", last_name="CreateTest", username="IC")
        self.user.set_password('password')
        self.user.save()
        self.tola_user = TolaUserFactory(user=self.user)
        self.request_factory = RequestFactory()
        self.country = self.tola_user.country
        self.program = ProgramFactory(funding_status='Funded')
        self.program.country.add(self.country)
        self.program.save()
        self.indicator = IndicatorFactory(program=self.program)

        self.client = Client()
        self.client.login(username="IC", password='password')


def generate_core_indicator_data(c_count=2, p_count=3, i_count=4):
    """
    Create up to 5 countries and an arbitrary number of related programs and indicators
    """
    c_params = [
        ('Colombia', 'CO'),
        ('Tunisia', 'TN'),
        ('Uganda', 'UG'),
        ('Nepal', 'NP'),
        ('Timor-Leste', 'TL')
    ]

    for i in range(max(5, c_count)):
        country = CountryFactory(country=c_params[i][0], code=c_params[i][1])
        programs = ProgramFactory.create_batch(
            p_count, countries=[country], name=Sequence(lambda n: 'Program %s %s' % (country.code, n)),
        )
        for p in programs:
            p.indicator_set.add(*(IndicatorFactory.create_batch(i_count)))
