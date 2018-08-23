from tola.test.utils import PeriodicTargetValues, IndicatorValues

indicator_scenarios = {}
indicator_values = []

"""
Scenario names follow the general pattern of:
<indicator count>i-<indicator config>_<periodic target count>pt_<collected data count>cd


"""


# Create 2 indicators with default indicator settings.  Create 4 periodic targets per indicator.
pts = [PeriodicTargetValues(target=100, collected_data=(50, 25, 15))]
pts.append(PeriodicTargetValues(target=100, collected_data=(0, 25, 50)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
indicator_values.append(IndicatorValues(periodic_targets=pts))
pts = [PeriodicTargetValues(target=200, collected_data=(10, 100, 15))]
pts.append(PeriodicTargetValues(target=200, collected_data=(0, 50, 150)))
pts.append(PeriodicTargetValues(target=200, collected_data=(60, 35, 15)))
pts.append(PeriodicTargetValues(target=200, collected_data=(60, 35, 15)))
indicator_values.append(IndicatorValues(periodic_targets=pts))
indicator_scenarios['scenario_2i-default_4pt_3cd'] = indicator_values

# Create 1 indicator with default indicator settings.  Create 5 periodic targets.
pts = [PeriodicTargetValues(target=100, collected_data=(50, 25, 15))]
pts.append(PeriodicTargetValues(target=100, collected_data=(0, 25, 50)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
indicator_scenarios['scenario_1i-default_5pt_3cd'] = [IndicatorValues(periodic_targets=pts)]

# Create 1 indicator with default indicator settings.  Create 5 periodic targets.
pts = [PeriodicTargetValues(target=100, collected_data=(50, 25, 15))]
pts.append(PeriodicTargetValues(target=100, collected_data=(0, 25, 50)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
indicator_scenarios['scenario_1i-cumulative_5pt_3cd'] = [
    IndicatorValues(periodic_targets=pts, is_cumulative=True)]
