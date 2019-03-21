import React from 'react';
import { inject, observer } from 'mobx-react';
import { IPTTTable } from './reportComponents';
import { IPTTFilterForm } from './filterForm';
import { PinButton, ExcelButton } from './buttons';


const IPTTHeader = inject('labels', 'rootStore')(
    observer(({ labels, rootStore }) => {
        return <div className="page-subheader">
                    <div id="id_span_iptt_date_range" className="subheader__title">
                        <h2 className="pt-3 text-title-case">{ labels.reportTitle }</h2>
                        <h4 className="pb-3">{ (rootStore.startPeriodLabel && rootStore.endPeriodLabel)
                                               ? rootStore.startPeriodLabel + " - " + rootStore.endPeriodLabel
                                               : "" }</h4>
                    </div>
                    <div className="subheader__actions">
                        <PinButton />
                        <ExcelButton />
                    </div>
                </div>
    })
);


const IPTTSidebar = inject('labels')(({ labels }) => {
    return <div className="sidebar_wrapper">
                <div className="collapse width show" id="sidebar">
                  <IPTTFilterForm />
                </div>
                <div className="sidebar-toggle">
                  <a href="#" data-target="#sidebar" data-toggle="collapse"
                        title={ labels.sidebarToggle }>
                    <i className="fa fa-chevron-left"></i>
                  </a>
                </div>
            </div>;
});


const IPTTReport = () => {
    return <main className="iptt_table_wrapper">
                <div id="id_div_top_iptt_report">
                    <IPTTHeader />
                    <IPTTTable />
                </div>
            </main>;
                
}

export class IPTTReportApp extends React.Component {
    render() {
        return <React.Fragment>
            <IPTTSidebar />
            <IPTTReport />
        </React.Fragment>
    }
}