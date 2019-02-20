import { observable, computed, action } from "mobx";



export class DocumentListStore {
    @observable documents = [];
    @observable programs = [];
    @observable allowProjectsAccess = false;

    constructor(documents, programs, allowProjectsAccess) {
        this.documents = documents;
        this.programs = programs;
        this.allowProjectsAccess = allowProjectsAccess;
    }
}

export class DocumentListUIStore {
    @observable selectedProgramId;  // program filter selection
    @observable selectedDocumentId;  // single document filter selection
    @observable selectedProjectId;  // legacy URL filter for projects

    constructor() {
        this.setSelectedProgramId = this.setSelectedProgramId.bind(this);
        this.clearSelectedProgramId = this.clearSelectedProgramId.bind(this);
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
