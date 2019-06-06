import React from 'react';
import Select from 'react-select';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { uniqueId } from '../formUtils';


export const SingleReactSelect = ( props ) => {
    let selectId = uniqueId('react-select');
    let labelClasses = props.labelClasses || "col-form-label text-uppercase";
    return (
        <div className="form-row mb-3">
            <label
                htmlFor={ selectId }
                className={labelClasses}>
                    { props.label }
            </label>
            <Select
                onChange={ props.update }
                value={ props.value }
                id={ selectId }
                className="tola-react-select"
                disabled={ props.disabled }
                options={ props.options }
                />
        </div>
    );
}

export const DateSelect = ( props ) => {
    let selectId = uniqueId('date-select');
    let formattedOptions =
        (props.options && props.options.length == 1 && props.options[0].value !== undefined) ?
            <option value={ props.options[0].value }>{ props.options[0].label }</option> :
            (props.options && props.options[0].options !== undefined) ?
                props.options.map(
                    (optgroup, index) => {
                        return <optgroup label={ optgroup.label } key={ index }>
                                    {optgroup.options.map(
                                        option => (<option value={ option.value } key={ option.value }>
                                                        { option.label }
                                                   </option>)
                                        )
                                    }
                                </optgroup>
                        }) :
                props.options.map(
                    (option, index) => {
                        return <option value={ option.value } key={ index }>{ option.label }</option>;
                    }
                );
                
    return (
        <div className="form-row mb-3">
            <label
                htmlFor={ selectId }
                className="col-form-label text-uppercase">
                    { props.label }
            </label>
            <select
                className="form-control"
                id={ selectId }
                value={ props.value }
                onChange = { props.update }
                disabled = { props.disabled }>
                { formattedOptions }
            </select>
        </div>  
    );
}

export const SingleSelect = ( props ) => {
    let selectId = uniqueId('react-select');
    return (
        <div className="form-row mb-3">
            <label
                htmlFor={ selectId }
                className="col-form-label text-uppercase">
                    { props.label }
            </label>
            <select
                onChange={ props.update }
                value={ props.value }
                id={ selectId }
                className="form-control"
                disabled={ props.disabled }>
                { props.options }
            </select>
        </div>
    );
}


/**
 * styling element to replace OptGroup headings in react multiselect checkbox widgets - used for
 * MultiSelectCheckbox when optgroups are required
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


/**
 * Styles ReactMultiSelectCheckbox to fit Tola styles
 */
export const MultiSelectCheckbox = ( props ) => {
    const selectId = uniqueId('multiselect');
    const multiSelectProps = (!props.options || props.options.length == 0) ?
            {
                getDropdownButtonLabel: () => gettext('None available'),
                isDisabled: true,
                menuIsOpen: false,
                options: [],
            } :
            {
                isMulti: true,
                options: props.options,
                getDropdownButtonLabel: (_ref) => {
                    if (!_ref.value) {
                        return gettext('None selected');
                    }
                    if (Array.isArray(_ref.value)) {
                        if (_ref.value.length == 0) {
                            return gettext('None selected');
                        }
                        if (_ref.value.length == 1) {
                            return _ref.value[0].label;
                        }
                        return `${_ref.value.length}  ${gettext('selected')}`;
                    }
                    return _ref.value.label;
                }
            };
    const baseStyles = {
        dropdownButton: base => (!props.options || props.options.length == 0)
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
    };
    const formatOptionLabel = (props) => {
        return <div style={{ display: "inline-block" , float: "right", width: "90%"}}>{props.label}</div>;
    };
    return (
        <div className="form-row mb-2 tola-react-multiselect-row">
            <label htmlFor={ selectId } className="col-form-label text-uppercase">
                { props.label }
            </label>
            <ReactMultiSelectCheckboxes
                id={ selectId }
                styles={ baseStyles }
                formatOptionLabel = { formatOptionLabel }
                components={{ GroupHeading }}
                value={ props.value }
                onChange={ props.update }
                { ...multiSelectProps }
            />
        </div>
    );
}
