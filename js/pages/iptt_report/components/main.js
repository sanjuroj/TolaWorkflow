import React from 'react';
import { inject, observer } from 'mobx-react';
import { IPTTHeader, IPTTTable } from './reportComponents';
import { IPTTFilterForm } from './filterForm';


export const IPTTSidebar = inject('labels')(({ labels }) => {
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

export class IPTTReport extends React.Component {
    render() {
        return <main className="iptt_table_wrapper">
                    <div id="id_div_top_iptt_report">
                        <IPTTHeader />
                        <IPTTTable />
                    </div>
                </main>;
                    
    }
}