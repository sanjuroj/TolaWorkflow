import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import Expander from 'components/expander'

const status_options = [
    {value: true, label: 'Active'},
    {value: false, label: 'Inactive'}
]

const ChangesetEntry = ({name, type, data}) => {
    return <p><strong>{name}</strong>: {(data != undefined && data != null)?data.toString():'N/A'}</p>
}

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
        return <div className="edit-organization">
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
                            {this.props.organizationHistoryData.map(entry => <tr key={entry.id}>
                                <td>{entry.date}</td>
                                <td>{entry.admin_user}</td>
                                <td>{entry.change_type}</td>
                                <td className="expand-section">
                                    <Expander>
                                        {entry.diff_list.map(changeset => {
                                                return <ChangesetEntry key={changeset.name} name={changeset.name} type={entry.change_type} data={changeset.prev} />
                                        })}
                                    </Expander>
                                </td>
                                <td className="expand-section">
                                    <Expander>
                                        {entry.diff_list.map(changeset => {
                                                return <ChangesetEntry key={changeset.name} name={changeset.name} type={entry.change_type} data={changeset.new} />
                                        })}
                                    </Expander>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}
