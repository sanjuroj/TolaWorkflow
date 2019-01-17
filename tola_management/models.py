# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.utils.translation import ugettext_lazy as _

from workflow.models import (
    TolaUser
)

# Create your models here.

class UserManagementAuditLog(models.Model):
    date = models.DateTimeField(_('Modification Date'), auto_now_add=True)
    admin_user = models.ForeignKey(TolaUser, related_name="+")
    modified_user = models.ForeignKey(TolaUser, related_name="+")
    change_type = models.CharField(_('Modification Type'), max_length=255)
    previous_entry = models.TextField()
    new_entry = models.TextField()
