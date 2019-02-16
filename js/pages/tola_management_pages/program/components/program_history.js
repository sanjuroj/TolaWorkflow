import React from 'react'
import Select from 'react-select'
import {AutoSizer, Table, Column, CellMeasurer, CellMeasurerCache} from 'react-virtualized'
import { observer } from 'mobx-react';

const status_options = [
    {value: 'Funded', label: 'Funded'},
    {value: 'Completed', label: 'Completed'}
]

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
        return <div className="edit-user-history container">
            <h2>{this.props.program_data.name}: Status and History</h2>
            <div className="row">
                <div className="col">
                <div className="form-group">
                    <label htmlFor="status-input" required>Program Status*</label>
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
                    <button className="btn btn-primary" type="button" onClick={() => this.onSave()}>Save Changes</button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => this.onReset()}>Reset</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="virtualized-table__wrapper">
                        { this.props.history &&
                        <AutoSizer>
                            {({height, width}) =>
                                <Table
                                height={height}
                                headerHeight={50}
                                width={width}
                                rowGetter={({index}) => history[index]}
                                rowHeight={50}
                                rowCount={history.length}>

                                    <Column
                                    dataKey="date"
                                    label="Date"
                                    width={100}
                                    flexGrow={1} />

                                    <Column
                                    dataKey="admin_name"
                                    label="Admin"
                                    width={100}
                                    flexGrow={2} />

                                    <Column
                                    width={100}
                                    flexGrow={2}
                                    dataKey="change_type"
                                    label="Change Type" />

                                    <Column
                                    width={100}
                                    flexGrow={2}
                                    dataKey="previous"
                                    label="Previous Entry" />

                                    <Column
                                    width={100}
                                    flexGrow={2}
                                    dataKey="new"
                                    label="New Entry" />

                                </Table>
                            }
                        </AutoSizer>
                        }
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProgramHistory
