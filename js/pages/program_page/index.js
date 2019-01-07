import React from 'react';
import ReactDOM from 'react-dom';
import eventBus from '../../eventbus';

import {IndicatorList} from './components/indicator_list';
import {ProgramMetrics} from './components/program_metrics';
import {ProgramPageStore, ProgramPageUIStore} from './models';

import './pinned_reports';

// console.log(jsContext);

/*
 * Model/Store setup
 */
const rootStore = new ProgramPageStore(jsContext.indicators, jsContext.program);
const uiStore = new ProgramPageUIStore();

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
    let url = `/indicators/collected_data_table/${indicatorId}/${rootStore.program.id}/`;

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

    uiStore.setIndicatorFilter(indicatorFilter);
});

// clear all gas tank and indicator select filters
eventBus.on('clear-all-indicator-filters', () => {
    uiStore.clearIndicatorFilter();
    eventBus.emit('select-indicators-to-filter', []);
    eventBus.emit('close-all-indicators');
});

// filter down by selecting individual indicator
eventBus.on('select-indicators-to-filter', (selectedIndicatorIds) => {
    // clear gauge tank filters
    uiStore.clearIndicatorFilter();

    uiStore.setSelectedIndicatorIds(selectedIndicatorIds);

    // Open up results pane as well
    selectedIndicatorIds.forEach(id => eventBus.emit('load-indicator-results', id));
});

// close all expanded indicators in the table
eventBus.on('close-all-indicators', () => {
    rootStore.deleteAllResultsHTML();
});


/*
 * React components on page
 */

ReactDOM.render(<IndicatorList rootStore={rootStore} uiStore={uiStore}/>,
    document.querySelector('#indicator-list-react-component'));

ReactDOM.render(<ProgramMetrics rootStore={rootStore}
                                uiStore={uiStore}
                                indicatorOnScopeMargin={jsContext.indicator_on_scope_margin}/>,
    document.querySelector('#program-metrics-react-component'));

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
