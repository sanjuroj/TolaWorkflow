import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'

const status_options = [
    {value: true, label: gettext('Active')},
    {value: false, label: gettext('Inactive')}
]

const ChangeField = ({name, data}) => {
    return <div className="change__field">
        <strong>{name}</strong>: {(data != undefined && data != null)?data.toString():'—'}
    </div>
}

const ChangeLogEntryHeader = ({data}) => {
    return <tr className="changelog__entry__header">
        <td className="text-nowrap"><strong>{data.date}</strong></td>
        <td className="text-nowrap">{data.admin_user}</td>
        <td>{data.change_type}</td>
        <td></td>
        <td></td>
    </tr>
}

const ChangeLogEntryRow = ({data}) => {
    if (data.change_type == 'user_programs_updated') {
        // Create multiple row for program/country changes:
        return <React.Fragment>
            {Object.entries(data.diff_list.countries).length > 0 &&
                Object.entries(data.diff_list.countries).map(([id, country]) =>
                    <tr key={id} className="changelog__entry__row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="changelog__change--prev">
                                <ChangeField name="country" data={country.prev.country} />
                                <ChangeField name="role" data={country.prev.role} />
                            </div>
                        </td>
                        <td>
                            <div className="changelog__change--new">
                                <ChangeField name="country" data={country.new.country} />
                                <ChangeField name="role" data={country.new.role} />
                            </div>
                        </td>
                    </tr>
                )
            }
            {Object.entries(data.diff_list.programs).length > 0 &&
                Object.entries(data.diff_list.programs).map(([id, program]) =>
                    <tr key={id} className="changelog__entry__row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <div className="changelog__change--prev">
                                <ChangeField name="program" data={program.prev.program} />
                                <ChangeField name="country" data={program.prev.country} />
                                <ChangeField name="role" data={program.prev.role} />
                            </div>
                        </td>
                        <td>
                            <div className="changelog__change--new">
                                <ChangeField name="program" data={program.new.program} />
                                <ChangeField name="country" data={program.new.country} />
                                <ChangeField name="role" data={program.new.role} />
                            </div>
                        </td>
                    </tr>
                )
            }
        </React.Fragment>
    } else {
        return <tr className="changelog__entry__row">
            <td className="text-nowrap"></td>
            <td></td>
            <td></td>
            <td>
                <div className="changelog__change--prev">
                    {data.diff_list.map((changeset, id)  =>
                        <ChangeField key={id} name={changeset.name} data={changeset.prev} />
                    )}
                </div>
            </td>
            <td>
                <div className="changelog__change--new">
                    {data.diff_list.map((changeset, id) =>
                        <ChangeField key={id} name={changeset.name} data={changeset.new} />
                    )}
                </div>
            </td>
        </tr>
    }
}

const ChangeLogEntry = ({data}) => {
    return <tbody className="changelog__entry" key={data.id}>
        <ChangeLogEntryHeader data={data} />
        <ChangeLogEntryRow data={data} />
    </tbody>
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
                        <th className="text-nowrap">{gettext("Date")}</th>
                        <th className="text-nowrap">{gettext("Admin")}</th>
                        <th className="text-nowrap">{gettext("Change Type")}</th>
                        <th className="text-nowrap td--half-stretch">{gettext("Previous Entry")}</th>
                        <th className="text-nowrap td--half-stretch">{gettext("New Entry")}</th>
                    </tr>
                </thead>
                {history.map((entry, id) =>
                    <ChangeLogEntry key={id} data={entry} />
                )}
            </table>
        </div>
    }
}

export default EditUserHistory
