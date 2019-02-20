import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import Select from 'react-select';

const BLANK_LABEL = '---------';
const TVA = 1;
const TIMEPERIODS = 2;

class IPTTQuickstartUIStore {
    @observable selectedProgram = {
        [TVA]: null,
        [TIMEPERIODS]: null
        };
    @observable selectedFrequency = null;
    @observable showAll = TVA;
    @observable mostRecent = null;

    constructor(programs, labels) {
        this.programs = {};
        this.programIds = [];
        this.labels = labels;
        programs.forEach((program) => {
            this.programs[program.id] = {
                name: program.name,
                urls: {
                    [TVA]: program.tva_url,
                    [TIMEPERIODS]: program.timeperiods_url
                },
                frequencies: program.frequencies
            };
            this.programIds.push(program.id);
        });
    }
    
    getUrl = (reportType) => {
        let url = false;
        if (this.selectedProgram[reportType] !== null) {
            url = this.programs[this.selectedProgram[reportType]].urls[reportType];
            url = url + '?frequency=';
            if (reportType == TIMEPERIODS) {
                url = url + '7&recents=2';
            } else {
                url = url + this.selectedFrequency + '&';
                if (this.showAll) {
                    url = url + 'show_all=1';
                } else {
                    url = url + 'recents=' + this.mostRecent;
                }
            };
        }
        return url;
    }

    getPrograms = (reportType) => {
        let programOptions = this.programIds.map((pid) => ({value: pid, label: this.programs[pid].name}));
        if (reportType == TIMEPERIODS) {
            return programOptions;
        } else {
            return programOptions.filter((program) => {return this.programs[program.value].frequencies.length > 0});
        }
    }
    
    getSelectedProgram = (reportType) => {
        if (this.selectedProgram[reportType]) {
            return {
                value: this.selectedProgram[reportType],
                label: this.programs[this.selectedProgram[reportType]].name
            };
        }
        return {
            value: null,
            label: BLANK_LABEL
            };
    }

    
    getFrequencies = () => {
        if (!this.selectedProgram[TVA]) {return false;}
        let selectedId = this.selectedProgram[TVA];
        return this.programs[selectedId].frequencies.map(
            (frequency) => ({value: frequency, label: this.labels.frequencies[frequency]})
        );
    }
    
    getSelectedFrequency = () => {
        if (this.selectedFrequency) {
            return {
                value: this.selectedFrequency,
                label: this.labels.frequencies[this.selectedFrequency]
            };
        }
        return {
            value: null,
            label: BLANK_LABEL
            };
    }
    

    @action
    setSelectedProgram(value, reportType) {
        if (reportType == TVA) {
            this.selectedProgram[TIMEPERIODS] = null;
        } else if (reportType == TIMEPERIODS) {
            this.selectedProgram[TVA] = null;
            this.selectedFrequency = null;
        }
        if (value && this.programIds.includes(value)) {
            this.selectedProgram[reportType] = value;
            if (this.selectedFrequency && !this.programs[value].frequencies.includes(this.selectedFrequency)) {
                this.selectedFrequency = null;
                this.setShowAll(reportType);
            }
        }
    }
    
    @action
    setSelectedFrequency(value, reportType) {
        this.selectedFrequency = value;
        if (reportType == TVA && [1, 2].includes(value)) {
            this.showAll = TVA;
            this.mostRecent = null;
        }
    }
    
    @action
    setShowAll(reportType) {
        this.showAll = reportType;
        this.mostRecent = null;
    }
    
    @action
    setMostRecent(num, reportType) {
        this.showAll = null;
        this.mostRecent = true;
    }
    @action
    setMostRecentCount(num, reportType) {
        this.showAll = null;
        this.mostRecent = num;
    }
    
}

let thisUIStore = new IPTTQuickstartUIStore(jsContext.programs, jsContext.labels);



@observer
class ProgramSelect extends React.Component {
    
    onSelection = (selected) => {
        let selectedId = selected ? selected.value : null;
        this.props.uiStore.setSelectedProgram(selectedId, this.props.reportType);
    }

    render() {
        return <Select
            options={this.props.uiStore.getPrograms(this.props.reportType)}
            value={this.props.uiStore.getSelectedProgram(this.props.reportType)}
            onChange={this.onSelection}
            />;
    }
}

@observer
class TargetPeriodSelect extends React.Component {
    onSelection = (selected) => {
        let selectedId = selected ? selected.value : null;
        this.props.uiStore.setSelectedFrequency(selectedId, this.props.reportType);
    }
    
    render() {
        let options = this.props.uiStore.getFrequencies();
        let isDisabled = false;
        if (!options) {
            options = [];
            isDisabled = true;
        };
        return <Select
                options={options}
                isDisabled={isDisabled}
                value={this.props.uiStore.getSelectedFrequency()}
                onChange={this.onSelection}
                />;
    }
}

const ShowAllSelect = observer(({uiStore, reportType}) => {
    const disabled = uiStore.selectedProgram[reportType] === null || (
        reportType == TVA && uiStore.selectedFrequency === null);
    const checked = uiStore.showAll == reportType;
    const handleChange = (e) => {
        uiStore.setShowAll(reportType);
    }
    let className = 'form-check form-check-inline py-1';
    if (disabled) {
        className += ' form-check-inline--is-disabled';
    }
    return <div className={className}>
             <span className="form-check-input">
                <input type="radio"
                checked={checked} disabled={disabled} 
                onChange={handleChange} />
             </span>
             <label className="form-check-label">{uiStore.labels.showAll}</label>
           </div>;
});

const MostRecentSelect = observer(({uiStore, reportType}) => {
    const disabled = uiStore.selectedProgram[reportType] === null || (
        reportType == TVA && [1, 2, null].includes(uiStore.selectedFrequency));
    const checked = uiStore.mostRecent !== null;
    const handleChange = (e) => {
        uiStore.setMostRecent(reportType);
    }
    let className = 'form-check form-check-inline py-1';
    if (disabled) {
        className += ' form-check-inline--is-disabled';
    }
    return <div className={className}>
             <span className="form-check-input">
                <input type="radio"
                       checked={checked} disabled={disabled} 
                       onChange={handleChange}/>
             </span>
             <label className="form-check-label">{uiStore.labels.mostRecent}</label>
           </div>;         
});

@observer
class MostRecentCount extends React.Component {
    handleChange = (e) => {
        let value = e.target.value;
        if (value == '') {value = true};
        this.props.uiStore.setMostRecentCount(value);
    }
    render() {
        let disabled = this.props.uiStore.selectedProgram[this.props.reportType] === null || (
            this.props.reportType == TVA && this.props.uiStore.selectedFrequency === null) || (
            this.props.reportType == TVA && [1, 2, null].includes(this.props.uiStore.selectedFrequency));
        let value = (this.props.uiStore.mostRecent !== null && this.props.uiStore.mostRecent !== true) ? this.props.uiStore.mostRecent : '';
        return <input
                type="number" placeholder={this.props.uiStore.labels.mostRecentCount}
                disabled={disabled} value={value}
                className="form-control" onChange={this.handleChange}/>;
    }
}

const IPTTSubmit = observer(({ uiStore, reportType}) => {
    const handleClick = (e) => {
        let url = uiStore.getUrl(reportType);
        window.location.href = url;
    };
    const disabled = uiStore.selectedProgram[reportType] === null || 
        (reportType == TVA && uiStore.selectedFrequency === null) ||
        (reportType == TVA && uiStore.mostRecent === true);
    const inlineCSS = {
        width: '100%'
    };
    return <button
            className="btn btn-primary"
            onClick={handleClick}
            disabled={disabled}
            style={inlineCSS}>{uiStore.labels.submit}</button>;
});



ReactDOM.render(<ProgramSelect uiStore={thisUIStore} reportType={TVA}/>,
                document.querySelector('#quickstart-tva-form-program-select-react'));

ReactDOM.render(<TargetPeriodSelect uiStore={thisUIStore} reportType={TVA} />,
                document.querySelector('#quickstart-tva-form-period-select-react'));

ReactDOM.render(<ShowAllSelect uiStore={thisUIStore} reportType={TVA} />,
                document.querySelector('#quickstart-tva-form-show-all-react'));

ReactDOM.render(<MostRecentSelect uiStore={thisUIStore} reportType={TVA} />,
                document.querySelector('#quickstart-tva-most-recent-check-react'));

ReactDOM.render(<MostRecentCount uiStore={thisUIStore} reportType={TVA} />,
                document.querySelector('#quickstart-tva-most-recent-count-react'));

ReactDOM.render(<IPTTSubmit uiStore={thisUIStore} reportType={TVA} />,
                document.querySelector('#quickstart-tva-submit-button-react'));

ReactDOM.render(<ProgramSelect uiStore={thisUIStore} reportType={TIMEPERIODS}/>,
                document.querySelector('#quickstart-timeperiods-form-program-select-react'));

ReactDOM.render(<IPTTSubmit uiStore={thisUIStore} reportType={TIMEPERIODS} />,
                document.querySelector('#quickstart-timeperiods-submit-button-react'));