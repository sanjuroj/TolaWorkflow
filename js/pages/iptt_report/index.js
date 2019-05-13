/**
 * entry point for the iptt_report webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import ipttRouter from './router';


const routeStore = new ipttRouter();
routeStore.init();


import { inject, observer } from 'mobx-react';
@inject('routeStore')
@observer
class FilterTest extends React.Component {
    onclick = () => {
        this.props.routeStore.programId = (this.props.routeStore.programId == 400) ? 350 : 400;
    }
    onclicka = () => {
        this.props.routeStore.reportType = (this.props.routeStore.reportType == 2) ? 1 : 2;
    }
    render = () => {
        return (<React.Fragment>
            <div>Hello route = {this.props.routeStore.levels}</div>
            <button onClick={this.onclick}>hiya</button>
            <button onClick={this.onclicka}>hiya</button>
        </React.Fragment>);
    }
}

ReactDOM.render(
    <Provider routeStore={ routeStore }>
        <FilterTest />
    </Provider>,
    document.querySelector('#id_div_content')
);
//import createRouter from 'router5';
//import browserPlugin from 'router5-plugin-browser';
//import { Provider } from 'mobx-react';
//import { RootStore, ReportAPI } from './models';
//import { IPTTReportApp } from './components/main';

//testing:
//import { contextFixture, reportData } from './fixtures';


//const labels = jsContext.labels;
//const reportAPI = new ReportAPI(jsContext.api_url);
//const rootStore = new RootStore(jsContext, reportAPI);

//const routes = [
//    {name: 'iptt', path: '/:programId<\\d+>/:reportType/?frequency&timeperiods&targetperiods&timeframe&numrecenteperiods&start&end&start_period&end_period&levels&sites&types&sectors&indicators&tiers&groupby'}
//];
//
//const router = createRouter(routes);
//
//router.usePlugin(browserPlugin({useHash: false, base: '/indicators/iptt_report'}));
//router.subscribe(rootStore.updateRoute);
//router.start();

//rootStore.init(router);


//ReactDOM.render(<Provider rootStore={ rootStore }
//                          labels={ labels } >
//                    <IPTTReportApp />    
//                </Provider>,
//                document.querySelector('#id_div_content'));