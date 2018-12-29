import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import eventBus from '../../eventbus';

import {RecordsView} from './components/record_list';
import {RecordListStore, RecordListUIStore} from './models';

console.log(jsContext);

const {records, programs} = jsContext;

/*
 * Model/Store setup
 */
const rootStore = new RecordListStore(records, programs);
const uiStore = new RecordListUIStore();

/*
 * Routing
 */

const routes = [
    {name: 'all', path: '/'},
    {name: 'program', path: '/program/:program_id<\\d+>'},
    {name: 'indicator', path: '/program/:program_id/:indicator_id'},
    {name: 'record', path: '/record/:record_id'},
];

// When the URL changes due to navigation, back button press, etc
function onNavigation(navRoutes) {
    let {previousRoute, route} = navRoutes;
    let params = route.params;

    // params may be strings or ints depending
    switch (navRoutes.route.name) {
        case 'all':
            console.log('alllll');
            break;
        case 'program':
            console.log(params.program_id);
            break;
        case 'indicator':
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

// setTimeout(function() {router.navigate('program', {program_id: 10})}, 4000)
// setTimeout(function() {router.navigate('indicator', {program_id: 10, indicator_id: 12})}, 8000)

/*
 * Event Handlers
 */

// open indicator update modal with form loaded from server
// eventBus.on('open-indicator-update-modal', (indicatorId) => {
//     // Note: depends on indicator_list_modals.html
//
//     let url = `/indicators/indicator_update/${indicatorId}/?modal=1`;
//
//     $("#indicator_modal_content").empty();
//     $("#modalmessages").empty();
//
//     $("#indicator_modal_content").load(url);
//     $("#indicator_modal_div").modal('show');
// });


/*
 * React components on page
 */

ReactDOM.render(<RecordsView rootStore={rootStore} uiStore={uiStore}/>,
    document.querySelector('#records-view'));
