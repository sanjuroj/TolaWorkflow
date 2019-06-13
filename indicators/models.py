# -*- coding: utf-8 -*-
import string
import uuid
from datetime import timedelta, date
from decimal import Decimal

import dateparser
from dateutil.relativedelta import relativedelta
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Avg
from django.http import QueryDict
from django.urls import reverse
from django.utils import formats, timezone, functional
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ugettext
from tola.l10n_utils import l10n_date_year_month, l10n_date_medium
from django.contrib import admin
from django.utils.functional import cached_property
import django.template.defaultfilters


from simple_history.models import HistoricalRecords
from safedelete.models import SafeDeleteModel
from safedelete.managers import SafeDeleteManager
from safedelete.queryset import SafeDeleteQueryset

from workflow.models import (
    Program, Sector, SiteProfile, ProjectAgreement, ProjectComplete, Country,
    Documentation, TolaUser
)


class TolaTable(models.Model):
    name = models.CharField(_("Name"), max_length=255, blank=True)
    table_id = models.IntegerField(_("Table id"), blank=True, null=True)
    owner = models.ForeignKey('auth.User', verbose_name=_("Owner"))
    remote_owner = models.CharField(_("Remote owner"), max_length=255, blank=True)
    country = models.ManyToManyField(Country, blank=True, verbose_name=_("Country"))
    url = models.CharField(_("URL"), max_length=255, blank=True)
    unique_count = models.IntegerField(_("Unique count"), blank=True, null=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    def __unicode__(self):
        return self.name

    @property
    def table_view_url(self):
        """
        The `url` field actually stores the URL used to pull data from the API
        This `tola_table_url` is the URL users can view
        """
        return u'https://tola-tables.mercycorps.org/silo_detail/{}/'.format(self.table_id) if self.table_id else None


class TolaTableAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'owner', 'url', 'create_date',
                    'edit_date')
    search_fields = ('country', 'name')
    list_filter = ('country__country',)
    display = 'Tola Table'


class IndicatorType(models.Model):
    indicator_type = models.CharField(_("Indicator type"), max_length=135, blank=True)
    description = models.TextField(_("Description"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Indicator Type")

    def __unicode__(self):
        return self.indicator_type


class IndicatorTypeAdmin(admin.ModelAdmin):
    list_display = ('indicator_type', 'description', 'create_date',
                    'edit_date')
    display = 'Indicator Type'


class StrategicObjective(SafeDeleteModel):
    name = models.CharField(_("Name"), max_length=135, blank=True)
    country = models.ForeignKey(Country, null=True, blank=True, verbose_name=_("Country"))
    description = models.TextField(_("Description"), max_length=765, blank=True)
    status = models.CharField(_("Status"), max_length=255, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Country Strategic Objectives")
        ordering = ('country', 'name')

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        super(StrategicObjective, self).save(*args, **kwargs)


class Objective(models.Model):
    name = models.CharField(_("Name"), max_length=135, blank=True)
    program = models.ForeignKey(Program, null=True, blank=True, verbose_name=_("Program"))
    description = models.TextField(_("Description"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Program Objective")
        ordering = ('program', 'name')

    def __unicode__(self):
        return self.name

    def save(self):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Objective, self).save()


class Level(models.Model):
    name = models.CharField(_("Name"), max_length=500)
    assumptions = models.CharField(_("Assumptions"), max_length=500, blank=True, null=True)
    parent = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE, related_name='child_levels')
    program = models.ForeignKey(Program, blank=True, null=True, on_delete=models.CASCADE, related_name='levels')
    customsort = models.IntegerField(_("Sort Order"), blank=True, null=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('customsort', )
        verbose_name = _("Level")
        unique_together = ('parent', 'customsort')

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        super(Level, self).save(*args, **kwargs)

    def get_level_depth(self, depth=1):
        if self.parent is None:
            return depth
        else:
            depth += 1
            depth = self.parent.get_level_depth(depth)
        return depth

    @property
    def ontology(self):
        target = self
        ontology = []
        while True:
            ontology = [str(target.customsort)] + ontology
            if target.parent is None:
                break
            else:
                target = target.parent

        tier_count = LevelTier.objects.filter(program=self.program_id).count()
        missing_tiers = tier_count - self.get_level_depth()
        ontology += missing_tiers * ['0']
        return '.'.join(ontology)

    @property
    def display_ontology(self):
        target = self
        display_ontology = []
        while target.parent is not None:
            display_ontology = [str(target.customsort),] + display_ontology
            target = target.parent
        return '.'.join(display_ontology)

    @property
    def leveltier(self):
        # TODO: What if their level hierarchy is deeper than the leveltier set that they pick
        tiers = self.program.level_tiers.order_by('tier_depth')
        try:
            tier = tiers[self.get_level_depth()-1]
        except IndexError:
            tier = None
        return tier

    @property
    def display_name(self):
        """ this returns the level's "name" as displayed on IPTT i.e. Goal: name or Output 1.1: Name"""
        return u'{tier}{ontology}: {name}'.format(
            tier=self.leveltier.name if self.leveltier else '',
            ontology=' {}'.format(self.display_ontology) if self.display_ontology else '',
            name=self.name
        )

    def get_children(self):
        """ Used in group-by-outcome-chain reports, recursively gets children in tree order"""
        child_levels = []
        for child_level in self.child_levels.all():
            child_levels.append(child_level)
            child_levels += child_level.get_children()
        return child_levels

    @property
    def next_sort_order(self):
        current_max = None
        if self.indicator_set.exists():
            current_max = self.indicator_set.aggregate(
                models.Max('level_order')
            ).get('level_order__max', None)
        return 0 if current_max is None else current_max + 1


class LevelAdmin(admin.ModelAdmin):
    list_display = ('name')
    display = 'Levels'


class LevelTier(models.Model):

    TEMPLATES = {
        'mc_standard': {
            # Translators: Name of the most commonly used organizational hierarchy of KPIs at Mercy Corps.
            'name': ugettext('Mercy Corps standard'),
            'tiers': [
                # Highest level objective of a project.  High level KPIs can be attached here.
                ugettext('Goal'),
                # Below Goals, the 2nd highest organizing level to attach KPIs to.
                ugettext('Outcome'),
                # Below Outcome, the 3rd highest organizing level to attach KPIs to. Noun.
                ugettext('Output'),
                # Below Output, the lowest organizing level to attach KPIs to.
                ugettext('Activity')]},
        'ec': {
            # Translators: The KPI organizational hierarchy used when we work on EC projects.
            'name': ugettext('European Commission (EC)'),
            'tiers': [
                # Highest level goal of a project.  High level KPIs can be attached here.
                ugettext('Overall Objective'),
                # Below Overall Objective, the 2nd highest organizing level to attach KPIs to.
                ugettext('Specific Objective'),
                # Below Specific Objective, the 3rd highest organizing level to attach KPIs to.
                ugettext('Purpose'),
                # Below Purpose, the 4th highest organizing level to attach KPIs to.
                ugettext('Result'),
                # Below Result, the lowest organizing level to attach KPIs to.
                ugettext('Activity')]},
        'usaid1': {
            # Translators: The KPI organizational hierarchy used when we work on certain USAID projects.
            'name': ugettext('USAID 1'),
            'tiers': [
                # Highest level objective of a project.  High level KPIs can be attached here.
                ugettext('Goal'),
                # Below Goal, the 2nd highest organizing level to attach KPIs to.
                ugettext('Purpose'),
                # Below Purpose, the 3rd highest organizing level to attach KPIs to.
                ugettext('Sub-Purpose'),
                # Below Sub-Purpose, the 4th highest organizing level to attach KPIs to. Noun.
                ugettext('Output'),
                # Below Output, the lowest organizing level to attach KPIs to. Noun.
                ugettext('Input')]},
        'usaid2': {
            # Translators: The KPI organizational hierarchy used when we work on certain USAID projects.
            'name': ugettext('USAID 2'),
            'tiers': [
                # Highest level goal of a project.  High level KPIs can be attached here.
                ugettext('Strategic Objective'),
                # Below Strategic Objective, the 2nd highest organizing level to attach KPIs to.
                ugettext('Intermediate Result'),
                # Below Intermediate Result, the 3rd highest organizing level to attach KPIs to.
                ugettext('Sub-Intermediate Result'),
                # Below Sub-Intermediate Result, the 4th highest organizing level to attach KPIs to. Noun.
                ugettext('Output'),
                # Below Output, the lowest organizing level to attach KPIs to. Noun.
                ugettext('Input')]},
        'usaid_ffp': {
            # Translators: The KPI organizational hierarchy used when we work on USAID Food for Peace projects.
            'name': ugettext('USAID FFP'),
            'tiers': [
                # Highest level bojective of a project.  High level KPIs can be attached here.
                ugettext('Goal'),
                # Below Goal, the 2nd highest organizing level to attach KPIs to.
                ugettext('Purpose'),
                # Below Purpose, the 3rd highest organizing level to attach KPIs to.
                ugettext('Sub-Purpose'),
                # Below Sub-Purpose, the 4th highest organizing level to attach KPIs to.
                ugettext('Intermediate Outcome'),
                # Below Intermediate Outcome, the lowest organizing level to attach KPIs to. Noun.
                ugettext('Output')]},
    }

    name = models.CharField(ugettext("Name"), max_length=135, blank=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='level_tiers')
    tier_depth = models.IntegerField(ugettext("Level Tier depth"))
    create_date = models.DateTimeField(ugettext("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(ugettext("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('tier_depth', )
        verbose_name = ugettext("Level Tier")
        unique_together = (('name', 'program'), ('program', 'tier_depth'))

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(LevelTier, self).save(*args, **kwargs)


class DisaggregationType(models.Model):
    disaggregation_type = models.CharField(_("Disaggregation type"), max_length=135, blank=True)
    description = models.CharField(_("Description"), max_length=765, blank=True)
    country = models.ForeignKey(Country, null=True, blank=True, verbose_name="Country")
    standard = models.BooleanField(default=False, verbose_name=_("Standard (TolaData Admins Only)"))
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    def __unicode__(self):
        return self.disaggregation_type


class DisaggregationLabel(models.Model):
    disaggregation_type = models.ForeignKey(DisaggregationType, verbose_name=_("Disaggregation type"))
    label = models.CharField(_("Label"), max_length=765, blank=True)
    customsort = models.IntegerField(_("Customsort"), blank=True, null=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    def __unicode__(self):
        return self.label

    @classmethod
    def get_standard_labels(cls):
        return cls.objects.filter(disaggregation_type__standard=True)


class DisaggregationValue(models.Model):
    disaggregation_label = models.ForeignKey(
        DisaggregationLabel, verbose_name=_("Disaggregation label"))
    value = models.CharField(_("Value"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    def __unicode__(self):
        return self.value


class DisaggregationValueAdmin(admin.ModelAdmin):
    list_display = ('disaggregation_label', 'value', 'create_date',
                    'edit_date')
    list_filter = (
        'disaggregation_label__disaggregation_type__disaggregation_type',
        'disaggregation_label'
    )
    display = 'Disaggregation Value'


class ReportingFrequency(models.Model):
    frequency = models.CharField(
        _("Frequency"), max_length=135, blank=True)
    description = models.CharField(
        _("Description"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Reporting Frequency")

    def __unicode__(self):
        return self.frequency


class DataCollectionFrequency(models.Model):
    frequency = models.CharField(
        _("Frequency"), max_length=135, blank=True, null=True)
    description = models.CharField(
        _("Description"), max_length=255, blank=True, null=True)
    numdays = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Frequency in number of days")
    )
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Data Collection Frequency")

    def __unicode__(self):
        return self.frequency


class DataCollectionFrequencyAdmin(admin.ModelAdmin):
    list_display = ('frequency', 'description', 'create_date', 'edit_date')
    display = 'Data Collection Frequency'


# TODO: Delete ReportingPeriod and ReportingPeriodAdmin? Not linked to other models and doesn't seem to be
# utilized in views
class ReportingPeriod(models.Model):
    frequency = models.ForeignKey(
        ReportingFrequency, verbose_name=_("Frequency")
    )
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Reporting Period")

    def __unicode__(self):
        return self.frequency


class ReportingPeriodAdmin(admin.ModelAdmin):
    list_display = ('frequency', 'create_date', 'edit_date')
    display = 'Reporting Frequency'


class ExternalService(models.Model):
    name = models.CharField(_("Name"), max_length=255, blank=True)
    url = models.CharField(_("URL"), max_length=765, blank=True)
    feed_url = models.CharField(_("Feed URL"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("External Service")

    def __unicode__(self):
        return self.name


class ExternalServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'feed_url', 'create_date', 'edit_date')
    display = 'External Indicator Data Service'


class ExternalServiceRecord(models.Model):
    external_service = models.ForeignKey(
        ExternalService, blank=True, null=True, on_delete=models.SET_NULL,
        verbose_name=_("External service"))
    full_url = models.CharField(_("Full URL"), max_length=765, blank=True)
    record_id = models.CharField(_("Unique ID"), max_length=765, blank=True)
    create_date = models.DateTimeField(null=True, blank=True, verbose_name=_("Create date"))
    edit_date = models.DateTimeField(null=True, blank=True, verbose_name=_("Edit date"))

    class Meta:
        verbose_name = _("External Service Record")

    def __unicode__(self):
        return self.full_url


class ExternalServiceRecordAdmin(admin.ModelAdmin):
    list_display = ('external_service', 'full_url', 'record_id', 'create_date',
                    'edit_date')
    display = 'Exeternal Indicator Data Service'

# pylint: disable=W0223
class DecimalSplit(models.Func):
    function = 'SUBSTRING_INDEX'
    template = '%(function)s(%(expressions)s)'

    def __init__(self, string, count, **extra):
        expressions = models.F(string), models.Value('.'), count
        super(DecimalSplit, self).__init__(*expressions)

# pylint: disable=W0223
class DoubleDecimalSplit(models.Func):
    function = 'SUBSTRING_INDEX'
    template = 'SUBSTRING_INDEX(%(function)s(%(expressions)s), \'.\', -1)'

    def __init__(self, string, count, **extra):
        expressions = models.F(string), models.Value('.'), count
        super(DoubleDecimalSplit, self).__init__(*expressions)

class IndicatorSortingQSMixin(object):
    """This provides a temporary relief to indicator number sorting issues in advance of Satsuma -
    uses regex matches to determine if the number is of the format "1.1" or "1.1.1" etc. and sorts it then by
    version number sorting, otherwise numeric, and falls back to alphabetical.  Written as a mixin so it can be
    replaced with log frame sorting on release of Satsuma"""
    def with_logframe_sorting(self):
        numeric_re = r'^[[:space:]]*[0-9]+[[:space:]]*$'
        logframe_re = r'^[[:space:]]*[0-9]+([[.period.]][0-9]+)?'\
                      '([[.period.]][0-9]+)?([[.period.]][0-9]+)?([[.period.]])?([a-z]+)?[[:space:]]*$'
        logframe_re2 = r'^[[:space:]]*[0-9]+[[.period.]][0-9]+([[.period.]][0-9]+)?([[.period.]][0-9]+)?[[:space:]]*$'
        logframe_re3 = r'^[[:space:]]*[0-9]+[[.period.]][0-9]+[[.period.]][0-9]+([[.period.]][0-9]+)?[[:space:]]*$'
        logframe_re4 = r'^[[:space:]]*[0-9]+[[.period.]][0-9]+[[.period.]][0-9]+[[.period.]][0-9]+[[:space:]]*$'

        qs = self.annotate(
            logsort_type=models.Case(
                models.When(
                    level_id__isnull=False,
                    then=0
                ),
                models.When(
                    number__regex=logframe_re,
                    then=1
                ),
                models.When(
                    number__regex=numeric_re,
                    then=2
                ),
                default=3,
                output_field=models.IntegerField()
            )
        ).annotate(
            logsort_a=models.Case(
                models.When(
                    logsort_type=0,
                    then=models.F('level_order')
                ),
                models.When(
                    logsort_type=1,
                    then=DecimalSplit('number', 1)
                ),
                models.When(
                    logsort_type=2,
                    then=models.F('number'),
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            ),
            logsort_b=models.Case(
                models.When(
                    number__regex=logframe_re2,
                    then=DoubleDecimalSplit('number', 2)
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            ),
            logsort_c=models.Case(
                models.When(
                    number__regex=logframe_re3,
                    then=DoubleDecimalSplit('number', 3)
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            ),
            logsort_d=models.Case(
                models.When(
                    number__regex=logframe_re4,
                    then=DoubleDecimalSplit('number', 4)
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            )
        )
        return qs.order_by(
            'logsort_type',
            models.functions.Cast('logsort_a', models.IntegerField()),
            models.functions.Cast('logsort_b', models.IntegerField()),
            models.functions.Cast('logsort_c', models.IntegerField()),
            'number'
            )

class IndicatorSortingManagerMixin(object):
    """This provides a temporary relief to indicator number sorting issues in advance of Satsuma -
    provides a logframe sorting method that utilizes the above QS mixin to sort as though a logframe model existed"""
    def with_logframe_sorting(self):
        qs = self.get_queryset()
        return qs.with_logframe_sorting()

class IndicatorQuerySet(SafeDeleteQueryset, IndicatorSortingQSMixin):
    pass

class IndicatorManager(SafeDeleteManager, IndicatorSortingManagerMixin):

    def get_queryset(self):
        queryset = IndicatorQuerySet(self.model, using=self._db)
        queryset._safedelete_visibility = self._safedelete_visibility
        queryset._safedelete_visibility_field = self._safedelete_visibility_field
        return queryset.select_related('program', 'sector')


class Indicator(SafeDeleteModel):
    LOP = 1
    MID_END = 2
    ANNUAL = 3
    SEMI_ANNUAL = 4
    TRI_ANNUAL = 5
    QUARTERLY = 6
    MONTHLY = 7
    EVENT = 8
    TARGET_FREQUENCIES = (
        (LOP, _('Life of Program (LoP) only')),
        (MID_END, _('Midline and endline')),
        (ANNUAL, _('Annual')),
        (SEMI_ANNUAL, _('Semi-annual')),
        (TRI_ANNUAL, _('Tri-annual')),
        (QUARTERLY, _('Quarterly')),
        (MONTHLY, _('Monthly')),
        (EVENT, _('Event'))
    )

    REGULAR_TARGET_FREQUENCIES = (
        ANNUAL,
        SEMI_ANNUAL,
        TRI_ANNUAL,
        QUARTERLY,
        MONTHLY,
    )

    IRREGULAR_TARGET_REQUENCIES = (
        LOP,
        MID_END,
        EVENT,
    )

    NUMBER = 1
    PERCENTAGE = 2
    UNIT_OF_MEASURE_TYPES = (
        (NUMBER, _('Number (#)')),
        (PERCENTAGE, _("Percentage (%)"))
    )

    DIRECTION_OF_CHANGE_NONE = 1
    DIRECTION_OF_CHANGE_POSITIVE = 2
    DIRECTION_OF_CHANGE_NEGATIVE = 3
    DIRECTION_OF_CHANGE = (
        (DIRECTION_OF_CHANGE_NONE, _("Direction of change (not applicable)")),
        (DIRECTION_OF_CHANGE_POSITIVE, _("Increase (+)")),
        (DIRECTION_OF_CHANGE_NEGATIVE, _("Decrease (-)"))
    )
    SEPARATOR = ','

    ONSCOPE_MARGIN = .15

    OLD_LEVELS = [
        (1, 'Goal'),
        (2, 'Output'),
        (3, 'Outcome'),
        (4, 'Activity'),
        (5, 'Impact'),
        (6, 'Intermediate Outcome')
    ]


    indicator_key = models.UUIDField(
        default=uuid.uuid4, unique=True, help_text=" ", verbose_name=_("Indicator key")),

    # i.e. Alpha, Donor, Standard
    # TODO: make this a foreign key
    indicator_type = models.ManyToManyField(
        IndicatorType, blank=True, help_text=" ",
        verbose_name=_("Indicator type")
    )

    # the Log Frame level (i.e. Goal, Output, Outcome, etc.)
    level = models.ForeignKey(
        Level, blank=True, null=True, verbose_name=_("Level"),
        on_delete=models.SET_NULL
    )

    # ordering with respect to level (determines whether indicator is 1.1a 1.1b or 1.1c)
    level_order = models.IntegerField(default=0)

    # this includes a relationship to a program
    objectives = models.ManyToManyField(
        Objective, blank=True, verbose_name=_("Program Objective"),
        related_name="obj_indicator", help_text=" "
    )

    # this includes a relationship to a country
    strategic_objectives = models.ManyToManyField(
        StrategicObjective, verbose_name=_("Country Strategic Objective"),
        blank=True, related_name="strat_indicator", help_text=" "
    )

    name = models.CharField(verbose_name=_("Name"), max_length=255,
                            null=False, help_text=" ")

    number = models.CharField(
        _("Number"), max_length=255, null=True, blank=True, help_text=" "
    )

    source = models.CharField(
        _("Source"), max_length=255, null=True, blank=True, help_text=" "
    )

    definition = models.TextField(
        _("Definition"), null=True, blank=True, help_text=" "
    )

    justification = models.TextField(
        max_length=500, null=True, blank=True,
        verbose_name=_("Rationale or Justification for Indicator"),
        help_text=" "
    )

    unit_of_measure = models.CharField(
        max_length=135, null=True, blank=True,
        verbose_name=_("Unit of measure"),
        help_text=" "
    )

    unit_of_measure_type = models.IntegerField(
        blank=False, null=True, choices=UNIT_OF_MEASURE_TYPES,
        default=NUMBER,
        verbose_name=_("Unit Type"), help_text=" "
    )

    disaggregation = models.ManyToManyField(
        DisaggregationType, blank=True, help_text=" ",
        verbose_name=_("Disaggregation"))

    baseline = models.CharField(
        verbose_name=_("Baseline"), max_length=255, null=True, blank=True,
        help_text=" "
    )

    baseline_na = models.BooleanField(
        verbose_name=_("Not applicable"), default=False, help_text=" "
    )

    lop_target = models.DecimalField(
        blank=True, decimal_places=2, help_text=b' ',
        max_digits=20, null=True, verbose_name=_('Life of Program (LoP) target'))

    direction_of_change = models.IntegerField(
        blank=False, null=True, choices=DIRECTION_OF_CHANGE,
        default=DIRECTION_OF_CHANGE_NONE,
        verbose_name=_("Direction of Change"), help_text=" "
    )

    is_cumulative = models.NullBooleanField(
        blank=False, verbose_name=_("C / NC"), help_text=" "
    )

    rationale_for_target = models.TextField(
        _("Rationale for target"), max_length=255, null=True,
        blank=True, help_text=" "
    )

    target_frequency = models.IntegerField(
        blank=False, null=True, choices=TARGET_FREQUENCIES,
        verbose_name=_("Target frequency"), help_text=" "
    )

    # Deprecated - redundant to the event name of the first PeriodicTarget saved by the form
    target_frequency_custom = models.CharField(
        null=True, blank=True, max_length=100,
        verbose_name=_("First event name"), help_text=" "
    )

    # Deprecated - can probably be safely deleted
    target_frequency_start = models.DateField(
        blank=True, null=True, auto_now=False, auto_now_add=False,
        verbose_name=_("First target period begins*"), help_text=" "
    )

    target_frequency_num_periods = models.IntegerField(
        blank=True, null=True, verbose_name=_("Number of target periods*"),
        help_text=" "
    )

    means_of_verification = models.CharField(
        max_length=255, null=True, blank=True,
        verbose_name=_("Means of Verification / Data Source"), help_text=" "
    )

    data_collection_method = models.CharField(
        max_length=255, null=True, blank=True,
        verbose_name=_("Data Collection Method"), help_text=" "
    )

    data_collection_frequency = models.ForeignKey(
        DataCollectionFrequency, null=True, blank=True, on_delete=models.SET_NULL,
        verbose_name=_("Frequency of Data Collection"), help_text=" "
    )

    data_points = models.TextField(
        max_length=500, null=True, blank=True, verbose_name=_("Data points"),
        help_text=" "
    )

    responsible_person = models.CharField(
        max_length=255, null=True, blank=True,
        verbose_name=_("Responsible Person(s) and Team"), help_text=" "
    )

    method_of_analysis = models.CharField(
        max_length=255, null=True, blank=True,
        verbose_name=_("Method of Analysis"), help_text=" "
    )

    information_use = models.CharField(
        max_length=255, null=True, blank=True,
        verbose_name=_("Information Use"), help_text=" "
    )

    reporting_frequency = models.ForeignKey(
        ReportingFrequency, null=True, blank=True, on_delete=models.SET_NULL,
        verbose_name=_("Frequency of Reporting"), help_text=" "
    )

    quality_assurance = models.TextField(
        max_length=500, null=True, blank=True,
        verbose_name=_("Quality Assurance Measures"), help_text=" "
    )

    data_issues = models.TextField(
        max_length=500, null=True, blank=True, verbose_name=_("Data issues"),
        help_text=" "
    )

    indicator_changes = models.TextField(
        max_length=500, null=True, blank=True,
        verbose_name=_("Changes to Indicator"), help_text=" "
    )

    comments = models.TextField(
        _("Comments"), max_length=255, null=True, blank=True, help_text=" "
    )

    program = models.ForeignKey(
        Program, verbose_name=_("Program"),
        blank=True, null=True, on_delete=models.CASCADE,
    )

    sector = models.ForeignKey(
        Sector, null=True, blank=True, on_delete=models.SET_NULL, help_text=" ", verbose_name=_("Sector")
    )

    key_performance_indicator = models.BooleanField(
        verbose_name=_("Key Performance Indicator for this program?"),
        default=False, help_text=" "
    )

    approved_by = models.ForeignKey(
        TolaUser, blank=True, null=True, on_delete=models.SET_NULL, related_name="approving_indicator",
        verbose_name=_("Approved by"), help_text=" "
    )

    approval_submitted_by = models.ForeignKey(
        TolaUser, blank=True, null=True, on_delete=models.SET_NULL, related_name="indicator_submitted_by",
        verbose_name=_("Approval submitted by"), help_text=" "
    )

    external_service_record = models.ForeignKey(
        ExternalServiceRecord, verbose_name=_("External Service ID"),
        blank=True, null=True, on_delete=models.SET_NULL, help_text=" "
    )

    old_level = models.CharField(
        max_length=80, null=True, blank=True,
        verbose_name=_("Old Level"), help_text=" "
    )

    create_date = models.DateTimeField(
        _("Create date"), null=True, blank=True, help_text=" "
    )

    edit_date = models.DateTimeField(
        _("Edit date"), null=True, blank=True, help_text=" "
    )

    notes = models.TextField(_("Notes"), max_length=500, null=True, blank=True)
    # optimize query for class based views etc.
    objects = IndicatorManager()

    class Meta:
        ordering = ('create_date',)
        verbose_name = _("Indicator")

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Indicator, self).save(*args, **kwargs)

    @property
    def is_target_frequency_time_aware(self):
        return self.target_frequency in self.REGULAR_TARGET_FREQUENCIES

    @property
    def is_target_frequency_not_time_aware(self):
        return self.target_frequency in self.IRREGULAR_TARGET_REQUENCIES

    @property
    def is_target_frequency_lop(self):
        return self.target_frequency == self.LOP

    @property
    def just_created(self):
        if self.create_date >= timezone.now() - timedelta(minutes=5):
            return True
        return False

    @property
    def name_clean(self):
        return self.name.encode('ascii', 'ignore')

    @property
    def objectives_list(self):
        return ', '.join([x.name for x in self.objectives.all()])

    @property
    def strategicobjectives_list(self):
        return ', '.join([x.name for x in self.strategic_objectives.all()])

    @property
    def programs(self):
        return ', '.join([x.name for x in self.program.all()])

    @property
    def indicator_types(self):
        return ', '.join([x.indicator_type for x in self.indicator_type.all()])

    @property
    def disaggregations(self):
        disaggregations = self.disaggregation.all()
        return self.SEPARATOR.join([x.disaggregation_type for x in disaggregations])

    @property
    def logged_fields(self):
        s = self
        return {
            "name": s.name.strip(),
            "unit_of_measure": s.unit_of_measure.strip() if s.unit_of_measure else s.unit_of_measure,
            "unit_of_measure_type": s.unit_of_measure_type,
            "is_cumulative": s.is_cumulative,
            "lop_target": s.lop_target,
            "direction_of_change": s.direction_of_change,
            "baseline_value": s.baseline.strip() if s.baseline else s.baseline,
            "baseline_na": s.baseline_na,
            "targets": {
                t.id: {
                    "id": t.id,
                    "value": t.target_display_str,
                    "name": t.period_name.strip(),
                }
                for t in s.periodictargets.all()
            }
        }

    @property
    def get_target_frequency_label(self):
        if self.target_frequency:
            return Indicator.TARGET_FREQUENCIES[self.target_frequency-1][1]
        return None

    @property
    def get_unit_of_measure_type(self):
        if self.unit_of_measure_type == self.NUMBER:
            return _("#")
        elif self.unit_of_measure_type == self.PERCENTAGE:
            return _("%")
        return ""

    @property
    def is_cumulative_display(self):
        if self.is_cumulative:
            # Translators: referring to an indicator whose results accumulate over time
            return _("Cumulative")
        elif self.is_cumulative is None:
            return None
        else:
            # Translators: referring to an indicator whose results do not accumulate over time
            return _("Not cumulative")

    @property
    def get_direction_of_change(self):
        if self.direction_of_change == self.DIRECTION_OF_CHANGE_NEGATIVE:
            return _("-")
        elif self.direction_of_change == self.DIRECTION_OF_CHANGE_POSITIVE:
            return _("+")
        return None

    @property
    def get_result_average(self):
        avg = self.result_set.aggregate(Avg('achieved'))['achieved__avg']
        return avg

    @property
    def baseline_display(self):
        if self.baseline and self.unit_of_measure_type == self.PERCENTAGE:
            return u"{0}%".format(self.baseline)
        return self.baseline

    @property
    def calculated_lop_target(self):
        """
        We have always manually set the LoP target of an indicator manually via form input
        but now we are starting to compute it based on the PeriodicTarget values.

        This property returns the calculated value, which may be different than the stored value in the DB
        """
        periodic_targets = self.periodictargets.all()

        if not periodic_targets.exists():
            return None

        if self.is_cumulative:
            # return the last value in the sequence
            return periodic_targets.last().target
        else:
            # sum the values
            return sum(pt.target for pt in periodic_targets)

    @property
    def lop_target_stripped(self):
        """adding logic to strip trailing zeros in case of a decimal with superfluous zeros to the right of the ."""
        if self.lop_target:
            lop_stripped = str(self.lop_target)
            lop_stripped = lop_stripped.rstrip('0').rstrip('.') if '.' in lop_stripped else lop_stripped
            return lop_stripped
        return self.lop_target

    @property
    def lop_target_display(self):
        """Same as lop_target_stripped but with a trailing % if applicable"""
        if self.lop_target:
            lop_stripped = self.lop_target_stripped
            if self.unit_of_measure_type == self.PERCENTAGE:
                return u"{0}%".format(lop_stripped)
            return lop_stripped
        return self.lop_target

    def current_periodic_target(self, date_=None):
        """
        Return the periodic target with start/end date containing localdate() or specified date

        :return: A PeriodicTarget with start_date and end_date containing now(), or None
        if no PeriodicTargets are found matching that criteria such as MIDLINE/ENDLINE
        """
        today = date_ or timezone.localdate()
        return self.periodictargets.filter(start_date__lte=today, end_date__gte=today).first()


    @property
    def last_ended_periodic_target(self):
        """
        Returns the last periodic target if any, or None
        """
        return self.periodictargets.filter(end_date__lte=timezone.localdate()).last()


    @cached_property
    def cached_data_count(self):
        return self.result_set.count()

    @property
    def leveltier_name(self):
        if self.level and self.level.leveltier:
            return self.level.leveltier.name
        elif self.level is None and self.old_level:
            return self.old_level
        return None

    @property
    def level_display_ontology(self):
        if self.level:
            return self.level.display_ontology
        return None

    @property
    def leveltier_depth(self):
        if self.level and self.level.leveltier:
            return self.level.get_level_depth()
        return None

    @property
    def level_pk(self):
        if self.level:
            return self.level.pk
        return None

    @property
    def level_order_display(self):
        """returns a-z for 0-25, then aa - zz for 26-676"""
        if self.level and self.level_order is not None and self.level_order < 26:
            return string.lowercase[self.level_order]
        elif self.level and self.level_order and self.level_order >= 26:
            return string.lowercase[self.level_order/26 - 1] + string.lowercase[self.level_order % 26]
        return ''

    @property
    def number_display(self):
        if self.results_framework and self.program.auto_number_indicators and self.level and self.level.leveltier:
            return "{0} {1}{2}".format(
                self.leveltier_name, self.level.display_ontology, self.level_order_display
            )
        elif self.results_framework and not self.program.auto_number_indicators:
            return self.number
        elif self.results_framework:
            return None
        else:
            return self.number

    @property
    def form_title_level(self):
        if self.results_framework:
            return '{} {} {}'.format(
                self.leveltier_name,
                _('indicator'),
                self.name
            )
        else:
            return '{} {}'.format(
                self.old_level,
                _('indicator')
            )


    @property
    def results_framework(self):
        if hasattr(self, 'using_results_framework'):
            return self.using_results_framework
        elif hasattr(self.program, 'using_results_framework'):
            return self.program.using_results_framework
        return self.program._using_results_framework != Program.NOT_MIGRATED


class PeriodicTarget(models.Model):
    LOP_PERIOD = _('Life of Program (LoP) only')
    MIDLINE = _('Midline')
    ENDLINE = _('Endline')
    ANNUAL_PERIOD = _('Year')
    SEMI_ANNUAL_PERIOD = _('Semi-annual period')
    TRI_ANNUAL_PERIOD = _('Tri-annual period')
    QUARTERLY_PERIOD = _('Quarter')

    indicator = models.ForeignKey(
        Indicator, null=False, blank=False, verbose_name=_("Indicator"), related_name="periodictargets"
    )

    # This field should never be referenced directly in the UI! See period_name below.
    period = models.CharField(
        _("Period"), max_length=255, null=True, blank=True
    )

    target = models.DecimalField(
        _("Target"), max_digits=20, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.0'))]
    )

    start_date = models.DateField(
        _("Start date"), auto_now=False, auto_now_add=False, null=True,
        blank=True
    )

    end_date = models.DateField(
        _("End date"), auto_now=False, auto_now_add=False, null=True,
        blank=True
    )

    customsort = models.IntegerField(_("Customsort"), default=0)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('customsort', '-create_date')
        verbose_name = _("Periodic Target")
        unique_together = (('indicator', 'customsort'),)

    @property
    def target_display_str(self):
        """Return str of target decimal value, rounded if a whole number"""
        s = str(self.target)
        return s.rstrip('0').rstrip('.') if '.' in s else s

    @staticmethod
    def generate_monthly_period_name(start_date):
        return django.template.defaultfilters.date(start_date, 'F Y')

    @staticmethod
    def generate_event_period_name(event_name):
        return event_name

    @classmethod
    def generate_midline_period_name(cls):
        return cls.MIDLINE

    @classmethod
    def generate_endline_period_name(cls):
        return cls.ENDLINE

    @classmethod
    def generate_lop_period_name(cls):
        return cls.LOP_PERIOD

    @classmethod
    def generate_annual_quarterly_period_name(cls, target_frequency, period_seq_num):
        target_frequency_to_period_name = {
            Indicator.ANNUAL: cls.ANNUAL_PERIOD,
            Indicator.SEMI_ANNUAL: cls.SEMI_ANNUAL_PERIOD,
            Indicator.TRI_ANNUAL: cls.TRI_ANNUAL_PERIOD,
            Indicator.QUARTERLY: cls.QUARTERLY_PERIOD,
        }

        period_name = target_frequency_to_period_name.get(target_frequency)

        if period_name is None:
            raise Exception('Invalid target_frequency passed to generate_annual_quarterly_period_name()')

        return u"{period_name} {period_number}".format(
            period_name=period_name,
            period_number=period_seq_num,
        )

    @property
    def has_ended(self):
        """ returns whether the target period is considered 'ended" for purposes of aggregating e.g. in gauges """
        try:
            if self.indicator.is_target_frequency_time_aware: # for annual, semi/tri-annual, quarterly, monthly
                return self.end_date < timezone.localdate()
            elif self.indicator.target_frequency == Indicator.LOP: # LOP target ends when the program does
                return self.indicator.program.reporting_period_end < timezone.localdate()
            elif self.indicator.target_frequency in (Indicator.EVENT, Indicator.MID_END):
                # these are always included in aggregated results so they are always considered "ended"
                return True
            else:
                return False
        except TypeError: # some edge cases for time-aware targets created without dates
                return False

    @property
    def period_name(self):
        """returns a period name translated to the local language.
            - LOP target: see target definition above,
            - MID/END: uses customsort to pick from definitions above
            - ANNUAL/SEMI_ANNUAL/TRI_ANNUAL/QUARTERLY: "Year 1" / "Semi-Annual Period 2" / "Quarter 4"
            - MONTHLY: "Jan 2018"
            - EVENT: this (and only this) uses the 'period' field and customsort to be "period name 1"
        """
        target_frequency = self.indicator.target_frequency

        # used in the result modal to display options in the target period dropdown
        if target_frequency == Indicator.MID_END:
            # midline is the translated "midline" or "endline" based on customsort
            return self.generate_midline_period_name() if self.customsort == 0 else self.generate_endline_period_name()
        if target_frequency == Indicator.LOP:
            # lop always has translated lop value
            return self.generate_lop_period_name()

        # use locale specific month names
        if target_frequency == Indicator.MONTHLY:
            return self.generate_monthly_period_name(self.start_date)

        # Do nothing for events
        if target_frequency == Indicator.EVENT:
            return self.generate_event_period_name(self.period)

        # for time-based frequencies get translated name of period:
        return self.generate_annual_quarterly_period_name(target_frequency, self.customsort + 1)

    def __unicode__(self):
        """outputs the period name (see period_name docstring) followed by start and end dates

        used in result form"""
        period_name = self.period_name

        if period_name and self.start_date and self.end_date:
            # e.g "Year 1 (date - date)" or "Quarter 2 (date - date)"
            return u"{period_name} ({start_date} - {end_date})".format(
                period_name=period_name,
                start_date=l10n_date_medium(self.start_date).decode('utf-8'),
                end_date=l10n_date_medium(self.end_date).decode('utf-8'),
            )
        elif period_name:
            # if no date for some reason but time-based frequency:
            return unicode(period_name)

        return self.period

    @classmethod
    def generate_for_frequency(cls, frequency):
        """
        Returns a generator function to yield periods based on start and end dates for a given frequency

        WARNING: This function as it stands can return either a str() or a unicode() depending on the `frequency`

        It returns a str() in the case of:

            * ANNUAL
            * MONTHLY
            * SEMI_ANNUAL_PERIOD
            * TRI_ANNUAL_PERIOD
            * QUARTERLY_PERIOD

        It returns unicode() in the case of:

            * LOP_PERIOD
            * MID_END

        It's unclear how some of these ''.format() works, as some params are gettext_lazy() (unicode) values containing
        non-ASCII chars being plugged into a non-unicode string. This normally crashes but for some reason it works here.

        An example of something that crashes in the REPL but seemingly works here when using ugettext_lazy():

            '{year}'.format(year=u'Año')

        It's my hope one day to find out how this works, but for now I would be happy with this just returning unicode
        for all cases as a consolation prize
        """
        months_per_period = {
            Indicator.SEMI_ANNUAL: 6,
            Indicator.TRI_ANNUAL: 4,
            Indicator.QUARTERLY: 3,
            Indicator.MONTHLY: 1
        }
        if frequency == Indicator.ANNUAL:
            next_date_func = lambda x: date(x.year + 1, x.month, 1)
            name_func = lambda start, count: '{period_name} {count}'.format(
                period_name=_(cls.ANNUAL_PERIOD), count=count)
        elif frequency in months_per_period:
            next_date_func = lambda x: date(
                x.year if x.month <= 12-months_per_period[frequency] else x.year + 1,
                x.month + months_per_period[frequency] if x.month <= 12 - months_per_period[frequency] \
                else x.month + months_per_period[frequency] - 12,
                1)
            if frequency == Indicator.MONTHLY:
                # TODO: strftime() does not work with Django i18n and will not give you localized month names
                # Could be: name_func = lambda start, count: cls.generate_monthly_period_name(start)
                # the above breaks things in other places though due to unicode encoding/decoding errors
                # UPDATE: Turns out the below still translates... strftime() still returns an english
                # month name, but since month names are translated elsewhere in the app, the _() turns it into
                # the correct language
                name_func = lambda start, count: '{month_name} {year}'.format(
                    month_name=_(start.strftime('%B')),
                    year=start.strftime('%Y')
                    )
            else:
                period_name = {
                    Indicator.SEMI_ANNUAL: cls.SEMI_ANNUAL_PERIOD,
                    Indicator.TRI_ANNUAL: cls.TRI_ANNUAL_PERIOD,
                    Indicator.QUARTERLY: cls.QUARTERLY_PERIOD
                }[frequency]
                name_func = lambda start, count: '{period_name} {count}'.format(
                    period_name=_(period_name), count=count)
        elif frequency == Indicator.LOP:
            return lambda start, end: [{
                'name': _(cls.LOP_PERIOD),
                'start': start,
                'label': '{0} - {1}'.format(l10n_date_medium(start), l10n_date_medium(end)),
                'end': end,
                'customsort': 0
                }]
        elif frequency == Indicator.MID_END:
            return lambda start, end: [
                {'name': _(cls.MIDLINE),
                 'start': start,
                 'label': None,
                 'end': end,
                 'customsort': 0},
                {'name': _(cls.ENDLINE),
                 'start': start,
                 'label': None,
                 'end': end,
                 'customsort': 1}
            ]
        else:
            next_date_func = None
            name_func = None
        def period_generator(start, end):
            count = 0
            while start < end:
                next_start = next_date_func(start)
                yield {
                    'name': name_func(start, count+1),
                    'start': start,
                    'label': '{0} - {1}'.format(
                        l10n_date_medium(start), l10n_date_medium(next_start - timedelta(days=1))
                        ) if frequency != Indicator.MONTHLY else None,
                    'end': next_start - timedelta(days=1),
                    'customsort': count
                }
                count += 1
                start = next_start
        return period_generator


class PeriodicTargetAdmin(admin.ModelAdmin):
    list_display = ('period', 'target', 'customsort',)
    display = 'Indicator Periodic Target'
    list_filter = ('period',)


class ResultManager(models.Manager):
    def get_queryset(self):
        return super(ResultManager, self).get_queryset()\
            .prefetch_related('site', 'disaggregation_value')\
            .select_related('program', 'indicator', 'agreement', 'complete',
                            'evidence', 'tola_table')


class Result(models.Model):
    data_key = models.UUIDField(
        default=uuid.uuid4, unique=True, help_text=" ", verbose_name=_("Data key")),

    periodic_target = models.ForeignKey(
        PeriodicTarget, null=True, blank=True, on_delete=models.SET_NULL, help_text=" ",
        verbose_name=_("Periodic target")
    )

    achieved = models.DecimalField(
        verbose_name=_("Actual"), max_digits=20, decimal_places=2,
        help_text=" ")

    disaggregation_value = models.ManyToManyField(
        DisaggregationValue, blank=True, help_text=" ",
        verbose_name=_("Disaggregation Value")
    )

    comments = models.TextField(_("Comments"), blank=True, default='')

    indicator = models.ForeignKey(
        Indicator, help_text=" ", verbose_name=_("Indicator"),
        db_index=True
    )

    agreement = models.ForeignKey(
        ProjectAgreement, blank=True, null=True, on_delete=models.SET_NULL, related_name="q_agreement2",
        verbose_name=_("Project Initiation"), help_text=" ")

    complete = models.ForeignKey(
        ProjectComplete, blank=True, null=True, related_name="q_complete2",
        on_delete=models.SET_NULL, help_text=" ",
        verbose_name=_("Project Complete")
    )

    program = models.ForeignKey(
        Program, blank=True, null=True, related_name="i_program",
        help_text=" ", verbose_name=_("Program"))

    date_collected = models.DateField(
        null=True, blank=True, help_text=" ", verbose_name=_("Date collected"))

    # Deprecated - see evidence_name/evidence_url
    evidence = models.ForeignKey(
        Documentation, null=True, blank=True, on_delete=models.SET_NULL,
        verbose_name=_("Evidence Document or Link"), help_text=" ")

    approved_by = models.ForeignKey(
        TolaUser, blank=True, null=True, on_delete=models.SET_NULL, verbose_name=_("Originated By"),
        related_name="approving_data", help_text=" ")

    # Deprecated
    tola_table = models.ForeignKey(
        TolaTable, blank=True, null=True, on_delete=models.SET_NULL, verbose_name=_("TolaTable"), help_text=" ")

    # Deprecated
    update_count_tola_table = models.BooleanField(
        verbose_name=_("Would you like to update the achieved total with the \
        row count from TolaTables?"), default=False, help_text=" ")

    record_name = models.CharField(max_length=135, blank=True, verbose_name=_("Record name"))
    evidence_url = models.CharField(max_length=255, blank=True, verbose_name=_("Evidence URL"))

    create_date = models.DateTimeField(null=True, blank=True, help_text=" ", verbose_name=_("Create date"))
    edit_date = models.DateTimeField(null=True, blank=True, help_text=" ", verbose_name=_("Edit date"))
    site = models.ManyToManyField(SiteProfile, blank=True, help_text=" ", verbose_name=_("Site"))

    history = HistoricalRecords()
    objects = ResultManager()

    class Meta:
        ordering = ('indicator', 'date_collected')
        verbose_name_plural = "Indicator Output/Outcome Result"

    def __unicode__(self):
        return u'{}: {}'.format(self.indicator, self.periodic_target)

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Result, self).save()

    def achieved_sum(self):
        achieved = Result.targeted.filter(indicator__id=self)\
            .sum('achieved')
        return achieved

    @property
    def date_collected_formatted(self):
        # apparently unused?
        if self.date_collected:
            return formats.date_format(self.date_collected, "MEDIUM_DATE_FORMAT")
        return self.date_collected

    @property
    def disaggregations(self):
        disaggs = self.disaggregation_value.all()
        return ', '.join([y.disaggregation_label.label + ': ' + y.value for y in disaggs])

    @property
    def logged_fields(self):
        return {
            "id": self.id,
            "value": self.achieved,
            "date": self.date_collected,
            "target": self.periodic_target.period_name if self.periodic_target else 'N/A',
            "evidence_name": self.record_name,
            "evidence_url": self.evidence_url,
            "sites": ', '.join(site.name for site in self.site.all()) if self.site.exists() else '',
            "disaggregation_values": {
                dv.disaggregation_label.id: {
                    "id": dv.disaggregation_label.id,
                    "value": dv.value,
                    "name": dv.disaggregation_label.label,
                }
                for dv in self.disaggregation_value.all()
            }
        }



class ResultAdmin(admin.ModelAdmin):
    list_display = ('indicator', 'date_collected', 'create_date', 'edit_date')
    list_filter = ['indicator__program__country__country']
    display = 'Indicator Output/Outcome Result'


class PinnedReport(models.Model):
    """
    A named IPTT report for a given program and user
    """
    name = models.CharField(max_length=50, verbose_name=_('Report Name'))
    tola_user = models.ForeignKey(TolaUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='pinned_reports')
    report_type = models.CharField(max_length=32)
    query_string = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creation_date']

    def parse_query_string(self):
        return QueryDict(self.query_string)

    @property
    def report_url(self):
        """
        Return the fully parameterized IPTT report URL string
        """
        return "{}?{}".format(reverse('iptt_report', kwargs={
            'program': self.program_id,
            'reporttype': self.report_type
        }), self.query_string)

    @property
    def date_range_str(self):
        """
        A localized string showing the date range covered by the pinned report

        There are several types of pinned reports w/ regards to date ranges and report type:

          * A report with a fixed start/end date
            * Recent progress
            * Annual vs targets
          * A relative report (show previous N months/quarters/year relative to today)
            * Recent progress
            * Annual vs targets
          * Show all with a time period selected (annual/monthly)
            * Recent progress
            * Annual vs targets
          * Show all with LoP/Midline+Endline/Event
            * Annual vs targets

        Currently the query string is used to determine the date range type, and thus the returned string
        """
        qs = self.parse_query_string()

        start_period = qs.get('start_period')
        end_period = qs.get('end_period')

        time_frame = qs.get('timeframe')  # show all/most recent
        num_recent_periods = qs.get('numrecentperiods')  # "most recent" input
        time_periods = qs.get('timeperiods')  # quarters/months/years/etc (recent progress)
        target_periods = qs.get('targetperiods')  # LoP/Midline+Endline/Annual/Quarterly/etc (target vs actuals)

        df = lambda d: formats.date_format(dateparser.parse(d), 'MEDIUM_DATE_FORMAT')

        # Fixed start/end date
        if start_period and end_period:
            return u'{} – {}'.format(df(start_period), df(end_period))

        from indicators.forms import ReportFormCommon

        # This is confusing but ReportFormCommon defines TIMEPERIODS_CHOICES
        # which is defined in terms of enum values in Indicators
        # Indicators also defines TARGET_FREQUENCIES which is also used by ReportFormCommon
        # Because of this, the enum values are interchangeable between ReportFormCommon and Indicators

        # TIMEPERIODS_CHOICES = (
        #     (YEARS, _("years")),
        #     (SEMIANNUAL, _("semi-annual periods")),
        #     (TRIANNUAL, _("tri-annual periods")),
        #     (QUARTERS, _("quarters")),
        #     (MONTHS, _("months"))
        # )

        # TARGETPERIOD_CHOICES = [empty] +
        # TARGET_FREQUENCIES = (
        #     (LOP, _('Life of Program (LoP) only')),
        #     (MID_END, _('Midline and endline')),
        #     (ANNUAL, _('Annual')),
        #     (SEMI_ANNUAL, _('Semi-annual')),
        #     (TRI_ANNUAL, _('Tri-annual')),
        #     (QUARTERLY, _('Quarterly')),
        #     (MONTHLY, _('Monthly')),
        #     (EVENT, _('Event'))
        # )

        # time period strings are used for BOTH timeperiod and targetperiod values
        time_period_str_lookup = dict(ReportFormCommon.TIMEPERIODS_CHOICES)

        time_or_target_period_str = None
        if time_periods:
            time_or_target_period_str = time_period_str_lookup.get(int(time_periods))
        if target_periods:
            time_or_target_period_str = time_period_str_lookup.get(int(target_periods))

        # A relative report (Recent progress || Target vs Actuals)
        if time_frame == str(ReportFormCommon.MOST_RECENT) and num_recent_periods and time_or_target_period_str:
            #  Translators: Example: Most recent 2 Months
            return _('Most recent {num_recent_periods} {time_or_target_period_str}').format(
                num_recent_periods=num_recent_periods, time_or_target_period_str=time_or_target_period_str)

        # Show all (Recent progress || Target vs Actuals w/ time period (such as annual))
        if time_frame == str(ReportFormCommon.SHOW_ALL) and time_or_target_period_str:
            # Translators: Example: Show all Years
            return _('Show all {time_or_target_period_str}').format(time_or_target_period_str=time_or_target_period_str)

        # Show all (Target vs Actuals LoP/Midline+End/Event)
        remaining_target_freq_set = {
            Indicator.LOP,
            Indicator.MID_END,
            Indicator.EVENT,
        }
        if time_frame == str(ReportFormCommon.SHOW_ALL) and target_periods \
                and int(target_periods) in remaining_target_freq_set:
            return _('Show all results')

        # It's possible to submit bad input, but have the view "fix" it..
        if time_frame == str(ReportFormCommon.MOST_RECENT) and num_recent_periods and not time_or_target_period_str:
            return _('Show all results')

        return ''


    @staticmethod
    def default_report(program_id):
        """
        Create a default hardcoded pinned report

        Shows recent progress for all indicators
        Does not exist in the DB
        """
        return PinnedReport(
            name=_('Recent progress for all indicators'),
            program_id=program_id,
            report_type='timeperiods',
            query_string='timeperiods=7&timeframe=2&numrecentperiods=2',
        )
