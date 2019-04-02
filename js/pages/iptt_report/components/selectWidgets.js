import React from 'react';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { uniqueId } from '../../../formUtils';

const IPTTMultiSelectWrapper = (props) => {
    return <div className="form-row mb-2 iptt-react-select-row">
                <label htmlFor={props.id} className="col-form-label text-uppercase">
                    { props.label }
                </label>
                { props.children }
            </div>;
}


/**
 * styling element to replace OptGroup headings in react multiselect checkbox widgets - used for
 * LevelSelect (no optgroup label shown for the tiers group, no checkbox by other labels)
 */
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


export class IPTTMultiselectCheckboxWrapper extends React.Component {
    constructor(props) {
        super(props);
        this._id = uniqueId('multiselect');
    }
    get options() {
        return [];
    }
    get value() {
        return {value: null, label: ''};
    }
    get label() {
        return '';
    }
    getProps = () => {
        if (this.options.length == 0) {
            return {
                getDropdownButtonLabel: () => this.props.labels.noOptionsSelect,
                isDisabled: true,
                menuIsOpen: false,
                options: [],
                id: this._id,
            };
        }
        return {
            isMulti: true,
            id: this._id,
            options: this.options,
            getDropdownButtonLabel: (_ref) => {
                if (!_ref.value) {
                    return this.props.labels.emptySelect;
                }
                if (Array.isArray(_ref.value)) {
                    if (_ref.value.length == 0) {
                        return this.props.labels.emptySelect;
                    }
                    if (_ref.value.length == 1) {
                        return _ref.value[0].label;
                    }
                    return "".concat(_ref.value.length, " ", this.props.labels.selected);
                }
                return _ref.value.label;
            }
        };       
    }
    getBaseStyles = () => ({
        dropdownButton: base => this.options.length == 0
                                ? { ...base, backgroundColor: '#E5E6E8', background: '' }
                                : base,
        option: (provided, state) => ({
                ...provided,
                padding: '1px 12px',
                display: 'inline-block'
            }),
        container: (provided, state) => ({
                ...provided,
                backgroundColor: '#f5f5f5'
            }),
    });
    
    render() {
        const formatOptionLabel = (props) => {
            return <div style={{ display: "inline-block" , float: "right", width: "90%"}}>{props.label}</div>;
        }
        return <IPTTMultiSelectWrapper id={ this._id} label={ this.label }>
                    <ReactMultiSelectCheckboxes
                            styles={ this.getBaseStyles() }
                            formatOptionLabel={ formatOptionLabel }
                            components={{ GroupHeading }}
                            value={ this.value }
                            { ...this.getProps() }
                            onChange={ this.onChange } />
                </IPTTMultiSelectWrapper>;
    }
}



export const IPTTSelectWrapper = (props) => {
    return <div className="form-row mb-3">
                <label htmlFor={ props.id } className="col-form-label text-uppercase">
                    { props.label }
                </label>
                { props.children }
            </div>;
}

export class IPTTSelect extends React.Component {
    constructor(props) {
        super(props);
        this._id = uniqueId('react-select');
    }
    render() {
        return (
            <IPTTSelectWrapper id={ this._id } label={ this.label }>
                <Select {...this.selectOptions} id={ this._id } className="iptt-react-select" />
            </IPTTSelectWrapper>
        );
    }
}


@inject('rootStore')
@observer
export class DateSelect extends React.Component {
    constructor(props) {
        super(props);
        this._id = uniqueId('date-select');
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
        return <IPTTSelectWrapper id={ this._id }label={ this.props.label }>
                    <select className="form-control"
                            id={ this._id }
                            value={ this.props.value }
                            onChange={ this.props.onChange }
                            disabled={ this.props.rootStore.selectedFrequencyId == 2 || this.props.rootStore.selectedFrequencyId == 1 }>
                        { this.options }
                    </select>
                </IPTTSelectWrapper>;
    }
}