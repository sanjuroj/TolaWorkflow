/**
 * IPTT Quickstart React data models
 * @module: iptt_quickstart/models
 */

import { observable, computed } from 'mobx';

const BLANK_LABEL = '---------';
const TVA = 1;
const TIMEPERIODS = 2;


class QSProgram {
    constructor(rootStore, programJSON) {
        this.rootStore = rootStore;
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
}

class QSProgramStore  {
    constructor(rootStore, programsJSON) {
        this.rootStore = rootStore;
        this.programs = {};
        programsJSON.forEach(programJSON => {
            this.programs[programJSON.id] = new QSProgram(this.rootStore, programJSON);
        });
    }
    
    getProgram(id) {
        return this.programs[id];
    }

}

export class QSRootStore {
    @observable reportType = null;
    @observable tvaSelectedProgram = null;
    @observable timeperiodsSelectedProgram = null;
    @observable tvaSelectedFrequencyId = null;
    @observable tvaShowAll = true;
    @observable tvaMostRecent = null;
    @observable tvaMostRecentCount = 2;

    constructor(contextData) {
        this.programStore = new QSProgramStore(this, contextData.programs);
        this.periodLabels = contextData.labels.targetperiods;
    }
    
    setTVAProgramId(id) {
        if (id === null) {
            this.tvaSelectedProgram = null;
        } else if (this.tvaSelectedProgram == null || this.tvaSelectedProgram.id != id) {
            this.tvaSelectedProgram = this.programStore.getProgram(id);
            if (this.tvaSelectedFrequencyId
                && this.tvaSelectedProgram.frequencies.indexOf(parseInt(this.tvaSelectedFrequencyId)) == -1) {
                this.setTVAFrequencyId(null);
            }
        }
        this.reportType = TVA;
    }
    
    @computed get selectedTVAProgramOption() {
        if (this.tvaSelectedProgram === null || this.reportType == TIMEPERIODS) {
            return {value: null, label: BLANK_LABEL};
        }
        return {value: this.tvaSelectedProgram.id, label: this.tvaSelectedProgram.name};
    }
    
    setTimeperiodsProgramId(id) {
        if (id === null) {
            this.timeperiodsSelectedProgram = null;
        } else if (this.timeperiodsSelectedProgram == null || this.timeperiodsSelectedProgram.id != id) {
            this.timeperiodsSelectedProgram = this.programStore.getProgram(id);
        }
        this.reportType = TIMEPERIODS;
    }
    
    @computed get selectedTimeperiodsProgramOption() {
        if (this.timeperiodsSelectedProgram === null || this.reportType == TVA) {
            return {value: null, label: BLANK_LABEL};
        }
        return {value: this.timeperiodsSelectedProgram.id, label: this.timeperiodsSelectedProgram.name};
    }
    
    get timeperiodsProgramOptions() {
        return Object.entries(this.programStore.programs).map(
            ([id, program]) => ({value: id, label: program.name})
        );
    }
    
    get tvaProgramOptions() {
        return Object.entries(this.programStore.programs).filter(
            ([id, program]) => program.frequencies.length > 0
        ).map(
            ([id, program]) => ({value: id, label: program.name})
        );
    }
    
    setTVAFrequencyId(id) {
        if (id === null) {
            this.tvaSelectedFrequencyId = null;
        } else if (this.tvaSelectedFrequencyId != id) {
            this.tvaSelectedFrequencyId = id;
        }
        this.reportType = TVA;
    }
    
    @computed get tvaSelectedFrequencyOption() {
        if (this.reportType == TIMEPERIODS || this.tvaSelectedProgram === null
            || this.tvaSelectedFrequencyId === null) {
            return {value: null, label: BLANK_LABEL};
        }
        return {
            value: this.tvaSelectedFrequencyId,
            label: this.periodLabels[this.tvaSelectedFrequencyId]
        };
    }
    
    @computed get tvaFrequencyOptions() {
        if (this.tvaSelectedProgram === null || this.reportType == TIMEPERIODS) {
            return [{value: null, label: BLANK_LABEL}, ];
        } else {
            return this.tvaSelectedProgram.frequencies.map(
                (id) => ({value: id, label: this.periodLabels[id]})
            );
        }
    }
    
    @computed get tvaRadioDisabled() {
        return !(this.reportType == TVA && this.tvaSelectedProgram != null && this.tvaSelectedFrequencyId !== null);
    }
    
    setTVAShowAll = () => {
        this.tvaShowAll = true;
        this.tvaMostRecent = false;
    }
    
    setTVAMostRecent = (count) => {
        this.tvaMostRecent = true;
        this.tvaShowAll = false;
        if (count !== undefined && count !== null) {
            this.tvaMostRecentCount = count;
        }
    }
    
    @computed get tvaMostRecentCountDisplay() {
        return this.tvaMostRecent ? this.tvaMostRecentCount : '';
    }
    
    @computed get tvaURL() {
        if (this.reportType == TIMEPERIODS || this.tvaSelectedProgram == null || this.tvaSelectedFrequencyId == null) {
            return false;
        }
        let url = '/indicators/iptt_report/' + this.tvaSelectedProgram.id + '/targetperiods/?frequency=' + this.tvaSelectedFrequencyId;
        if (this.tvaShowAll) {
            return url + '&timeframe=1';
        } else if (this.tvaMostRecent) {
            return url + '&timeframe=2&numrecentcount=' + this.tvaMostRecentCount;
        }
        return url;
    }
    
    @computed get timeperiodsURL() {
        if (this.reportType == TVA || this.timeperiodsSelectedProgram == null) {
            return false;
        }
        let url = '/indicators/iptt_report/' + this.timeperiodsSelectedProgram.id + '/timeperiods/?frequency=';
        return url + '7&timeframe=2&numrecentcount=2';
    }
    
}