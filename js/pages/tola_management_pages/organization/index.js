import React from 'react';
import ReactDOM from 'react-dom';
import {OrganizationStore} from './models';
import {IndexView} from './views';

/*
 * Model/Store setup
 */
const store = new OrganizationStore(
    jsContext.programs,
    jsContext.organizations,
    jsContext.sectors
);

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
