import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'

const status_options = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'}
]

export class EditUserHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            original_user_data: props.userData,
            user_data: props.userData
        }
    }

    onChange(new_value) {
        this.setState({
            user_data: {
                ...this.state.user_data,
                is_active: new_value.value
            }
        })
    }

    onResendRegistrationEmail() {
        this.props.onResendRegistrationEmail()
    }

    onReset() {
        this.setState({
            user_data: this.state.original_user_data
        })
    }

    render() {
        const selected = status_options.find(option => option.value == this.state.user_data.is_active)
        const {history} = this.props
        return <div className="edit-user-history container">
            <h2>{this.state.user_data.name}: Status and History</h2>
            <div className="row">
                <div className="col">
                    <Select options={status_options} value={selected} onChange={(new_value) => this.onChange(new_value)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-secondary" onClick={() => this.onResendRegistrationEmail()}>Resend Registration Email</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary" type="button" onClick={() => this.props.onSave(this.state.user_data)}>Save Changes</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.onReset()}>Reset</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="virtualized-table__wrapper">
                        <AutoSizer>
                            {({height, width}) =>
                                <Table
                                height={height}
                                headerHeight={50}
                                width={width}
                                rowGetter={({index}) => history[index]}
                                rowHeight={50}
                                rowCount={history.length}>

                                    <Column
                                    dataKey="date"
                                    label="Date"
                                    width={100}
                                    flexGrow={1} />

                                    <Column
                                    dataKey="admin_name"
                                    label="Admin"
                                    width={100}
                                    flexGrow={2} />

                                    <Column
                                    width={100}
                                    flexGrow={2}
                                    dataKey="change_type"
                                    label="Change Type" />

                                    <Column
                                    width={100}
                                    flexGrow={2}
                                    dataKey="previous"
                                    label="Previous Entry" />

                                    <Column
                                    width={100}
                                    flexGrow={2}
                                    dataKey="new"
                                    label="New Entry" />

                                </Table>
                            }
                        </AutoSizer>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default EditUserHistory
