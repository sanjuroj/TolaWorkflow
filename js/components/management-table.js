import { observer } from "mobx-react"
import React from 'react';

/*
   Props:

   - HeaderRow: a function to render the header row. it receives a component
     prop to render the header column and row

   - Row: a function used to render each row. it receives a component prop to
     render the column, it receives the relevant data for that row as a prop data

   - Expando: renderer for the interior of the expando

   - data: the dataset used to render the table, it must be an array

   - keyField: field to use for key on rows and expando checking

   - expandoTarget: the row that should open the expando as referenced by keyField

 */
const ColumnComponent = ({className, size, ...props}) => <div className={["mgmt-table__col", className].join(' ')} style={{"flex-grow": size}} {...props}>{props.children}</div>
const RowComponent = ({className, size, ...props}) => <div className={["mgmt-table__row", className].join(' ')} {...props}>{props.children}</div>
const ExpandoWrapper = (props) => <div {...props}>{props.children}</div>

const ManagementTable = observer(({HeaderRow, Row, Expando, data, keyField, expandoTarget}) => {
    const ObservedHeaderRow = observer(HeaderRow)
    const ObservedRow = observer(Row)
    const ObservedExpando = observer(Expando)
    return <div className="mgmt-table">
        <div className="mgmt-table__head">
            <ObservedHeaderRow Col={ColumnComponent} Row={RowComponent}/>
        </div>
        {data.map(row_data =>
            <div className="mgmt-table__body" key={row_data[keyField]}>
                <ObservedRow data={row_data} Col={ColumnComponent} Row={RowComponent}/>
                {expandoTarget == row_data[keyField] &&
                <ObservedExpando Wrapper={ExpandoWrapper} />
                }
            </div>
        )}
    </div>
})
export default ManagementTable
