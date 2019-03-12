/**
 * Data models for the IPTT report reqct page
 * @module iptt_report/models
 */

import {observable, action, reaction, when, computed} from "mobx";

/**
 * models list:
 * ReportStore (observable - all data for report)
 * ProgramStore (observable - all program options)
 */

const BLANK_LABEL = '---------';
const TVA = 1;
const TIMEPERIODS = 2;

export class ReportStore {
    reports = {};
    addReport(reportData) {
        this.reports[reportData.programId] = reportData;
    }
    
    getIndicators(programId) {
        return this.reports[programId].indicators;
    }
}

class Program {
    constructor(programJSON) {
        this.id = programJSON.id;
        this.name = programJSON.name;
        this.frequencies = programJSON.frequencies;
        this.periodDateRanges = programJSON.periodDateRanges;
    }
    
    periods(frequency) {
        return frequency in this.periodDateRanges ? this.periodDateRanges[frequency] : false;
    }
    
    periodCount(frequency) {
        return this.periods(frequency) ? this.periods(frequency).length : 0;
    }
    
    currentPeriod(frequency) {
        let periods = this.periods(frequency);
        if (!periods) {
            return null;
        } else if (frequency == 7) {
            return periods.filter((period) => !period[4]).length - 1;
        } else {
            return periods.filter((period) => !period[2]).length - 1;
        }
    }

}

class ProgramStore  {
    constructor(programsJSON) {
        this.programs = {};
        programsJSON.forEach(programJSON => {this.programs[programJSON.id] = new Program(programJSON);});
    }
    
    getProgram(id) {
        return this.programs[id];
    }
    

}

export class RootStore {
    @observable selectedProgram = null;
    @observable selectedFrequencyId = null;
    @observable startPeriod = '';
    @observable endPeriod = '';
    reportType = null;
    router = null;
    currentPeriod = null;
    
    constructor(contextData) {
        this.programStore = new ProgramStore(contextData.programs);
        this._periodLabels = {
            [TIMEPERIODS]: contextData.labels.timeperiods,
            [TVA]: contextData.labels.targetperiods,
            names: contextData.labels.periodNames
        };
    }
    
    init = (router) => {
        this.router = router;
        let params = router.getState().params;
        let reload = false;
        this.setProgramId(params.programId);
        this.setReportType(params.reportType);
        if (params.timeperiods || params.targetperiods) {
            params.frequency = params.timeperiods || params.targetperiods;
            delete params['timeperiods'];
            delete params['targetperiods'];
            reload = true;
        }
        this.setFrequencyId(params.frequency);
        if (params.timeframe == 1) {
            params.start = 0;
            params.end = this.selectedProgram.periodDateRanges[params.frequency].length - 1;
            delete params['timeframe'];
            reload = true;
        } else if (params.timeframe == 2) {
            let numrecent = params.numrecenteperiods || 2;
            params.end = this.selectedProgram.periodDateRanges[params.frequency].length - 1;
            params.start = params.end - numrecent;
            delete params['timeframe'];
            delete params['numrecentperiods'];
            reload = true;
        } else if (!(params.start && params.end)) {
            params.start = 0;
            params.end = this.selectedProgram.periodDateRanges[params.frequency].length - 1;
            delete params['timeframe'];
            delete params['numrecentperiods'];
            delete params['start_period'];
            delete params['end_period'];
            reload = true;
        }
        this.setStartPeriod(params.start);
        this.setEndPeriod(params.end);
        if (reload) {
            router.navigate(router.getState().name, params, {reload: true});
        }
    }
    
    updateUrl = (param, newValue) => {
        let oldParams = this.router.getState().params;
        if (!oldParams[param] || oldParams[param] != newValue) {
            let newParams = { ...oldParams, [param]: newValue };
            this.router.navigate(this.router.getState().name, newParams, {replace: true});
        }
    }
    
    updateRoute = ({ previousRoute, route }) => {
        console.log("updating route from", previousRoute, "  to ", route);
    }
    
    // REPORT TYPE:
    
    setReportType(reportType) {
        if (reportType == 'timeperiods') {
            this.reportType = TIMEPERIODS;
        } else {
            this.reportType = TVA;
        }
    }
    
    get isTVA() {
        return (this.reportType === TVA);
    }
    
    //SELECTING PROGRAMS:

    setProgramId(id) {
        if (id === null) {
            this.selectedProgram = null;
        } else if (this.selectedProgram == null || this.selectedProgram.id != id) {
            console.log("updating program ID to", id);
            this.selectedProgram = this.programStore.getProgram(id);
            if (this.isTVA && this.selectedFrequencyId
                && this.selectedProgram.frequencies.indexOf(this.selectedFrequencyId) == -1) {
                this.setFrequencyId(null);
            }
        }
    }
    
    @computed get selectedProgramOption() {
        if (this.selectedProgram === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {value: this.selectedProgram.id, label: this.selectedProgram.name};
    }
    
    get programOptions() {
        // all available options for Programs dropdown:
        return Object.entries(this.programStore.programs).map(
            ([id, program]) => ({value: id, label: program.name})
        );
    }
    
    //SELECTING FREQUENCY:
    
    setFrequencyId(id) {
        if (id === null) {
            this.selectedFrequencyId = null;
        } else if (this.selectedFrequencyId != id) {
            this.selectedFrequencyId = id;
            this.updateUrl('frequency', id);
            //refresh periods to make sure they're in range:
            this.setStartPeriod(this.startPeriod);
            this.setEndPeriod(this.endPeriod);
            this.updateCurrentPeriod();
        }
    }
    
    updateCurrentPeriod() {
        this.currentPeriod = this.selectedProgram.currentPeriod(this.selectedFrequencyId);
    }
    
    @computed get selectedFrequencyOption() {
        if (this.selectedProgram === null || this.selectedFrequencyId === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {
            value: this.selectedFrequencyId,
            label: this._periodLabels[this.reportType][this.selectedFrequencyId]
            };
    }
    
    @computed get frequencyOptions() {
        if (this.selectedProgram === null) {
            return [{value: null, label: BLANK_LABEL},];
        }
        else if (this.reportType == TIMEPERIODS) {
            return Object.entries(this._periodLabels[TIMEPERIODS]).map(
              ([id, label]) => ({value: id, label: label})
            );
        } else {
            return this.selectedProgram.frequencies.map(
                (id) => ({value: id, label: this._periodLabels[TVA][id]})
            );
        }
    }
    
    //PERIODS:
    
    setStartPeriod(period) {
        //use '' for null values as React does badly with null value for select
        if (this.selectedFrequencyId && this.selectedProgram) {
            period = period !== null
                     ? period < this.selectedProgram.periodCount(this.selectedFrequencyId)
                        ? period
                        : 0
                    : '';
            this.startPeriod = period;
            this.updateUrl('start', this.startPeriod);
        }
    }
    
    setEndPeriod(period) {
        if (this.selectedFrequencyId && this.selectedProgram) {
            period = period !== null
                     ? period < this.selectedProgram.periodCount(this.selectedFrequencyId)
                        ? period
                        : this.selectedProgram.periodCount(this.selectedFrequencyId) - 1
                    : '';
            this.endPeriod = period;
            this.updateUrl('end', this.endPeriod);
        }
    }
    
    @computed get startPeriodLabel() {
        if (this.selectedProgram && this.selectedFrequencyId
            && this.startPeriod !== null && this.startPeriod !== ''
            && this.startPeriod <= this.selectedProgram.periodCount(this.selectedFrequencyId)) {
            return this.selectedProgram.periods(this.selectedFrequencyId)[this.startPeriod][0];
        }
        return '';
    }
    
    @computed get endPeriodLabel() {
        if (this.selectedProgram && this.selectedFrequencyId
            &&this.endPeriod !== null && this.endPeriod !== ''
            && this.endPeriod < this.selectedProgram.periodCount(this.selectedFrequencyId)) {
            return this.selectedProgram.periods(this.selectedFrequencyId)[this.endPeriod][1];
        }
        return '';
    }
    
    @computed get selectedPeriods() {
        if (!this.selectedProgram || !this.selectedFrequencyId || this.selectedFrequencyId === 1
            || this.startPeriod === null || this.endPeriod === null) {
            return [];
        }
        return this.selectedProgram.periods(this.selectedFrequencyId).slice(this.startPeriod, parseInt(this.endPeriod) + 1);
    }
    
    @computed get periodOptions() {
        if (this.selectedProgram === null || this.selectedFrequencyId === null) {
            return [{value: null, label: BLANK_LABEL}];
        } else if (this.selectedFrequencyId == 7) {
            let years = {};
            this.selectedProgram.periodDateRanges[7].forEach(
                ( period, index ) => {
                    let label = this.getPeriodLabel(period, index);
                    let year = period[3];
                    if (!(year in years)) {
                        years[year] = [];
                    }
                    years[year].push({value: index, label: label.title});
                }
            );
            return years;
        }
        return this.selectedProgram.periods(this.selectedFrequencyId).map(
            (labels, index) => {
                let label = this.getPeriodLabel(labels, index);
                return {value: index, label: label.title + ' ' + '(' + label.subtitle + ')'};
            }
        );
    }
    
    getPeriodLabel = (period, index) => {
        if (this.selectedFrequencyId == 7) {
            let [, , monthLabel, year] = period;
            return {title: monthLabel + ' ' + year, subtitle: ''};
        } else {
            let [startLabel, endLabel] = period;
            return {title: this._periodLabels.names[this.selectedFrequencyId] + " " + (index + 1),
                    subtitle: startLabel + ' - ' + endLabel};
        }
    }
    
    // SHOW ALL / MOST RECENT OPTIONS:
    
    setShowAll = () => {
        this.setStartPeriod(0);
        this.setEndPeriod(this.selectedProgram.periodCount(this.selectedFrequencyId) - 1);
    }
    
    setMostRecent = (numrecent) => {
        numrecent = numrecent || 2;
        let startPeriod = Math.max(this.currentPeriod - numrecent + 1, 0);
        this.setEndPeriod(this.currentPeriod);
        this.setStartPeriod(startPeriod);
    }
    
    @computed get timeframeEnabled() {
        //showAll and Most Recent don't make sense for non time-aware frequencies:
        return (this.selectedProgram && ['3', '4', '5', '6', '7'].indexOf(this.selectedFrequencyId) != -1);
    }
    
    @computed get showAll() {
        return (this.timeframeEnabled && this.startPeriod == 0
                && this.endPeriod == this.selectedProgram.periodCount(this.selectedFrequencyId) - 1);
    }
    
    @computed get mostRecent() {
        if (this.timeframeEnabled && !this.showAll && this.currentPeriod !== null
            && this.endPeriod == this.currentPeriod) {
            return this.endPeriod - this.startPeriod + 1;
        }
        return null;
    }
    
}