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
    rootStore = null;
    constructor(contextData) {
        //this.isTVA = (contextData.report.reportType == 'timeperiods') ? false : true;
    }
    
    @computed get reportDates() {
        return 'Feb 1, 2019 - Mar 31, 2019';
    }
}

class Program {
    constructor(programJSON) {
        this.id = programJSON.id;
        this.name = programJSON.name;
        this.frequencies = programJSON.frequencies;
        this.periodDateRanges = programJSON.periodDateRanges;
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

export class FilterStore {
    @observable showAllSelected = null;
    @observable mostRecentValue = null;
    @observable rootStore;
    programStore = null;
    _periodLabels = null;

    constructor(contextData, rootStore) {
        this.programStore = new ProgramStore(contextData.programs);
        this.rootStore = rootStore;
        
    }
    
    
    
    @computed get selectedProgram() {
        if (this.rootStore && this.rootStore.programId !== null) {
            return this.programStore.programs[this.rootStore.programId];
        }
        return null;
    }
    
    @computed get selectedProgramOption() {
        if (this.selectedProgram === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {value: this.selectedProgram.id, label: this.selectedProgram.name};
    }

    get periodLabels() {
        if (this.rootStore.isTVA) {
            return this._periodLabels.targetperiods;
        }
        return this._periodLabels.timeperiods;
    }
    
    
    @computed get selectedProgramDateRanges() {
        if (this.selectedProgramId === null || this.selectedFrequencyId === null) {
            return null;
        }
        return this.selectedProgram.periodDateRanges[this.selectedFrequencyId];
    }
    
    get allFrequencyOptions() {
        return Object.entries(this.periodLabels).map(
            ([id, label]) => ({value: id, label: label})
        );
    }
    
    @computed get programFrequencyOptions() {
        return this.selectedProgram.frequencies.map(
            frequency => ({value: frequency, label: this.periodLabels[frequency]})
        );
    }
    
    @computed get selectedFrequencyOption() {
        if (this.selectedFrequencyId === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {value: this.selectedFrequencyId, label: this.periodLabels[this.selectedFrequencyId]};
    }
    
    setShowAll(value) {
        if (value === true) {
            this.setMostRecent()
            this.showAllSelected = true;
        } else if (value === false) {
            this.showAllSelected = false;
        } else {
            this.showAllSelected = !(this.showAllSelected);
        }
    }
    
    setMostRecent(numRecent) {
        if (numRecent) {
            this.setShowAll(false);
            this.mostRecentValue = numRecent;
        } else {
            this.mostRecentValue = null;
        }
    }
}

export class RootStore {
    @observable selectedProgram = null;
    @observable selectedFrequencyId = null;
    @observable startPeriod = '';
    @observable startPeriodLabel = null;
    reportType = null;
    
    constructor(contextData) {
        this.programStore = new ProgramStore(contextData.programs);
        this._periodLabels = {
            [TIMEPERIODS]: contextData.labels.timeperiods,
            [TVA]: contextData.labels.targetperiods,
            names: contextData.labels.periodNames
        };
    }
    
    init = (router) => {
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
        //this.setStartPeriod
        if (reload) {
            router.navigate(router.getState().name, params, {reload: true});
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
            console.log("updating frequency ID to", id);
            this.selectedFrequencyId = id;
        }
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
        this.startPeriod = period;
        this.startPeriodLabel = this.selectedProgram.periodDateRanges[this.selectedFrequencyId][period][0];
    }
    
    @computed get startPeriodOptions() {
        if (this.selectedProgram === null || this.selectedFrequencyId === null) {
            return [{value: null, label: BLANK_LABEL}];
        } else if (this.selectedFrequencyId == 7) {
            let years = {};
            this.selectedProgram.periodDateRanges[7].forEach(
                ( [,, monthLabel, year], index ) => {
                    if (!(year in years)) {
                        years[year] = [];
                    }
                    years[year].push({value: index, label: monthLabel + " " + year});
                }
            );
            return years;
        }
        return this.selectedProgram.periodDateRanges[this.selectedFrequencyId].map(
            (labels, index) => ({value: index, label: this.getPeriodLabel(labels, index)})
        );
    }
    
    getPeriodLabel([startLabel, endLabel], index) {
        if (this._periodLabels.names[this.selectedFrequencyId]) {
            return this._periodLabels.names[this.selectedFrequencyId] + " " + (index + 1) + " (" + startLabel + " - " + endLabel + ")";
        }
    }
    
    @computed get dateRange() {
        return this.startPeriodLabel + ' - banana';
    }
    
}