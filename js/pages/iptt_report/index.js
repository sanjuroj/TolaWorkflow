/**
 * entry point for the iptt_report webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { Provider, inject } from 'mobx-react';
import { ReportStore, RootStore } from './models';
import { IPTTSidebar, IPTTReport } from './components/main';

//testing:
import { contextFixture, reportData } from './fixtures';


const labels = contextFixture.labels;
const rootStore = new RootStore(contextFixture);

const routes = [
    {name: 'iptt', path: '/:programId<\\d+>/:reportType/?frequency&timeperiods&targetperiods&timeframe&numrecenteperiods&start&end&start_period&end_period'}
];

const router = createRouter(routes);

router.usePlugin(browserPlugin({useHash: false, base: '/indicators/iptt_report'}));
router.subscribe(rootStore.updateRoute);
router.start();

rootStore.init(router);

const reportStore = new ReportStore();
reportStore.addReport(reportData[542]);

class IPTTReportApp extends React.Component {
    render() {
        return <React.Fragment>
            <IPTTSidebar />
            <IPTTReport />
        </React.Fragment>
    }
}

ReactDOM.render(<Provider rootStore={ rootStore }
                          reportStore={ reportStore }
                          labels={ labels } >
                    <IPTTReportApp />    
                </Provider>,
                document.querySelector('#id_div_content'));