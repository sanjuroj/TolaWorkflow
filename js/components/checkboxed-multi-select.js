import React from 'react'
import Select, {components} from 'react-select'
import {VirtualizedMenuList as MenuList} from './virtualized-react-select'

const Option = props => {
    return (components.Option &&
        <components.Option {...props}>
            <input
            className="checkboxed-multi-select-checkbox"
            type="checkbox"
            checked={props.isSelected}
            onChange={(e) => {
                //we can let the outer component manage state
            }}
            />
            &nbsp;
            {props.data.label}
        </components.Option>
    )
}

const CheckboxedMultiSelect = props => (
      <Select
        isMulti={true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
            MenuList,
            Option
        }}
        {...props} />
)

export default CheckboxedMultiSelect
