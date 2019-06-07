import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import eventBus from '../../../eventbus';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import {IndicatorFilterType} from "../models";
import Select from 'react-select';


library.add(faCaretDown, faCaretRight);


function getStatusIndicatorString(filterType, indicatorCount) {
    let fmts;
    switch (filterType) {
        case IndicatorFilterType.missingTarget:
            // # Translators: The number of indicators that do not have targets defined on them
            fmts = ngettext("%s indicator has missing targets", "%s indicators have missing targets", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.missingResults:
            // # Translators: The number of indicators that no one has entered in any results for
            fmts = ngettext("%s indicator has missing results", "%s indicators have missing results", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.missingEvidence:
            // # Translators: The number of indicators that contain results that are not backed up with evidence
            fmts = ngettext("%s indicator has missing evidence", "%s indicators have missing evidence", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.aboveTarget:
            // # Translators: shows what number of indicators are a certain percentage above target. Example: 3 indicators are >15% above target
            fmts = ngettext("%s indicator is >15% above target", "%s indicators are >15% above target", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.belowTarget:
            // # Translators: shows what number of indicators are a certain percentage below target. Example: 3 indicators are >15% below target
            fmts = ngettext("%s indicator is >15% below target", "%s indicators are >15% below target", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
        case IndicatorFilterType.onTarget:
            // # Translators: shows what number of indicators are within a set range of target. Example: 3 indicators are on track
            fmts = ngettext("%s indicator is on track", "%s indicators are on track", indicatorCount);
            return interpolate(fmts, [indicatorCount]);

        default:
            // # Translators: the number of indicators in a list. Example: 3 indicators
            fmts = ngettext("%s indicator", "%s indicators", indicatorCount);
            return interpolate(fmts, [indicatorCount]);
    }
}



@observer
class StatusHeader extends React.Component {
    constructor(props) {
        super(props);
        this.onShowAllClick = (e) => {
            e.preventDefault();
            eventBus.emit('nav-clear-all-indicator-filters');
        };
    }

    render() {
        const {
            indicatorCount,
            programId,
            currentIndicatorFilter,
            filterApplied,
            readonly,
        } = this.props;

        return <div className="indicators-list__header">
            <h3 className="no-bold">
                <span id="indicators-list-title">{getStatusIndicatorString(currentIndicatorFilter, indicatorCount)} </span>

                {filterApplied &&
                <a href="#" id="show-all-indicators" onClick={this.onShowAllClick}>
                    <small>{gettext('Show all')}</small>
                </a>
                }
            </h3>
            <div>
            {!readonly &&
            <a role="button" className="btn-link btn-add" onClick={e => openCreateIndicatorFormModal(programId)}>
                <i className="fas fa-plus-circle"/> {gettext("Add indicator")}
            </a>
            }
            </div>
        </div>
    }
}


@observer
class IndicatorFilter extends React.Component{
    onSelection = (selectedObject) => {
        let selectedIndicatorId = selectedObject ? selectedObject.value : null;

        if (selectedIndicatorId) {
            eventBus.emit('nav-select-indicator-to-filter', selectedIndicatorId);
        }
    };

    onGroupingSelection = (selected) => {
        this.props.uiStore.setGroupBy(selected.value);
    }

    render() {
        const indicators = this.props.rootStore.indicatorStore.indicators;
        const selectedIndicatorId = this.props.uiStore.selectedIndicatorId;

        const indicatorSelectOptions = indicators.map(i => {
            return {
                value: i.id,
                label: i.name,
            }
        });

        let selectedValue = null;
        if (selectedIndicatorId) {
            selectedValue = indicatorSelectOptions.find(i => i.value === selectedIndicatorId);
        }

        const indicatorGroupingOptions = this.props.uiStore.groupByOptions;
        const groupingValue = this.props.uiStore.selectedGroupByOption;
        return <nav className="list__filters list__filters--block-label" id="id_div_indicators">
            <div className="form-group">
                <label className="">
                    {gettext("Find an indicator:")}
                </label>
                <div className="">
                    <Select
                        options={indicatorSelectOptions}
                        value={selectedValue}
                        isClearable={false}
                        placeholder={gettext('None')}
                        onChange={this.onSelection}
                    />
                </div>
            </div>
            {!this.props.rootStore.oldStyleLevels &&
            <React.Fragment>
                <div className="form-group">
                    <label className="">
                        {gettext("Group indicators:")}
                    </label>
                    <div className="">
                        <Select
                               options={indicatorGroupingOptions}
                               value={groupingValue}
                               isClearable={false}
                               onChange={this.onGroupingSelection}
                        />
                    </div>
                </div>
            </React.Fragment>}
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
        const program = this.props.program;
        const programReportingPeriodEndDate = new Date(program.reporting_period_end);
        const resultsMap = this.props.resultsMap;

        return <table className="table indicators-list">
            <thead>
            <tr className="table-header">
                <th className="" id="id_indicator_name_col_header">{gettext("Indicator")}</th>
                <th className="" id="id_indicator_buttons_col_header">&nbsp;</th>
                {this.props.oldStyleLevels && <th className="" id="id_indicator_level_col_header">{gettext("Level")}</th>}
                <th className="" id="id_indicator_unit_col_header">{gettext("Unit of measure")}</th>
                <th className="text-right" id="id_indicator_baseline_col_header">{gettext("Baseline")}</th>
                <th className="text-right" id="id_indicator_target_col_header">{gettext("Target")}</th>
            </tr>
            </thead>

            <tbody>
            {indicators.map(indicator => {
                const resultsExist = resultsMap.has(indicator.id);
                const resultsStr = resultsMap.get(indicator.id);
                const targetPeriodLastEndDate = indicator.target_period_last_end_date ? new Date(indicator.target_period_last_end_date) : null;
                // ^^^ Because calling Date() on null returns the current date, and we actually need null!
                const displayFunc = (parseInt(indicator.unit_of_measure_type) == 2) ?
                        (val) => val ? `${val}%` : '' :
                        (val) => val ? `${val}` : '';
                const numberCellFunc = (val) => {
                    if (val == '' || isNaN(parseFloat(val))) {
                        return '';
                    }
                    val = parseFloat(val).toFixed(2);
                    if (val.slice(-2) == "00") {
                        return displayFunc(val.slice(0, -3));
                    } else if (val.slice(-1) == "0") {
                        return displayFunc(val.slice(0, -1));
                    }
                    return displayFunc(val);
                }
                return <React.Fragment key={indicator.id}>
                    <tr className={classNames("indicators-list__row", "indicators-list__indicator-header", {
                        "is-highlighted": indicator.just_created,
                        "is-expanded": resultsExist
                    })}>
                        <td>
                            <a href="#"
                               className="indicator_results_toggle btn btn-link text-left"
                               onClick={(e) => this.onIndicatorResultsToggleClick(e, indicator.id)}
                            >
                                <FontAwesomeIcon icon={resultsExist ? 'caret-down' : 'caret-right'} />
                                <strong>
                                    { indicator.number_display ? indicator.number_display + ':' : indicator.number }
                                </strong>&nbsp;
                                <span className="indicator_name">{ indicator.name }</span>
                            </a>

                            {indicator.key_performance_indicator &&
                            <span className="badge">KPI</span>
                            }

                            {targetPeriodLastEndDate && programReportingPeriodEndDate > targetPeriodLastEndDate &&
                            <a href={`/indicators/indicator_update/${indicator.id}/`}
                               className="indicator-link color-red missing_targets"
                               data-toggle="modal" data-target="#indicator_modal_div"
                               data-tab="targets">
                                <i className="fas fa-bullseye"/> Missing targets
                            </a>
                            }
                        </td>
                        <td>
                            <a href="#" className="indicator-link"
                               onClick={(e) => this.onIndicatorUpdateClick(e, indicator.id)}><i
                                className="fas fa-cog"/></a>
                        </td>
                        { this.props.oldStyleLevels && <td>{ indicator.old_level }</td> }
                        <td>{indicator.unit_of_measure}</td>
                        <td className="text-right">{ numberCellFunc(indicator.baseline) }</td>
                        <td className="text-right">{ numberCellFunc(indicator.lop_target_active) }</td>
                    </tr>

                    {resultsExist &&
                    <tr className="indicators-list__row indicators-list__indicator-body">
                        <td colSpan="6" ref={el => $(el).find('[data-toggle="popover"]').popover({html:true})}>
                            {/* result_table.html container */}
                                <div dangerouslySetInnerHTML={{__html: resultsStr}} />
                        </td>
                    </tr>
                    }
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
    const selectedIndicatorId = props.uiStore.selectedIndicatorId;
    const sortByChain = props.uiStore.groupByChain;
    // Either a gas gauge filter is applied, or an indicator has been selected, but not both

    // apply gas gauge filter
    let filteredIndicators = indicatorStore.filterIndicators(currentIndicatorFilter);

    filteredIndicators = indicatorStore.sortIndicators(
        props.rootStore.oldStyleLevels, sortByChain, filteredIndicators);

    if (selectedIndicatorId) {
        filteredIndicators = filteredIndicators.filter((i) => i.id == selectedIndicatorId);
    }

    return <React.Fragment>
        <StatusHeader indicatorCount={filteredIndicators.length}
                      programId={program.id}
                      currentIndicatorFilter={currentIndicatorFilter}
                      filterApplied={currentIndicatorFilter || selectedIndicatorId}
                      readonly={props.readonly}/>

        <IndicatorFilter uiStore={props.uiStore} rootStore={props.rootStore} />

        {program.does_it_need_additional_target_periods &&
            <div id="id_missing_targets_msg" className="color-red">
                <i className="fas fa-bullseye"/>&nbsp;
                {gettext('Some indicators have missing targets. To enter these values, click the target icon near the indicator name.')}
            </div>
        }

        <IndicatorListTable indicators={filteredIndicators} resultsMap={resultsMap}
                            program={program} oldStyleLevels={ props.rootStore.oldStyleLevels } />
    </React.Fragment>
});
