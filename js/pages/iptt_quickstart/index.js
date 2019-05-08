import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import QSRootStore from './models/root_store';
import { IPTTQuickstartForm } from './components/main';

const labels = jsContext.labels;

const rootStore = new QSRootStore(jsContext);

ReactDOM.render(
    <Provider labels={ labels }
              rootStore={ rootStore }>
        <IPTTQuickstartForm />
    </Provider>,
    document.querySelector('#id_div_top_quickstart_iptt')
);