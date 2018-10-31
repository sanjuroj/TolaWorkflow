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
        $('.indicators-list__header > h3').text(list_title);
    });
});
