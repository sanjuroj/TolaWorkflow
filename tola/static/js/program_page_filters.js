$(document).ready(function() {

    // State of what is currently being filtered
    let gas_tank_filter_target;
    let gas_tank_filter_target_positive;
    let over_under_filter = null;
    let selected_indicator_ids = [];
    let selected_indicator_levels = [];

    // Important selectors & attributes
    const indicators_select = $("#id_indicators"); // indicator search filter (sidebar)
    const show_all_link = $('#show-all-indicators');
    const indicators_list_title = $('#indicators-list-title');
    const indicator_list_row = $('.indicators-list__row');
    let list_title = indicators_select.data('list-title'); // Should this really be global?
    let default_list_title = $('#indicators-list-title').text();

    // Highlight gauge filter tab
    function highlightFilterTab(highlighted_tab, list_title) {
        $('.gauge').removeClass('is-highlighted');
        highlighted_tab.addClass('is-highlighted');
        indicators_list_title.text(list_title);
        show_all_link.show();
    }

    // Clear sidebar filters
    function clear_side_bar_filters() {
        // these do not trigger any callbacks
        indicators_select.multiselect('deselectAll', false);
        indicators_select.multiselect('updateButtonText');
        show_all_link.show();

        selected_indicator_ids = [];
        selected_indicator_levels = [];
    }

    // Clear gauge filters
    function clear_gauge_filters() {
        $('.gauge').removeClass('is-highlighted');
        show_all_link.hide();
        indicator_list_row.show();
        indicators_list_title.text(default_list_title);
        indicators_select.val('');
    }

    // Show only filtered rows
    function hide_row_factory(positive, target) {
        return function() {
            let elem = $(this);
            let this_show = 1;

            if (target === "results_evidence") {
                this_show = elem.data('has-evidence') * positive;
            } else if (target === "reported_results") {
                this_show = elem.data('reported-results') * positive;
            } else if (target === "targets_defined") {
                this_show = elem.data('defined-targets') * positive;
            }

            let indicator_id = elem.data('indicator-id'); // int;
            let indicator_level_ids = elem.data('indicator-level-ids'); // array of ints

            let hideElem = function() {
                elem.hide();
                elem.next().hide();
            };

            if (this_show <= 0) {
                hideElem();
            } else if (selected_indicator_ids.length > 0 && selected_indicator_ids.indexOf(indicator_id) < 0) {
                hideElem();
            } else if (selected_indicator_levels.length > 0 && !indicator_level_ids.some(function (r) {
                return selected_indicator_levels.indexOf(r) >= 0
            })) {
                hideElem();
            } else if (over_under_filter !== null && elem.data('over-under') !== over_under_filter) {
                hideElem();
            } else  {
                elem.show();
                elem.next().show();
            }
        }
    }

    function apply_filters_to_indicator_rows() {
        let callback = hide_row_factory(gas_tank_filter_target_positive, gas_tank_filter_target);
        indicator_list_row.each(callback);
    }

    // Hide "show all" link
    show_all_link.hide();

    // Apply top level gas tank filters
    $('.filter-trigger').on('click', function(e) {
        e.preventDefault();
        clear_gauge_filters();
        clear_side_bar_filters();

        let highlighted_tab = $(this);
        let target = $(this).data('target');
        let list_title = $(this).data('list-title');

        highlightFilterTab(highlighted_tab, list_title);
        // is there some way to do this without a callback where data(target) is [value]? like $(this).data{target, 1).hide()
        indicator_list_row.each(function(){
            if ($(this).data(target) == 1) {
                $(this).hide()
            } else {
                $(this).show()
            }
        });
    });

    // "show all" button
    show_all_link.on('click', function(e) {
        e.preventDefault();
        clear_gauge_filters();
        clear_side_bar_filters();

        indicator_list_row.show();
        $(this).hide();
    });

    // gauge band links (indicators on track gas tank)
    $('.filter-trigger--band').on('click', function (e) {
        e.preventDefault();
        clear_gauge_filters();
        clear_side_bar_filters();

        let elem = $(this);
        let highlighted_tab = elem.closest('.gauge');
        let list_title = elem.data('list-title');
        let over_under_filter = $(this).data('over-under-filter');

        highlightFilterTab(highlighted_tab, list_title);
        indicator_list_row.each(function(){
            if ($(this).data('over-under') == over_under_filter) {
                $(this).show()
            } else {
                $(this).hide()
            }
        });
    });

    let multiselectOptions = {
        includeSelectAllOption: true,
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        numberDisplayed: 1,
        maxHeight: 320,
        buttonClass: 'btn form-control',
        templates: {
            filter: '<li class="multiselect-item filter"><div class="input-group"><input class="form-control multiselect-search" type="text"></div></li>',
            filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="fas fa-times-circle"></i></button></span>',
        }
    };

    function on_indicators_change() {
        $('.gauge').removeClass('is-highlighted');
        selected_indicator_ids = indicators_select.find('option:selected').map(function() { return parseInt($(this).val()) }).get();
        apply_filters_to_indicator_rows();
        show_all_link.show();
        indicators_list_title.text(list_title);
    }

    indicators_select.multiselect(Object.assign(multiselectOptions, {
        onChange: on_indicators_change,
        onSelectAll: on_indicators_change,
        onDeselectAll: on_indicators_change,
    }));
});
