import React from 'react';
import ReactDOM from 'react-dom';
import {OrganizationStore} from './models';
import {IndexView} from './views';

const app_root = '#app_root'


/*
 * Model/Store setup
 */
const store = new OrganizationStore(
    jsContext.programs,
    jsContext.organizations,
    jsContext.sectors,
    jsContext.countries,
    jsContext.country_filter,
    jsContext.program_filter,
)

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector(app_root)
)
