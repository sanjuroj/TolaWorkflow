import React from 'react';

/*
   Props:

   - HeaderRow: a function to render the header row. it receives a component
     prop to render the header column
   - Row: a function used to render each row. it receives a component prop to
     render the column, it receives the relevant data for that row as a prop data
   - data: the dataset used to render the table, it must be an array
 */
const Column = (props) => <div className="mgmt-table-col">{props.children}</div>

const ManagementTable = ({HeaderRow, Row, data}) =>
    <div className="mgmt-table">
        <div className="mgmt-table-head">
            <HeaderRow className="mgmt-table-row" Col={Column} />
        </div>
        <div className="mgmt-table-body">
            {data.map(row_data =>
                <div className="mgmt-table-row">
                    <Row className="mgmt-table-row" data={row_data} Col={Column} />
                </div>
            )}
        </div>
    </div>
