# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-07-11 00:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0064_auto_20190624_1558'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicator',
            name='name',
            field=models.CharField(help_text=b' ', max_length=500, verbose_name='Name'),
        ),
    ]