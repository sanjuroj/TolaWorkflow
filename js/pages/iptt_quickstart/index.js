import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import { TVA, TIMEPERIODS } from '../iptt_shared/models';
import { DualFilterStore, QuickstartProgramFilterData } from './models';
import { IPTTQuickstartForm } from './components/form';


let programStore = new QuickstartProgramFilterData(jsContext.programs);
let labels = jsContext.labels;
let parentStore = new DualFilterStore(programStore, labels);


ReactDOM.render(<IPTTQuickstartForm uiStore={parentStore.getStore(TVA)} />,
                document.querySelector('#quickstart-tva-form'));


ReactDOM.render(<IPTTQuickstartForm uiStore={parentStore.getStore(TIMEPERIODS)} />,
                document.querySelector('#quickstart-timeperiods-form'));