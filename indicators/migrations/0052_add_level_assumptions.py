# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2019-03-27 22:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0051_update_level_models'),
    ]

    operations = [
        migrations.AddField(
            model_name='level',
            name='assumptions',
            field=models.CharField(blank=True, max_length=500, null=True, verbose_name='Assumptions'),
        ),
        migrations.AlterField(
            model_name='level',
            name='name',
            field=models.CharField(blank=True, max_length=500, verbose_name='Name'),
        ),
    ]
