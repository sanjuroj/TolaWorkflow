import React from 'react';
import ReactDOM from 'react-dom';
import {UserStore} from './models';
import {IndexView} from './views';

const app_root = '#app_root'

/*
 * Model/Store setup
 */
const store = new UserStore(jsContext);

ReactDOM.render(
    <IndexView store={store} />,
    document.querySelector(app_root)
);
