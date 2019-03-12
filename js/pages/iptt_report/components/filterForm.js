import React from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Select from 'react-select';

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

@inject('labels', 'rootStore')
@observer
class StartDateSelect extends React.Component {
    selectStartPeriod = (selected) => {
        this.props.rootStore.setStartPeriod(selected.target.value);
    }
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
        return <IPTTSelectWrapper label={ this.props.labels.startPeriod }>
                    <select className="form-control"
                            value={ this.props.rootStore.startPeriod }
                            onChange={ this.selectStartPeriod }>
                        { this.options }
                    </select>
                </IPTTSelectWrapper>;
    }
}

@inject('labels', 'rootStore')
@observer
class EndDateSelect extends React.Component {
    selectEndPeriod = (selected) => {
        this.props.rootStore.setEndPeriod(selected.target.value);
    }
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
        return <IPTTSelectWrapper label={ this.props.labels.endPeriod }>
                    <select className="form-control"
                            value={ this.props.rootStore.endPeriod }
                            onChange={ this.selectEndPeriod }>
                        { this.options }
                    </select>
                </IPTTSelectWrapper>;
    }
}

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



@inject('labels')
export class IPTTFilterForm extends React.Component {
    render() {
        return <nav id="id_iptt_report_filter">
                    <div className="p-3" id="filter-top">
                        <h3 className="filter-title text-title-case">{ this.props.labels.filterTitle }</h3>
                        <ProgramSelect />
                        <PeriodSelect />
                        <TimeFrameRadio />
                        <StartDateSelect />
                        <EndDateSelect />
                    </div>
                </nav>;
    }
}