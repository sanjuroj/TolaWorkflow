import React from 'react';
import { observer } from 'mobx-react';
import { computed, when } from 'mobx';
import Select from 'react-select';
import { TVA, TIMEPERIODS } from '../models';

const SelectWrapper = ({ classNames, labelText }) => {
    return <div className={ classNames.outerDiv }>
                <label className={ classNames.label }>
                    { labelText }
                </label>
            </div>;
}

class IPTTFormComponent extends React.Component {
    getClassNames = () => {
        return {
            outerDiv: this.props.outerDivClass || '',
            label: this.props.labelClass || '',
            field: this.props.fieldClass || '',
            span: this.props.spanClass || ''
        };
    }
}

@observer
export class ProgramSelect extends IPTTFormComponent {
    render = () => {
        let classNames = this.getClassNames();
        let store = this.props.uiStore;
        return <SelectWrapper classNames={classNames} labelText={label} >
                    <Select
                        options={ store.programOptions }
                        value={ store.selectedProgramOption }
                        onChange={ (selected) => { if (selected) { store.setSelectedProgram(selected.value) } } }
                        className={ classNames.field }
                    />
                </SelectWrapper>;
    }
}

@observer
export class PeriodSelect extends IPTTFormComponent {
    get enabled() {
        return (this.props.uiStore.enabled === true && this.props.uiStore.selectedProgramId !== null);
    }
    
    render() {
        let classNames = this.getClassNames();
        let store = this.props.uiStore;
        return <SelectWrapper classNames={classNames} labelText={ store.labels.periodSelect } >
                    <Select options={ store.frequencyOptions } isDisabled={ !this.enabled }
                        value={ store.selectedFrequencyOption }
                        onChange={ (selected) => { if (selected) { store.setSelectedFrequency(selected.value) } } }
                        className={ classNames.field } />
                </SelectWrapper>;
    }
}

class IPTTFormFieldBase extends IPTTFormComponent {
    get enabled() {
        return (this.props.uiStore.enabled === true && this.props.uiStore.selectedProgramId !== null);
    }
}


@observer
export class ShowAllSelect extends IPTTFormFieldBase {
    get enabled() {
        return super.enabled && ![1,2].includes(this.props.uiStore.selectedFrequencyId);
    }

    get checked() {
        return this.enabled && this.props.uiStore.showAll;
    }

    getClassNames = () => {
        let classNames = super.getClassNames();
        classNames.outerDiv += ' pr-2';
        if (!this.enabled) { classNames.outerDiv += ' form-check-inline--is-disabled'; }
        return classNames;
    }

    render() {
        let classNames = this.getClassNames();
        let store = this.props.uiStore;
        return <div className={ classNames.outerDiv }>
                 <span className={ classNames.span }>
                    <input type="radio"
                    checked={ this.checked } disabled={ !this.enabled } 
                    onChange={ store.setShowAll } />
                 </span>
                 <label className={ classNames.label }>{ store.labels.showAll }</label>
               </div>;
    }
}

@observer
export class MostRecentSelect extends IPTTFormFieldBase {
    getClassNames = () => {
        let classNames = super.getClassNames();
        if (!this.enabled) { classNames.outerDiv += ' form-check-inline--is-disabled'; }
        return classNames;
    }
    
    get enabled() {
        return super.enabled && ![1,2].includes(this.props.uiStore.selectedFrequencyId);
    }

    get checked() {
        return this.enabled && this.props.uiStore.mostRecent;
    }
    render() {
        let classNames = this.getClassNames();
        let store = this.props.uiStore;
        return <div className={ classNames.outerDiv }>
                 <span className={ classNames.span }>
                    <input type="radio"
                    checked={ this.checked } disabled={ !this.enabled } 
                       onChange={ store.setMostRecent } />
             </span>
             <label className={ classNames.label }>{ store.labels.mostRecent }</label>
           </div>;  
    }
}


@observer
export class MostRecentCount extends IPTTFormFieldBase {

    componentDidMount() {
        eventBus.on('most-recent-count-focus', () => {
            if (this.countInput) {
                this.countInput.focus();
            }
        });
    }
    
    handleChange = (e) => {
        let value = e.target.value;
        if (value !== '' && !isNaN(parseFloat(value)) && isFinite(value)) {
            this.props.uiStore.setMostRecentCount(value);
        }
    }
    
    render() {
        let classNames = this.getClassNames();
        let store = this.props.uiStore;
        return <div>
                <input ref={ (input) => { this.countInput = input; }}
                    onFocus={ store.setMostRecent }
                    type="number" placeholder={ store.labels.mostRecentCount }
                    disabled={ !this.enabled } value={ store.mostRecentCount }
                    className={ classNames.field } onChange={ this.handleChange } />
                </div>;
    }
}


export const IPTTSubmit = observer((props) => {
    let store = props.uiStore;

    const handleClick = (e) => {
        let url = store.submitUrl;
        if (url) {
            window.location.href = url;
        }
    };
    const enabled = (store.enabled && store.selectedProgramId !== null &&
                     store.selectedFrequencyId && store.submitUrl);

    const inlineCSS = {
        width: '100%'
    };
    return  <div className="d-flex justify-content-center mb-1">
                <button
                className="btn btn-primary"
                onClick={ handleClick }
                disabled={ !enabled }
                style={ inlineCSS }>{ store.labels.submit }</button>
            </div>;
});

@observer
export class StartPeriodSelect extends React.Component {
    handleChange = (e) => {
        this.props.uiStore.setStartPeriod(e.target.value);
    }
    get enabled() {
        return (this.props.uiStore.selectedProgramId !== null && this.props.uiStore.selectedFrequencyId !== null);
    }
    
    createOptions = () => {
        let options = [];
        this.props.uiStore.getPeriods().forEach(
            (period, count) => {
                options.push(<option key={count} value={period.value} disabled={period.disabled}>{period.label}</option>);
                }
        );
        return options;
    }
    render() {
        let store = this.props.uiStore;
        return <React.Fragment>
                    <label className="col-form-label">
                    {store.labels.startPeriodSelect}
                    </label>
                    <select className="form-control" value={ store.selectedStartPeriod }
                            disabled={!this.enabled}
                             onChange={ (e) => store.setStartPeriod(e.target.value) }>
                             {this.createOptions()}
                    </select>
               </React.Fragment>
    }
}

@observer
export class EndPeriodSelect extends React.Component {
    handleChange = (e) => {
        this.props.uiStore.setEndPeriod(e.target.value);
    }
    createOptions = () => {
        let options = [];
        this.props.uiStore.getPeriods(true).forEach(
            (period, count) => {
                options.push(<option key={count} value={period.value} disabled={period.disabled}>{period.label}</option>);
                }
        );
        return options;
    }
    render() {
        let isEnabled = (this.props.uiStore.selectedProgramId !== null &&
                         this.props.uiStore.selectedFrequencyId !== null);
        return <React.Fragment>
                    <label className="col-form-label">
                    {this.props.uiStore.labels.endPeriodSelect}
                    </label>
                    <select className="form-control" value={this.props.uiStore.getEndPeriod()}
                            disabled={!isEnabled}
                             onChange={this.handleChange}>
                             {this.createOptions()}
                    </select>
               </React.Fragment>
    }
}

class FilterMultiSelect extends React.Component {
    render() {
        return <div className={this.props.outerClassNames} >
                    <label className={this.props.labelClassNames} >
                        {this.label}
                    </label>
                    <Select options={this.options}
                        isMulti={true} placeholder={this.props.uiStore.labels.selectPlaceholder}
                        value={this.getSelected()}
                        onChange={this.onSelection} className={this.props.classNames} />
                </div>;
    }
}

@observer
export class LevelSelect extends FilterMultiSelect {
    label = this.props.uiStore.labels.levelSelect;
    options = this.props.uiStore.programFilters.levels;

    getSelected = () => this.props.uiStore.selectedLevels;

    onSelection = (selected) => {
        this.props.uiStore.setLevels(selected);
    }
}

@observer
export class TypeSelect extends FilterMultiSelect {
    label = this.props.uiStore.labels.typeSelect;
    options = this.props.uiStore.programFilters.types;
    
    getSelected = () => this.props.uiStore.selectedTypes;
    
    onSelection = (selected) => {
        this.props.uiStore.setTypes(selected);
    }
}

@observer
export class SectorSelect extends FilterMultiSelect {
    label = this.props.uiStore.labels.sectorSelect;
    options = this.props.uiStore.programFilters.sectors;
    
    getSelected = () => this.props.uiStore.selectedSectors;
    
    onSelection = (selected) => {
        this.props.uiStore.setSectors(selected);
    }
}

@observer
export class SiteSelect extends FilterMultiSelect {
    label = this.props.uiStore.labels.siteSelect;
    options = this.props.uiStore.programFilters.sites;
    
    getSelected = () => this.props.uiStore.selectedSites;
    
    onSelection = (selected) => {
        this.props.uiStore.setSites(selected);
    }
}

@observer
export class IndicatorSelect extends FilterMultiSelect {
    label = this.props.uiStore.labels.indicatorSelect;
    options = this.props.uiStore.programFilters.indicators;
    
    getSelected = () => this.props.uiStore.selectedIndicators;
    
    onSelection = (selected) => {
        this.props.uiStore.setIndicators(selected);
    }
}