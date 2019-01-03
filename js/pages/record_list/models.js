import { observable, computed, action } from "mobx";



export class RecordListStore {
    @observable records = [];
    @observable programs = [];
    @observable indicatorToRecordsMap = {};
    @observable allowProjectsAccess = false;

    constructor(records, programs, indicatorToRecordsMap, allowProjectsAccess) {
        this.records = records;
        this.programs = programs;
        this.indicatorToRecordsMap = indicatorToRecordsMap;
        this.allowProjectsAccess = allowProjectsAccess;

        this.getIndicators = this.getIndicators.bind(this);
        this.getRecordsForIndicator = this.getRecordsForIndicator.bind(this);
    }

    // For a given program, return a list of indicators
    getIndicators(programId) {
        const programs = this.programs.filter(p => p.id === programId);
        if (programs.length) {
            return programs[0].indicator_set;
        }

        return [];
    }

    getRecordsForIndicator(indicatorId) {
        return this.indicatorToRecordsMap[indicatorId];
    }
}

export class RecordListUIStore {
    @observable selectedProgramId;  // program filter selection
    @observable selectedIndicatorId;  // indicator filter selection
    @observable selectedRecordId;  // single record filter selection
    @observable selectedProjectId;  // legacy URL filter for projects

    constructor() {
        this.setSelectedProgramId = this.setSelectedProgramId.bind(this);
        this.clearSelectedProgramId = this.clearSelectedProgramId.bind(this);
        this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
        this.clearSelectedIndicatorId = this.clearSelectedIndicatorId.bind(this);
        this.setSelectedRecordId = this.setSelectedRecordId.bind(this);
        this.clearSelectedRecordId = this.clearSelectedRecordId.bind(this);
        this.setSelectedProjectId = this.setSelectedProjectId.bind(this);
        this.clearSelectedProjectId = this.clearSelectedProjectId.bind(this);
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

    @action
    setSelectedRecordId(recordId) {
        this.selectedRecordId = recordId;
    }

    @action
    clearSelectedRecordId() {
        this.selectedRecordId = null;
    }

    @action
    setSelectedProjectId(projectId) {
        this.selectedProjectId = projectId;
    }

    @action
    clearSelectedProjectId() {
        this.selectedProjectId = null;
    }
}
