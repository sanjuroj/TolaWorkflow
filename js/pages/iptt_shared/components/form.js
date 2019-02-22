import React from 'react';
import { observer } from 'mobx-react';
import { computed, when } from 'mobx';
import Select from 'react-select';
import { TVA, TIMEPERIODS } from '../models';


@observer
export class ProgramSelect extends React.Component {
    onSelection = (selected) => {
        let selectedId = selected ? selected.value : null;
        this.props.uiStore.setSelectedProgram(selectedId);
    }

    render() {
        return <div className={this.props.outerClassNames}>
                    <label className={this.props.labelClassNames}>
                        {this.props.uiStore.labels.programSelect}
                    </label>
                    <Select
                        options={this.props.uiStore.getPrograms(this.props.reportType)}
                        value={this.props.uiStore.getSelectedProgram()}
                        onChange={this.onSelection}
                        className={this.props.classNames}
                    />
                </div>;
    }
}

class IPTTFormFieldBase extends React.Component {
    isEnabled = () => {
        return (this.props.uiStore.reportType && this.props.reportType == this.props.uiStore.reportType &&
                this.props.uiStore.selectedProgramId !== null);
    }

    processOptions = (optionsCallback, isEnabled) => {
        if (!isEnabled) {
            return [[], false];
        }
        let options = optionsCallback(this.props.reportType);
        if (options === false || options.length == 0) {
            return [[], false];
        }
        return [options, true];
    }
}

@observer
export class PeriodSelect extends IPTTFormFieldBase {
    onSelection = (selected) => {
        let selectedId = selected ? selected.value : null;
        this.props.uiStore.setSelectedFrequency(selectedId);
    }
    
    render() {
        let isEnabled = this.isEnabled();
        let options;
        [options, isEnabled] = this.processOptions(this.props.uiStore.getFrequencies, isEnabled);
        let label = this.props.reportType == TVA ? this.props.uiStore.labels.tvaPeriodSelect : this.props.uiStore.labels.timeperiodsPeriodSelect;
        return <div className={this.props.outerClassNames} >
                    <label className={this.props.labelClassNames} >
                        {label}
                    </label>
                    <Select options={options} isDisabled={!isEnabled}
                        value={this.props.uiStore.getSelectedFrequency()}
                        onChange={this.onSelection} className={this.props.classNames} />
                </div>;
    }
}

@observer
export class ShowAllSelect extends IPTTFormFieldBase {
    render() {
        let isEnabled = this.isEnabled() && (this.props.reportType == TIMEPERIODS || this.props.uiStore.selectedFrequencyId);
        let checked = (this.props.reportType == this.props.uiStore.reportType && this.props.uiStore.showAll);
        let handleChange = () => {this.props.uiStore.setShowAll();};
        let outerClassNames = this.props.outerClassNames || '';
        outerClassNames = "form-check form-check-inline " + outerClassNames;
        if (!isEnabled) {
            outerClassNames += ' form-check-inline--is-disabled';
        }
        return <div className={outerClassNames}>
                 <span className="form-check-input">
                    <input type="radio"
                    checked={checked} disabled={!isEnabled} 
                    onChange={handleChange} />
                 </span>
                 <label className="form-check-label">{this.props.uiStore.labels.showAll}</label>
               </div>;
    }
}

@observer
export class MostRecentSelect extends IPTTFormFieldBase {
    render() {
        let isEnabled = (this.isEnabled() && (this.props.reportType == TIMEPERIODS ||
                                             (this.props.uiStore.selectedFrequencyId &&
                                              ![1, 2, null].includes(this.props.uiStore.selectedFrequencyId))));
        let checked = (this.props.reportType == this.props.uiStore.reportType && this.props.uiStore.mostRecent);
        let handleChange = () => {
            this.props.uiStore.setMostRecent();
            this.props.uiStore.focusMostRecentCount();
            };
        let outerClassNames = this.props.outerClassNames || '';
        outerClassNames = "form-check form-check-inline " + outerClassNames;
        if (!isEnabled) {
            outerClassNames += ' form-check-inline--is-disabled';
        }
        return <div className={outerClassNames}>
             <span className="form-check-input">
                <input type="radio"
                       checked={checked} disabled={!isEnabled} 
                       onChange={handleChange} />
             </span>
             <label className="form-check-label">{this.props.uiStore.labels.mostRecent}</label>
           </div>;  
    }
}


@observer
export class MostRecentCount extends IPTTFormFieldBase {
    constructor(props) {
        super(props);
        when(
            () => this.props.uiStore.mostRecentCountHasFocus,
            () => {
                this.props.uiStore.focusedMostRecentCount();
                this.countInput.focus();
            }
        );
    }
    
    handleChange = (e) => {
        this.props.uiStore.setMostRecent(true);
        let value = e.target.value;
        if (value !== '' && !isNaN(parseFloat(value)) && isFinite(value)) {
            this.props.uiStore.setMostRecent(value);
        }
    }
    
    handleFocus = () => {
        if (this.props.uiStore.mostRecent === false) {
            this.props.uiStore.setMostRecent(true);
        }
    }
    
    render() {
        let isEnabled = (this.isEnabled() && this.props.uiStore.selectedFrequencyId &&
                         !([1, 2, null].includes(this.props.uiStore.selectedFrequencyId)));
        let value = this.props.uiStore.getMostRecentCount();
        value = value || '';
        return <div>
                <input ref={ (input) => { this.countInput = input; }}
                    onFocus={this.handleFocus}
                    type="number" placeholder={this.props.uiStore.labels.mostRecentCount}
                    disabled={!isEnabled} value={this.props.uiStore.getMostRecentCount() || ''}
                    className="form-control" onChange={this.handleChange}/>
                </div>;
    }
}


export const IPTTSubmit = observer(({ uiStore, reportType}) => {
    const handleClick = (e) => {
        let url = uiStore.getUrl(reportType);
        window.location.href = url;
    };
    const enabled = (uiStore.enabled && uiStore.selectedProgramId !== null &&
                     uiStore.selectedFrequencyId && uiStore.getUrl());
    const inlineCSS = {
        width: '100%'
    };
    return <button
            className="btn btn-primary"
            onClick={handleClick}
            disabled={!enabled}
            style={inlineCSS}>{uiStore.labels.submit}</button>;
});

@observer
export class StartPeriodSelect extends React.Component {
    handleChange = (e) => {
        this.props.uiStore.setStartPeriod(e.target.value);
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
        let isEnabled = (this.props.uiStore.selectedProgramId !== null &&
                         this.props.uiStore.selectedFrequencyId !== null);
        return <React.Fragment>
                    <label className="col-form-label">
                    {this.props.uiStore.labels.startPeriodSelect}
                    </label>
                    <select className="form-control" value={this.props.uiStore.getStartPeriod()}
                            disabled={!isEnabled}
                             onChange={this.handleChange}>
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