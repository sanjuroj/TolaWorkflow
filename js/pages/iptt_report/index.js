/**
 * entry point for the iptt_report webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { Provider, inject } from 'mobx-react';
import eventBus from '../../eventbus';
import { ReportStore, FilterStore, RootStore } from './models';
import { IPTTSidebar, IPTTReport } from './components/main';

//testing:
import { contextFixture } from './fixtures';


const labels = contextFixture.labels;
const rootStore = new RootStore(contextFixture);

const routes = [
    {name: 'iptt', path: '/:programId<\\d+>/:reportType/?frequency&timeperiods&targetperiods&timeframe&numrecenteperiods&start&end&start_period&end_period'}
];

const router = createRouter(routes);

router.usePlugin(browserPlugin({useHash: false, base: '/indicators/iptt_report'}));
router.subscribe(rootStore.updateRoute);
router.start();

const routerParamsCleanup = (router) => {
    let params = router.getState().params;
    let reload = false;
    if (params.timeperiods || params.targetperiods) {
        params.frequency = params.timeperiods || params.targetperiods;
        delete params['timeperiods'];
        delete params['targetperiods'];
        reload = true;
    }
    if (params.timeframe)
    if (reload) {
        router.navigate(router.getState().name, params, {reload: true});
    }
}

rootStore.init(router);


class IPTTReportApp extends React.Component {
    render() {
        return <React.Fragment>
            <IPTTSidebar />
            <IPTTReport />
        </React.Fragment>
    }
}

ReactDOM.render(<Provider rootStore={ rootStore }
                          labels={ labels } >
                    <IPTTReportApp />    
                </Provider>,
                document.querySelector('#id_div_content'));