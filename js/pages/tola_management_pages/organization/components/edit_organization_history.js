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
        this.state = {
        }
    }

    onChange(new_value) {
        this.setState({
        })
    }

    onReset() {
        this.setState({
        })
    }

    render() {
        const selected = null
        return <div className="edit-user-organization container">
            <h2>OrganizationName: Status and History</h2>
            <div className="row">
                <div className="col">
                    <Select options={status_options} value={selected} onChange={(new_value) => this.onChange(new_value)} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-primary" type="button" onClick={() => this.props.onSave()}>Save Changes</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.onReset()}>Reset</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="virtualized-table__wrapper">
                    </div>
                </div>
            </div>
        </div>
    }
}
