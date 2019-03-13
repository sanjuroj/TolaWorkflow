import React from 'react';
import ReactDOM from 'react-dom';
import eventBus from '../../eventbus';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';

import {LevelListExport} from './components/level_list';
import {LevelTierPickerExport} from './components/leveltier_picker';
import {RFPageStore, RFPageUIStore} from './models';

/*
 * Model/Store setup
 */
const rootStore = new RFPageStore(jsContext.levels, jsContext.levelTiers, jsContext.tierPresets);
const uiStore = new RFPageUIStore();


/*
 * React components on page
 */

ReactDOM.render(<LevelTierPickerExport rootStore={rootStore} uiStore={uiStore} />,
    document.querySelector('#leveltier-picker-react-component'));

ReactDOM.render(<LevelListExport rootStore={rootStore}
                                uiStore={uiStore} />,
    document.querySelector('#level-list-react-component'));
