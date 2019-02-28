import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import classNames from 'classnames'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'

import LoadingSpinner from 'components/loading-spinner'

const pretty_change_type = {
    indicator_changed: 'Indicator changed',
    indicator_created: 'Indicator created',
    indicator_deleted: 'Indicator deleted',
    result_changed: 'Result changed',
    result_created: 'Result created',
    result_deleted: 'Result deleted',
    program_dates_changed: 'Program Dates Changed'
}

const map_pretty_change_type = change_type => pretty_change_type[change_type]

const is_field_changed = (p, n, field) => {
    if(!p && n) return true
    if(!n && p) return true
    return p[field] !== n[field]
}

const ChangesetRow = ({data, compareAgainst, field, name}) => {
    if(!is_field_changed(data, compareAgainst, field)) return null
    if(data == undefined || data[field] == undefined) {
        return <p>{name}: N/A</p>
    } else {
        return <p>{name}: {data[field].toString()}</p>
    }
}

const ChangesetRowUrl = ({data, compareAgainst, field, name}) => {
    if(data === compareAgainst) return null
    if(data == undefined || data[field] == undefined) {
        return <p>{name}: N/A</p>
    } else {
        return <p>{name}: <a href={data[field]}>{name}</a></p>
    }
}

const hash_targets = targets => targets.reduce((xs, x) => {
    xs[x.id] = x
    return xs
}, {})

const merge_previous_and_new_targets = (prev_table, new_table) => {
    let ret_table = {}
    Object.entries(prev_table).forEach(([id, data]) => {
        ret_table[id] = {
            prev_target: data,
            new_target: null
        }
    })

    Object.entries(new_table).forEach(([id, data]) => {
        ret_table[id] = {
            prev_target: null,
            ...ret_table[id],
            new_target: data
        }
    })

    return ret_table
}

const units_of_measure_type = {
    1: "Number",
    2: "Percentage"
}
const map_unit_of_measure_type = id => units_of_measure_type[id]

const directions_of_change = {
    1: "N/A",
    2: "Increase (+)",
    3: "Decrease (-)",
}
const map_direction_of_change = id => directions_of_change[id]

const ResultChangeset = ({data, compareAgainst}) => {
    return <div>
        <ChangesetRow data={data} compareAgainst={compareAgainst} field="date" name="Collection Date" />
        <ChangesetRow data={data} compareAgainst={compareAgainst} field="target" name="Target" />
        <ChangesetRow data={data} compareAgainst={compareAgainst} field="value" name="Value" />
        <ChangesetRow data={data} compareAgainst={compareAgainst} field="evidence_name" name="Evidence Name" />
        {is_field_changed(data, compareAgainst, 'evidence_url') &&
         <p>Evidence Url: {(data)?<a href={data.evidence_url}>Link</a>:'N/A'}</p>
        }
    </div>
}

const ProgramDatesChangeset = ({data, compareAgainst}) => {
    return <div>
        <ChangesetRow data={data} compareAgainst={compareAgainst} field="start_date" name="Start Date" />
        <ChangesetRow data={data} compareAgainst={compareAgainst} field="end_date" name="End Date" />
    </div>
}

const IndicatorChangeset = ({data, compareAgainst}) => {
    const previous_entry_targets_table = (data)?hash_targets(data.targets):{}
    const new_entry_targets_table = (compareAgainst)?hash_targets(compareAgainst.targets):{}
    const targets_table = merge_previous_and_new_targets(previous_entry_targets_table, new_entry_targets_table)
    const mapped_data = {
        ...data,
        unit_of_measure_type: (data)?map_unit_of_measure_type(data.unit_of_measure_type):undefined,
        direction_of_change: (data)?map_direction_of_change(data.direction_of_change):undefined
    }
    const mapped_compare_against = {
        ...compareAgainst,
        unit_of_measure_type: (compareAgainst)?map_unit_of_measure_type(compareAgainst.unit_of_measure_type):undefined,
        direction_of_change: (compareAgainst)?map_direction_of_change(compareAgainst.direction_of_change):undefined
    }
    return <div>
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="name" name="Name" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="unit_of_measure" name="Unit of Measure" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="unit_of_measure_type" name="Unit of Measure Type" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="is_cumulative" name="Is Cumulative" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="lop_target" name="LOP Target" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="direction_of_change" name="Direction of Change" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="rationale_for_target" name="Rationale for Target" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="baseline_value" name="Baseline Value" />
        <ChangesetRow data={mapped_data} compareAgainst={mapped_compare_against} field="baseline_na" name="Baseline N/A" />
        {Object.entries(targets_table).map(([id, data]) => <ChangesetRow key={id} data={data.prev_target} compareAgainst={data.new_target} field="value" name={data.prev_target?data.prev_target.name:data.new_target.name}/>)}
    </div>
}

class ChangesetEntry extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            overflowing: false,
        }
        this.ref = React.createRef()
    }

    componentDidMount() {
        if(this.ref.current.scrollHeight > this.ref.current.clientHeight) {
            this.setState({overflowing: true})
        }
    }

    toggleExpanded(e) {
        e.preventDefault()
        this.setState({
            expanded: !this.state.expanded
        })
    }

    renderType(type) {
        switch(type) {
            case 'indicator_changed':
            case 'indicator_created':
            case 'indicator_deleted':
                return <IndicatorChangeset data={this.props.data} compareAgainst={this.props.compareAgainst} />
                break;
            case 'result_changed':
            case 'result_created':
            case 'result_deleted':
                return <ResultChangeset data={this.props.data} compareAgainst={this.props.compareAgainst} />
                break;
            case 'program_dates_changed':
                return <ProgramDatesChangeset data={this.props.data} compareAgainst={this.props.compareAgainst} />
            case 'rationale':
                return <div>{this.props.data}</div>
                break;
        }
    }

    render() {
        return <div className="changeset">
            <div ref={this.ref} className={classNames("changeset-entry", {expanded: this.state.expanded})}>
                {this.renderType(this.props.type)}
            </div>
            {this.state.overflowing &&
            <div>
                <a href="" onClick={(e) => this.toggleExpanded(e)}>{(this.state.expanded)?'Show Less':'Show More'}</a>
            </div>
            }
        </div>
    }
}

export const IndexView = observer(
    ({store}) => {
        return <div id="audit-log-index-view" className="container-fluid row">

            <div className="list-controls">
                <a className="btn btn-link btn-secondary" href={`/api/tola_management/program/${store.program_id}/csv_audit_log`}>Export to Excel</a>
            </div>
            <div className="col col-sm-12 list-section">
                <LoadingSpinner isLoading={store.fetching}>
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th>Date and Time</th>
                                <th>No.</th>
                                <th width="25%">Indicator</th>
                                <th>User</th>
                                <th>Organization</th>
                                <th>Change Type</th>
                                <th>Previous Entry</th>
                                <th>New Entry</th>
                                <th>Rationale</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.log_rows.map(data => <tr key={data.id}>
                                <td>{data.date}</td>
                                <td>{(data.indicator)?data.indicator.number:'N/A'}</td>
                                <td>{(data.indicator)?data.indicator.name:'N/A'}</td>
                                <td>{data.user}</td>
                                <td>{data.organization}</td>
                                <td>{map_pretty_change_type(data.change_type)}</td>
                                <td className="expander"><ChangesetEntry type={data.change_type} data={data.previous_entry} compareAgainst={data.new_entry} /></td>
                                <td className="expander"><ChangesetEntry type={data.change_type} data={data.new_entry} compareAgainst={data.previous_entry} /></td>
                                <td className="expander"><ChangesetEntry type="rationale" data={data.rationale} /></td>
                            </tr>)}
                        </tbody>
                    </table>
                </LoadingSpinner>
                <div className="list-metadata">
                    <div id="entries-count">{store.entries_count?`${store.entries_count} entries`:`--`}</div>
                    <div id ="pagination-controls">
                        {store.total_pages &&
                         <Pagination
                             pageCount={store.total_pages}
                             initialPage={store.current_page}
                             onPageChange={page => store.changePage(page)} />
                        }
                    </div>
                </div>
            </div>
        </div>
    }
)
