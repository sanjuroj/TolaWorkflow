import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import eventBus from '../../eventbus';

import {RecordsView} from './components/record_list';
import {RecordListStore, RecordListUIStore} from './models';

// console.log(jsContext);

const {records, programs, indicatorToRecordsMap, allowProjectsAccess} = jsContext;

/*
 * Model/Store setup
 */
const rootStore = new RecordListStore(records, programs, indicatorToRecordsMap, allowProjectsAccess);
const uiStore = new RecordListUIStore();


/*
 * Routing
 */

const routes = [
    {name: 'records', path: '/?program_id&project_id&indicator_id&record_id'},
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

    if (params.record_id) {
        uiStore.setSelectedRecordId(parseInt(params.record_id));
    } else {
        uiStore.clearSelectedRecordId();
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
        router.navigate('records', {program_id: programId});
    } else {
        router.navigate('records');
    }
});

eventBus.on('indicator-id-filter-selected', (indicatorId) => {
    const programId = uiStore.selectedProgramId;

    if (indicatorId) {
        router.navigate('records', {program_id: programId, indicator_id: indicatorId});
    } else {
        router.navigate('records', {program_id: programId});
    }
});

eventBus.on('record-id-filter-selected', (recordId) => {
    const programId = uiStore.selectedProgramId;
    const indicatorId = uiStore.selectedIndicatorId;

    let qs = {};

    if (programId) {
        qs.program_id = programId;
    }

    if (indicatorId) {
        qs.indicator_id = indicatorId;
    }

    if (recordId) {
        qs.record_id = recordId;
    }

    router.navigate('records', qs);
});


/*
 * React components on page
 */

ReactDOM.render(<RecordsView rootStore={rootStore} uiStore={uiStore}/>,
    document.querySelector('#records-view'));
