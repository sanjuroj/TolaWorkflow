# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.core.serializers.json import DjangoJSONEncoder
from django.core import serializers
from django.db import models
from django.utils.translation import ugettext_lazy as _

from workflow.models import (
    TolaUser,
    Organization,
    Program,
)

from indicators.models import (
    Indicator
)

# Create your models here.

class UserManagementAuditLog(models.Model):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    admin_user = models.ForeignKey(TolaUser, related_name="+")
    modified_user = models.ForeignKey(TolaUser, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()


class IndicatorAuditLog(models.Model):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    user = models.ForeignKey(TolaUser, related_name="+")
    organization = models.ForeignKey(Organization, related_name="+")
    indicator = models.ForeignKey(Indicator, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()
    rationale = models.TextField()

    @staticmethod
    def log_indicator_created(user, created_indicator, rationale):
        new_indicator_log_entry = IndicatorAuditLog(
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=created_indicator,
            change_type="indicator_created",
            rationale=rationale,
            previous_entry=None,
            new_entry=serializers.serialize("json", created_indicator.logged_fields)
        )
        new_indicator_log_entry.save()

    @staticmethod
    def log_indicator_deleted(user, deleted_indicator_values, rationale):
        new_indicator_log_entry = IndicatorAuditLog(
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=deleted_indicator,
            change_type="indicator_deleted",
            rationale=rationale,
            previous_entry=serializers.serialize("json", deleted_indicator_values),
            new_entry=None
        )
        new_indicator_log_entry.save()

    @staticmethod
    def log_indicator_updated(user, indicator, old_indicator_values, new_indicator_values, rationale):
        previous_entry_json = json.dumps(old_indicator_values, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_indicator_values, cls=DjangoJSONEncoder)
        if new_entry_json != previous_entry_json:
            new_indicator_log_entry = IndicatorAuditLog(
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=indicator,
                change_type="indicator_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_indicator_log_entry.save()

    @staticmethod
    def log_result_created(user, indicator, created_result, rationale):
        pass

    @staticmethod
    def log_result_deleted(user, indicator, deleted_result, rationale):
        pass

    @staticmethod
    def log_result_updated(user, indicator, old_result, new_result, rationale):
        pass

    @staticmethod
    def log_program_dates_updated(user, indicator, old_dates, new_dates, rationale):
        pass


class ProgramAdminAuditLog(models.Model):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    admin_user = models.ForeignKey(TolaUser, related_name="+")
    program = models.ForeignKey(Program, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()

    logged_fields = (
        'gaitid',
        'name',
        'funding_status',
        'cost_center',
        'description',
        'sector',
        'country',
    )

    @classmethod
    def created(cls, program, created_by, entry):
        new_entry = json.dumps(entry)
        entry = cls(
            admin_user=created_by,
            program=program,
            change_type="program_created",
            new_entry=new_entry,
        )
        entry.save()

    @classmethod
    def updated(cls, program, changed_by, old, new):
        old = json.dumps(old)
        new = json.dumps(new)
        entry = cls(
            admin_user=changed_by,
            program=program,
            change_type="program_updated",
            previous_entry=old,
            new_entry=new,
        )
        entry.save()