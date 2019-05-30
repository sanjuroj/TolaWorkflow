import React from 'react';
import IPTTSidebar from './sidebar/sidebar';
import IPTTReport from './report/ipttReport';




const IPTTReportApp = () => {
    return <React.Fragment>
                <IPTTSidebar />
                <IPTTReport />
            </React.Fragment>
}

export default IPTTReportApp;