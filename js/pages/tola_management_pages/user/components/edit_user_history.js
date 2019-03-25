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
    return <div className="changeset__change"><strong>{name}</strong>: {(data != undefined && data != null)?data.toString():'N/A'}</div>
}

const ProgramChangesetEntry = ({data}) => {
    return <React.Fragment>
        {Object.entries(data.countries).length > 0 &&
            Object.entries(data.countries).map(([id, country]) =>
                <tr key={id} className="changelog__entry__row">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <div className="changeset__change"><strong>{gettext("Country")}</strong>: {country.prev.country}</div>
                        <div className="changeset__change"><strong>{gettext("Role")}</strong>: {country.prev.role}</div>
                    </td>
                    <td>
                        <div className="changeset__change"><strong>{gettext("Country")}</strong>: {country.new.country}</div>
                        <div className="changeset__change"><strong>{gettext("Role")}</strong>: {country.new.role}</div>
                    </td>
                </tr>
            )
        }
        {Object.entries(data.programs).length > 0 &&
            Object.entries(data.programs).map(([id, program]) =>
                <tr key={id} className="changelog__entry__row">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <div className="changeset__change"><strong>{gettext("Program")}</strong>: {program.prev.program}</div>
                        <div className="changeset__change"><strong>{gettext("Country")}</strong>: {program.prev.country}</div>
                        <div className="changeset__change"><strong>{gettext("Role")}</strong>: {program.prev.role}</div>
                    </td>
                    <td>
                        <div className="changeset__change"><strong>{gettext("Program")}</strong>: {program.new.program}</div>
                        <div className="changeset__change"><strong>{gettext("Country")}</strong>: {program.new.country}</div>
                        <div className="changeset__change"><strong>{gettext("Role")}</strong>: {program.new.role}</div>
                    </td>
                </tr>
            )
        }
    </React.Fragment>
}

export class EditUserHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            original_user_data: {user: {is_active: props.userData.user.is_active}},
            user_data: {user: {is_active: props.userData.user.is_active}}
        }
    }

    onChange(new_value) {
        this.setState({
            user_data: {
                user: {is_active: new_value.value}
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
        return <div className="admin-edit-pane">
            <h2 className="no-bold">{this.state.user_data.name?this.state.user_data.name+': ':''}{gettext("Status and History")}</h2>
            <div className="form-group">
                <Select isDisabled={this.props.disabled} options={status_options} value={selected} onChange={(new_value) => this.onChange(new_value)} />
            </div>
            <div className="form-group">
                <button className="btn btn-secondary" onClick={() => this.onResendRegistrationEmail()}>{gettext("Resend Registration Email")}</button>
            </div>
            {!this.props.disabled &&
                <div className="form-group">
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={() => this.props.onSave(this.state.user_data)}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
                    </div>
                </div>
            }
            <table className="table table-sm text-small changelog">
                <thead>
                    <tr>
                        <th>{gettext("Date")}</th>
                        <th>{gettext("Admin")}</th>
                        <th>{gettext("Change Type")}</th>
                        <th>{gettext("Previous Entry")}</th>
                        <th>{gettext("New Entry")}</th>
                    </tr>
                </thead>
                {history.map(entry => {
                    if(entry.change_type == 'user_programs_updated'){
                        return <tbody className="changelog__entry" key={entry.id}>
                            <tr className="changelog__entry__header">
                                <td className="text-nowrap">{entry.id}:{entry.date}</td>
                                <td>{entry.admin_user}</td>
                                <td>{entry.change_type}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            <ProgramChangesetEntry data={entry.diff_list} />
                        </tbody>
                    } else {
                        return <tbody className="changelog__entry" key={entry.id}>
                            <tr className="changelog__entry__row">
                                <td className="text-nowrap">{entry.id}:{entry.date}</td>
                                <td>{entry.admin_user}</td>
                                <td>{entry.change_type}</td>
                                <td>
                                    prev
                                </td>
                                <td>
                                    new
                                </td>
                            </tr>
                        </tbody>
                    }
                    {/*if(entry.change_type == 'user_programs_updated') {
                        return <tbody className="changelog__entry" key={entry.id}>
                            <tr className="changelog__entry__row" key={entry.id}>
                                <td className="text-nowrap">{entry.date}</td>
                                <td>{entry.admin_user}</td>
                                <td>{entry.change_type}</td>
                                <td>
                                    <ProgramChangesetEntry data={entry.diff_list} timeframe="prev"/>
                                </td>
                                <td>
                                    <ProgramChangesetEntry data={entry.diff_list} timeframe="new" />
                                </td>
                            </tr>
                        </tbody>
                    } else {

                        return <tbody className="changelog__entry" key={entry.id}>
                            <tr className="changelog__entry__row">
                                <td className="text-nowrap">{entry.date}</td>
                                <td>{entry.admin_user}</td>
                                <td>{entry.change_type}</td>
                                <td>
                                    diff 1
                                    {entry.diff_list.map(changeset => {
                                        return <ChangesetEntry key={changeset.name} name={changeset.name} type={entry.change_type} data={changeset.prev} />
                                    })}
                                </td>
                                <td>
                                    diff 2
                                    {entry.diff_list.map(changeset => {
                                        return <ChangesetEntry key={changeset.name} name={changeset.name} type={entry.change_type} data={changeset.new} />
                                    })}
                                </td>
                            </tr>
                        } */ }
                })}
            </table>
        </div>
    }
}

export default EditUserHistory
