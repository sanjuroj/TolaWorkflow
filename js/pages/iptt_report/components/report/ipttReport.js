import React from 'react';
import IPTTHeader from './header';
import IPTTTable from './table';

const IPTTReport = () => {
    return <main className="iptt_table_wrapper">
                <div id="id_div_top_iptt_report">
                    <IPTTHeader />
                    <IPTTTable />
                </div>
            </main>;
                
}

export default IPTTReport;