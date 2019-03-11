/**
 * IPTT Quickstart React data models
 * @module: iptt_quickstart/models
 */

import { computed } from 'mobx';
import { ProgramFilterData, IPTTUIStore, TVA, TIMEPERIODS } from '../iptt_shared/models';
import eventBus from '../../eventbus';


/** Class representing a program's filterable information (name, id, frequencies, dates */
export class QuickstartProgramFilterData extends ProgramFilterData {}

/** Class containing UI data in one of two Quickstart page filters (TVA/Timeperiods)
 * @extends module:iptt_shared/,mmodels.IPTTUIStore
 */
class IPTTQuickstartUIStore extends IPTTUIStore {
    setSelectedProgram(value) {
        super.setSelectedProgram(value);
        if (this.selectedProgramId !== null && !this.enabled) {
            this.enabled = true;
            eventBus.emit('activate-iptt-quickstart-form', this.reportType); 
        }
    }
}

export class IPTTQuickstartTVAStore extends IPTTQuickstartUIStore {
    reportType = TVA;
    
    init() {
        super.init();
        this.enabled = true;
        this.showAll = true;
    }
    
    get formTitle() { return this.labels.tvaTitle; }
    get formSubtitle() { return this.labels.tvaSubtitle; }
    
    get programOptions() {
        return super.programOptions.filter((program) => this.programStore.getProgram(program.value).frequencies.length > 0);
    }
    
    setSelectedProgram(value) {
        super.setSelectedProgram(value);
        let validFrequencies = this.programStore.getProgram(this.selectedProgramId).frequencies;
        if (this.selectedFrequencyId &&
            !this.programStore.getProgram(this.selectedProgramId).frequencies.includes(this.selectedFrequencyId)) {
            this.selectedFrequencyId = null;
        }
    }
}

export class IPTTQuickstartTimeperiodsStore extends IPTTQuickstartUIStore {
    reportType = TIMEPERIODS;
    
    init() {
        this.enabled = false;
        this.selectedFrequencyId = 7;
        this.mostRecent = true;
        this.mostRecentCount = 2;
    }
    
    get formTitle() { return this.labels.timeperiodsTitle; }
    get formSubtitle() { return this.labels.timeperiodsSubtitle; }
}

export class DualFilterStore {
    constructor(programStore, labels) {
        this.stores = {
            [TVA]: new IPTTQuickstartTVAStore(programStore, labels),
            [TIMEPERIODS]: new IPTTQuickstartTimeperiodsStore(programStore, labels)
        };
        eventBus.on('activate-iptt-quickstart-form', this.disableOthers);
    }
    
    getStore = (reportType) => {
        return this.stores[reportType];
    }
    
    disableOthers = (reportType) => {
        let altReportType = reportType == TVA ? TIMEPERIODS : TVA;
        this.stores[altReportType].enabled = false;
    }
}