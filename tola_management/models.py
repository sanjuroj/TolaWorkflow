# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.utils.translation import ugettext_lazy as _

from workflow.models import (
    TolaUser,
    Organization,
    Program
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


class ProgramAuditLog(models.Model):
    program = models.ForeignKey(Program, related_name="audit_logs")
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    user = models.ForeignKey(TolaUser, related_name="+")
    organization = models.ForeignKey(Organization, related_name="+")
    indicator = models.ForeignKey(Indicator, related_name="+", null=True)
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField(null=True, blank=True)
    new_entry = models.TextField(null=True, blank=True)
    rationale = models.TextField()

    @staticmethod
    def log_indicator_created(user, created_indicator, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=created_indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=created_indicator,
            change_type="indicator_created",
            rationale=rationale,
            previous_entry=None,
            new_entry=json.dumps(created_indicator.logged_fields, cls=DjangoJSONEncoder),
        )
        new_program_log_entry.save()

    @staticmethod
    def log_indicator_deleted(user, deleted_indicator, deleted_indicator_values, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=deleted_indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=deleted_indicator,
            change_type="indicator_deleted",
            rationale=rationale,
            previous_entry=json.dumps(deleted_indicator_values, cls=DjangoJSONEncoder),
            new_entry=None
        )
        new_program_log_entry.save()

    @staticmethod
    def log_indicator_updated(user, indicator, old_indicator_values, new_indicator_values, rationale):
        previous_entry_json = json.dumps(old_indicator_values, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_indicator_values, cls=DjangoJSONEncoder)
        if new_entry_json != previous_entry_json:
            new_program_log_entry = ProgramAuditLog(
                program=indicator.program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=indicator,
                change_type="indicator_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()

    @staticmethod
    def log_result_created(user, indicator, created_result, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=indicator,
            change_type="result_created",
            rationale="N/A",
            previous_entry=None,
            new_entry=json.dumps(created_result.logged_fields, cls=DjangoJSONEncoder)
        )
        new_program_log_entry.save()

    @staticmethod
    def log_result_deleted(user, indicator, deleted_result_values, rationale):
        new_program_log_entry = ProgramAuditLog(
            program=indicator.program,
            user=user.tola_user,
            organization=user.tola_user.organization,
            indicator=indicator,
            change_type="result_deleted",
            rationale=rationale,
            previous_entry=json.dumps(deleted_indicator_values, cls=DjangoJSONEncoder),
            new_entry=None,
        )
        new_program_log_entry.save()

    @staticmethod
    def log_result_updated(user, indicator, old_result_values, new_result_vlaues, rationale):
        previous_entry_json = json.dumps(old_indicator_values, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_indicator_values, cls=DjangoJSONEncoder)
        if previous_entry_json != new_entry_json:
            new_program_log_entry = ProgramAuditLog(
                program=indicator.program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=indicator,
                change_type="result_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()

    @staticmethod
    def log_program_dates_updated(user, program, old_dates, new_dates, rationale):
        previous_entry_json = json.dumps(old_dates, cls=DjangoJSONEncoder)
        new_entry_json = json.dumps(new_dates, cls=DjangoJSONEncoder)
        if previous_entry_json != new_entry_json:
            new_program_log_entry = ProgramAuditLog(
                program=indicator.program,
                user=user.tola_user,
                organization=user.tola_user.organization,
                indicator=None,
                change_type="program_dates_changed",
                rationale=rationale,
                previous_entry=previous_entry_json,
                new_entry=new_entry_json
            )
            new_program_log_entry.save()
