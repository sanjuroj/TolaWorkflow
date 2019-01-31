import React from 'react';
import ReactDOM from 'react-dom';
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';

import {IndicatorList} from './components/indicator_list';
import {ProgramMetrics} from './components/program_metrics';
import {ProgramPageStore, ProgramPageUIStore, IndicatorFilterType} from './models';

import './pinned_reports';


/*
 * Model/Store setup
 */
const rootStore = new ProgramPageStore(jsContext.indicators, jsContext.program);
const uiStore = new ProgramPageUIStore();

/*
 * Routes setup:
 */

const routes = [
    { name: 'all', path: '/', filterType: IndicatorFilterType.noFilter },
    { name: 'targets', path: '/targets', filterType: IndicatorFilterType.missingTarget },
    { name: 'results', path: '/results', filterType: IndicatorFilterType.missingResults },
    { name: 'evidence', path: '/evidence', filterType: IndicatorFilterType.missingEvidence },
    { name: 'scope', path: '/scope' },
    { name: 'scope.on', path: '/on', filterType: IndicatorFilterType.onTarget },
    { name: 'scope.above', path: '/above', filterType: IndicatorFilterType.aboveTarget },
    { name: 'scope.below', path: '/below', filterType: IndicatorFilterType.belowTarget }
];

var routeLookup = {};
var routeNameLookup = {};

/* generate a route map to lookup route name from filtertype (events bubbling up from gauge bands) and also
 * generate a lookup to get filtertype from route name (for url-based filtering)
 */
for (let i=0; i<routes.length; i++) {
    if (routes[i].name == 'scope') {
        routeLookup[routes[i].name] = null;
    } else {
        routeLookup[routes[i].name] = routes[i].filterType;
        routeNameLookup[routes[i].filterType] = routes[i].name;
    }
}


const router = createRouter(routes, {
    defaultRoute: 'all', //unrouted: show all indicators
    defaultParams: {},
    trailingSlashMode: 'always'
});

const routeToEventBus = (routeName) => {
    if (!routeLookup.hasOwnProperty(routeName)) {
        console.log('no filter for name', routeName);
    } else {
        let filterType = routeLookup[routeName];
        eventBus.emit('apply-gauge-tank-filter', filterType);
    }
}

const onNavigation = (navRoutes) => {
    if (navRoutes.route.name == 'scope') {
        router.navigate('scope.on', {}, {replace: true});
    }
};

router.usePlugin(browserPlugin({useHash: true, base:'/program/'+jsContext.program.id+'/'}));
router.subscribe(onNavigation);
router.start();

/* function to pass into gauge band elements to handle clicking a filter or show all
 */
const filterClickToRoute = (filterType = 0) => {
    if (routeNameLookup.hasOwnProperty(filterType)) {
        router.navigate(routeNameLookup[filterType]);
    } else {
        //how do we handle js errors?
        console.log("attempted to find (and failed) filter type", filterType);
    }
}


/*
 * Event Handlers
 */

// open indicator update modal with form loaded from server
eventBus.on('open-indicator-update-modal', (indicatorId) => {
    // Note: depends on indicator_list_modals.html

    let url = `/indicators/indicator_update/${indicatorId}/?modal=1`;

    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();

    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show');
});

// get results html blob for indicator
eventBus.on('load-indicator-results', (indicatorId) => {
    if (!indicatorId) return;

    let url = `/indicators/result_table/${indicatorId}/${rootStore.program.id}/`;

    $.get(url, function (data) {
        rootStore.addResultsHTML(indicatorId, data);
    });
});

// delete (hide) results html blob for indicator
eventBus.on('delete-indicator-results', (indicatorId) => {
    rootStore.deleteResultsHTML(indicatorId);
});

// reload singular indicator json obj
eventBus.on('reload-indicator', indicatorId => {
    $.get(`/indicators/api/indicator/${indicatorId}`, rootStore.indicatorStore.updateIndicator);
});

// apply a gas gauge filter. Takes in IndicatorFilterType enum value
eventBus.on('apply-gauge-tank-filter', indicatorFilter => {

    // reset all filters
    eventBus.emit('clear-all-indicator-filters');

    eventBus.emit('close-all-indicators');
    
    // update navigation element:
    if (routeNameLookup.hasOwnProperty(indicatorFilter)) {
        router.navigate(routeNameLookup[indicatorFilter]);
    } else {
        //how do we handle js errors?
        console.log("attempted to find (and failed) filter type", indicatorFilter);
    }

    uiStore.setIndicatorFilter(indicatorFilter);
});

// clear all gas tank and indicator select filters
eventBus.on('clear-all-indicator-filters', () => {
    router.navigate('all');
    uiStore.clearIndicatorFilter();
    eventBus.emit('select-indicators-to-filter', null);
    eventBus.emit('close-all-indicators');
});

// filter down by selecting individual indicator
eventBus.on('select-indicators-to-filter', (selectedIndicatorId) => {
    // clear gauge tank filters
    uiStore.clearIndicatorFilter();

    uiStore.setSelectedIndicatorId(selectedIndicatorId);

    // Open up results pane as well
    eventBus.emit('load-indicator-results', selectedIndicatorId);
});

// close all expanded indicators in the table
eventBus.on('close-all-indicators', () => {
    rootStore.deleteAllResultsHTML();
});


/*
 * React components on page
 */

ReactDOM.render(<IndicatorList rootStore={rootStore} uiStore={uiStore} />,
    document.querySelector('#indicator-list-react-component'));

ReactDOM.render(<ProgramMetrics rootStore={rootStore}
                                uiStore={uiStore}
                                indicatorOnScopeMargin={jsContext.indicator_on_scope_margin} />,
    document.querySelector('#program-metrics-react-component'));


//fire initial filters:
routeToEventBus(router.getState().name);

/*
 * Copied and modified JS from indicator_list_modals.js to allow modals to work
 * without being completely converted to React
 */

// Open the CollectDataUpdate (update results) form in a modal
$("#indicator-list-react-component").on("click", ".collected-data__link", function(e) {
    e.preventDefault();
    let url = $(this).attr("href");
    url += "?modal=1";
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();

    $("#indicator_collected_data_modal_content").load(url);
    $("#indicator_collecteddata_div").modal('show');
});

// Open the IndicatorUpdate (Add targets btn in results section (HTML)) Form in a modal
$("#indicator-list-react-component").on("click", ".indicator-link[data-tab]", function(e) {
    e.preventDefault();
    let url = $(this).attr("href");
    url += "?modal=1";
    let tab = $(this).data("tab");
    if (tab && tab != '' && tab != undefined && tab != 'undefined') {
        url += "&targetsactive=true";
    }
    $("#indicator_modal_content").empty();
    $("#modalmessages").empty();

    $("#indicator_modal_content").load(url);
    $("#indicator_modal_div").modal('show');

});

// when indicator update modal is closed, update targets
$('#indicator_modal_div').on('hide.bs.modal', function (e) {
    let form = $(this).find('form');
    let form_action = form.attr('action').split('/');
    let indicator_id = parseInt(form_action[form_action.length -2]);

    eventBus.emit('reload-indicator', indicator_id);

    if (rootStore.resultsMap.has(indicator_id)) {
        eventBus.emit('load-indicator-results', indicator_id);
    }
});

// When "add results" modal is closed, the targets data needs refreshing
// the indicator itself also needs refreshing for the gas tank gauge
$('#indicator_collecteddata_div').on('hide.bs.modal', function (e) {
    let recordchanged = $(this).find('form').data('recordchanged');
    if (recordchanged === true) {
        let indicator_id = $(this).find('form #id_indicator').val();
        eventBus.emit('load-indicator-results', indicator_id);
        eventBus.emit('reload-indicator', indicator_id);
    }
});
