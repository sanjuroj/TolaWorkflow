import React from 'react';
import { mount } from 'enzyme';
import {ProgramMetrics} from '../../components/program_metrics';
import {ProgramPageStore, ProgramPageUIStore} from "../../models";

import jsContext from '../fixtures/jsContext';

import '../../../../test_helpers/django_i18n_stubs';

const rootStore = new ProgramPageStore(jsContext.indicators, jsContext.program);
const uiStore = new ProgramPageUIStore();

describe('IndicatorList', () => {
    it('renders without crashing', () => {
        const wrapper = mount(<ProgramMetrics rootStore={rootStore}
                                              uiStore={uiStore}
                                              indicatorOnScopeMargin={jsContext.indicator_on_scope_margin}/>);
    });
});
