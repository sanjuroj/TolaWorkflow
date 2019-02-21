import { observable, action } from 'mobx';

export const BLANK_LABEL = '---------';
export const TVA = 1;
export const TIMEPERIODS = 2;

export class IPTTQuickstartUIStore {
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

    extractProgramInfo = (programJSON) => {
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

export class IPTTReportUIStore extends IPTTQuickstartUIStore {
    constructor(jsContext, reportType) {
        super(jsContext, reportType);
        this.enabled = true;
        this.setSelectedProgram(jsContext.program.id);
        this.setSelectedFrequency(jsContext.frequency);
    }
};