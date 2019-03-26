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
        return <div className="tab-pane--react">
            <h2 className="no-bold">{this.state.data.name ? this.state.data.name+": ": ""}{gettext("Status and history")}</h2>
            <div className="form-group">
                <Select options={status_options} value={this.state.data.is_active} onChange={(new_value) => this.onChange(new_value)} />
            </div>
            <div className="form-group btn-row">
                <button className="btn btn-primary" type="button" onClick={(e) => this.save(e)}>{gettext("Save Changes")}</button>
                <button className="btn btn-reset" type="button" onClick={() => this.onReset()}>{gettext("Reset")}</button>
            </div>

            <ChangeLog data={this.props.organizationHistoryData} />

        </div>
    }
}
