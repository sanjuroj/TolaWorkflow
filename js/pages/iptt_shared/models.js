import { observable, action } from 'mobx';

export const BLANK_LABEL = '---------';
export const TVA = 1;
export const TIMEPERIODS = 2;

class IPTTUIStore {
    @observable selectedProgramId = null;
    @observable enabled = false;
    @observable selectedFrequencyId;
    @observable showAll;
    @observable mostRecent;
    @observable mostRecentCountHasFocus;
    oldMostRecent = null;
    blankOption = {
        value: null,
        label: BLANK_LABEL
        };

    constructor(jsContext, reportType, parentStore) {
        this.programs = {};
        this.programIds = [];
        this.reportType = reportType;
        this.parentStore = parentStore || null;
        this.init();
        this.labels = jsContext.labels;
        jsContext.programs.forEach((programJSON) => {
            this.programs[programJSON.id] = this.extractProgramInfo(programJSON);
            this.programIds.push(programJSON.id);
        });
    }
    
    init = () => {
        this.mostRecentCountHasFocus = false;
        if (this.reportType == TIMEPERIODS) {
            this.selectedFrequencyId = 7;
            this.showAll = false;
            this.mostRecent = 2;
        } else {
            this.selectedFrequencyId = null;
            this.showAll = true;
            this.mostRecent = false;
        }
    }

    extractProgramInfo(programJSON) {
        let programObject = {
            name: programJSON.name,
            id: programJSON.id,
            url: this.reportType == TVA ? programJSON.tva_url : programJSON.timeperiods_url
        };
        if (this.reportType == TVA) {
            programObject.frequencies = programJSON.frequencies;
        }
        return programObject;
    }
    
    getUrl = () => {
        let url = false;
        if (this.enabled && this.selectedProgramId !== null &&
            this.selectedFrequencyId !== null) {
            url = this.programs[this.selectedProgramId].url;
            url = url + '?frequency=' + this.selectedFrequencyId;
            if (this.showAll) {
                url = url + '&show_all=1';
            } else if (this.mostRecent && this.mostRecent !== false && this.mostRecent !== true) {
                url = url + '&recents=' +  this.mostRecent;
            } else {
                return false;
            }
        }
        return url;
    }

    getPrograms = () => {
        let programOptions = this.programIds.map((pid) => ({value: pid, label: this.programs[pid].name}));
        if (this.reportType == TIMEPERIODS) {
            return programOptions;
        } else {
            return programOptions.filter((program) => {return this.programs[program.value].frequencies.length > 0});
        }
    }

    getSelectedProgram = () => {
        if (this.enabled && this.selectedProgramId) {
            return {
                value: this.selectedProgramId,
                label: this.programs[this.selectedProgramId].name
            };
        }
        return this.blankOption;
    }

    
    getFrequencies = () => {
        if (this.enabled && this.reportType === TVA && this.selectedProgramId &&
            this.programs[this.selectedProgramId].frequencies.length > 0) {
            return this.programs[this.selectedProgramId].frequencies.map(
                (frequency) => ({value: frequency, label: this.labels.frequencies[frequency]})
            );
        } else if (this.enabled && this.reportType === TIMEPERIODS) {
            return Object.entries(this.labels.frequencies).map(
                ([frequency, label], count) => (
                    {value: frequency, label: label}
                )
            );
            return mapped;
        }
        return false;
    }
    
    getSelectedFrequency = () => {
        if (this.enabled && this.selectedProgramId && this.selectedFrequencyId) {
            return {
                value: this.selectedFrequencyId,
                label: this.labels.frequencies[this.selectedFrequencyId]
            };
        }
        return this.blankOption;
    }
    
    getMostRecentCount = () => {
        if (this.enabled && this.mostRecent !== false && this.mostRecent !== true) {
            return this.mostRecent;
        }
        return false;
    }
    
    @action
    focusMostRecentCount() {
        this.mostRecentCountHasFocus = true;
    }

    focusedMostRecentCount = () => {
        this.mostRecentCountHasFocus = false;
    }
    
    setDisabled = action(() => { 
        this.enabled = false;
    });
    
    @action
    setSelectedProgram(value) {
        if (!value || !this.programIds.includes(value)) {
            this.selectedProgramId = null;
            return false;
        }
        this.selectedProgramId = value;
        if (!this.enabled) {
            if (this.parentStore) {
                this.parentStore.disableOthers(this.reportType);
            }
            this.enabled = true;
            this.init();
        } else {
            if (this.reportType == TVA && this.selectedFrequencyId &&
                !this.programs[value].frequencies.includes(this.selectedFrequencyId)) {
                this.selectedFrequencyId = null;
            }
        }
        return true;
    }
    
    @action
    setSelectedFrequency(value) {
        this.selectedFrequencyId = value;
        if (value && [1, 2].includes(value)) {
            this.setShowAll();
        }
    }
    
    @action
    setShowAll() {
        this.showAll = true;
        this.oldMostRecent = this.mostRecent;
        this.mostRecent = false;
    }
    
    @action
    setMostRecent(val) {
        this.showAll = false;
        if (!isNaN(parseFloat(val)) && isFinite(val)) {
            this.mostRecent = val;
        } else if (this.oldMostRecent && this.oldMostRecent !== null) {
            this.mostRecent = this.oldMostRecent;
            this.oldMostRecent = null;
        } else {
            this.mostRecent = true;
        }
    }
    
}

export class IPTTQuickstartUIStore extends IPTTUIStore {};


export class IPTTReportUIStore extends IPTTUIStore {
    @observable startPeriod = null;
    @observable endPeriod = null;
    @observable selectedLevels = [];
    @observable selectedTypes = [];
    @observable selectedSectors = [];
    @observable selectedSites = [];
    @observable selectedIndicators = [];
    @observable programFilters;

    constructor(jsContext, reportType) {
        super(jsContext, reportType);
        this.enabled = true;
        this.setSelectedProgram(jsContext.program.id);
        this.setSelectedFrequency(jsContext.frequency);
        this.extractProgramFilters(jsContext.program);
    }
    
     extractProgramInfo(programJSON) {
        let programObject = {
            name: programJSON.name,
            id: programJSON.id,
            url: this.reportType == TVA ? programJSON.tva_url : programJSON.timeperiods_url,
            reportingStart: {
                iso: programJSON.reporting_period_start,
                label: programJSON.reporting_period_start_label
            },
            reportingEnd: {
                iso: programJSON.reporting_period_end,
                label: programJSON.reporting_period_end_label
            },
            frequencies: programJSON.frequencies,
            periods: programJSON.periods
        };
        return programObject;
    }
    
    extractProgramFilters = (programJSON) => {
        this.programFilters = {
            levels: Object.entries(programJSON.levels).map((item) => ({value: item[0], label: item[1]})),
            types: Object.entries(programJSON.types).map((item)  => ({value: item[0], label: item[1]})),
            sectors: Object.entries(programJSON.sectors).map((item)  => ({value: item[0], label: item[1]})),
            sites: Object.entries(programJSON.sites).map((item)  => ({value: item[0], label: item[1]})),
            indicators: Object.entries(programJSON.indicators).map((item)  => ({value: item[0], label: item[1]}))
        };
    }
    
    getStartPeriod = () => {
        if (this.startPeriod === null) {
            return BLANK_LABEL;
        }
        return this.startPeriod;
    }
    
    getEndPeriod = () => {
        if (this.endPeriod === null) {
            return BLANK_LABEL;
        }
        return this.endPeriod;
    }
    
    setStartPeriod = (count) => {
        this.startPeriod = count;
        return true;
    }
    
    setEndPeriod = (count) => {
        this.endPeriod = count;
        return true;
    }
    
    clearStartPeriod = () => {
        let options = this.getPeriods();
        if (options && options.length > 0) {
            this.startPeriod = options[0].value;
        } else {
            this.startPeriod = null;
        }
    }
    
    clearEndPeriod = () => {
        let options = this.getPeriods();
        if (options && options.length > 0) {
            this.endPeriod = options[options.length - 1].value;
        } else {
            this.endPeriod = null;
        }
    }
    
    getPeriods = (end_period=false) => {
        let options = [];
        if ([1, 2].includes(this.selectedFrequencyId)) {
            let label = (end_period ? this.programs[this.selectedProgramId].reportingEnd.label :
                         this.programs[this.selectedProgramId].reportingStart.label);
            return [{value: 0, label: label, disabled: false}];
        }
        if (this.selectedProgramId !== null && this.selectedFrequencyId !== null) {
            this.programs[this.selectedProgramId].periods[this.selectedFrequencyId].forEach(
                (period) => {options.push(
                    {
                        value: period.sort_index,
                        label: period.label,
                        disabled: (end_period ? this.startPeriod !== null && period.sort_index < this.startPeriod :
                                   this.endPeriod !== null && period.sort_index > this.endPeriod)
                    })}
            );
        }
        return options;
    }
    
    setSelectedFrequency(value) {
        if (value != this.selectedFrequencyId) {
            super.setSelectedFrequency(value);
            this.clearStartPeriod();
            this.clearEndPeriod();
        }
    }
    
    setLevels = (selected) => {
        this.selectedLevels = selected;
    }
    
    setTypes = (selected) => {
        this.selectedTypes = selected;
    }
    setSectors = (selected) => {
        this.selectedSectors = selected;
    }
    setSites = (selected) => {
        this.selectedSites = selected;
    }
    setIndicators = (selected) => {
        this.selectedIndicators = selected;
    }
    
    resetAll = () => {
        this.clearStartPeriod();
        this.clearEndPeriod();
        this.selectedLevels = [];
        this.selectedTypes = [];
        this.selectedSectors = [];
        this.selectedSites = [];
        this.selectedIndicators = [];
    }
    
    applyFilters = () => {
        console.log("applying");
    }
};



export class DualFilterStore {
    constructor(jsContext) {
        this.stores = {
            [TVA]: new IPTTQuickstartUIStore(jsContext, TVA, this),
            [TIMEPERIODS]: new IPTTQuickstartUIStore(jsContext, TIMEPERIODS, this)
        };
    }
    
    getStore = (reportType) => {
        return this.stores[reportType];
    }
    
    disableOthers = (reportType) => {
        let altReportType = reportType == TVA ? TIMEPERIODS : TVA;
        this.stores[altReportType].setDisabled();
    }
}