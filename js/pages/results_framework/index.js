import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react"
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';

import {LevelListPanel} from './components/level_list';
import {LevelTierPicker} from './components/leveltier_picker';
import {RootStore} from './models';

/*
 * Model/Store setup
 */
const {program_id, levels, indicators, levelTiers, tierTemplates, accessLevel} = jsContext;
const rootStore = new RootStore(program_id, levels, indicators, levelTiers, tierTemplates, accessLevel);

/*
 * React components on page
 */

ReactDOM.render(
    <Provider rootStore={rootStore}>
        <React.Fragment>
            <LevelTierPicker />
            <LevelListPanel />
        </React.Fragment>
    </Provider>,
    document.querySelector('#level-builder-react-component'));
