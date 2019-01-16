import React from 'react';
import ReactDOM from 'react-dom';
import eventBus from '../../../eventbus';
import {OrganizationStore} from './models';
import {IndexView} from './views';

/*
 * Model/Store setup
 */
const store = new OrganizationStore();

store.fetchOrganizations();

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
