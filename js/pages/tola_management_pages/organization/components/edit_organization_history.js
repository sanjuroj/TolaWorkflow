import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import Expander from 'components/expander'
import ChangeLog from 'components/changelog'

const status_options = [
    {value: true, label: gettext('Active')},
    {value: false, label: gettext('Inactive')}
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

    hasUnsavedDataAction() {
        this.props.onIsDirtyChange(JSON.stringify(this.state.data) != JSON.stringify(this.state.initial_data))
    }

    onChange(new_value) {
        this.state.data.is_active = new_value

        this.setState({
            data: this.state.data
        }, () => this.hasUnsavedDataAction())
    }

    onReset() {
        this.setState({
            data: this.state.initial_data
        }, () => this.hasUnsavedDataAction())
    }

    save() {
        this.props.onSave({
            ...this.state.data,
            is_active: this.state.data.is_active.value,
            sectors: this.state.data.sectors
        })
    }

    render() {
        const {organizationHistoryData, store} = this.props;
        const changelog_expanded_rows = store.changelog_expanded_rows;
        return <div className="tab-pane--react">
            <h2 className="no-bold">{this.state.data.name ? this.state.data.name+": ": ""}{gettext("Status and history")}</h2>
            <div className="form-group">
                <label className="label--required" htmlFor="organization-status-input">{gettext("Status")}</label>
                <Select
                    options={status_options}
                    value={this.state.data.is_active}
                    id="organization-status-input"
                    onChange={(new_value) => this.onChange(new_value)} />
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-group btn-row">
                        <button className="btn btn-primary" type="button" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                        <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
                    </div>
                </div>
            </div>

            <ChangeLog data={organizationHistoryData} expanded_rows={changelog_expanded_rows} toggle_expando_cb={(row_id) => store.toggleChangeLogRowExpando(row_id)} />

        </div>
    }
}
