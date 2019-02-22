import React from 'react';
import ReactDOM from 'react-dom';
import { IPTTFilterForm } from './components/form';
import { IPTTHeader } from './components/report';
import { IPTTReportUIStore, BLANK_LABEL, TVA, TIMEPERIODS } from '../iptt_shared/models';
import { IPTTReportStore } from './models';

const reportType = (jsContext.reportType == 'timeperiods') ? TIMEPERIODS : TVA;

const IPTTTable = (props) => {
    return <table id="iptt_table" className="table table-sm table-bordered table-hover">
               </table>;
}

class IPTTReport extends React.Component {
    render() {
        return <React.Fragment>
                <IPTTHeader {...this.props} />
               </React.Fragment>;
    }
}


let uiStore = new IPTTReportUIStore(jsContext, reportType);
let reportStore = new IPTTReportStore(jsContext);


ReactDOM.render(<IPTTFilterForm uiStore={uiStore} reportType={reportType}/>,
                document.querySelector('#id_iptt_report_filter'));
ReactDOM.render(<IPTTReport uiStore={uiStore} reportStore={reportStore} />,
                document.querySelector('#id_div_top_iptt_report'));