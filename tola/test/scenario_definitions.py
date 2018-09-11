from tola.test.utils import PeriodicTargetValues, IndicatorValues, Scenario

from indicators.models import Indicator

indicator_scenarios = {}
indicator_values = []

"""
DON'T CHANGE THESE SCENARIOS UNLESS YOU'RE SURE YOU KNOW WHAT YOU'RE DOING!!!!
These are meant to be common scenarios that can be used in many different tests.  If you change a scenario, 
the change will ripple through all tests that use this scenario, potentially invalidating the tests that are based
on it and creating a rift in space-time. If your test requires a very specific setup, you might be better off 
defining it in your test.

Scenario names follow the general pattern of:
<indicator count>i-<indicator config>_<periodic target count>pt_<collected data count>cd_<evidence count>ev

If you want to associate evidence with a collected data record, you should use the evidence keyword
to pass in an indexable (i.e. list or tuple) of the same size as the one you are using for collected_data.  
This array should contain booleans representing whether a collected data record has documentary evidence or not.
"""

# Create 2 indicators with default indicator settings.  Create 4 periodic targets per indicator.
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50)),
    PeriodicTargetValues(target=120, collected_data=(50, 25, 15)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 15)), ]
indicator_values.append(IndicatorValues(periodic_targets=pts))
pts = [
    PeriodicTargetValues(target=210, collected_data=(10, 100, 15)),
    PeriodicTargetValues(target=220, collected_data=(0, 50, 150)),
    PeriodicTargetValues(target=230, collected_data=(60, 35, 15)),
    PeriodicTargetValues(target=240, collected_data=(60, 35, 15)), ]
indicator_values.append(IndicatorValues(periodic_targets=pts))
indicator_scenarios['scenario_2i-default_4pt_3cd'] = Scenario(indicators=indicator_values)

# Create 1 indicator with default indicator settings.  Create 5 periodic targets.
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50)),
    PeriodicTargetValues(target=120, collected_data=(50, 25, 16)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 17)),
    PeriodicTargetValues(target=140, collected_data=(50, 25, 18)), ]
indicator_scenarios['scenario_1i-default_5pt_3cd'] = Scenario(indicators=[IndicatorValues(
    lop_target=20,
    periodic_targets=pts)])

# Create 1 indicator with default indicator settings.  Create 5 periodic targets.
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50)),
    PeriodicTargetValues(target=120.5, collected_data=(50, 25, 16)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 17.93)),
    PeriodicTargetValues(target=140, collected_data=(50.29, 25, 18)), ]
indicator_scenarios['scenario_1i-cumulative_number_5pt_3cd'] = Scenario(indicators=[IndicatorValues(
    lop_target=30,
    periodic_targets=pts,
    is_cumulative=True)])

# Create 1 indicator with default indicator settings.  Create 5 periodic targets.
pts = [
    PeriodicTargetValues(target=.50, collected_data=(.20, .25)),
    PeriodicTargetValues(target=.60, collected_data=(0, .10, .40)),
    PeriodicTargetValues(target=.70, collected_data=(.50, .10, 0)),
    PeriodicTargetValues(target=.80, collected_data=(.40, .20, .20)),
    PeriodicTargetValues(target=.90, collected_data=(.50, .20, .10)), ]
indicator_scenarios['scenario_1i-cumulative_percent_5pt_3cd'] = Scenario(indicators=[IndicatorValues(
    unit_of_measure_type=Indicator.PERCENTAGE,
    lop_target=.80,
    periodic_targets=pts,
    is_cumulative=True)])

# Create 4 indicators with default indicator settings. Each indicator has a a different level of achieved vs target
indicators_values = []
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15), evidence=(True, False, True)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50), evidence=(True, True, True)),
    PeriodicTargetValues(target=120, collected_data=(50, 25, 16), evidence=(False, False, True)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 17), evidence=(False, False, False)),
    PeriodicTargetValues(target=140, collected_data=(50, 25, 18), evidence=(False, False, True)), ]
indicators_values.append(IndicatorValues(lop_target=20, periodic_targets=pts))
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15), evidence=(True, False, True)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50), evidence=(True, True, True)),
    PeriodicTargetValues(target=120, collected_data=(50, 25, 16), evidence=(False, False, True)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 17), evidence=(False, False, False)),
    PeriodicTargetValues(target=140, collected_data=(50, 25, 18), evidence=(False, False, True)), ]
indicators_values.append(IndicatorValues(lop_target=20, periodic_targets=pts))
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15), evidence=(True, False, True)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50), evidence=(True, True, True)),
    PeriodicTargetValues(target=120, collected_data=(50, 25, 16), evidence=(False, False, True)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 17), evidence=(False, False, False)),
    PeriodicTargetValues(target=140, collected_data=(50, 25, 18), evidence=(False, False, True)), ]
indicators_values.append(IndicatorValues(lop_target=20, periodic_targets=pts))
pts = [
    PeriodicTargetValues(target=100, collected_data=(50, 25, 15), evidence=(True, False, True)),
    PeriodicTargetValues(target=110, collected_data=(0, 25, 50), evidence=(True, True, True)),
    PeriodicTargetValues(target=120, collected_data=(50, 25, 16), evidence=(False, False, True)),
    PeriodicTargetValues(target=130, collected_data=(50, 25, 17), evidence=(False, False, False)),
    PeriodicTargetValues(target=140, collected_data=(50, 25, 18), evidence=(False, False, True)), ]
indicators_values.append(IndicatorValues(lop_target=20, periodic_targets=pts))
indicator_scenarios['scenario_1i-default_5pt_3cd_7ev'] = Scenario(indicators=indicators_values)
