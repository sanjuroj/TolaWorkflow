# -*- coding: utf-8 -*-
import openpyxl
from rest_framework import serializers
from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
from django.utils.translation import ugettext
from tola.l10n_utils import l10n_date_medium

from workflow.models import Program
from indicators.models import Indicator, Level, LevelTier, PeriodicTarget
from indicators.queries import IPTTIndicator


class LevelSerializer(serializers.ModelSerializer):
    """
    Level serializer for Program Page
    """
    level_depth = serializers.IntegerField(source='get_level_depth', read_only=True)

    class Meta:
        model = Level
        fields = [
            'id',
            'parent',
            'name',
            'assumptions',
            'program',
            'customsort',
            'ontology',
            'level_depth'
        ]
        read_only_fields = ['level_depth', 'ontology']


class LevelTierSerializer(serializers.ModelSerializer):
    """
    Level serializer for Program Page
    """
    class Meta:
        model = LevelTier
        fields = [
            'id',
            'name',
            'tier_depth'
        ]


class IndicatorSerializerMinimal(serializers.ModelSerializer):

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'level',
        ]


class IndicatorSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    reporting = serializers.BooleanField()
    all_targets_defined = serializers.IntegerField()
    results_count = serializers.IntegerField()
    results_with_evidence_count = serializers.IntegerField()
    over_under = serializers.IntegerField()
    target_period_last_end_date = serializers.DateField()
    level = LevelSerializer(read_only=True)

    class Meta:
        model = Indicator
        fields = [
            'id',
            'name',
            'number',
            'level',
            'unit_of_measure',
            'baseline_display',
            'lop_target_display',
            'key_performance_indicator',
            'just_created',

            # DB annotations
            #  whether indicator progress towards targets is reported
            #  (min. one target period complete, one result reported):
            'reporting',
            'all_targets_defined',  # whether all targets are defined for this indicator
            'results_count',
            'results_with_evidence_count',
            'target_period_last_end_date', # last end date of last target period, for time-aware indicators
            'over_under',  # indicator progress towards targets (1: over, 0: within 15% of target, -1: under, "None": non reporting
        ]


class ProgramSerializer(serializers.ModelSerializer):
    """
    Serializer specific to the Program Page
    """
    class Meta:
        model = Program
        fields = [
            'id',
            'does_it_need_additional_target_periods',
            'reporting_period_start',
            'reporting_period_end',
        ]


class ExcelRenderer:
    TITLE_START_COLUMN = 3 # 2 rows currently hidden at start, title starts at column C
    TITLE_FONT = openpyxl.styles.Font(size=18)
    HEADER_FONT = openpyxl.styles.Font(bold=True)
    HEADER_FILL = openpyxl.styles.PatternFill('solid', 'EEEEEE')
    CENTER_ALIGN = openpyxl.styles.Alignment(horizontal='center', vertical='bottom')
    RIGHT_ALIGN = openpyxl.styles.Alignment(horizontal='right', vertical='bottom')

    def __init__(self, serializer):
        self.serializer = serializer

    @property
    def header_columns(self):
        headers = [
            ugettext('Program ID'),
            ugettext('Indicator ID'),
            # Translators: "No." as in abbreviation for Number
            ugettext('No.'),
            ugettext('Indicator')
        ]
        if self.serializer.level_column:
            headers += [
                ugettext('Level')
            ]
        headers += [
            ugettext('Unit of measure'),
            ugettext('Change'),
            # Translators: 'C' as in Cumulative and 'NC' as in Non Cumulative
            ugettext('C / NC'),
            u'# / %',
            ugettext('Baseline')
        ]
        return headers

    @property
    def header_cols_length(self):
        return 9 + (self.serializer.level_column and 1)

    def add_period_header(self, sheet, col, period):
        for header, row in [
            (period.header, 2),
            (period.subheader, 3)]:
            if header:
                cell = sheet.cell(row=row, column=col)
                cell.value = unicode(header)
                cell.font = self.HEADER_FONT
                cell.alignment = self.CENTER_ALIGN
                if period.tva:
                    sheet.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col+2)
        columns = [ugettext('Target'), ugettext('Actual'), ugettext('% Met')] if period.tva else [ugettext('Actual'),]
        for col_no, col_header in enumerate(columns):
            cell = sheet.cell(row=4, column=col+col_no)
            cell.value = unicode(col_header)
            cell.font = self.HEADER_FONT
            cell.fill = self.HEADER_FILL
            cell.alignment = self.RIGHT_ALIGN
        return col + (3 if period.tva else 1)

    def add_headers(self, sheet):
        for row, title in enumerate([
                self.serializer.report_title,
                self.serializer.report_date_range,
                self.serializer.program_name]):
            cell = sheet.cell(row=row+1, column=self.TITLE_START_COLUMN)
            cell.value = unicode(title)
            cell.font = self.TITLE_FONT
            sheet.merge_cells(
                start_row=row+1, start_column=self.TITLE_START_COLUMN,
                end_row=row+1, end_column=len(self.header_columns)
                )
        for column, header in enumerate(self.header_columns):
            cell = sheet.cell(row=4, column=column+1)
            cell.value = unicode(header)
            cell.font = self.HEADER_FONT
            cell.alignment = self.CENTER_ALIGN
            cell.fill = self.HEADER_FILL
        period_column = len(self.header_columns) + 1
        for period in self.serializer.all_periods:
            period_column = self.add_period_header(
                sheet, period_column, period
            )



    def render(self):
        # create new workbook with dno sheets:
        wb = openpyxl.Workbook()
        wb.remove(wb.active)
        # add one sheet for each page in the serializer data:
        for page in self.serializer.pages:
            sheet = wb.create_sheet(page['name'])
            self.add_headers(sheet)
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(self.serializer.filename)
        wb.save(response)
        return response


class Period:

    @classmethod
    def lop_period(cls):
        return cls(1, {
            'name': ugettext('Life of Program') 
        }, True)
        
    def __init__(self, frequency, period, tva=False):
        self.period = period
        self.frequency = int(frequency)
        self.tva = tva

    @property
    def start_display(self):
        return l10n_date_medium(self.period['start'])

    @property
    def end_display(self):
        return l10n_date_medium(self.period['end'])

    @property
    def header(self):
        """LOP/MidEnd/Monthly have no header, just the label, time-aware has the period name"""
        if self.frequency in [1, 2, 7]:
            return None
        return self.period['name']

    @property
    def subheader(self):
        """ Name for Lop/MidEnd/monthly is the subheader on the excel report, label for other time-aware"""
        if self.frequency in [1, 2, 7]:
            return self.period['name']
        return self.period['label']


class IPTTTVAMixin:
    indicator_qs = IPTTIndicator.tva
    period_column_count = 3

    @property
    def report_name(self):
        return ugettext('IPTT TvA report')

class IPTTTimeperiodsMixin:
    indicator_qs = IPTTIndicator.timeperiods
    period_column_count = 1

    @property
    def report_name(self):
        return ugettext('IPTT Actuals only report')

class IPTTJSONMixin:
    filters = False # JSON never filters - all data sent to client and filtered in React

    def get_periods(self):
        frequency = int(self.request.get('frequency'))
        return [
            Period(frequency, period_dict)
            for period_dict in PeriodicTarget.generate_for_frequency(
                int(self.request.get('frequency')))(
                    self.program_data['reporting_period_start'],
                    self.program_data['reporting_period_end']
                )
            ]

class IPTTExcelMixin:
    def get_periods(self):
        self.frequency = int(self.request.get('frequency'))
        periods = [
            Period(self.frequency, period_dict)
            for period_dict in PeriodicTarget.generate_for_frequency(self.frequency)(
                self.program_data['reporting_period_start'],
                self.program_data['reporting_period_end']
            )
        ]
        start = int(self.request.get('start', 0))
        end = self.request.get('end', None)
        if end is not None:
            end = int(end) + 1
        return periods[start:end]

    @property
    def filename(self):
        report_date = l10n_date_medium(timezone.now().date())
        return u'{name} {report_date}.xlsx'.format(name=self.report_name, report_date=report_date)

    @property
    def report_date_range(self):
        return u'{} – {}'.format(self.periods[0].start_display, self.periods[-1].end_display)

    @property
    def column_count(self):
        return 10 + (self.level_column and 1) + (len(self.periods) * self.period_column_count)

    @property
    def all_periods(self):
        yield Period.lop_period()
        for period in self.periods:
            yield period

    @property
    def pages(self):
        name = {
            1: ugettext('Life of Program (LoP) only'),
            2: ugettext('Midline and endline'),
            3: ugettext('Annual'),
            4: ugettext('Semi-annual'),
            5: ugettext('Tri-annual'),
            # Translators: this is the measure of time (3 months)
            6: ugettext('Quarterly'),
            7: ugettext('Monthly')
        }[self.frequency]
        return [{
            'name': name,
            'frequency': self.frequency
        }]

    def load_indicators(self):
        indicators = self.indicator_qs.filter(program_id=self.program_data['pk'])
        filter_params = ['sites', 'types', 'sectors', 'indicators']
        filters = {param: self.request.getlist(param) for param in self.request.viewkeys() & filter_params}
        if self.request.getlist('levels'):
            if self.program_data['using_results_framework']:
                filters['levels'] = [level.pk for levels in [
                    [level] + level.get_children()
                    for level in Level.objects.filter(pk__in=self.request.getlist('levels'))
                    ] for level in levels]
            else:
                filters['levels'] = self.request.getlist('levels')
        if self.request.getlist('tiers'):
            filters['levels'] = [
                level.pk for level in Level.objects.filter(program_id=self.program_data['pk'])
                if str(level.get_level_depth()) in self.request.getlist('tiers')
            ]
        if not filters:
            self.filters = False
        else:
            self.filters = filters
            filters['old_levels'] = not self.program_data['using_results_framework']
            indicators = indicators.apply_filters(**filters)
        return indicators


    def render(self, request):
        #return render(request, 'indicators/iptt_excel_test.html', {'serializer': self})
        return ExcelRenderer(self).render()


class IPTTSerializer(object):
    TIMEPERIODS_JSON = 1
    TVA_JSON = 2
    TIMEPERIODS_EXCEL = 3
    TVA_EXCEL = 4
    TVA_FULL_EXCEL = 5
    REPORT_TYPES = {
        TIMEPERIODS_JSON: None,
        TVA_JSON: None,
        TIMEPERIODS_EXCEL: [IPTTTimeperiodsMixin, IPTTExcelMixin],
        TVA_EXCEL: None,
        TVA_FULL_EXCEL: None
    }

    def __new__(cls, report_type, request, **kwargs):
        if report_type not in cls.REPORT_TYPES or cls.REPORT_TYPES[report_type] is None:
            raise NotImplementedError("report type not supported")
        else:
            kwargs.update({'request': request})
            kwargs.update({'report_title': ugettext('Indicator Performance Tracking Report')})
            return object.__new__(type(
                'IPTTReportSerializer', tuple([IPTTSerializer] + cls.REPORT_TYPES[report_type]), kwargs
                ))

    def __init__(self, *args, **kwargs):
        self.program_data = Program.objects.values(
            'pk',
            'name',
            'reporting_period_start',
            'reporting_period_end',
            'using_results_framework'
            ).get(pk=self.request.get('programId'))
        self.indicators = self.load_indicators()
        if self.program_data['using_results_framework']:
            self._level_rows = self.get_rf_levels()
        self.periods = self.get_periods()

    def get_rf_levels(self):
        if self.request.get('groupby') == '2':
            sorted_levels = sorted(
                sorted(Level.objects.filter(program_id=self.program_data['pk']),
                       key=lambda level: level.ontology),
                key=lambda level: level.get_level_depth())
        else:
            sorted_levels = []
            levels = Level.objects.filter(program_id=self.program_data['pk'])
            for level in [level for level in levels if level.get_level_depth() == 1]:
                sorted_levels.append(level)
                sorted_levels += level.get_children()
        for level in sorted_levels:
            level_row = {
                'level': level,
                'indicators': [indicator for indicator in self.indicators.filter(level=level)]
            }
            if level_row['indicators'] or not self.filters:
                yield level_row

    @property
    def program_name(self):
        return self.program_data['name']

    @property
    def level_column(self):
        return not self.program_data['using_results_framework']

    @property
    def level_rows(self):
        if not self.program_data['using_results_framework'] or len(self.blank_level_row) == len(self.indicators):
            return False
        return self._level_rows

    @property
    def blank_level_row(self):
        return [indicator for indicator in self.indicators.filter(level__isnull=True).with_logframe_sorting()]
