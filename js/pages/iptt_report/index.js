/**
 * entry point for the iptt_report webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { Provider, inject } from 'mobx-react';
import { RootStore, ReportAPI } from './models';
import { IPTTReportApp } from './components/main';

//testing:
import { contextFixture, reportData } from './fixtures';


const labels = jsContext.labels;
const reportAPI = new ReportAPI('/indicators/iptt_report_data/');
const rootStore = new RootStore(jsContext, reportAPI);

const routes = [
    {name: 'iptt', path: '/:programId<\\d+>/:reportType/?frequency&timeperiods&targetperiods&timeframe&numrecenteperiods&start&end&start_period&end_period'}
];

const router = createRouter(routes);

router.usePlugin(browserPlugin({useHash: false, base: '/indicators/iptt_report'}));
router.subscribe(rootStore.updateRoute);
router.start();

rootStore.init(router);


ReactDOM.render(<Provider rootStore={ rootStore }
                          labels={ labels } >
                    <IPTTReportApp />    
                </Provider>,
                document.querySelector('#id_div_content'));