import React from 'react';
import ReactDOM from 'react-dom';
import {CountryStore} from './models';
import {IndexView} from './views';
import api from './api';

const app_root = '#app_root'

/*
 * Model/Store setup
 */

const initialData = {
    allCountries: jsContext.countries,
    organizations: jsContext.organizations,
    allPrograms: jsContext.programs,
    is_superuser: jsContext.is_superuser,
}

const store = new CountryStore(
    api,
    initialData,
);


ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector(app_root)
);
