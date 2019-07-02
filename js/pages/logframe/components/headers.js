import React from 'react';

const HeaderCell = ({ label }) => {
    return (
        <th className="table-cell">
            <span className="spacer-span"></span>
            <span className="table-cell__text">{ label }</span>
        </th>
    );
}

const HeaderRow = ({ headers }) => {
    return (
        <thead>
            <tr className="logframe--table--row logframe--table--row__header">
                { headers.map((label, idx) => <HeaderCell label={ label } key={ idx } />) }
            </tr>
        </thead>
    );
}

export default HeaderRow;
