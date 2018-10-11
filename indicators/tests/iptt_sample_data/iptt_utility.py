""" Class for testing an IPTT response (translating raw html into processed IPTT data)

for testing IPTT view response data"""

import json
from datetime import datetime
from bs4 import BeautifulSoup
from indicators.models import Indicator
from indicators.views.views_reports import IPTT_Mixin
from factories.indicators_models import IndicatorFactory
from factories.workflow_models import ProgramFactory
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

def process_table(mainsoup):
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
    for daterange in ranges:
        for k, indic_row in enumerate(indicator_rows):
            indicator_range = {
                'name': daterange['name'],
                'dates': daterange['range'],
                'start_date': daterange['start_date'],
                'end_date': daterange['end_date']
            }
                #'target': target, 'actual': actual, 'met': met}
            for key in ['target', 'actual', 'met']:
                indicator_range[key] = nonestr(indic_row.td.extract().get_text().strip())
            indicators[k]['ranges'].append(indicator_range)
    return {
        'info': info,
        'indicators': indicators,
    }

class IPTTResponse(object):
    """object for holding a processed IPTT response from the server (raw HTML) and testing it for indicator content"""
    def __init__(self, html):
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
        main = process_table(soup.main.extract())
        self.indicators = main['indicators']
        self.info = main['info']
        for script in soup.find_all("script"):
            script.extract()
        self.leftoversoup = soup

class TestIPTTTargetPeriodsReportResponseBase(test.TestCase):
    indicator_frequency = Indicator.LOP
    def setUp(self):
        self.client = test.Client(enforce_csrf_checks=False)
        self.response = None
        startdate = datetime.strptime('2017-02-04', '%Y-%m-%d')
        enddate = datetime.strptime('2019-10-01', '%Y-%m-%d')
        self.program = ProgramFactory(reporting_period_start=startdate,
                                      reporting_period_end=enddate)

    def tearDown(self):
        Indicator.objects.all().delete()
        self.response = None

    def get_indicator_for_program(self, **kwargs):
        indicator = IndicatorFactory(**kwargs)
        indicator.program.add(self.program)
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
        