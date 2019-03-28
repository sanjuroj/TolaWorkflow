import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react"
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';

import {LevelListing} from './components/level_list';
import {LevelTierPicker} from './components/leveltier_picker';
import {RFPageStore, RFPageUIStore} from './models';

/*
 * Model/Store setup
 */
const {levels, levelTiers, tierPresets} = jsContext;
const rootStore = new RFPageStore(levels, levelTiers, tierPresets);


/*
 * React components on page
 */

ReactDOM.render(
    <Provider rootStore={rootStore}>
        <React.Fragment>
            <LevelTierPicker />
            <LevelListing />
        </React.Fragment>
    </Provider>,
    document.querySelector('#level-builder-react-component'));

// ReactDOM.render(<LevelList rootStore={rootStore}
//                                 uiStore={uiStore} />,
//     document.querySelector('#level-list-react-component'));
