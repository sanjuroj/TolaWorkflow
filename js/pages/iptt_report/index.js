/**
 * entry point for the iptt_report webpack bundle
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import ipttRouter from './router';
import ReportAPI from './api';
import ProgramStore from './models/programStore';
import FilterStore from './models/filterStore';
import ReportStore from './models/reportStore';
import IPTTReportApp from './components/main';

const API = new ReportAPI(jsContext.api_url);
const dataStore = new ProgramStore(jsContext, API);
const filterStore = new FilterStore(dataStore);
const reportStore = new ReportStore(filterStore);
const routeStore = new ipttRouter(filterStore, jsContext);
routeStore.init();


ReactDOM.render(<Provider filterStore={ filterStore }
                          routeStore={ routeStore }
                          reportStore={ reportStore }>
                    <IPTTReportApp />    
                </Provider>,
                document.querySelector('#id_div_content'));