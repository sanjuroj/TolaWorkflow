import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {IndicatorFilterType} from "../models";
import {Select} from '../../../components/bootstrap_multiselect';

library.add(faCaretDown, faCaretRight);


function getStatusIndicatorString(filterType, indicatorCount) {
    let fmts;
    switch (filterType) {
        case IndicatorFilterType.missingTarget:
            // Translators: The number of indicators that do not have targets defined on them
            fmts = ngettext("%s indicator has missing targets", "%s indicators have missing targets", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.missingResults:
            // Translators: The number of indicators that no one has entered in any results for
            fmts = ngettext("%s indicator has no results", "%s indicators have no results", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.missingEvidence:
            // Translators: The number of indicators that contain results that are not backed up with evidence
            fmts = ngettext("%s indicator has results without evidence", "%s indicators have results without evidence", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.aboveTarget:
            // Translators: shows what number of indicators are a certain percentage above target. Example: 3 indicators are >15% above target
            fmts = ngettext("%s indicator is >15% above target", "%s indicators are >15% above target", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.belowTarget:
            // Translators: shows what number of indicators are a certain percentage below target. Example: 3 indicators are >15% below target
            fmts = ngettext("%s indicator is >15% below target", "%s indicators are >15% below target", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.onTarget:
            // Translators: shows what number of indicators are within a set range of target. Example: 3 indicators are on track
            fmts = ngettext("%s indicator is on track", "%s indicators are on track", indicatorCount);
            return interpolate(fmts, [indicatorCount]);

        default:
            // Translators: the number of indicators in a list. Example: 3 indicators
            fmts = ngettext("%s indicator", "%s indicators", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
    }
}



@observer
class StatusHeader extends React.Component {
    constructor(props) {
        super(props);

        this.onShowAllClick = this.onShowAllClick.bind(this);
    }

    onShowAllClick(e) {
        e.preventDefault();
        eventBus.emit('clear-all-indicator-filters');
    }

    render() {
        const {
            indicatorCount,
            programId,
            currentIndicatorFilter,
            filterApplied,
        } = this.props;

        return <div className="indicators-list__header">
            <h3 className="no-bold">
                <span id="indicators-list-title">{getStatusIndicatorString(currentIndicatorFilter, indicatorCount)} </span>

                {filterApplied &&
                <a href="#" id="show-all-indicators" onClick={this.onShowAllClick}>
                    <small>Show all</small>
                </a>
                }
            </h3>
            <div>
                <a href={`/indicators/indicator_create/${programId}`} role="button" className="btn-link btn-add"><i
                    className="fas fa-plus-circle"/> {gettext("Add indicator")}</a>
            </div>
        </div>
    }
}


@observer
class IndicatorFilter extends React.Component{
    render() {
        const indicators = this.props.rootStore.indicatorStore.indicators;
        const selectedIndicatorIds = this.props.uiStore.selectedIndicatorIds;

        const indicatorSelectOptions = indicators.map(i => {
            return {
                value: i.id,
                label: i.name,
            }
        });

        return <nav className="list__filters list__filters--inline-label" id="id_div_indicators">
            <label className="filters__label">
                {gettext("Find an indicator:")}
            </label>
            <div className="filters__control">
                <Select forceEmptySelect={true}
                        options={indicatorSelectOptions}
                        selected={selectedIndicatorIds}
                        onSelectCb={(selectedIndicatorIds) => eventBus.emit('select-indicators-to-filter', selectedIndicatorIds)} />
            </div>
        </nav>;
    }
}


@observer
class IndicatorListTable extends React.Component {
    constructor(props) {
        super(props);

        this.onIndicatorUpdateClick = this.onIndicatorUpdateClick.bind(this);
        this.onIndicatorResultsToggleClick = this.onIndicatorResultsToggleClick.bind(this);
    }

    onIndicatorUpdateClick(e, indicatorId) {
        e.preventDefault();

        eventBus.emit('open-indicator-update-modal', indicatorId);
    }

    onIndicatorResultsToggleClick(e, indicatorId) {
        e.preventDefault();

        const resultsMap = this.props.resultsMap;

        if (resultsMap.has(indicatorId)) {
            eventBus.emit('delete-indicator-results', indicatorId);
        } else {
            eventBus.emit('load-indicator-results', indicatorId);
        }
    }

    render() {
        const indicators = this.props.indicators;
        const resultsMap = this.props.resultsMap;

        return <table className="table indicators-list">
            <thead>
            <tr className="table-header">
                <th className="" id="id_indicator_name_col_header">{gettext("Indicator")}</th>
                <th className="" id="id_indicator_buttons_col_header">&nbsp;</th>
                <th className="" id="id_indicator_level_col_header">{gettext("Level")}</th>
                <th className="" id="id_indicator_unit_col_header">{gettext("Unit of measure")}</th>
                <th className="text-right" id="id_indicator_baseline_col_header">{gettext("Baseline")}</th>
                <th className="text-right" id="id_indicator_target_col_header">{gettext("Target")}</th>
            </tr>
            </thead>

            <tbody>
            {indicators.map(indicator => {
                const resultsExist = resultsMap.has(indicator.id);
                const resultsStr = resultsMap.get(indicator.id);

                return <React.Fragment key={indicator.id}>
                    <tr className={classNames("indicators-list__row", "indicators-list__indicator-header", {
                        "is-highlighted": indicator.just_created,
                        "is-expanded": resultsExist
                    })}>
                        <td>
                            <a href="#"
                               className="indicator_results_toggle"
                               onClick={(e) => this.onIndicatorResultsToggleClick(e, indicator.id)}
                            >
                                <FontAwesomeIcon icon={resultsExist ? 'caret-down' : 'caret-right'} />
                                <strong>{indicator.number}</strong>
                                <span className="indicator_name">{indicator.name}</span>
                            </a>

                            {indicator.key_performance_indicator &&
                            <span className="badge">KPI</span>
                            }

                            {/* this seems to be copy n pasted from the indicator list view, but not set in the program view */}
                            {/* it's unclear if this is even part of the spec for program page */}

                            {/*{program && program.reporting_period_end > indicator.target_period_last_end_date &&*/}
                            {/*<a href={`/indicators/indicator_update/${indicator.id}/`}*/}
                               {/*className="indicator-link color-red missing_targets"*/}
                               {/*data-toggle="modal" data-target="#indicator_modal_div"*/}
                               {/*data-tab="targets">*/}
                                {/*<i className="fas fa-bullseye"/> Missing targets*/}
                            {/*</a>*/}
                            {/*}*/}
                        </td>
                        <td>
                            <a href="#" className="indicator-link"
                               onClick={(e) => this.onIndicatorUpdateClick(e, indicator.id)}><i
                                className="fas fa-cog"/></a>
                        </td>
                        <td>{indicator.level}</td>
                        <td>{indicator.unit_of_measure}</td>
                        <td className="text-right">{indicator.baseline_display}</td>
                        <td className="text-right">{indicator.lop_target_display}</td>
                    </tr>

                    <tr className="indicators-list__row indicators-list__indicator-body hiddenRow">
                        <td colSpan="6" className="p-0 bg-blue border-0">
                            {/* collected_data_table.html container */}
                            {resultsExist &&
                                <div dangerouslySetInnerHTML={{__html: resultsStr}} />
                            }
                        </td>
                    </tr>
                </React.Fragment>

            })}
            </tbody>
        </table>
    }
}


export const IndicatorList = observer(function (props) {
    const program = props.rootStore.program;
    const indicatorStore = props.rootStore.indicatorStore;
    // const indicators = props.rootStore.indicatorStore.indicators;
    const resultsMap = props.rootStore.resultsMap;
    const currentIndicatorFilter = props.uiStore.currentIndicatorFilter;
    const selectedIndicatorIds = props.uiStore.selectedIndicatorIds;

    // Either a gas gauge filter is applied, or an indicator has been selected, but not both

    // apply gas gauge filter
    let filteredIndicators = indicatorStore.filterIndicators(currentIndicatorFilter);

    if (selectedIndicatorIds.length > 0) {
        filteredIndicators = filteredIndicators.filter((i) => selectedIndicatorIds.indexOf(i.id) > -1);
    }

    return <React.Fragment>
        <StatusHeader indicatorCount={filteredIndicators.length}
                      programId={program.id}
                      currentIndicatorFilter={currentIndicatorFilter}
                      filterApplied={currentIndicatorFilter || selectedIndicatorIds.length > 0}/>

        <IndicatorFilter uiStore={props.uiStore} rootStore={props.rootStore} />

        {program.does_it_need_additional_target_periods &&
            <div id="id_missing_targets_msg" className="color-red">
                <i className="fas fa-bullseye"/>&nbsp;
                {gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')}
            </div>
        }

        <IndicatorListTable indicators={filteredIndicators} resultsMap={resultsMap} />
    </React.Fragment>
});
