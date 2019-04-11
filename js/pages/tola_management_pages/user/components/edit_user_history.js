import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import ChangeLog from 'components/changelog'

const status_options = [
    {value: true, label: gettext('Active')},
    {value: false, label: gettext('Inactive')}
]


@observer
export class EditUserHistory extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            original_user_data: {user: {is_active: props.userData.user.is_active}},
            user_data: {user: {is_active: props.userData.user.is_active}}
        }
    }

    save() {
        this.props.onSave(this.state.user_data)
    }

    onChange(new_value) {
        this.setState({
            user_data: {
                user: {is_active: new_value.value}
            }
        }, () => this.hasUnsavedDataAction())
    }

    onResendRegistrationEmail() {
        this.props.onResendRegistrationEmail()
    }

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(this.state.user_data.user.is_active == this.state.user_data.user.is_active)
    }

    onReset() {
        this.setState({
            user_data: this.state.original_user_data
        }, () => this.hasUnsavedDataAction())
    }

    toggleChangeLogRowExpando = (row_id) => {
        this.props.store.toggleChangeLogRowExpando(row_id);
    }

    render() {
        const selected = status_options.find(option => option.value == this.state.user_data.user.is_active)
        const {history, store} = this.props
        const changelog_expanded_rows = store.changelog_expanded_rows;
        return <div className="edit-user-history">
            <h2 className="no-bold">{this.state.user_data.name?this.state.user_data.name+': ':''}{gettext("Status and History")}</h2>
            <div className="form-group">
                <button className="btn btn-secondary" onClick={() => this.onResendRegistrationEmail()}>{gettext("Resend Registration Email")}</button>
            </div>
            <div className="form-group">
                <label className="label--required" htmlFor="user-status-input">{gettext("Status")}</label>
                <Select
                    isDisabled={this.props.disabled}
                    options={status_options}
                    value={selected}
                    id="user-status-input"
                    onChange={(new_value) => this.onChange(new_value)} />
            </div>
            {!this.props.disabled &&
            <div className="form-group">
                <button className="btn btn-primary" type="button" onClick={() => this.save()}>{gettext("Save Changes")}</button>
                <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
            </div>
            }
            <ChangeLog data={history} expanded_rows={changelog_expanded_rows} toggle_expando_cb={(row_id) => store.toggleChangeLogRowExpando(row_id)} />
        </div>
    }
}

export default EditUserHistory
