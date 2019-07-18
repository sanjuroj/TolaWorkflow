import { observable, action, computed, reaction } from 'mobx';
import { TVA, TIMEPERIODS, GROUP_BY_CHAIN, GROUP_BY_LEVEL, BLANK_OPTION, TIME_AWARE_FREQUENCIES } from '../../../constants';

const _gettext = (typeof gettext !== 'undefined') ?  gettext : (s) => s;


export default class ReportStore {
    constructor(filterStore) {
        this.filterStore = filterStore;
    }
    
    @computed get isTVA() {
        return this.filterStore.reportType === TVA;
    }
    
    @computed get programName() {
        if (this.filterStore.program) {
            return this.filterStore.program.name;
        }
        return null;
    }
    
    @computed get levelColumn() {
        return this.filterStore.oldLevels === true;
    }
    
    @computed get levelRows() {
        return this.filterStore.oldLevels === false;
    }
    
    @computed get reportPeriods() {
        if (this.filterStore.periods) {
            if (this.filterStore.frequencyId == 2) {
                return this.filterStore.periods.periods;
            }
            return this.filterStore.periods.periodRange(this.filterStore.startPeriod, this.filterStore.endPeriod) || [];
        }
        return [];
    }
    
    @computed get indicatorRows() {
        if (this.levelRows) {
            return [];
        }
        if (this.filterStore.frequencyId && this.filterStore.programIsLoaded) {
            return this.filterStore.filteredIndicators || [];
        }
        return [];
    }
    
    @computed get groupedIndicatorRows() {
        if (!this.levelRows) {
            return [];
        }
        if (this.filterStore.frequencyId && this.filterStore.programIsLoaded) {
            return this.filterStore.filteredLevels.map(
                level => ({
                    level: level,
                    indicators: this.filterStore.filterIndicators(level.indicators)
                })).concat([{
                    level: null,
                    indicators: this.filterStore.filteredIndicators.filter(indicator => !indicator.levelpk)
                }]);
        }
        return [];
    }
    
    periodValues(indicator) {
        if (this.filterStore.frequencyId == 1) {
            return [];
        }
        if (this.filterStore.frequencyId && this.filterStore.programIsLoaded) {
            let reportData = indicator.reportData[this.filterStore.reportType][this.filterStore.frequencyId];
            if (reportData && reportData !== undefined) {
                return this.filterStore.frequencyId == 2 ? reportData :
                    reportData.slice(this.filterStore.startPeriod, this.filterStore.endPeriod + 1) || [];
            } else {
                let reportData = indicator.program.getIndicator(indicator.pk)
                                    .reportData[this.filterStore.reportType][this.filterStore.frequencyId];
                if (reportData && reportData !== undefined) {
                    return this.filterstore.frequencyId == 2 ? reportData :
                        reportData.slice(this.filterStore.startPeriod, this.filterStore.endPeriod + 1);
                }
            }
        }
        return [];
    }
    
    @computed get reportWidth() {
        return 8 + (this.levelColumn && 1) + 3 + (this.reportPeriods.length * (1 + (this.filterStore.isTVA && 2)));
    }
    
};