import { observable, computed, action } from "mobx";



export class DocumentListStore {
    @observable documents = [];
    @observable programs = [];
    @observable indicatorToDocumentsMap = {};
    @observable allowProjectsAccess = false;

    constructor(documents, programs, indicatorToDocumentsMap, allowProjectsAccess) {
        this.documents = documents;
        this.programs = programs;
        this.indicatorToDocumentsMap = indicatorToDocumentsMap;
        this.allowProjectsAccess = allowProjectsAccess;

        this.getIndicators = this.getIndicators.bind(this);
        this.getDocumentsForIndicator = this.getDocumentsForIndicator.bind(this);
    }

    // For a given program, return a list of indicators
    getIndicators(programId) {
        const programs = this.programs.filter(p => p.id === programId);
        if (programs.length) {
            return programs[0].indicator_set;
        }

        return [];
    }

    getDocumentsForIndicator(indicatorId) {
        return this.indicatorToDocumentsMap[indicatorId];
    }
}

export class DocumentListUIStore {
    @observable selectedProgramId;  // program filter selection
    @observable selectedIndicatorId;  // indicator filter selection
    @observable selectedDocumentId;  // single document filter selection
    @observable selectedProjectId;  // legacy URL filter for projects

    constructor() {
        this.setSelectedProgramId = this.setSelectedProgramId.bind(this);
        this.clearSelectedProgramId = this.clearSelectedProgramId.bind(this);
        this.setSelectedIndicatorId = this.setSelectedIndicatorId.bind(this);
        this.clearSelectedIndicatorId = this.clearSelectedIndicatorId.bind(this);
        this.setSelectedDocumentId = this.setSelectedDocumentId.bind(this);
        this.clearSelectedDocumentId = this.clearSelectedDocumentId.bind(this);
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
    setSelectedDocumentId(documentId) {
        this.selectedDocumentId = documentId;
    }

    @action
    clearSelectedDocumentId() {
        this.selectedDocumentId = null;
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
