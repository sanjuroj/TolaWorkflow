import React from 'react'
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import { observer } from 'mobx-react';
import Expander from 'components/expander'

const status_options = [
    {value: 'Funded', label: 'Funded'},
    {value: 'Completed', label: 'Completed'}
]

const ChangesetEntry = ({name, type, data}) => {
    return <p><strong>{name}</strong>: {(data != undefined && data != null)?data.toString():'N/A'}</p>
}

@observer
export class ProgramHistory extends React.Component {

    constructor(props) {
        super(props)
        const {program_data} = props
        this.state = {
            managed_status: Object.assign({}, program_data),
            original_status: Object.assign({}, program_data)
        }
    }

    onStatusChange(selection) {
        let value = selection.value
        this.setState({
            managed_status: Object.assign(this.state.managed_status, {'funding_status': value})
        })
    }

    onSave() {
        const program_id = this.state.original_status.id
        const program_data = this.state.managed_status
        this.props.onSave(this.state.original_status.id, this.state.managed_status)
    }

    onReset() {
        this.setState({
            managed_status: this.state.original_status,
        })
    }

    render() {
        const {history} = this.props
        const currentStatusSelection = status_options.find(x=> x.value == this.state.managed_status.funding_status)
        return <div className="tab-pane--react">
            <h2>{this.props.program_data.name}: {gettext("Status and History")}</h2>
            <div className="row">
                <div className="col">
                <div className="form-group">
                    <label htmlFor="status-input" required>{gettext("Program Status")}<span className="required">*</span></label>
                    <Select
                        isSearchable={false}
                        options={status_options}
                        value={currentStatusSelection}
                        onChange={(new_value) => this.onStatusChange(new_value)}
                    />
                </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={() => this.onSave()}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>{gettext("Date")}</th>
                                <th>{gettext("Admin User")}</th>
                                <th>{gettext("Change Type")}</th>
                                <th>{gettext("Previous Entry")}</th>
                                <th>{gettext("New Entry")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.history.map(entry => <tr key={entry.id}>
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

export default ProgramHistory
