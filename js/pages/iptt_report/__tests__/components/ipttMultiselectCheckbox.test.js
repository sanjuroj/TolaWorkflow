import React from 'react';
import renderer from 'react-test-renderer';
import { IPTTMultiselectCheckboxWrapper } from '../../components/selectWidgets';


const labels = {
    emptySelect: 'empty label',
    noOptionsSelect: 'no options label',
    selected: 'selected'
};

class TestItem extends IPTTMultiselectCheckboxWrapper {
    onChange = (selected) => {
        this.props.testHarness.selectedValue = selected;
    }
    get value() {
        return this.props.testHarness.selectedValue;
    }
    get options() {
        return this.props.testHarness.options;
    }
    get label() {
        return 'label';
    }
}

describe('MultiselectCheckbox', () => {
    it('displays an empty select label with nothing selected but options', () => {
        let testHarness = {
            options: [{label: 'option 1', value: 1}, {label: 'option 2', value: 2}],
            selectedValue: []
        };
        const component = renderer.create(<TestItem labels={labels} testHarness={testHarness} />);
        let nothingSelected = component.toJSON();
        expect(nothingSelected).toMatchSnapshot();
    });
})