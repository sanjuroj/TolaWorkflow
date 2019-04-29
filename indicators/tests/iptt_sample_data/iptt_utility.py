""" Class for testing an IPTT response (translating raw html into processed IPTT data)

for testing IPTT view response data"""

import json
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from indicators.models import Indicator
from indicators.views.views_reports import IPTT_Mixin
from factories.indicators_models import IndicatorFactory, ResultFactory
from factories.workflow_models import ProgramFactory
from factories import UserFactory, TolaUserFactory
from django import test


def process_nav(navsoup):
    """get useful values from the form section of an IPTT report, store as python dict"""
    selects = []
    for select in navsoup.find_all('select'):
        this_select = select.extract()
        options = []
        for option in this_select.find_all('option'):
            options.append({
                'text': option.get_text(),
                'value': option.get('value')
            })
        selects.append({
            'name': this_select.get('name'),
            'options': options
        })
    return selects

def get_ranges(header_row):
    """translates a group of cells with dates and labels (i.e. quarter 3: Jan 1, 2015 - Jul 2, 2015) to python dict"""
    ranges = []
    for td in header_row.find_all('td'):
        daterange = td.small.extract().get_text().strip() if td.small is not None else None
        ranges.append({
            'range': daterange,
            'start_date': datetime.strptime(
                daterange.split("-")[0].strip(), "%b %d, %Y"
                ).strftime('%Y-%m-%d') if daterange is not None else None,
            'end_date': datetime.strptime(
                daterange.split("-")[1].strip(), "%b %d, %Y"
                ).strftime('%Y-%m-%d') if daterange is not None else None,
            'name': td.get_text().strip()
        })
        td.extract()
    return ranges

def nonestr(string):
    return string if string != "" else None

def process_table(mainsoup, timeperiods=False):
    """takes the entire table portion of an IPTT page and returns the indicators/values and info gleaned from it"""
    info = {}
    indicators = []
    info['date_range'] = mainsoup.find(id='id_span_iptt_date_range').extract().h4.get_text()
    table = mainsoup.table.extract()
    header_row = table.tr.extract()
    info['program_name'] = header_row.find(id='id_td_iptt_program_name').extract().strong.get_text()
    ranges = get_ranges(header_row)
    header_row = table.tr.extract()
    indicator_rows = []
    for row in table.find_all('tr'):
        indicator_rows.append(row.extract())
        indicators.append({'ranges': []})
    for _ in range(9):
        key = header_row.th.extract().get_text().strip()
        for k, indic_row in enumerate(indicator_rows):
            value = indic_row.td.extract().get_text().strip()
            if key:
                indicators[k][key] = value
    for c, daterange in enumerate(ranges):
        for k, indic_row in enumerate(indicator_rows):
            indicator_range = {
                'name': daterange['name'],
                'dates': daterange['range'],
                'start_date': daterange['start_date'],
                'end_date': daterange['end_date']
            }
                #'target': target, 'actual': actual, 'met': met}
            for key in ['actual'] if (timeperiods and c > 0) else ['target', 'actual', 'met']:
                indicator_range[key] = nonestr(indic_row.td.extract().get_text().strip())
                if indicator_range[key] == u'\u2014':
                    indicator_range[key] = None
            indicators[k]['ranges'].append(indicator_range)
    return {
        'info': info,
        'indicators': indicators,
    }

class IPTTResponse(object):
    """object for holding a processed IPTT response from the server (raw HTML) and testing it for indicator content"""
    def __init__(self, html, timeperiods=False):
        self.timeperiods = timeperiods
        self.rawhtml = html
        self.info = None
        self.components = {}
        self.indicators = []
        self.process()

    def __str__(self):
        return "\n".join([json.dumps(self.info, indent=4), json.dumps(self.indicators, indent=4)])

    def process(self):
        soup = BeautifulSoup(self.rawhtml, 'html.parser')
        self.components['head'] = soup.head.extract()
        self.components['menu'] = soup.nav.extract()
        self.components['nav'] = process_nav(soup.nav.extract())
        main = process_table(soup.main.extract(), self.timeperiods)
        self.indicators = main['indicators']
        self.info = main['info']
        for script in soup.find_all("script"):
            script.extract()
        self.leftoversoup = soup

class TestIPTTTargetPeriodsReportResponseBase(test.TestCase):
    indicator_frequency = Indicator.LOP
    def setUp(self):

        self.user = UserFactory(first_name="FN", last_name="LN", username="iptt_tester", is_superuser=True)
        self.user.set_password('password')
        self.user.save()

        self.tola_user = TolaUserFactory(user=self.user)
        self.tola_user.save()

        self.client = test.Client(enforce_csrf_checks=False)
        self.client.login(username='iptt_tester', password='password')
        self.response = None
        startdate = datetime.strptime('2017-02-04', '%Y-%m-%d')
        enddate = datetime.strptime('2019-10-01', '%Y-%m-%d')
        self.program = ProgramFactory(reporting_period_start=startdate,
                                      reporting_period_end=enddate)

    def tearDown(self):
        Indicator.objects.all().delete()
        self.response = None

    def get_indicator_for_program(self, **kwargs):
        make_kwargs = {'program': self.program}
        make_kwargs.update(kwargs)
        indicator = IndicatorFactory(**make_kwargs)
        return indicator

    def get_indicator_by_frequency(self, frequency, **kwargs):
        kwargs['target_frequency'] = frequency
        return self.get_indicator_for_program(**kwargs)

    def get_response(self, target_frequency=None, reporttype=IPTT_Mixin.REPORT_TYPE_TARGETPERIODS):
        target_frequency = self.indicator_frequency if target_frequency is None else target_frequency
        response = self.client.post('/indicators/iptt_report/{program}/{reporttype}/'.format(
            program=self.program.id, reporttype=reporttype),
                                    {'targetperiods': target_frequency,
                                     'csrfmiddlewaretoken': 'asfd',
                                     'program': self.program.id},
                                    follow=True)
        self.assertEqual(response.status_code, 200,
                         "response gave status code {0} instead of 200".format(response.status_code))
        self.response = IPTTResponse(response.content)
        return self.response

    def format_assert_message(self, msg):
        return "{0}:\n{1}".format(self.response, msg)


class TestIPTTTimePeriodsReportResponseBase(test.TestCase):
    timeperiods = Indicator.ANNUAL

    def setUp(self):
        self.user = UserFactory(first_name="FN", last_name="LN", username="iptt_tester", is_superuser=True)
        self.user.set_password('password')
        self.user.save()

        self.tola_user = TolaUserFactory(user=self.user)
        self.tola_user.save()

        self.client = test.Client(enforce_csrf_checks=False)
        self.client.login(username='iptt_tester', password='password')
        self.response = None
        startdate = datetime.strptime('2017-02-04', '%Y-%m-%d')
        enddate = datetime.strptime('2019-10-01', '%Y-%m-%d')
        self.program = ProgramFactory(reporting_period_start=startdate,
                                      reporting_period_end=enddate)
        self.request_params = {
            'csrfmiddlewaretoken': 'asdf',
            'program': self.program.id
        }

    def tearDown(self):
        Indicator.objects.all().delete()
        self.response = None

    def set_dates(self, start, end):
        self.program.reporting_period_start = datetime.strptime(start, '%Y-%m-%d')
        self.program.reporting_period_end = datetime.strptime(end, '%Y-%m-%d')
        self.program.save()

    def get_indicator_for_program(self, **kwargs):
        make_kwargs = {'program': self.program}
        make_kwargs.update(kwargs)
        indicator = IndicatorFactory(**make_kwargs)
        return indicator

    def add_indicator(self, frequency=Indicator.ANNUAL, **kwargs):
        kwargs['target_frequency'] = frequency
        return self.get_indicator_for_program(**kwargs)

    def add_indicator_with_data(self, frequency, values):
        indicator = self.add_indicator(frequency=frequency)
        collect_date = self.program.reporting_period_start + timedelta(days=1)
        for value in values:
            _ = ResultFactory(indicator=indicator, date_collected=collect_date, achieved=value)
            if frequency == Indicator.ANNUAL:
                collect_date = datetime(collect_date.year + 1, collect_date.month, collect_date.day)
            elif frequency == Indicator.SEMI_ANNUAL:
                collect_date = datetime(collect_date.year if collect_date.month < 7 else collect_date.year + 1,
                                        collect_date.month + 6 if collect_date.month < 7 else collect_date.month - 6,
                                        collect_date.day)
            elif frequency == Indicator.TRI_ANNUAL:
                collect_date = datetime(collect_date.year if collect_date.month < 9 else collect_date.year + 1,
                                        collect_date.month + 4 if collect_date.month < 9 else collect_date.month - 8,
                                        collect_date.day)
            elif frequency == Indicator.QUARTERLY:
                collect_date = datetime(collect_date.year if collect_date.month < 10 else collect_date.year + 1,
                                        collect_date.month + 3 if collect_date.month < 10 else collect_date.month - 9,
                                        collect_date.day)
            elif frequency == Indicator.MONTHLY:
                collect_date = datetime(collect_date.year if collect_date.month < 12 else collect_date.year + 1,
                                        collect_date.month + 1 if collect_date.month < 12 else collect_date.month - 11,
                                        collect_date.day)

    def get_showall_response(self):
        self.request_params['timeframe'] = 1
        self.request_params['numrecentperiods'] = None
        return self.get_response()

    def get_recent_periods(self, numrecent):
        self.request_params['timeframe'] = 2
        self.request_params['numrecentperiods'] = numrecent
        return self.get_response()

    def get_date_range_periods(self, start, end):
        self.request_params['start_period'] = start.strftime('%Y-%m-%d') if isinstance(start, datetime) else start
        self.request_params['end_period'] = end.strftime('%Y-%m-%d') if isinstance(end, datetime) else end
        return self.get_response()

    def get_response(self, reporttype=IPTT_Mixin.REPORT_TYPE_TIMEPERIODS):
        self.request_params['timeperiods'] = self.timeperiods
        response = self.client.post('/indicators/iptt_report/{program}/{reporttype}/'.format(
            program=self.program.id, reporttype=reporttype),
                                    self.request_params,
                                    follow=True)
        self.assertEqual(response.status_code, 200,
                         "response gave status code {0} instead of 200".format(response.status_code))
        self.response = IPTTResponse(response.content, timeperiods=True)
        return self.response

    def get_indicator_results(self, response, indicator_row=0):
        indicator = response.indicators[indicator_row]['ranges']
        return indicator[0], indicator[1:]

    def format_assert_message(self, msg):
        return "{0}:\n{1} timeperiods, {2}".format(self.response,
                                                   {k:v for k, v in Indicator.TARGET_FREQUENCIES}[self.timeperiods],
                                                   msg)

    def number_of_ranges_test(self, start, end, expected_ranges):
        self.set_dates(start, end)
        self.add_indicator()
        response = self.get_showall_response()
        ranges = response.indicators[0]['ranges'][1:]
        self.assertEqual(len(ranges), expected_ranges,
                         self.format_assert_message("expected {0} ranges for {1} to {2}, got {3}".format(
                             expected_ranges, start, end, len(ranges)
                         )))
