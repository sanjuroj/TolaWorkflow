import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'

const status_options = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'}
]

export default class EditOrganizationHistory extends React.Component {

    constructor(props) {
        super(props)
        const data = {
            ...props.organizationData,
            is_active: status_options.find(op => op.value == props.organizationData.is_active)
        }
        this.state = {
            initial_data: data,
            data: {...data}
        }
    }

    onChange(new_value) {
        this.state.data.is_active = new_value

        this.setState({
            data: this.state.data
        })
    }

    onReset() {
        this.setState({
            data: this.state.initial_data
        })
    }

    save(e) {
        e.preventDefault()
        this.props.onSave({
            ...this.state.data,
            is_active: this.state.data.is_active.value,
            sectors: this.state.data.sectors.map(sector => sector.id)
        })
    }

    render() {
        return <div className="edit-user-organization container">
            <h2>OrganizationName: Status and History</h2>
            <div className="row">
                <div className="col">
                    <Select options={status_options} value={this.state.data.is_active} onChange={(new_value) => this.onChange(new_value)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary" type="button" onClick={(e) => this.save(e)}>Save Changes</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.onReset()}>Reset</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Admin User</th>
                                <th>Change Type</th>
                                <th>Previous Entry</th>
                                <th>New Entry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.organizationHistoryData.map(row => <tr>
                                <td>{row.date}</td>
                                <td>{row.admin_name}</td>
                                <td>{row.change_type}</td>
                                <td>{row.previous}</td>
                                <td>{row.new}</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}
