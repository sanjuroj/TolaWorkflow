
/**
 * Shared IPTT React data models (UI/Business data)
 * @module iptt_shared/models
 */

import { observable, action, computed } from 'mobx';

import eventBus from '../../eventbus';

export const BLANK_LABEL = '---------';
export const TVA = 1;
export const TIMEPERIODS = 2;

export class ProgramFilterData {
    constructor(programsJSON) {
        this.programs = {};
        programsJSON.forEach(this.extractProgramInfo);
    }

    /** convert JSON object from back end to JS object with sanitized data */
    extractProgramInfo = programJSON => {
        let programObject = {
            name: programJSON.name,
            id: programJSON.id,
            url: {
                [TVA]: programJSON.tva_url,
                [TIMEPERIODS]: programJSON.timeperiods_url
            }
        };
        programObject.frequencies = programJSON.frequencies;
        this.programs[programJSON.id] = programObject;
    }

    get programIDs() {
        return Object.keys(this.programs);
    }

    validID = (value) => {
        if (value === null) {
            return null;
        } else if (value in this.programs || String(value) in this.programs) {
            return true;
        } else {
            return false;
        }
    }
    
    getProgram = (value) => {
        if (value === null) {
            return null;
        } else if (value in this.programs) {
            return this.programs[value];
        } else if (String(value) in this.programs) {
            return this.programs[String(value)];
        } else {
            //logging?  Error handling?
        }
    }
}


/**
 * Abstract base class for Filter UI data in IPTT pages
 */

export class IPTTUIStore {
    @observable selectedProgramId;
    @observable enabled;
    @observable selectedFrequencyId;
    @observable showAll;
    @observable mostRecent;
    @observable mostRecentCount;

    programStore = null;
    blankOption = {
        value: null,
        label: BLANK_LABEL
        };

    constructor(programStore, labels) {
        this.programStore = programStore;
        this.init();
        this.labels = labels;
    }
    
    init() {
        this.selectedProgramId = null;
        this.enabled = false;
        this.selectedFrequencyId = null;
        this.showAll = false;
        this.mostRecent = false;
        this.mostRecentCount = null;
        this.mostRecentFocus = false;
    }
    
    @computed get selectedProgramOption() {
        if (this.selectedProgramId !== null) {
            return {
                value: this.selectedProgramId,
                label: this.programStore.getProgram(this.selectedProgramId).name
            };
        } else {
            return this.blankOption;
        }
    }
    
    @computed get selectedFrequencyOption() {
        if (this.selectedProgramId !== null && this.selectedFrequencyId !== null) {
            return {
                value: this.selectedFrequencyId,
                label: this.labels.frequencies[this.selectedFrequencyId]
            };
        } else {
            return this.blankOption;
        }
    }
    
    get submitUrl() {
        if ( this.enabled && this.selectedProgramId !== null && this.selectedFrequencyId !== null ) {
            let url = this.programStore.getProgram(this.selectedProgramId).url[this.reportType];
            url += '?frequency=' + this.selectedFrequencyId;
            if ([1,2].includes(this.selectedFrequencyId)) {
                return url;
            } else if (this.showAll) {
                url += '&show_all=1';
            } else if (this.mostRecent && this.mostRecentCount !== null) {
                url += '&recents=' + this.mostRecentCount;
            }
            return url;
        }
        return false;
    }
    
    get selectedProgram() { return this.programStore.getProgram(this.selectedProgramId); }
    
    get programOptions() {
        return this.programStore.programIDs.map((pid) => ({value: pid, label: this.programStore.getProgram(pid).name}));
    }
    
    get frequencyOptions() {
        if (this.reportType == TIMEPERIODS) {
            return Object.entries(this.labels.frequencies).map(
                ([value, label]) => ({value: value, label: label})
            );
        } else {
            if (!this.selectedProgramId) {
                return [];
            } else {
             return this.programStore.getProgram(this.selectedProgramId).frequencies.map(
                    (frequency) => ({value: frequency, label: this.labels.frequencies[frequency]})
                );   
            }
        }
    }

    @action
    setSelectedProgram(value) {
        if (value == this.selectedProgramId) {
            //do nothing
        } else if (value && this.programStore.validID(value)) {
            this.selectedProgramId = value;
            this.setSelectedFrequency(this.selectedFrequencyId);
        } else {
            this.selectedProgramId = null;
        }
    }
    
    @action
    setSelectedFrequency(value) {
        let validFrequencies;
        if (!value || !this.selectedProgramId) {
            this.selectedFrequencyId = null;
        } else if (this.reportType == TVA) {
            validFrequencies = this.programStore.getProgram(this.selectedProgramId).frequencies;
        } else {
            validFrequencies = Object.keys(this.labels.frequencies);
        }
        if (validFrequencies.includes(value)) {
            this.selectedFrequencyId = value;
        } else if (validFrequencies.includes(String(value))) {
            this.selectedFrequencyId = String(value);
        } else if (validFrequencies.includes(parseInt(value))) {
            this.selectedFrequencyId = parseInt(value);
        } else {
            //error handling?
            this.selectedFrequencyId = null;
        }
    }

    @action
    setShowAll() {
        this.showAll = true;
        this.mostRecent = false;
    }

    @action
    setMostRecent() {
        if (!this.mostRecent) {
            this.showAll = false;
            this.mostRecent = true;
            if (!this.mostRecentCount) {
                eventBus.emit('most-recent-count-focus');
            }
        }
    }

    @action
    setMostRecentCount(value) {
        if (value) {
            this.mostRecentCount = value;
            this.setMostRecent();
        }
        
    }
}
