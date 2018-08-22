from tola.test.utils import PeriodicTargetValues, IndicatorValues

indicator_scenarios = {}

indicator_values = []
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
indicator_scenarios['scenario_2i_5pt_default'] = indicator_values

pts = [PeriodicTargetValues(target=100, collected_data=(50, 25, 15))]
pts.append(PeriodicTargetValues(target=100, collected_data=(0, 25, 50)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
pts.append(PeriodicTargetValues(target=100, collected_data=(50, 25, 15)))
indicator_scenarios['scenario_1i_5pt_default'] = [IndicatorValues(periodic_targets=pts)]
