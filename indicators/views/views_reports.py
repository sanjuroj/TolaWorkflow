# -*- coding: utf-8 -*-
""" View functions for generating IPTT Reports (HTML and Excel)"""

import openpyxl
from openpyxl import styles

from tola.l10n_utils import l10n_date_medium, l10n_date_long, l10n_monthname
from workflow.models import Program
from indicators.models import Indicator, PeriodicTarget, PinnedReport, Level, LevelTier
from indicators.forms import PinnedReportForm
from indicators.queries import IPTTIndicator

from django.utils import timezone
from django.core.urlresolvers import reverse
from django.views.decorators.http import require_POST
from django.views.generic import TemplateView, View
from django.utils.translation import (
    ugettext,
    ugettext_lazy as _
)
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin


@require_POST
def create_pinned_report(request):
    """
    AJAX call for creating a PinnedReport
    """
    form = PinnedReportForm(request.POST)
    if form.is_valid():
        pr = form.save(commit=False)
        pr.tola_user = request.user.tola_user
        pr.save()
    else:
        return HttpResponseBadRequest(str(form.errors.items()))

    return HttpResponse()


@require_POST
def delete_pinned_report(request):
    """
    AJAX call for deleting a PinnedReport
    """
    pinned_report_id = request.POST.get('pinned_report_id')
    PinnedReport.objects.filter(id=pinned_report_id, tola_user_id=request.user.tola_user.id).delete()
    return HttpResponse()


def get_program_filter_data(request):
    """uses request user to populate program data for filter dropdowns in IPTT Quickstart / IPTT Reeport"""

    programs = []
    countries = request.user.tola_user.countries.all()
    programs_qs = Program.objects.filter(
        funding_status="Funded", country__in=countries,
        reporting_period_start__isnull=False, reporting_period_end__isnull=False
    ).order_by('id')
    frequencies_qs = Indicator.objects.filter(
        program__in=programs_qs, target_frequency__isnull=False
    ).order_by('program_id', 'target_frequency').values(
        'program_id', 'target_frequency'
    ).distinct()
    for program in programs_qs:
        start_formatted = l10n_date_medium(program.reporting_period_start)
        end_formatted = l10n_date_medium(program.reporting_period_end)
        programs.append({
            'id': program.pk,
            'name': program.name,
            'frequencies': [f['target_frequency'] for f in frequencies_qs if f['program_id'] == program.pk],
            'periodDateRanges': {
                '1': [[
                    start_formatted,
                    end_formatted
                    ]],
                '2': [[
                    start_formatted,
                    end_formatted,
                    ugettext('Midline')
                    ], [
                        start_formatted,
                        end_formatted,
                        ugettext('Endline')
                    ]],
                '3': [
                    [l10n_date_medium(period['start']),
                     l10n_date_medium(period['end']),
                     period['start'] > timezone.now().date()]
                    for period in PeriodicTarget.generate_for_frequency(3)(
                        program.reporting_period_start,
                        program.reporting_period_end)],
                '4': [
                    [l10n_date_medium(period['start']),
                     l10n_date_medium(period['end']),
                     period['start'] > timezone.now().date()]
                    for period in PeriodicTarget.generate_for_frequency(4)(
                        program.reporting_period_start,
                        program.reporting_period_end)],
                '5': [
                    [l10n_date_medium(period['start']),
                     l10n_date_medium(period['end']),
                     period['start'] > timezone.now().date()]
                    for period in PeriodicTarget.generate_for_frequency(5)(
                        program.reporting_period_start,
                        program.reporting_period_end)],
                '6': [
                    [l10n_date_medium(period['start']),
                     l10n_date_medium(period['end']),
                     period['start'] > timezone.now().date()]
                    for period in PeriodicTarget.generate_for_frequency(6)(
                        program.reporting_period_start,
                        program.reporting_period_end)],
                '7': [
                    [l10n_date_medium(period['start']),
                     l10n_date_medium(period['end']),
                     l10n_monthname(period['start']),
                     period['start'].year,
                     period['start'] > timezone.now().date()]
                    for period in PeriodicTarget.generate_for_frequency(7)(
                        program.reporting_period_start,
                        program.reporting_period_end)],
            }
        })
    return programs

def get_labels(quickstart=True):
    # this is not in a loop or comprehension so as to allow translator comments:
    labels = {
        'programSelect': ugettext('Program'),
        'showAll': ugettext('Show all'),
        'mostRecent': ugettext('Most recent'),
        'mostRecentPlaceholder': ugettext('enter a number'),
        'targetperiods': {
            '1': ugettext('Life of Program (LoP) only'),
            '2': ugettext('Midline and endline'),
            '3': ugettext('Annual'),
            '4': ugettext('Semi-annual'),
            '5': ugettext('Tri-annual'),
            # Translators: this is the measure of time (3 months)
            '6': ugettext('Quarterly'),
            '7': ugettext('Monthly')
        },
    }
    if quickstart:
        labels.update(
            {
                'tvaFilterTitle': ugettext('Periodic targets vs. actuals'),
                'timeperiodsFilterTitle': ugettext('Recent progress for all indicators'),
                'tvaFilterSubtitle': ugettext(
                    'View results organized by target period for indicators that share the same target frequency'
                ),
                'timeperiodsFilterSubtitle': ugettext(
                    ('View the most recent two months of results. '
                     '(You can customize your time periods.) '
                     'This report does not include periodic targets')
                ),
                'periodSelect': ugettext('Target periods'),
                'submitButton': ugettext('View report')
            }
        )
    else:
        labels.update(
            {
                'filterTitle': ugettext('Report options'),
                'reportTitle': ugettext('Indicator performance tracking table'),
                'sidebarToggle': ugettext('Show/hide filters'),
                'pin': {
                    'buttonLabel': ugettext('Pin'),
                    'reportName': ugettext('Report name'),
                    'submitButton': ugettext('Pin to program page'),
                    'createUrl': reverse('create_pinned_report'),
                    'successMsg': ugettext('Success! This report is now pinned to the program page.'),
                    'successLink': ugettext('Visit the program page now.')
                },
                'excel': {
                    'buttonMain': ugettext('Excel'),
                    'buttonCurrent': ugettext('Current view'),
                    'buttonAll': ugettext('All program data')
                },
                'resetButton': ugettext('Reset'),
                'periodSelect': {
                    'tva': ugettext('Target periods'),
                    'timeperiods': ugettext('Time periods')
                },
                'startPeriod': ugettext('Start'),
                'endPeriod': ugettext('End'),
                'levelGrouping': {
                    'label': ugettext('Group indicators'),
                    'group': ugettext('by Level')
                },
                'levelSelect': ugettext('Levels'),
                'typeSelect': ugettext('Types'),
                'sectorSelect': ugettext('Sectors'),
                'siteSelect': ugettext('Sites'),
                'indicatorSelect': ugettext('Indicators'),
                'loading': ugettext('Loading'),
                'timeperiods': {
                    '3' : ugettext('Years'),
                    '4' : ugettext('Semi-annual periods'),
                    '5' : ugettext('Tri-annual periods'),
                    # Translators: this is the measure of time (3 months)
                    '6' : ugettext('Quarters'),
                    '7' : ugettext('Months')
                },
                'periodNames': {
                    '3': ugettext('Year'),
                    '4': ugettext('Semi-annual period'),
                    '5': ugettext('Tri-annual period'),
                    # Translators: this is the measure of time (3 months)
                    '6': ugettext('Quarter')
                },
                'columnHeaders': {
                    'lop': ugettext('Life of Program'),
                    # Translators: this is the abbreviation for number
                    'number': ugettext('No.'),
                    'indicator': ugettext('Indicator'),
                    'level': ugettext('Level'),
                    'uom': ugettext('Unit of measure'),
                    # Translators: the noun form (as in 'type of change')
                    'change': ugettext('Change'),
                    # Translators: C as in Cumulative and NC as in Non Cumulative
                    'cumulative': ugettext('C / NC'),
                    'numType': '# / %',
                    'baseline': ugettext('Baseline'),
                    'target': ugettext('Target'),
                    'actual': ugettext('Actual'),
                    'met': ugettext('% Met')
                },
                'noIndicatorsForFrequency': ugettext('No indicators for this target frequency in this program, '
                                                     'please select a different target period frequency.')
            }
        )
    return labels

def add_numeric_cell(cell, value):
    if value is None or value == '':
        return None
    cell.value = float(value)
    cell.data_type = 'n'
    cell.style = 'Normal'
    return True

def add_percentage_cell(cell, value, is_float=False):
    if value is None or value == '':
        return None
    if not is_float:
        value = float(value)/100
    cell.value = float(value)
    cell.data_type = 'n'
    cell.style = 'Percent'
    cell.number_format = '0.0%'
    return True

class IPTTQuickstart(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_quickstart.html'

    def get(self, request, *args, **kwargs):
        js_context = {
            'labels': get_labels(quickstart=True),
            'programs': get_program_filter_data(request)
        }
        return self.render_to_response({'js_context': js_context})


class IPTTReport(LoginRequiredMixin, TemplateView):
    template_name = 'indicators/iptt_report.html'

    def get(self, request, *args, **kwargs):
        js_context = {
            'labels': get_labels(quickstart=False),
            'programs': get_program_filter_data(request)
        }
        return self.render_to_response({'js_context': js_context})


class IPTTReportData(LoginRequiredMixin, View):
    tva = False
    frequency = Indicator.LOP

    def get_context_data(self, request):
        program_id = request.GET.get('programId')
        dates = Program.objects.values('reporting_period_start', 'reporting_period_end').get(pk=program_id)
        indicator_qs = IPTTIndicator.tva if self.tva else IPTTIndicator.timeperiods
        indicator_qs = indicator_qs.filter(
            program_id=program_id
            )
        if self.tva:
            indicator_qs = indicator_qs.filter(
                target_frequency=self.frequency
            )
        indicator_qs = indicator_qs.with_frequency_annotations(
            self.frequency, dates['reporting_period_start'], dates['reporting_period_end'])
        levels = Level.objects.filter(program_id=int(program_id))
        level_data = []
        for level in levels:
            level_item ={
                'id': level.pk,
                'name': level.name,
                'tier': level.leveltier.name,
                'tierPk': level.leveltier.pk,
                'ontology': level.ontology,
                'parent': level.parent.pk if level.parent else None,
                'depth': level.get_level_depth(),
                'sort': level.customsort
                }
            if level_item['depth'] > 2:
                target = level
                while target.get_level_depth() > 2:
                    target = target.parent
                level_item['level2parent'] = target.pk
            else:
                level_item['level2parent'] = None
            level_data.append(level_item)
        return indicator_qs, level_data

    def get(self, request):
        self.tva = request.GET.get('reportType') == 'tva'
        self.frequency = int(request.GET.get('frequency'))
        indicator_qs, level_data = self.get_context_data(request)
        indicators = []
        for sort_index, indicator in enumerate(indicator_qs):
            this_indicator = {
                'id': indicator.pk,
                'sortIndex': sort_index,
                'number': indicator.number,
                'name': indicator.name,
                'level': indicator.level.leveltier.name if indicator.level else None,
                'tierDepth': indicator.level.get_level_depth(),
                'levelpk': indicator.level.pk if indicator.level else None,
                'sites': indicator.sites,
                'indicatorTypes': indicator.indicator_types,
                'sector': {'pk': indicator.sector.pk, 'name': indicator.sector.sector} if indicator.sector else {},
                'frequency': indicator.target_frequency,
                'directionOfChange': indicator.get_direction_of_change,
                'unitOfMeasure': indicator.unit_of_measure,
                'cumulative': ugettext('Cumulative') if indicator.is_cumulative else ugettext('Non-cumulative'),
                'unitType': indicator.get_unit_of_measure_type,
                'baseline': indicator.baseline,
                'lopTarget': indicator.lop_target,
                'lopActual': indicator.lop_actual,
                'lopMet': indicator.lop_percent_met,
                'reportData': {}
            }
            if self.frequency != Indicator.LOP:
                values_count = getattr(indicator, 'frequency_{0}_count'.format(self.frequency))
                if self.tva:
                    this_indicator['reportData']['tva'] = {
                        self.frequency: [
                            {'target': getattr(indicator, 'frequency_{0}_period_{1}_target'.format(self.frequency, c)),
                             'value': getattr(indicator, 'frequency_{0}_period_{1}'.format(self.frequency, c))}
                            for c in range(values_count)
                        ]
                    }
                else:
                    this_indicator['reportData']['timeperiods'] = {
                        self.frequency: [getattr(indicator, 'frequency_{0}_period_{1}'.format(self.frequency, c))
                                         for c in range(values_count)]
                    }
            indicators.append(this_indicator)
        second_tier_name = LevelTier.objects.filter(program_id=int(request.GET.get('programId')),
                                                    tier_depth=2).first().name
        reportData = {
            'programId': request.GET.get('programId'),
            'reportFrequency': self.frequency,
            'reportType': 'tva' if self.tva else 'timeperiods',
            'indicators': indicators,
            'levels': level_data,
            'resultChainFilter': ugettext('by %(tier)s chain') % {'tier': second_tier_name}
        }
        return JsonResponse(reportData)


class IPTTExcelExport(LoginRequiredMixin, View):
    tva = False
    wb = None
    TITLE_START_COLUMN = 3
    TITLE_END_COLUMN = 8
    INDICATOR_ROW = 5 # first row that has indicator data
    TITLE_FONT = styles.Font(size=18)
    HEADER_FONT = styles.Font(bold=True)
    HEADER_FILL = styles.PatternFill('solid', 'EEEEEE')
    CENTER_ALIGN = styles.Alignment(horizontal='center', vertical='bottom')
    RIGHT_ALIGN = styles.Alignment(horizontal='right', vertical='bottom')
    INDICATOR_NAME_ALIGN = styles.Alignment(wrap_text=True)

    def get_context_data(self, request):
        program_id = request.GET.get('programId')
        frequency = request.GET.get('frequency')
        program = Program.objects.get(pk=program_id)
        indicator_qs = IPTTIndicator.tva if self.tva else IPTTIndicator.timeperiods
        indicator_qs = indicator_qs.filter(
            program_id=program_id
            )
        if self.tva and frequency != 'all':
            indicator_qs = indicator_qs.filter(
                target_frequency=int(frequency)
            )
        indicator_qs = indicator_qs.apply_filters(
            levels=request.GET.getlist('levels'),
            sites=request.GET.getlist('sites'),
            indicator_types=request.GET.getlist('types'),
            sectors=request.GET.getlist('sectors'),
            indicator_ids=request.GET.getlist('indicators'))
        frequency = int(frequency) if frequency != 'all' else 'all'
        indicator_qs = indicator_qs.with_frequency_annotations(
            frequency, program.reporting_period_start, program.reporting_period_end
        )
        return program, indicator_qs

    def get_filename(self):
        # Translators: "IPTT" = Indicator Performance Tracking Table, "TVA" = Targets vs Actuals
        report_name = ugettext('IPTT TvA report') if self.tva else ugettext('IPTT Actuals only report')
        report_date = l10n_date_medium(timezone.now().date())
        return '{name} {report_date}.xlsx'.format(name=report_name, report_date=report_date)

    def add_headers(self, sheet, program, periods):
        for row, title in enumerate([_("Indicator Performance Tracking Report"),
                                     u'{start} - {end}'.format(
                                         start=l10n_date_long(periods[0]['start']),
                                         end=l10n_date_long(periods[-1]['end'])),
                                     program.name]):
            cell = sheet.cell(row=row+1, column=self.TITLE_START_COLUMN)
            cell.value = unicode(title)
            cell.font = self.TITLE_FONT
            sheet.merge_cells(start_row=row+1, start_column=self.TITLE_START_COLUMN,
                              end_row=row+1, end_column=self.TITLE_END_COLUMN)
        header_col = 1
        for header in [
                ugettext('Program ID'),
                ugettext('Indicator ID'),
                # Translators: "No." as in abbreviation for Number
                ugettext('No.'),
                ugettext('Indicator'),
                ugettext('Level'),
                ugettext('Unit of measure'),
                ugettext('Change'),
                # Translators: 'C' as in Cumulative and 'NC' as in Non Cumulative
                ugettext('C / NC'),
                u'# / %',
                ugettext('Baseline')]:
            cell = sheet.cell(row=4, column=header_col)
            cell.value = unicode(header)
            cell.font = self.HEADER_FONT
            cell.alignment = self.CENTER_ALIGN
            cell.fill = self.HEADER_FILL
            header_col += 1
        header_col = self.add_period_header(sheet, header_col, [ugettext('Life of Program'), None], True)
        for period in periods:
            header_col = self.add_period_header(sheet, header_col, [period['name'], period['label']], self.tva)

    def add_period_header(self, sheet, col_no, titles, tva):
        # this moves Life of Program and Midline/Endline labels down to right above the data (no subtitle for dates)
        if titles[0] is not None and titles[1] is None:
            subtitle = titles[0]
            supertitle = None
        else:
            supertitle = titles[0]
            subtitle = titles[1]
        if supertitle:
            cell = sheet.cell(row=2, column=col_no)
            cell.value = unicode(supertitle)
            cell.font = self.HEADER_FONT
            cell.alignment = self.CENTER_ALIGN
            if tva:
                sheet.merge_cells(start_row=2, start_column=col_no, end_row=2, end_column=col_no+2)
        if subtitle:
            cell = sheet.cell(row=3, column=col_no)
            cell.value = unicode(subtitle)
            cell.font = self.HEADER_FONT
            cell.alignment = self.CENTER_ALIGN
            if tva:
                sheet.merge_cells(start_row=3, start_column=col_no, end_row=3, end_column=col_no+2)
        header_cells = []
        if tva:
            for offset, value in enumerate([ugettext('Target'), ugettext('Actual'), ugettext('% Met')]):
                cell = sheet.cell(row=4, column=col_no + offset)
                cell.value = unicode(value)
                header_cells.append(cell)
        else:
            cell = sheet.cell(row=4, column=col_no)
            cell.value = unicode(ugettext('Actual'))
            header_cells.append(cell)
        for cell in header_cells:
            cell.font = self.HEADER_FONT
            cell.alignment = self.RIGHT_ALIGN
            cell.fill = self.HEADER_FILL
        return col_no + len(header_cells)

    def add_data(self, sheet, indicators, periods, frequency):
        for offset, indicator in enumerate(indicators):
            for col, val in enumerate([indicator.program_id,
                                       indicator.id,
                                       unicode(indicator.number),
                                       unicode(indicator.name),
                                       unicode(indicator.levelname),
                                       unicode(indicator.unit_of_measure),
                                       unicode(indicator.get_direction_of_change)]):
                sheet.cell(row=self.INDICATOR_ROW + offset, column=col+1).value = val
            sheet.cell(row=self.INDICATOR_ROW + offset, column=4).alignment = self.INDICATOR_NAME_ALIGN
            if indicator.is_cumulative:
                sheet.cell(row=self.INDICATOR_ROW + offset, column=8).value = unicode(ugettext('Cumulative'))
            else:
                sheet.cell(row=self.INDICATOR_ROW + offset, column=8).value = unicode(ugettext('Non-cumulative'))
            sheet.cell(row=self.INDICATOR_ROW + offset, column=9).value = unicode(indicator.get_unit_of_measure_type)
            if indicator.unit_of_measure_type == Indicator.PERCENTAGE:
                add_cell_func = add_percentage_cell
            else:
                add_cell_func = add_numeric_cell
            add_cell_func(sheet.cell(row=self.INDICATOR_ROW + offset, column=10), indicator.baseline)
            add_cell_func(sheet.cell(row=self.INDICATOR_ROW + offset, column=11), indicator.lop_target)
            add_cell_func(sheet.cell(row=self.INDICATOR_ROW + offset, column=12), indicator.lop_actual)
            add_percentage_cell(sheet.cell(row=self.INDICATOR_ROW + offset, column=13),
                                indicator.lop_percent_met, True)
            column = 14
            for period in periods:
                if self.tva:
                    target = getattr(
                        indicator,
                        'frequency_{f}_period_{p}_target'.format(f=frequency, p=period['customsort'])
                    )
                    add_cell_func(sheet.cell(row=self.INDICATOR_ROW + offset, column=column), target)
                    column += 1
                actual = getattr(
                    indicator,
                    'frequency_{f}_period_{p}'.format(f=frequency, p=period['customsort'])
                )
                add_cell_func(sheet.cell(row=self.INDICATOR_ROW + offset, column=column), actual)
                column += 1
                if self.tva:
                    if actual and target and target != 0:
                        met = float(actual)/float(target)
                        add_percentage_cell(sheet.cell(row=self.INDICATOR_ROW + offset, column=column), met, True)
                    column += 1

    def set_widths(self, sheet):
        widths = [10, 10, 10, 100, 12, 40, 8, 12]
        for col_no, width in enumerate(widths):
            sheet.column_dimensions[openpyxl.utils.get_column_letter(col_no + 1)].width = width
        sheet.column_dimensions['A'].hidden = True
        sheet.column_dimensions['B'].hidden = True
        if not self.tva:
            for col_no in range(13, sheet.max_column):
                sheet.column_dimensions[openpyxl.utils.get_column_letter(col_no + 1)].width = 25

    def add_sheets(self, frequencies):
        frequency_names = {
            1: ugettext('Life of Program (LoP) only'),
            2: ugettext('Midline and endline'),
            3: ugettext('Annual'),
            4: ugettext('Semi-annual'),
            5: ugettext('Tri-annual'),
            # Translators: this is the measure of time (3 months)
            6: ugettext('Quarterly'),
            7: ugettext('Monthly')
        }
        self.wb.remove(self.wb.active)
        # cut event out of this loop - haven't figured out how to show event frequency indicators yet:
        for frequency in [f for f in frequency_names if f in frequencies]:
            sheet = self.wb.create_sheet(frequency_names[frequency])
            yield frequency, sheet

    def get(self, request):
        self.tva = request.GET.get('reportType') == 'tva'
        frequency = request.GET.get('frequency')
        start_period = request.GET.get('start') if frequency != 'all' else None
        end_period = request.GET.get('end') if frequency != 'all' else None
        program, indicators = self.get_context_data(request)
        self.wb = openpyxl.Workbook()
        frequencies = [int(frequency)] if frequency != 'all' else program.target_frequencies
        for sheet_frequency, sheet in self.add_sheets(frequencies):
            periods = [period for period in program.get_periods_for_frequency(sheet_frequency)]
            periods = periods[int(start_period):] if start_period else periods
            periods = periods[:int(end_period)+1] if end_period else periods
            if self.tva:
                sheet_indicators = indicators.filter(target_frequency=int(sheet_frequency))
            else:
                sheet_indicators = indicators
            self.add_headers(sheet, program, periods)
            self.add_data(sheet, sheet_indicators, periods, sheet_frequency)
            self.set_widths(sheet)

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(self.get_filename())
        self.wb.save(response)
        return response
