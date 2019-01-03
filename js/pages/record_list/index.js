import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import eventBus from '../../eventbus';

import {RecordsView} from './components/record_list';
import {RecordListStore, RecordListUIStore} from './models';

console.log(jsContext);

const {records, programs, allowProjectsAccess} = jsContext;

/*
 * Model/Store setup
 */
const rootStore = new RecordListStore(records, programs, allowProjectsAccess);
const uiStore = new RecordListUIStore();


/*
 * Routing
 */

const routes = [
    {name: 'all', path: '/'},
    {name: 'program', path: '/program/:program_id<\\d+>'},
    {name: 'project', path: '/project/:project_id<\\d+>'},
    {name: 'indicator', path: '/program/:program_id<\\d+>/:indicator_id<\\d+>'},
    {name: 'record', path: '/record/:record_id<\\d+>'},
];

// When the URL changes due to navigation, back button press, etc
function onNavigation(navRoutes) {
    let {previousRoute, route} = navRoutes;
    let params = route.params;

    let indicatorId, programId;

    // Clear all selections such that routes don't need to worry about previous routes
    uiStore.clearSelectedProgramId();
    uiStore.clearSelectedIndicatorId();

    // params may be strings or ints depending
    switch (navRoutes.route.name) {
        case 'all':
            break;
        case 'program':
            programId = parseInt(params.program_id);
            uiStore.setSelectedProgramId(programId);
            break;
        case 'project':
            break;
        case 'indicator':
            programId = parseInt(params.program_id);
            indicatorId = parseInt(params.indicator_id);
            uiStore.setSelectedProgramId(programId);
            uiStore.setSelectedIndicatorId(indicatorId);
            break;
        case 'record':
            break;
        default:
            console.log('hmmm')
    }
    console.log(navRoutes);
}

const router = createRouter(routes, {
    defaultRoute: 'all', // used if route not found
    defaultParams: {},
});
router.usePlugin(browserPlugin({useHash: false, base: '/workflow/documentation_list/0/0'}));
router.subscribe(onNavigation);
router.start();


/*
 * Event Handlers
 */

// program filter selection
eventBus.on('program-id-filter-selected', (programId) => {
    if (programId) {
        router.navigate('program', {program_id: programId});
    } else {
        router.navigate('all');
    }
});

eventBus.on('indicator-id-filter-selected', (indicatorId) => {
    const programId = uiStore.selectedProgramId;

    if (indicatorId) {
        router.navigate('indicator', {program_id: programId, indicator_id: indicatorId});
    } else {
        router.navigate('program', {program_id: programId});
    }
});


/*
 * React components on page
 */

ReactDOM.render(<RecordsView rootStore={rootStore} uiStore={uiStore}/>,
    document.querySelector('#records-view'));
