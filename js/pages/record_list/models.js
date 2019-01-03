import { observable, computed, action } from "mobx";



export class RecordListStore {
    @observable records = [];
    @observable programs = [];
    @observable allowProjectsAccess = false;

    constructor(records, programs, allowProjectsAccess) {
        this.records = records;
        this.programs = programs;
        this.allowProjectsAccess = allowProjectsAccess;

        this.getIndicators = this.getIndicators.bind(this);
    }

    // For a given program, return a list of indicators
    getIndicators(programId) {
        const programs = this.programs.filter(p => p.id === programId);
        if (programs.length) {
            return programs[0].indicator_set;
        }

        return [];
    }
}

export class RecordListUIStore {
    @observable selectedProgramId;  // program filter selection
    @observable selectedIndicatorId;  // indicator filter selection

    constructor() {
        this.setSelectedProgramId = this.setSelectedProgramId.bind(this);
        this.clearSelectedProgramId = this.clearSelectedProgramId.bind(this);
        this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
        this.clearSelectedIndicatorId = this.clearSelectedIndicatorId.bind(this);
    }

    @action
    setSelectedProgramId(programId) {
        this.selectedProgramId = programId;
    }

    @action
    clearSelectedProgramId() {
        this.selectedProgramId = null;
    }

    @action
    setSelectedIndicatorId(indicatorId) {
        this.selectedIndicatorId = indicatorId;
    }

    @action
    clearSelectedIndicatorId() {
        this.selectedIndicatorId = null;
    }
}
