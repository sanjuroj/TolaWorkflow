# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-06-26 23:16
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0064_auto_20190624_1558'),
        ('tola_management', '0007_auto_20190308_1508'),
    ]

    operations = [
        migrations.AddField(
            model_name='programauditlog',
            name='level',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_query_name='+', to='indicators.Level'),
        ),
    ]