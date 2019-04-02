import React from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Select from 'react-select';
import { CheckboxGroupHeading } from 'react-multiselect-checkboxes/lib/CheckboxGroup';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { IPTTMultiselectCheckboxWrapper, IPTTSelect, DateSelect, IPTTSelectWrapper } from './selectWidgets';
import { uniqueId } from '../../../formUtils';

/**
 * input-ready filtering single-select for Programs available to user in IPTT Report
 * extends IPTTSelect in components/selectWidgets
 */
@inject('labels', 'rootStore')
@observer
class ProgramSelect extends IPTTSelect {
    get label() { return this.props.labels.programSelect;}
    get selectOptions() {
        return {
            options: this.props.rootStore.programOptions,
            value: this.props.rootStore.selectedProgramOption,
            onChange: selected => {this.props.rootStore.setProgramId(selected.value)}
        };
    }
}

/**
 * input-ready filtering single-select for Frequencies available for selected program in IPTT Report
 * extends IPTTSelect in components/selectWidgets
 */
@inject('labels', 'rootStore')
@observer
class PeriodSelect extends IPTTSelect {
    get label() { return this.props.rootStore.isTVA ? this.props.labels.periodSelect.tva
                                                    : this.props.labels.periodSelect.timeperiods; }
    get selectOptions() {
        return {
            options: this.props.rootStore.frequencyOptions,
            value: this.props.rootStore.selectedFrequencyOption,
            onChange: selected => {this.props.rootStore.setFrequencyId(selected.value)}
        };
    }
}

/**
 * non input-ready dropdown for periods available for Start of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */
const StartDateSelect = inject('labels', 'rootStore')(
    observer(({labels, rootStore}) => {
        const selectHandler = (e) => { rootStore.setStartPeriod(e.target.value); }
        return <DateSelect label={ labels.startPeriod }
                           value={ rootStore.startPeriod }
                           onChange={ selectHandler } />
    })
);

/**
 * non input-ready dropdown for periods available for End of IPTT Report select
 * composes DateSelect in components/selectWidgets
 */
const EndDateSelect = inject('labels', 'rootStore')(
    observer(({labels, rootStore}) => {
        const selectHandler = (e) => { rootStore.setEndPeriod(e.target.value); }
        return <DateSelect label={ labels.endPeriod }
                           value={ rootStore.endPeriod }
                           onChange={ selectHandler } />
    })
);

/**
 * Show All radio / Most Recent radio / number of Most Recent periods input combo component
 * For selecting start and end of IPTT report
 * controlled component - logic to update date selects in rootStore model (../models)
 */
@inject('labels', 'rootStore')
@observer
class TimeFrameRadio extends React.Component {
    checkMostRecent = () => {
        //default value of 2 in case of clicking "most recent" radio box - default behavior
        this.props.rootStore.setMostRecent(2);
    }
    updateMostRecentCount = (e) => {
        this.props.rootStore.setMostRecent(e.target.value);
    }
    render() {
        return <div className="form-row mb-3">
                    <div className="col-sm-4">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.rootStore.showAll }
                                       disabled={ !this.props.rootStore.timeframeEnabled }
                                       onChange={ this.props.rootStore.setShowAll }
                                       />
                            </span>
                            <label className="form-check-label">
                                { this.props.labels.showAll }
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4 p-0">
                        <div className="form-check form-check-inline pt-1">
                            <span className="form-check-input">
                                <input type="radio"
                                       checked={ this.props.rootStore.mostRecent !== null }
                                       disabled={ !this.props.rootStore.timeframeEnabled }
                                       onChange={ this.checkMostRecent }
                                       />
                            </span>
                            <label className="form-check-label">
                                { this.props.labels.mostRecent}
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <input type="number" className="form-control"
                               value={ this.props.rootStore.mostRecent || ''}
                               disabled={ !this.props.rootStore.timeframeEnabled }
                               onChange={ this.updateMostRecentCount }
                               />
                    </div>
               </div>;
    }
}

/**
 * single select with non dynamic options (dynamic labeling based on program's name for tier 2)
 * selects "grouping" or "chaining" based display of indicators in report and filter dropdowns
 * composes IPTTSelectWrapper from components/selectWidgets
 */
@inject('labels', 'rootStore')
@observer
class GroupingSelect extends React.Component {
    _id = "grouping-select1"
    onChange = (e) => {
        this.props.rootStore.setLevelGrouping(e.target.value);
    }
    
    render() {
        return (
            <IPTTSelectWrapper id={ this._id } label={ this.props.labels.levelGrouping.label }>
                <select className="form-control"
                        id={ this._id }
                        value={ (this.props.rootStore.levelGrouping ? 1 : 0) }
                        onChange={ this.onChange }>
                        <option value="0">{ this.props.rootStore.selectedProgram.resultChainFilter }</option>
                        <option value="1">{ this.props.labels.levelGrouping.group }</option>
                </select>
            </IPTTSelectWrapper>
        );
    }
}

/**
 * input-ready multi-select checkbox widget for filtering IPTT report by level
 * contains both "grouping" and "chaining" filtering options, displayed as two optgroups
 * labeling for second optgroup is based on Program's definition of tier 2 (stored in rootStore.selectedProgram)
 * extends IPTTMultiselectCheckboxWrapper (with helper functions for styling/labeling) in components/selectWidgets
 */
@inject('labels', 'rootStore')
@observer
class LevelSelect extends IPTTMultiselectCheckboxWrapper {
    get options() {
        let tiers = this.props.rootStore.selectedProgram.reportLevelTiers;
        let chains = this.props.rootStore.selectedProgram.reportLevelChains;
        if (tiers.length == 0 && chains.length == 0) {
            return [];
        }
        return [
            {label: '',
             options: tiers},
             {label: this.props.rootStore.selectedProgram.resultChainHeader,
             options: chains}
        ];
    }
    get value() {
        if (this.props.rootStore.levelFilters && this.props.rootStore.levelFilters.length > 0) {
            return this.props.rootStore.levelFilters;
        } else if (this.props.rootStore.tierFilters && this.props.rootStore.tierFilters.length > 0) {
            return this.props.rootStore.tierFilters;
        } else {
            return [];
        }
    }
    get label() {
        return this.props.labels.levelSelect;
    }
    
    onChange = (selected) => {
        let levelSelects = selected.filter(option => option.filterType == 'level');
        let tierSelects = selected.filter(option => option.filterType == 'tier');
        if (levelSelects.length > 0 && tierSelects.length > 0) {
            if (this.props.rootStore.tierFilters && this.props.rootStore.tierFilters.length > 0) {
                this.props.rootStore.setLevelFilters(levelSelects);
            } else {
                this.props.rootStore.setTierFilters(tierSelects);
            }
        } else if (levelSelects.length > 0) {
            this.props.rootStore.setLevelFilters(levelSelects);
        } else {
            this.props.rootStore.setTierFilters(tierSelects);
        }
    }
}

@inject('labels', 'rootStore')
@observer
class SiteSelect extends IPTTMultiselectCheckboxWrapper {
    onChange = (selected) => {
        this.props.rootStore.setSiteFilters(selected);
    }
    get value() {
        return this.props.rootStore.siteFilters;
    }
    get options() {
        return this.props.rootStore.selectedProgram.reportSites;
    }
    get label() {
        return this.props.labels.siteSelect;
    }
}


@inject('labels', 'rootStore')
@observer
class TypeSelect extends IPTTMultiselectCheckboxWrapper {
    onChange = (selected) => {
        this.props.rootStore.setTypeFilters(selected);
    }
    get options() {
        return this.props.rootStore.selectedProgram.reportTypes;
    }
    get value() {
        return this.props.rootStore.typeFilters;
    }
    get label() {
        return this.props.labels.typeSelect;
    }
}

@inject('labels', 'rootStore')
@observer
class SectorSelect extends IPTTMultiselectCheckboxWrapper {
    onChange = (selected) => {
        this.props.rootStore.setSectorFilters(selected);
    }
    get options() {
        return this.props.rootStore.selectedProgram.reportSectors;
    }
    get value() {
        return this.props.rootStore.sectorFilters;
    }
    get label() {
        return this.props.labels.sectorSelect;
    }
}


@inject('labels', 'rootStore')
@observer
class IndicatorSelect extends IPTTMultiselectCheckboxWrapper {
    onChange = (selected) => {
        this.props.rootStore.setIndicatorFilters(selected);
    }
    get options() {
        return this.props.rootStore.selectedProgram.reportIndicatorsOptions;
    }
    get value() {
        return this.props.rootStore.indicatorFilters;
    }
    get label() {
        return this.props.labels.indicatorSelect;
    }
}


const IPTTFilterForm = inject('labels')(
    observer(({labels}) => {
        return <nav id="id_iptt_report_filter">
                    <div className="p-3" id="filter-top">
                        <h3 className="filter-title text-title-case">{ labels.filterTitle }</h3>
                        <ProgramSelect />
                        <PeriodSelect />
                        <TimeFrameRadio />
                        <StartDateSelect />
                        <EndDateSelect />
                        <GroupingSelect />
                    </div>
                    <div id="filter-middle" className="p-3">
                        <LevelSelect />
                        <SiteSelect />
                        <TypeSelect />
                        <SectorSelect />
                        <IndicatorSelect />
                    </div>
                </nav>;
    })
);

export default IPTTFilterForm;