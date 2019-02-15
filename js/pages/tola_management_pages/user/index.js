import React from 'react';
import ReactDOM from 'react-dom';
import {UserStore} from './models';
import {IndexView} from './views';

/*
 * Model/Store setup
 */
const store = new UserStore(
    jsContext.countries,
    jsContext.organizations,
    jsContext.programs,
    jsContext.users,
    jsContext.program_roles,
    jsContext.country_roles,
    jsContext.is_superuser
);

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
