import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import classNames from 'classnames'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import Expander from 'components/expander'

import LoadingSpinner from 'components/loading-spinner'

const pretty_change_type = {
    indicator_changed: gettext('Indicator changed'),
    indicator_created: gettext('Indicator created'),
    indicator_deleted: gettext('Indicator deleted'),
    result_changed: gettext('Result changed'),
    result_created: gettext('Result created'),
    result_deleted: gettext('Result deleted'),
    program_dates_changed: gettext('Program Dates Changed')
}

const map_pretty_change_type = change_type => pretty_change_type[change_type]

const units_of_measure_type = {
    1: gettext("Number"),
    2: gettext("Percentage")
}
const map_unit_of_measure_type = id => units_of_measure_type[id]

const directions_of_change = {
    1: gettext("N/A"),
    2: gettext("Increase (+)"),
    3: gettext("Decrease (-)"),
}
const map_direction_of_change = id => directions_of_change[id]

const result_changeset_name_map = {
    'evidence_url': gettext('Evidence Url'),
    'evidence_name': gettext('Evidence Name'),
    'date': gettext('Date'),
    'target': gettext('Target'),
    'value': gettext('Value'),
}

const ResultChangeset = ({data, name}) => {
    if(name == 'evidence_url') {
        return <p>{result_changeset_name_map[name]}: {(data != 'N/A')?<a href={data}>Link</a>:data}</p>
    } else {
        return <p>{result_changeset_name_map[name]}: {data}</p>
    }
}

const program_dates_changset_name_map = {
    'start_date': gettext('Start Date'),
    'end_date': gettext('End Date')
}

const ProgramDatesChangeset = ({data, name}) => {
    return <p>{program_dates_changset_name_map[name]}: {data}</p>
}

const indicator_changeset_name_map = {
    name: gettext('Name'),
    unit_of_measure: gettext('Unit of Measure'),
    unit_of_measure_type: gettext('Unit of Measure Type'),
    is_cumulative: gettext('Is Cumulative'),
    lop_target: gettext('LOP Target'),
    direction_of_change: gettext('Direction of Change'),
    rationale_for_target: gettext('Rationale for Target'),
    baseline_value: gettext('Baseline Value'),
    baseline_na: gettext('Baseline N/A'),
}

const IndicatorChangeset = ({data, name}) => {
    const mapped_data = (() => {
        if (data == 'N/A') return data

        switch(name) {
            case 'unit_of_measure_type':
                return map_unit_of_measure_type(data)
                break
            case 'direction_of_change':
                return map_direction_of_change(data)
                break
            default:
                return data
                break
        }
    })()
    if(name == 'targets') {
        return <div>
            <p>Targets</p>
            {Object.entries(data).map(([id, target]) => {
                return <p key={id}>{target.name}: {target.value}</p>
            })}
        </div>
    } else {
        return <p>
            {indicator_changeset_name_map[name]}: {(mapped_data !== null && mapped_data !== undefined)?mapped_data.toString():'N/A'}
        </p>
    }
}

class ChangesetEntry extends React.Component {
    renderType(type, data, name) {
        switch(type) {
            case 'indicator_changed':
            case 'indicator_created':
            case 'indicator_deleted':
                return <IndicatorChangeset data={data} name={name}/>
                break
            case 'result_changed':
            case 'result_created':
            case 'result_deleted':
                return <ResultChangeset data={data} name={name} />
                break
            case 'program_dates_changed':
                return <ProgramDatesChangeset data={data} name={name} />
                break
        }
    }

    render() {
        const {data, type, name} = this.props
        return this.renderType(type, data, name)
    }
}

export const IndexView = observer(
    ({store}) => {
        return <div id="audit-log-index-view" className="container-fluid row">

            <div className="admin-list__controls">
                <a className="btn btn-link btn-secondary btn-sm" href={`/api/tola_management/program/${store.program_id}/export_audit_log`}>{gettext("Export to Excel")}</a>
            </div>
            <div className="col col-sm-12 admin-list">
                <LoadingSpinner isLoading={store.fetching}>
                    <table className="admin-list__table">
                        <thead>
                            <tr>
                                <th>{gettext("Date and Time")}</th>
                                <th>{gettext("No.")}</th>
                                <th width="25%">{gettext("Indicator")}</th>
                                <th>{gettext("User")}</th>
                                <th>{gettext("Organization")}</th>
                                <th>{gettext("Change Type")}</th>
                                <th>{gettext("Previous Entry")}</th>
                                <th>{gettext("New Entry")}</th>
                                <th>{gettext("Rationale")}</th>
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
                                <td className="expand-section">
                                    <Expander>
                                        {data.diff_list.map(changeset => {
                                             return <ChangesetEntry key={changeset.name} name={changeset.name} type={data.change_type} data={changeset.prev} />
                                        })}
                                    </Expander>
                                </td>
                                <td className="expand-section">
                                    <Expander>
                                        {data.diff_list.map(changeset => {
                                             return <ChangesetEntry key={changeset.name} name={changeset.name} type={data.change_type} data={changeset.new} />
                                        })}
                                    </Expander>
                                </td>
                                <td className="expand-section"><Expander>{data.rationale}</Expander></td>
                            </tr>)}
                        </tbody>
                    </table>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div id="entries-count">{store.entries_count?`${store.entries_count} ${gettext("entries")}`:`--`}</div>
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
