/**
 * IPTT Quickstart React data models
 * @module: iptt_quickstart/models
 */

import { observable, computed, action, reaction } from 'mobx';
import QSProgramStore from './program_models'

export const BLANK_LABEL = '---------';
export const TVA = 1;
export const TIMEPERIODS = 2;
const BLANK_OPTION = {
    value: null,
    label: BLANK_LABEL
};


export default class QSRootStore {
    @observable reportType = null;
    @observable tvaProgramId = null;
    @observable timeperiodsProgramId = null;
    @observable frequencyId = null;
    @observable showAll = true;
    @observable mostRecent = false;
    @observable mostRecentCount = 2;

    constructor(contextData) {
        this.programStore = new QSProgramStore(this, contextData.programs);
        this.periodLabels = contextData.labels.targetperiods;
        this.iptt_url = contextData.iptt_url;
        const resetFrequency = reaction(
            () => this.tvaProgramId,
            programId => {
                if (programId !== null && this.frequencyId !== null &&
                    this.programStore.getProgram(programId).frequencies.indexOf(this.frequencyId) == -1) {
                    this.setFrequency(null);
                }
            }
        )
    }
    
    /* options for program selection in TIMEPERIODS form */
    get timeperiodsProgramOptions() {
        return this.programStore.programList.map(
            program => ({value: program.id, label: program.name})
        );
    }
    
    /* options for program selection in TVA form (must have available frequencies) */
    get tvaProgramOptions() {
        return this.programStore.programList.filter(
            program => program.frequencies.length > 0
        ).map(program => ({value: program.id, label: program.name}));
    }
    
    /* options for frequency selection in TVA form (must be TVA program, only shows that program's frequencies */
    @computed get frequencyOptions() {
        if (this.reportType !== TVA || this.tvaProgramId === null) {
            return [BLANK_OPTION];
        }
        return this.programStore.getProgram(this.tvaProgramId)
            .frequencies.map( id => ({value: id, label: this.periodLabels[id]})
        );
    }
    
    /* GET select option (value/label) for selected Program in TVA form */
    @computed get selectedTVAProgram() {
        if (this.reportType !== TVA || this.tvaProgramId === null) {
            return BLANK_OPTION;
        }
        return {
            value: this.tvaProgramId, label: this.programStore.getProgram(this.tvaProgramId).name
        }
    }
    
    /* GET select option (value/label) for selected Program in Timeperiods form */
    @computed get selectedTimeperiodsProgram() {
        if (this.reportType !== TIMEPERIODS || this.timeperiodsProgramId === null) {
            return BLANK_OPTION;
        }
        return {
            value: this.timeperiodsProgramId,
            label: this.programStore.getProgram(this.timeperiodsProgramId).name
        }
    }
    
    /* GET select option (value/label) for selected Frequency in TVA form */
    @computed get selectedFrequency() {
        if (this.reportType !== TVA || this.tvaProgramId === null || this.frequencyId === null) {
            return BLANK_OPTION;
        }
        return {
            value: this.frequencyId,
            label: this.periodLabels[this.frequencyId]
        }
    }
    
    /* Whether to disable the most recent and show all radio buttons */
    @computed get periodCountDisabled() {
        return this.reportType !== TVA || this.tvaProgramId === null || [3, 4, 5, 6, 7].indexOf(this.frequencyId) == -1;
    }
    
    /* GET most recent display - only show value if most recent is selected */
    @computed get mostRecentCountDisplay() {
        if (!this.periodCountDisabled && this.mostRecent) {
            return this.mostRecentCount;
        }
        return '';
    }
    
    /* SET tva program to the designated ID, and make the report type TVA */
    @action setTVAProgram(id) {
        if (id === null) {
            this.tvaProgramId = null;
        } else {
            this.tvaProgramId = id;
            this.reportType = TVA;
        }
    }
    
    /* SET tva program to the designated ID, and make the report type Timeperiods */
    @action setTimeperiodsProgram(id) {
        if (id === null) {
            this.timeperiodsProgramId = null;
        } else {
            this.timeperiodsProgramId = id;
            this.reportType = TIMEPERIODS;
        }
    }
    
    /* SET frequency in TVA form */
    @action setFrequency(id) {
        this.frequencyId = id;
    }
    
    
    @action setMostRecent() {
        this.showAll = false;
        this.mostRecent = true;
    }

    @action setMostRecentCount(count) {
        this.setMostRecent();
        count = Math.min(count, this.programStore.getProgram(this.tvaProgramId).periodCount(this.frequencyId));
        this.mostRecentCount = count;
    }
    
    @action setShowAll() {
        this.mostRecent = false;
        this.showAll = true;
    }
    
    @computed get tvaURL() {
        if (this.reportType === TVA && this.tvaProgramId !== null && this.frequencyId !== null) {
            let url = `${this.iptt_url}${this.tvaProgramId}/targetperiods/?frequency=${this.frequencyId}`;
            if (this.frequencyId == 1 || this.frequencyId == 2) {
                return url;
            } else if (this.showAll) {
                return `${url}&timeframe=1`;
            }
            return `${url}&timeframe=2&numrecentcount=${this.mostRecentCount}`;
        }
        return false;
    }
    
    @computed get timeperiodsURL() {
        if (this.reportType === TIMEPERIODS && this.timeperiodsProgramId !== null) {
            return `${this.iptt_url}${this.timeperiodsProgramId}/timeperiods/` +
                    `?frequency=7&timeframe=2&numrecentcount=2`;
        }
        return false;
    }
}