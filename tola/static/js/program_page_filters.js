function hide_row_factory(positive, target) {
    return function() {
        var this_show;
        if (target == "results_evidence") {
            this_show = $(this).data('has-evidence') * positive;
        } else if (target == "reported_results") {
            this_show = $(this).data('reported-results') * positive;
        } else if (target == "targets_defined") {
            this_show = $(this).data('defined-targets') * positive;
        }
        if (this_show == -1) {
            $(this).hide();
            $(this).next().hide();
        } else  {
            $(this).show();
            $(this).next().show();
        }
    }
}
$(document).ready(function() {
    var default_list_title = $('#indicators-list-title').text();
    $('.filter-trigger').on('click', function(e) {
        e.preventDefault();
        var target, positive, highlighted_tab, list_title;
        highlighted_tab = $(this);
        target = $(this).data('target');
        list_title = $(this).data('list-title');
        positive = $(this).data('target-positive');
        if (positive === 0) {
            return;
        }
        callback = hide_row_factory(positive, target);
        $('.indicators-list__indicator-header').each(callback);
        $('.gauge').removeClass('is-highlighted');
        highlighted_tab.addClass('is-highlighted');
        $('#indicators-list-title').text(list_title);
        $('#show-all-indicators').removeClass('is-display-none');
    });
    $('#show-all-indicators').on('click', function(e) {
        $('.gauge').removeClass('is-highlighted');
        $('#show-all-indicators').addClass('is-display-none');
        $('.indicators-list__indicator-header').show();
        $('#indicators-list-title').text(default_list_title);
    });
});
