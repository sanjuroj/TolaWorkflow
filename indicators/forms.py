from datetime import datetime
from functools import partial

from workflow.models import (
    Program, SiteProfile, Documentation, ProjectComplete, TolaUser, Sector
)
from tola.util import getCountry
from indicators.models import (
    Indicator, PeriodicTarget, Result, Objective, StrategicObjective,
    TolaTable, DisaggregationType, Level, IndicatorType,
    PinnedReport)
from indicators.widgets import DataAttributesSelect

import dateparser

from django.core.exceptions import ValidationError
from django.db.models import Q
from django import forms
from django.forms.fields import DateField
from django.utils.translation import ugettext_lazy as _
from django.utils import formats, translation, timezone


locale_format = formats.get_format('DATE_INPUT_FORMATS', lang=translation.get_language())[-1]

class DatePicker(forms.DateInput):
    """
    Use in form to create a Jquery datepicker element
    Usage:
        self.fields['some_date_field'].widget = DatePicker.DateInput()
    """
    template_name = 'datepicker.html'
    DateInput = partial(forms.DateInput, {'class': 'datepicker'})


class LocaleDateField(DateField):
    def to_python(self, value):
        if value in self.empty_values:
            return None
        try:
            return dateparser.parse(value).date()
        except AttributeError:
            raise ValidationError(
                self.error_messages['invalid'], code='invalid')


class IndicatorForm(forms.ModelForm):
    unit_of_measure_type = forms.ChoiceField(
        choices=Indicator.UNIT_OF_MEASURE_TYPES,
        widget=forms.RadioSelect(),
    )

    class Meta:
        model = Indicator
        exclude = ['create_date', 'edit_date']
        widgets = {
            'definition': forms.Textarea(attrs={'rows': 4}),
            'justification': forms.Textarea(attrs={'rows': 4}),
            'quality_assurance': forms.Textarea(attrs={'rows': 4}),
            'data_issues': forms.Textarea(attrs={'rows': 4}),
            'indicator_changes': forms.Textarea(attrs={'rows': 4}),
            'comments': forms.Textarea(attrs={'rows': 4}),
            'notes': forms.Textarea(attrs={'rows': 4}),
            'rationale_for_target': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        indicator = kwargs.get('instance', None)
        if not indicator.unit_of_measure_type:
            kwargs['initial']['unit_of_measure_type'] = Indicator.UNIT_OF_MEASURE_TYPES[0][0]
        if indicator.lop_target:
            lop_stripped = str(indicator.lop_target)
            lop_stripped = lop_stripped.rstrip('0').rstrip('.') if '.' in lop_stripped else lop_stripped
            kwargs['initial']['lop_target'] = lop_stripped
        self.request = kwargs.pop('request')
        self.programval = kwargs.pop('program')

        super(IndicatorForm, self).__init__(*args, **kwargs)

        countries = getCountry(self.request.user)
        self.fields['disaggregation'].queryset = DisaggregationType.objects\
            .filter(country__in=countries, standard=False)
        self.fields['program'].queryset = Program.objects.filter(
            funding_status="Funded", country__in=countries).distinct()
        self.fields['program'].disabled = True
        self.fields['objectives'].queryset = Objective.objects.filter(program__id__in=[self.programval.id])
        self.fields['strategic_objectives'].queryset = StrategicObjective.objects.filter(country__in=countries)
        self.fields['approved_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()
        self.fields['approval_submitted_by'].queryset = TolaUser.objects.filter(country__in=countries).distinct()
        self.fields['name'].label = _('Indicator Name')
        self.fields['level'].required = True
        self.fields['name'].required = True
        self.fields['name'].widget = forms.Textarea(attrs={'rows': 3})
        self.fields['unit_of_measure'].required = True
        self.fields['target_frequency'].required = True
        self.fields['target_frequency_start'].widget.attrs['class'] = 'monthPicker'
        # self.fields['is_cumulative'].widget = forms.RadioSelect()
        if self.instance.target_frequency and self.instance.target_frequency != Indicator.LOP:
            self.fields['target_frequency'].widget.attrs['readonly'] = True

    def clean_lop_target(self):
        data = self.cleaned_data['lop_target']
        if data < 0:
            raise forms.ValidationError(_('Please enter a number larger than zero.'))
        return data


class ResultForm(forms.ModelForm):

    class Meta:
        model = Result
        exclude = ['create_date', 'edit_date']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'program': forms.HiddenInput(),
            'indicator': forms.HiddenInput(),
            'evidence': forms.HiddenInput()
        }
        labels = {
            'site': _('Site'),
            'achieved': _('Actual value'),
            'periodic_target': _('Measure against target*'),
            'complete': _('Project'),
        }

    target_frequency = forms.CharField(
        widget=forms.HiddenInput(),
        required=False
    )
    date_collected = forms.DateField(
        widget=DatePicker.DateInput(format=locale_format),
        # TODO: this field outputs dates in non-ISO formats in Spanish & French
        localize=True,
        required=True,
        help_text=' ',
        label=_('Result date')
    )
    submitted_by = forms.CharField(
        widget=forms.TextInput(attrs={'readonly': True}),
        label=_('Submitted by'),
        required=False
    )
    record_name = forms.CharField(
        label=_('Record name'),
        required=False
    )
    record_url = forms.URLField(
        label=_('Link to file or folder'),
        required=False
    )
    record_description = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        label=_('Description'),
        required=False
    )

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request')
        self.indicator = kwargs.pop('indicator')
        super(ResultForm, self).__init__(*args, **kwargs)

        self.set_initial_querysets()
        self.set_periodic_target_widget()
        self.set_evidence_fields()
        self.fields['target_frequency'].initial = self.indicator.target_frequency
        self.fields['submitted_by'].initial = self.request.user.tola_user.display_with_organization
        self.fields['indicator'].initial = self.indicator.id
        self.fields['program'].initial = self.indicator.program.id

    def set_initial_querysets(self):
        """populate foreign key fields with limited quersets based on user / country / program"""
        # provide only in-program Documentation objects for the evidence queryset
        self.fields['evidence'].queryset = Documentation.objects\
            .filter(program=self.indicator.program)
        # only display Project field to existing users
        if not self.request.user.tola_user.allow_projects_access:
            self.fields.pop('complete')
        else:
            # provide only in-program projects for the complete queryset:
            self.fields['complete'].queryset = ProjectComplete.objects.filter(program=self.program)
        self.fields['site'].queryset = SiteProfile.objects.filter(
            country__in=getCountry(self.request.user)
        )

    def set_periodic_target_widget(self):
        # Django will deliver localized strings to the template but the form needs to be able to compare the date
        # entered to the start and end dates of each period.  Data attributes (attached to each option element) are
        # used to provide access to the start and end dates in ISO format, since they are easier to compare to than
        # the localized date strings.
        periodic_targets = PeriodicTarget.objects \
            .filter(indicator=self.indicator) \
            .order_by('customsort', 'create_date', 'period')
        data = {'data-start': {'': ''}, 'data-end': {'': ''}}
        choices = [('', '---------')]
        for pt in periodic_targets:
            data['data-start'].update({str(pt.id): pt.start_date})
            data['data-end'].update({str(pt.id): pt.end_date})
            choices.append((pt.id, str(pt)))
        self.fields['periodic_target'].widget = DataAttributesSelect(data=data, choices=choices)

    def set_evidence_fields(self):
        if self.instance and self.instance.evidence:
            self.fields['record_name'].initial = self.instance.evidence.name
            self.fields['record_url'].initial = self.instance.evidence.url
            self.fields['record_description'].initial = self.instance.evidence.description

    def clean_date_collected(self):
        date_collected = self.cleaned_data['date_collected']
        date_collected = datetime.strftime(date_collected, '%Y-%m-%d')
        return date_collected

    def clean(self):
        cleaned_data = super(ResultForm, self).clean()
        record_name = cleaned_data.get('record_name')
        record_url = cleaned_data.get('record_url')
        record_description = cleaned_data.get('record_description')
        if any([record_name, record_url, record_description]):
            if not record_name:
                msg = forms.ValidationError(_('This field is required'))
                self.add_error('record_name', msg)
            if not record_url:
                msg = forms.ValidationError(_('This field is required'))
                self.add_error('record_url', msg)

    def save(self, commit=True):
        instance = super(ResultForm, self).save(commit=False)
        evidence_id = self.cleaned_data.get('evidence')
        if not evidence_id:
            if self.cleaned_data.get('record_name'):
                new_evidence = Documentation(
                    name=self.cleaned_data.get('record_name'),
                    url=self.cleaned_data.get('record_url'),
                    description=self.cleaned_data.get('record_description'),
                    program=self.cleaned_data.get('program')
                )
                if commit:
                    new_evidence.save()
                    instance.evidence = new_evidence
        if commit:
            instance.save()
        return instance



class ReportFormCommon(forms.Form):
    EMPTY = 0
    YEARS = Indicator.ANNUAL
    SEMIANNUAL = Indicator.SEMI_ANNUAL
    TRIANNUAL = Indicator.TRI_ANNUAL
    QUARTERS = Indicator.QUARTERLY
    MONTHS = Indicator.MONTHLY
    TIMEPERIODS_CHOICES = (
        (YEARS, _("years")),
        (SEMIANNUAL, _("semi-annual periods")),
        (TRIANNUAL, _("tri-annual periods")),
        (QUARTERS, _("quarters")),
        (MONTHS, _("months"))
    )

    SHOW_ALL = 1
    MOST_RECENT = 2
    TIMEFRAME_CHOICES = (
        (SHOW_ALL, _("Show all")),
        (MOST_RECENT, _("Most recent"))
    )

    EMPTY_OPTION = (EMPTY, "---------")
    # combine the target_frequencies (except EVENT) and the EMPTY option
    TARGETPERIODS_CHOICES = (EMPTY_OPTION,) + Indicator.TARGET_FREQUENCIES[0:7]

    program = forms.ModelChoiceField(queryset=Program.objects.none())
    timeperiods = forms.ChoiceField(choices=TIMEPERIODS_CHOICES, required=False)
    targetperiods = forms.ChoiceField(choices=TARGETPERIODS_CHOICES, required=False)
    timeframe = forms.ChoiceField(choices=TIMEFRAME_CHOICES, widget=forms.RadioSelect(), required=False)
    numrecentperiods = forms.IntegerField(required=False)
    formprefix = forms.CharField(widget=forms.HiddenInput(), required=False)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request')
        countries = getCountry(self.request.user)
        super(ReportFormCommon, self).__init__(*args, **kwargs)
        self.fields['program'].label = _("Program")
        self.fields['timeperiods'].label = _("Time periods")
        self.fields['timeperiods'].choices = ((k, v.capitalize()) for k, v in self.TIMEPERIODS_CHOICES)
        self.fields['numrecentperiods'].widget.attrs['placeholder'] = _("enter a number")
        self.fields['targetperiods'].label = _("Target periods")
        self.fields['program'].queryset = Program.objects \
            .filter(country__in=countries,
                    funding_status="Funded",
                    reporting_period_start__isnull=False,
                    reporting_period_end__isnull=False,
                    reporting_period_start__lte=timezone.localdate(),
                    indicator__target_frequency__isnull=False,) \
            .exclude(indicator__isnull=True) \
            .distinct()


class IPTTReportQuickstartForm(ReportFormCommon):
    prefix = 'timeperiods'
    formprefix = forms.CharField(widget=forms.HiddenInput(), required=False)

    def __init__(self, *args, **kwargs):
        prefix = kwargs.pop('prefix')
        self.prefix = prefix if prefix is not None else self.prefix
        super(IPTTReportQuickstartForm, self).__init__(*args, **kwargs)
        self.fields['formprefix'].initial = self.prefix
        self.fields['timeframe'].initial = self.SHOW_ALL
        # self.fields['timeperiods'].widget = forms.HiddenInput()
        self.fields['timeperiods'].initial = Indicator.MONTHLY


class IPTTReportFilterForm(ReportFormCommon):
    level = forms.ModelMultipleChoiceField(queryset=Level.objects.none(), required=False, label=_('Levels'))
    ind_type = forms.ModelMultipleChoiceField(queryset=IndicatorType.objects.none(), required=False, label=_('Types'))
    sector = forms.ModelMultipleChoiceField(queryset=Sector.objects.none(), required=False, label=_('Sectors'))
    site = forms.ModelMultipleChoiceField(queryset=SiteProfile.objects.none(), required=False, label=_('Sites'))
    indicators = forms.ModelMultipleChoiceField(
        queryset=Indicator.objects.none(), required=False, label=_('Indicators'))

    def __init__(self, *args, **kwargs):
        program = kwargs.pop('program')
        periods_choices_start = kwargs.get('initial').get('period_choices_start') # TODO: localize this date
        periods_choices_end = kwargs.get('initial').get('period_choices_end') # TODO: localize this date

        target_frequencies = program.indicator_set.filter(target_frequency__isnull=False) \
            .exclude(target_frequency=Indicator.EVENT) \
            .values('target_frequency') \
            .distinct() \
            .order_by('target_frequency')

        target_frequency_choices = []
        for tp in target_frequencies:
            try:
                pk = int(tp['target_frequency'])
                target_frequency_choices.append((pk, Indicator.TARGET_FREQUENCIES[pk-1][1]))
            except TypeError:
                pass

        first_year_first_daterange_key = kwargs.get('initial').get('period_start_initial')
        last_year_last_daterange_key = kwargs.get('initial').get('period_end_initial')

        super(IPTTReportFilterForm, self).__init__(*args, **kwargs)
        del self.fields['formprefix']
        level_ids = program.indicator_set.values(
            'level_id').distinct().order_by('level')

        self.fields['program'].initial = program
        self.fields['sector'].queryset = Sector.objects.filter(
            indicator__program=program).distinct()
        self.fields['level'].queryset = Level.objects.filter(id__in=level_ids).distinct().order_by('customsort')
        ind_type_ids = program.indicator_set.values(
            'indicator_type__id').distinct().order_by('indicator_type')
        self.fields['ind_type'].queryset = IndicatorType.objects.filter(id__in=ind_type_ids).distinct()
        self.fields['site'].queryset = program.get_sites()
        self.fields['indicators'].queryset = program.indicator_set.all()

        # Start and end periods dropdowns are updated dynamically
        self.fields['start_period'] = forms.ChoiceField(choices=periods_choices_start, label=_("START"))
        self.fields['end_period'] = forms.ChoiceField(choices=periods_choices_end, label=_("END"))

        self.fields['start_period'].initial = str(first_year_first_daterange_key)
        self.fields['end_period'].initial = str(last_year_last_daterange_key)

        self.fields['targetperiods'] = forms.ChoiceField(choices=target_frequency_choices, label=_("TARGET PERIODS"))


class PinnedReportForm(forms.ModelForm):
    class Meta:
        model = PinnedReport
        exclude = ('tola_user',)
