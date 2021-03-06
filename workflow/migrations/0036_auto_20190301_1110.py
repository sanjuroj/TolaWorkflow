# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-03-01 19:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0035_auto_20190301_1020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='program',
            name='user_access',
            field=models.ManyToManyField(blank=True, related_name='programs', through='workflow.ProgramAccess', to='workflow.TolaUser'),
        ),
    ]
