import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import Expander from 'components/expander'

const status_options = [
    {value: true, label: gettext('Active')},
    {value: false, label: gettext('Inactive')}
]

const ChangesetEntry = ({name, type, data}) => {
    return <p><strong>{name}</strong>: {(data != undefined && data != null)?data.toString():'N/A'}</p>
}

const ProgramChangesetEntry = ({data, timeframe}) => {
    return <div>
        {Object.entries(data.countries).length > 0 &&
        <div>
            <h3>Countries</h3>
            {Object.entries(data.countries).map(([id, country]) =>
                <div key={id} className="program-changeset-row">
                    <p><strong>{gettext("Country")}</strong>: {country[timeframe].country}</p>
                    <p><strong>{gettext("Role")}</strong>: {country[timeframe].role}</p>
                </div>
            )}
        </div>
        }
        {Object.entries(data.programs).length > 0 &&
        <div>
            <h3>Programs</h3>
            {Object.entries(data.programs).map(([id, program]) =>
                <div key={id} className="program-changeset-row">
                    <p><strong>{gettext("Program")}</strong>: {program[timeframe].program}</p>
                    <p><strong>{gettext("Country")}</strong>: {program[timeframe].country}</p>
                    <p><strong>{gettext("Role")}</strong>: {program[timeframe].role}</p>
                </div>
            )}
        </div>
        }
    </div>
}

export class EditUserHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            original_user_data: props.userData,
            user_data: {...props.userData, user: {...props.userData.user}}
        }
    }

    onChange(new_value) {
        this.setState({
            user_data: {
                ...this.state.user_data,
                user: {...this.state.user_data.user, is_active: new_value.value}
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
        const selected = status_options.find(option => option.value == this.state.user_data.user.is_active)
        const {history} = this.props
        return <div className="edit-user-history">
            <h2 className="no-bold">{this.state.user_data.name?this.state.user_data.name+': ':''}{gettext("Status and History")}</h2>
            <div className="row">
                <div className="col">
                    <Select isDisabled={this.props.disabled} options={status_options} value={selected} onChange={(new_value) => this.onChange(new_value)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-secondary" onClick={() => this.onResendRegistrationEmail()}>{gettext("Resend Registration Email")}</button>
                </div>
            </div>
            <div className="row">
                {!this.props.disabled &&
                <div className="col">
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={() => this.props.onSave(this.state.user_data)}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
                    </div>
                </div>
                }
            </div>
            <div className="row">
                <div className="col">
                    <table>
                        <thead>
                            <tr>
                                <th>{gettext("Date")}</th>
                                <th>{gettext("Admin")}</th>
                                <th>{gettext("Change Type")}</th>
                                <th>{gettext("Previous Entry")}</th>
                                <th>{gettext("New Entry")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(entry => {
                                if(entry.change_type == 'user_programs_updated') {
                                    return <tr key={entry.id}>
                                        <td>{entry.date}</td>
                                        <td>{entry.admin_user}</td>
                                        <td>{entry.change_type}</td>
                                        <td className="expand-section">
                                            <Expander>
                                                <ProgramChangesetEntry data={entry.diff_list} timeframe="prev"/>
                                            </Expander>
                                        </td>
                                        <td className="expand-section">
                                            <Expander>
                                                <ProgramChangesetEntry data={entry.diff_list} timeframe="new" />
                                            </Expander>
                                        </td>
                                    </tr>
                                } else {

                                    return <tr key={entry.id}>
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
                                    </tr>
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}

export default EditUserHistory
