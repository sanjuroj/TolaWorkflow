import { observer } from "mobx-react"
import React from 'react';

const ColumnComponent = ({className, size, ...props}) => <div className={["mgmt-table__col", className].join(' ')} style={{flexGrow: size}} {...props}>{props.children}</div>
const InnerRowComponent = (props) => <div className="mgmt-table__row">{props.children}</div>

/***
    A wrapper for the rendering of the given row renderer, it takes and expando
    renderer used to render expanded content

    Props:
    - expanded: whether the expando content is shown or not
    - Expando: The content to render when the expando is shown
*/
const RowComponent = observer(({className, expanded, Expando, ...props}) => {
    if(Expando) {
        const ObservedExpando = observer(Expando)
        return <div className={["mgmt-table__body", className].join(' ')} {...props} >
            <InnerRowComponent>{props.children}</InnerRowComponent>
            {expanded && <ObservedExpando Wrapper={ExpandoWrapper} />}
        </div>
    } else {
        return <div className={["mgmt-table__body", className].join(' ')} {...props} >
            <InnerRowComponent>{props.children}</InnerRowComponent>
        </div>
    }
})
const ExpandoWrapper = ({className, ...props}) => <div className={["container-fluid", className].join(' ')} {...props}>{props.children}</div>
const RowList = observer(({data, Row, keyField, ...props}) => {
    const ObservedRow = observer(Row)
    return <div className="mgmt-table__rows">
        {data.map(row_data => <ObservedRow key={row_data[keyField]} data={row_data} Col={ColumnComponent} Row={RowComponent} />)}
    </div>
})

/*
   Props:

   - HeaderRow: a function to render the header row. it receives a component
   prop to render the header column and row

   - Row: a function used to render each row. it receives a component prop to
    render the row (see RowComponent), it receives the relevant data for that
    row as a prop: data

   - data: the dataset used to render the table, it must be an array

   - keyField: field to use for key on rows and expando checking

 */
const ManagementTable = observer(({HeaderRow, className, ...props}) => {
    const ObservedHeaderRow = observer(HeaderRow)
    return <div className={["mgmt-table", className].join(' ')} >
        <div className="mgmt-table__head">
            <ObservedHeaderRow Col={ColumnComponent} Row={InnerRowComponent}/>
        </div>
        <RowList {...props} />
    </div>
})
export default ManagementTable
