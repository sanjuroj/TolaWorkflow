import React from 'react';
import ReactDOM from 'react-dom';
import {OrganizationStore} from './models';
import {IndexView} from './views';

/*
 * Model/Store setup
 */
console.log(jsContext)
const store = new OrganizationStore(
    jsContext.countries,
    jsContext.programs,
    jsContext.organizations
);

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
