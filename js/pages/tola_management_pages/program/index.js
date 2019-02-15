import React from 'react';
import ReactDOM from 'react-dom';
import {ProgramStore} from './models';
import {IndexView} from './views';
import api from './api';

/*
 * Model/Store setup
 */

const initialData = {
    countries: jsContext.countries,
    organizations: jsContext.organizations,
    allPrograms: jsContext.programs,
    sectors: jsContext.sectors,
}
const store = new ProgramStore(
    api,
    initialData,
);


ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
