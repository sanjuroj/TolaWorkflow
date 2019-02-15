import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import eventBus from '../../eventbus';

import {DocumentsView} from './components/document_list';
import {DocumentListStore, DocumentListUIStore} from './models';

// console.log(jsContext);

const {documents, programs, indicatorToDocumentsMap, allowProjectsAccess} = jsContext;

/*
 * Model/Store setup
 */
const rootStore = new DocumentListStore(documents, programs, indicatorToDocumentsMap, allowProjectsAccess);
const uiStore = new DocumentListUIStore();


/*
 * Routing
 */

const routes = [
    {name: 'documents', path: '/?program_id&project_id&indicator_id&document_id'},
];

// When the URL changes due to navigation, back button press, etc
function onNavigation(navRoutes) {
    let {previousRoute, route} = navRoutes;
    let params = route.params;

    if (params.indicator_id) {
        uiStore.setSelectedIndicatorId(parseInt(params.indicator_id));
    } else {
        uiStore.clearSelectedIndicatorId();
    }

    if (params.program_id) {
        uiStore.setSelectedProgramId(parseInt(params.program_id));
    } else {
        uiStore.clearSelectedProgramId();
        uiStore.clearSelectedIndicatorId();
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

eventBus.on('indicator-id-filter-selected', (indicatorId) => {
    const programId = uiStore.selectedProgramId;

    if (indicatorId) {
        router.navigate('documents', {program_id: programId, indicator_id: indicatorId});
    } else {
        router.navigate('documents', {program_id: programId});
    }
});

eventBus.on('document-id-filter-selected', (documentId) => {
    const programId = uiStore.selectedProgramId;
    const indicatorId = uiStore.selectedIndicatorId;

    let qs = {};

    if (programId) {
        qs.program_id = programId;
    }

    if (indicatorId) {
        qs.indicator_id = indicatorId;
    }

    if (documentId) {
        qs.document_id = documentId;
    }

    router.navigate('documents', qs);
});


/*
 * React components on page
 */

ReactDOM.render(<DocumentsView rootStore={rootStore} uiStore={uiStore}/>,
    document.querySelector('#documents-view'));
