import React from 'react';
import { inject } from 'mobx-react';
import SubTitleRow from './subtitle';
import LogframeTable from './table';


const LogframeApp = () => {
    return (
        <React.Fragment>
            <SubTitleRow />
            <div className="logframe--table--wrapper">
                <LogframeTable />
            </div>
        </React.Fragment>
    );
}

export default LogframeApp;