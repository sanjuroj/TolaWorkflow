import React from 'react';
import { observer, inject } from 'mobx-react';
import { SingleReactSelect, SingleSelect, DateSelect } from '../../../../components/selectWidgets';


/**  false && <Selectors.PeriodSelect />}
                { false && <Selectors.TimeFrameRadio />}
                { false && <Selectors.StartDateSelect />}
                { false && <Selectors.EndDateSelect />}
                { false && filterStore.oldLevels === false &&
                    <Selectors.GroupingSelect />*/
/**
 * input-ready filtering single-select for Programs available to user in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

const ProgramSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return (
            <SingleReactSelect
                label={ gettext('Program') }
                options={ filterStore.programOptions }
                value={ filterStore.selectedProgramOption }
                update={ selected => { filterStore.programId = selected.value } }
            />
        );
    })
);

/**
 * input-ready filtering single-select for Frequencies available for selected program in IPTT Report
 * uses SingleSelect in js/components/selectWidgets
 */

const FrequencySelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return (
            <SingleReactSelect
                label={
                    filterStore.isTVA ?
                        gettext('Target periods') :
                        gettext('Time periods')
                }
                options={ filterStore.frequencyOptions }
                value={ filterStore.selectedFrequencyOption }
                update={ selected => { filterStore.frequencyId = selected.value } }
            />
        );
    })
);

/**
 * Show All radio / Most Recent radio / number of Most Recent periods input combo component
 * For selecting start and end of IPTT report
 * controlled component - logic to update date selects in filterStore model (../models)
 */
@inject('filterStore')
@observer
class TimeframeRadio extends React.Component {
    checkMostRecent = () => {
        //default value of 2 in case of clicking "most recent" radio box - default behavior
        this.props.filterStore.mostRecent = 2;
    }
    updateMostRecentCount = (e) => {
        this.props.filterStore.mostRecent = e.target.value;
    }
    render() {
        return <div className="form-row mb-3">
                    <div className="col-sm-4">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.filterStore.showAll }
                                       disabled={ this.props.filterStore.periodsDisabled }
                                       onChange={ () => {this.props.filterStore.showAll = true;} }
                                       />
                            </span>
                            <label className="form-check-label">
                                {
                                    /* # Translators: option to show all periods for the report */
                                    gettext('Show all')
                                }
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4 p-0">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.filterStore.mostRecent }
                                       disabled={ this.props.filterStore.periodsDisabled }
                                       onChange={ this.checkMostRecent }
                                       />
                            </span>
                            <label className="form-check-label">
                                {
                                    /* # Translators: option to show a number of recent periods for the report */
                                    gettext('Most recent')
                                }
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <input type="number" className="form-control"
                               value={ this.props.filterStore.mostRecent || ''}
                               disabled={ this.props.filterStore.periodsDisabled }
                               onChange={ this.updateMostRecentCount }
                               />
                    </div>
               </div>;
    }
}

/**
 * non input-ready dropdown for periods available for Start of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */
const StartDateSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <DateSelect
                    label={
                        /* # Translators: menu for selecting the start date for a report */
                        gettext('Start')
                    }
                    disabled={ filterStore.periodsDisabled }
                    value={ filterStore.startPeriod || '' }
                    update={ e => {filterStore.startPeriod = e.target.value;} }
                    options={ filterStore.startOptions }
                />
    })
);

/**
 * non input-ready dropdown for periods available for End of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */
const EndDateSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        return <DateSelect
                    label={
                        /* # Translators: menu for selecting the end date for a report */
                        gettext('End')
                    }
                    disabled={ filterStore.periodsDisabled }
                    value={ filterStore.endPeriod || '' }
                    update={ e => {filterStore.endPeriod = e.target.value;} }
                    options={ filterStore.endOptions }
                />
    })
);

/**
 * single select with non dynamic options (dynamic labeling based on program's name for tier 2)
 * selects "grouping" or "chaining" based display of indicators in report and filter dropdowns
 */
const GroupingSelect = inject('filterStore')(
    observer(({ filterStore }) => {
        let options = [
            <option value="1" key={1}>{ filterStore.resultChainFilterLabel }</option>,
            <option value="2" key={2}>{
                /* # Translators: refers to grouping the report by the level of the indicator */
                gettext('by Level')
            }</option>
        ];;
        return <SingleSelect
                    label={
                        /* # Translators: menu for selecting how rows are grouped in a report */
                        gettext('Group indicators')
                    }
                    disabled={ filterStore.groupByDisabled }
                    value={ filterStore.groupBy }
                    update={ e => { filterStore.groupBy = e.target.value;} }
                    options={ options }
                />
    })
);


export { ProgramSelect, FrequencySelect, TimeframeRadio, StartDateSelect, EndDateSelect, GroupingSelect };