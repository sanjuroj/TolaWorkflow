import React from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Select, { components } from 'react-select';
import { CheckboxGroupHeading } from 'react-multiselect-checkboxes/lib/CheckboxGroup';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

const programOptions = [
    { value: 1, label: 'program 1'},
    { value: 2, label: 'program 2'}
];
const selectedProgram = {value: 1, label: 'program 1'};

const IPTTSelectWrapper = (props) => {
    return <div className="form-row mb-3">
                <label className="col-form-label text-uppercase">
                    { props.label }
                </label>
                { props.children }
            </div>;
}


@inject('labels', 'rootStore')
@observer
class ProgramSelect extends React.Component {
    selectProgram = (selected) => {
        this.props.rootStore.setProgramId(selected.value);
    }
    render() {
        return <IPTTSelectWrapper label={ this.props.labels.programSelect }>
                    <Select options={ this.props.rootStore.programOptions }
                            value={ this.props.rootStore.selectedProgramOption }
                            onChange={ this.selectProgram }
                            className="iptt-react-select" />
               </IPTTSelectWrapper>;
    }
}

@inject('labels', 'rootStore')
@observer
class PeriodSelect extends React.Component {
    selectFrequency = (selected) => {
        this.props.rootStore.setFrequencyId(selected.value);
    }
    render() {
        const label = this.props.rootStore.isTVA
                ? this.props.labels.periodSelect.tva
                : this.props.labels.periodSelect.timeperiods;
        return <IPTTSelectWrapper label={ label }>
                    <Select options={ this.props.rootStore.frequencyOptions }
                            value={ this.props.rootStore.selectedFrequencyOption }
                            onChange={ this.selectFrequency }
                            className="iptt-react-select" />
               </IPTTSelectWrapper>;
    }
}

@inject('rootStore')
@observer
class DateSelect extends React.Component {
    @computed get options() {
        if (this.props.rootStore.selectedFrequencyId == 7) {
            return Object.entries(this.props.rootStore.periodOptions).map(
                ([optgroupLabel, options], index) => {
                    return <optgroup label={optgroupLabel} key={index}>
                        {options.map(
                            (option) => <option value={option.value} key={option.value}>{option.label}</option>
                        )}
                    </optgroup>;
                }
            );
        } else {
            return this.props.rootStore.periodOptions.map(
                (option) => <option value={option.value} key={option.value}>{option.label}</option>
            );
        }
    }
    render() {
        return <IPTTSelectWrapper label={ this.props.label }>
                    <select className="form-control"
                            value={ this.props.value }
                            onChange={ this.props.onChange }
                            disabled={ this.props.rootStore.selectedFrequencyId == 2 || this.props.rootStore.selectedFrequencyId == 1 }>
                        { this.options }
                    </select>
                </IPTTSelectWrapper>;
    }
}

const StartDateSelect = inject('labels', 'rootStore')(
    observer(({labels, rootStore}) => {
        const selectHandler = (e) => { rootStore.setStartPeriod(e.target.value); }
        return <DateSelect label={ labels.startPeriod }
                           value={ rootStore.startPeriod }
                           onChange={ selectHandler } />
    })
);

const EndDateSelect = inject('labels', 'rootStore')(
    observer(({labels, rootStore}) => {
        const selectHandler = (e) => { rootStore.setEndPeriod(e.target.value); }
        return <DateSelect label={ labels.endPeriod }
                           value={ rootStore.endPeriod }
                           onChange={ selectHandler } />
    })
);

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

@inject('labels', 'rootStore')
@observer
class GroupingSelect extends React.Component {
    onChange = (e) => {
        this.props.rootStore.levelGrouping = (e.target.value == 1);
    }
    
    render() {
        return (
            <IPTTSelectWrapper label={ this.props.labels.levelGrouping.label }>
                <select className="form-control"
                        value={ (this.props.rootStore.levelGrouping ? 1 : 0) }
                        onChange={ this.onChange }>
                        <option value="0">{ this.props.rootStore.selectedProgram.resultChainFilter }</option>
                        <option value="1">{ this.props.labels.levelGrouping.group }</option>
                </select>
            </IPTTSelectWrapper>
        );
    }
}

const IPTTMultiSelectWrapper = (props) => {
    return <div className="form-row mb-2 iptt-react-select-row">
                <label className="col-form-label text-uppercase">
                    { props.label }
                </label>
                { props.children }
            </div>;
}

const GroupHeading = (props) => {
    if (props.children == '') {
        return <div></div>;
    } else {
        return (
            <React.Fragment>
                <hr style={{ margin: '3px 0px 0px 0px' }} />
                <div style={{ textTransform: 'uppercase',
                              paddingLeft: '4px',
                              marginBottom: '2px'}}>
                    { props.children }
                </div>
            </React.Fragment>
            );
    }
}

@inject('labels', 'rootStore')
@observer
class LevelSelect extends React.Component {
    getOptions = () => {
        let tiers = this.props.rootStore.selectedProgram.reportLevelTiers;
        let chains = this.props.rootStore.selectedProgram.reportLevelChains;
        return [
            {label: '',
             options: tiers},
             {label: 'Outcome chains',
             options: chains}
        ];
    }
    getValue = () => {
        if (this.props.rootStore.levelFilters && this.props.rootStore.levelFilters.length > 0) {
            return this.props.rootStore.levelFilters;
        } else if (this.props.rootStore.tierFilters && this.props.rootStore.tierFilters.length > 0) {
            return this.props.rootStore.tierFilters;
        } else {
            return [];
        }
    }
    
    updateLevelFilters = (selected) => {
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

    render() {
        const customStyles = {
            option: (provided, state) => ({
                ...provided,
                padding: '1px 12px',
                display: 'inline-block'
            }),
            container: (provided, state) => ({
                ...provided,
                backgroundColor: '#f5f5f5'
            })
        };
        const formatOptionLabel = (props) => {
            return <div style={{ display: "inline-block" , float: "right", width: "90%"}}>{props.label}</div>;
        }
        return <IPTTMultiSelectWrapper label={this.props.labels.levelSelect}>
                    <ReactMultiSelectCheckboxes
                            options={ this.getOptions() }
                            isMulti={ true }
                            styles={ customStyles }
                            formatOptionLabel={ formatOptionLabel }
                            components={{ GroupHeading }}
                            value={ this.getValue() }
                            onChange={ this.updateLevelFilters } />
                </IPTTMultiSelectWrapper>;
    }
}

@inject('labels', 'rootStore')
@observer
class SiteSelect extends React.Component {
    updateSiteFilters = (selected) => {
        this.props.rootStore.setSiteFilters(selected);
    }
    render() {
        return <IPTTMultiSelectWrapper label={this.props.labels.siteSelect}>
                    <ReactMultiSelectCheckboxes
                            options={this.props.rootStore.selectedProgram.reportSites}
                            isMulti={ true }
                            value={ this.props.rootStore.siteFilters }
                            onChange={ this.updateSiteFilters } />
                </IPTTMultiSelectWrapper>
    }
}

@inject('labels', 'rootStore')
@observer
class TypeSelect extends React.Component {
    updateTypeFilters = (selected) => {
        this.props.rootStore.setTypeFilters(selected);
    }
    render() {
        return <IPTTMultiSelectWrapper label={this.props.labels.typeSelect}>
                    <ReactMultiSelectCheckboxes
                            options={this.props.rootStore.selectedProgram.reportTypes}
                            isMulti={ true }
                            value={ this.props.rootStore.typeFilters }
                            onChange={ this.updateTypeFilters } />
                </IPTTMultiSelectWrapper>
    }
}

@inject('labels', 'rootStore')
@observer
class SectorSelect extends React.Component {
    updateSectorFilters = (selected) => {
        this.props.rootStore.setSectorFilters(selected);
    }
    render() {
        return <IPTTMultiSelectWrapper label={this.props.labels.sectorSelect}>
                    <ReactMultiSelectCheckboxes
                            options={this.props.rootStore.selectedProgram.reportSectors}
                            isMulti={ true }
                            value={ this.props.rootStore.sectorFilters }
                            onChange={ this.updateSectorFilters } />
                </IPTTMultiSelectWrapper>
    }
}


@inject('labels', 'rootStore')
@observer
class IndicatorSelect extends React.Component {
    updateIndicatorFilters = (selected) => {
        this.props.rootStore.setIndicatorFilters(selected);
    }
    render() {
        return <IPTTMultiSelectWrapper label={this.props.labels.indicatorSelect}>
                    <ReactMultiSelectCheckboxes
                            options={this.props.rootStore.selectedProgram.reportIndicatorsOptions}
                            isMulti={ true }
                            components={{ GroupHeading }}
                            value={ this.props.rootStore.indicatorFilters }
                            onChange={ this.updateIndicatorFilters } />
                </IPTTMultiSelectWrapper>
    }
}


export const IPTTFilterForm = inject('labels')(
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