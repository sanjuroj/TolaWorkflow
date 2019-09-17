# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2019-07-30 17:06
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0050_using_results_framework_three_options'),
        ('indicators', '0065_longer_indicator_names'),
    ]

    operations = [
        migrations.CreateModel(
            name='LevelTierTemplate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=135, verbose_name='Template name')),
                ('tier_depth', models.IntegerField(verbose_name='Level tier depth')),
                ('create_date', models.DateTimeField(blank=True, null=True, verbose_name='Create date')),
                ('edit_date', models.DateTimeField(blank=True, null=True, verbose_name='Edit date')),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='level_tier_templates', to='workflow.Program')),
            ],
            options={
                'ordering': ('tier_depth',),
                'verbose_name': 'Level tier template',
            },
        ),
        migrations.AlterUniqueTogether(
            name='leveltiertemplate',
            unique_together=set([('program', 'tier_depth'), ('name', 'program')]),
        ),
    ]