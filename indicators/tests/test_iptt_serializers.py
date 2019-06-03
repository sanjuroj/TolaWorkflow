import datetime
from django import test
from factories import (
    workflow_models as w_factories,
    indicators_models as i_factories
)
from indicators.views.views_reports import IPTTSerializer

class RequestDict(dict):
    def getlist(self, key):
        if self.get(key, None):
            return list(self.get(key))
        return self.get(key)

class IPTTTestScenario:
    def __init__(self):
        pass

class TestTimeperiodsExcelSerializer(test.TestCase):
    report_type = IPTTSerializer.TIMEPERIODS_EXCEL

    def get_serializer(self, programId, frequency=7, **kwargs):
        kwargs.update({'programId': programId, 'frequency': frequency})
        return IPTTSerializer(self.report_type, RequestDict(kwargs))

    def test_program_name(self):
        program = w_factories.ProgramFactory(name="test name")
        instance = self.get_serializer(program.pk)
        self.assertEqual(instance.program_name, "test name")

    def test_all_indicators_shown(self):
        program = w_factories.ProgramFactory()
        for _ in range(5):
            i_factories.IndicatorFactory(program=program)
        instance = self.get_serializer(program.pk)
        self.assertEqual(len(instance.indicators), 5)
