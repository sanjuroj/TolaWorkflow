import React from 'react';
import ReactDOM from 'react-dom';
import eventBus from '../../../eventbus';
import {UserStore} from './models';
import {IndexView} from './views';

/*
 * Model/Store setup
 */
const store = new UserStore();

store.fetchUsers();

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector('#app_root')
);
