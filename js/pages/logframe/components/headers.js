import React from 'react';

const HeaderCell = ({ label }) => {
    return <div className="table-cell">
        <span className="spacer-span"></span>
        <span className="table-cell__text">{ label }</span></div>;
}

const HeaderRow = ({ headers }) => {
    return (
        <div className="logframe--table--row logframe--table--row__header">
            { headers.map((label, idx) => <HeaderCell label={ label } key={ idx } />) }
        </div>
    );
}

export default HeaderRow;