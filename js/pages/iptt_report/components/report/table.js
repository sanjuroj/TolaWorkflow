import React from 'react';
import ReportTableHeader from './tableHeader';
import ReportTableBody from './tableBody';

const IPTTTable = () => {
    //return (
    //    <table className="table table-sm table-bordered table-hover table__iptt" id="iptt_table">
    //        <IPTTTableHead />
    //        <IPTTTableBody />
    //    </table>
    //    );
    return (
        <table className="table table-sm table-bordered table-hover table__iptt" id="iptt_table">
            <ReportTableHeader />
            <ReportTableBody />
        </table>
        );
}
export default IPTTTable;