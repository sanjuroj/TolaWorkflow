import React from 'react';
import ReactDOM from 'react-dom';
import { IPTTFilterForm } from './components/form';
import { IPTTHeader } from './components/report';
import { IPTTReportUIStore, BLANK_LABEL, TVA, TIMEPERIODS } from '../iptt_shared/models';
import { IPTTReportStore } from './models';

const reportType = (jsContext.reportType == 'timeperiods') ? TIMEPERIODS : TVA;

const IPTTTableHeader = (props) => {
    return <thead className="thead-light">
                <tr>
                    <td colspan="9" id="id_td_iptt_program_name" className="lopCols align-bottom pt-2">
                        <h5 className="m-0"><strong>{ props.reportStore.program.name }</strong></h5>
                    </td>
                    <td scope="colgroup" colspan="3" className="text-center align-bottom text-uppercase">
                        {props.uiStore.labels.lopLabel}
                    </td>
                </tr>
            </thead>;
}

const IPTTTable = (props) => {
    return <table id="iptt_table" className="table table-sm table-bordered table-hover">
                <colgroup scope="col" span="9"></colgroup>
                <colgroup scope="col" span="3" className="lopCols"></colgroup>
                <colgroup scope="col" span={props.reportStore.dateRanges.length}></colgroup>
                <IPTTTableHeader {...props} />
               </table>;
}

class IPTTReport extends React.Component {
    render() {
        return <React.Fragment>
                <IPTTHeader {...this.props} />
                <IPTTTable {...this.props} />
               </React.Fragment>;
    }
}


let uiStore = new IPTTReportUIStore(jsContext, reportType);
let reportStore = new IPTTReportStore(jsContext);


ReactDOM.render(<IPTTFilterForm uiStore={uiStore} reportType={reportType}/>,
                document.querySelector('#id_iptt_report_filter'));
ReactDOM.render(<IPTTReport uiStore={uiStore} reportStore={reportStore} />,
                document.querySelector('#id_div_top_iptt_report'));