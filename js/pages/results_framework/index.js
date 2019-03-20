import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react"
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';

import {LevelListExport} from './components/level_list';
import {LevelTierPicker} from './components/leveltier_picker';
import {RFPageStore, RFPageUIStore} from './models';

/*
 * Model/Store setup
 */
const {levels, levelTiers, tierPresets} = jsContext;
const rootStore = new RFPageStore(levels, levelTiers, tierPresets);
const uiStore = new RFPageUIStore(levelTiers, tierPresets);


/*
 * React components on page
 */

ReactDOM.render(
    <Provider uiStore={uiStore}>
        <LevelTierPicker />
    </Provider>,
    document.querySelector('#leveltier-picker-react-component'));

ReactDOM.render(<LevelListExport rootStore={rootStore}
                                uiStore={uiStore} />,
    document.querySelector('#level-list-react-component'));
