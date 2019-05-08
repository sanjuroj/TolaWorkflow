import React from 'react';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

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
export class QSTVAProgramSelect extends React.Component {
    selectProgram = (selected) => {
        this.props.rootStore.setTVAProgram(selected.value);
    }
    render() {
        return <IPTTSelectWrapper label={ this.props.labels.programSelect }>
                    <Select options={ this.props.rootStore.tvaProgramOptions }
                            value={ this.props.rootStore.selectedTVAProgram }
                            onChange={ this.selectProgram }
                            className="iptt-react-select" />
               </IPTTSelectWrapper>;
    }
}


@inject('labels', 'rootStore')
@observer
export class QSTimeperiodsProgramSelect extends React.Component {
    selectProgram = (selected) => {
        this.props.rootStore.setTimeperiodsProgram(selected.value);
    }
    render() {
        return <IPTTSelectWrapper label={ this.props.labels.programSelect }>
                    <Select options={ this.props.rootStore.timeperiodsProgramOptions }
                            value={ this.props.rootStore.selectedTimeperiodsProgram }
                            onChange={ this.selectProgram }
                            className="iptt-react-select" />
               </IPTTSelectWrapper>;
    }
}


@inject('labels', 'rootStore')
@observer
export class QSTVAPeriodSelect extends React.Component {
    selectFrequency = (selected) => {
        this.props.rootStore.setFrequency(selected.value);
    }
    render() {

        return <IPTTSelectWrapper label={ this.props.labels.periodSelect }>
                    <Select options={ this.props.rootStore.frequencyOptions }
                            value={ this.props.rootStore.selectedFrequency }
                            onChange={ this.selectFrequency }
                            className="iptt-react-select" />
               </IPTTSelectWrapper>;
    }
}