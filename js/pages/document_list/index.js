import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import eventBus from '../../eventbus';

import {DocumentsView} from './components/document_list';
import {DocumentListStore, DocumentListUIStore} from './models';

// console.log(jsContext);

const {documents, programs, allowProjectsAccess, readonly, access} = jsContext;

/*
 * Model/Store setup
 */
const rootStore = new DocumentListStore(documents, programs, allowProjectsAccess);
const uiStore = new DocumentListUIStore();


/*
 * Routing
 */

const routes = [
    {name: 'documents', path: '/?program_id&project_id&document_id'},
];

// When the URL changes due to navigation, back button press, etc
function onNavigation(navRoutes) {
    let {previousRoute, route} = navRoutes;
    let params = route.params;

    if (params.program_id) {
        uiStore.setSelectedProgramId(parseInt(params.program_id));
    } else {
        uiStore.clearSelectedProgramId();
    }

    if (params.document_id) {
        uiStore.setSelectedDocumentId(parseInt(params.document_id));
    } else {
        uiStore.clearSelectedDocumentId();
    }

    if (params.project_id) {
        uiStore.setSelectedProjectId(parseInt(params.project_id));
    } else {
        uiStore.clearSelectedProjectId();
    }
}

const router = createRouter(routes, {
    defaultRoute: 'all', // used if route not found
    defaultParams: {},
});
router.usePlugin(browserPlugin({useHash: false, base: '/workflow/documentation_list'}));
router.subscribe(onNavigation);
router.start();


/*
 * Event Handlers
 */

// program filter selection
eventBus.on('program-id-filter-selected', (programId) => {
    if (programId) {
        router.navigate('documents', {program_id: programId});
    } else {
        router.navigate('documents');
    }
});

eventBus.on('document-id-filter-selected', (documentId) => {
    const programId = uiStore.selectedProgramId;

    let qs = {};

    if (programId) {
        qs.program_id = programId;
    }

    if (documentId) {
        qs.document_id = documentId;
    }

    router.navigate('documents', qs);
});


/*
 * React components on page
 */

const mapped_program_access = access.programs.reduce((programs, program) => ({...programs, [program.program]: program}),{})
ReactDOM.render(<DocumentsView rootStore={rootStore} uiStore={uiStore} readonly={readonly} access={mapped_program_access}/>,
    document.querySelector('#documents-view'));
