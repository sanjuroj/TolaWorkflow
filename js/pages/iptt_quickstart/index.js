import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import { DualFilterStore, TVA, TIMEPERIODS } from '../iptt_shared/models';
import { IPTTQuickstartForm } from './components/form';


let uiStore = new DualFilterStore(jsContext);


ReactDOM.render(<IPTTQuickstartForm uiStore={uiStore.getStore(TVA)} reportType={TVA} />,
                document.querySelector('#quickstart-tva-form'));


ReactDOM.render(<IPTTQuickstartForm uiStore={uiStore.getStore(TIMEPERIODS)} reportType={TIMEPERIODS} />,
                document.querySelector('#quickstart-timeperiods-form'));