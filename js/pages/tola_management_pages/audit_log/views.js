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
    'id': gettext('ID'),
}

const ResultChangeset = ({data, name}) => {
    if(name == 'evidence_url') {
        return <div className="change__field"><strong>{result_changeset_name_map[name]}</strong>: {(data != 'N/A')?<a href={data}>Link</a>:data}</div>
    } else {
        return <div className="change__field"><strong>{result_changeset_name_map[name]}</strong>: {data}</div>
    }
}

const program_dates_changset_name_map = {
    'start_date': gettext('Start Date'),
    'end_date': gettext('End Date')
}

const ProgramDatesChangeset = ({data, name}) => {
    return <div className="change__field"><strong>{program_dates_changset_name_map[name]}</strong>: {data}</div>
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
        return <div className="changelog__change__targets">
            <h4 className="text-small">{gettext('Targets changed')}</h4>
            {Object.entries(data).map(([id, target]) => {
                return <div className="change__field" key={id}><strong>{target.name}:</strong> {target.value}</div>
            })}
        </div>
    } else {
        return <div className="change__field">
            <strong>{indicator_changeset_name_map[name]}:</strong> {(mapped_data !== null && mapped_data !== undefined)?mapped_data.toString():'N/A'}
        </div>
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
        return <div id="audit-log-index-view">

            <div className="admin-list__controls">
                <div className="controls__bulk-actions" />
                <div className="controls__buttons">
                    <a className="btn btn-secondary btn-sm" href={`/api/tola_management/program/${store.program_id}/export_audit_log`}>
                        <i className="fas fa-download"></i>
                        {gettext("Excel")}
                    </a>
                </div>
            </div>
            <div className="admin-list__table">
                <LoadingSpinner isLoading={store.fetching}>
                    <table className="table table-sm table-bordered bg-white text-small changelog">
                        <thead>
                            <tr>
                                <th className="text-nowrap">{gettext("Date and Time")}</th>
                                <th className="text-nowrap">{gettext("No.")}</th>
                                <th className="text-nowrap">{gettext("Indicator")}</th>
                                <th className="text-nowrap">{gettext("User")}</th>
                                <th className="text-nowrap">{gettext("Organization")}</th>
                                <th className="text-nowrap">{gettext("Change Type")}</th>
                                <th className="text-nowrap">{gettext("Previous Entry")}</th>
                                <th className="text-nowrap">{gettext("New Entry")}</th>
                                <th className="text-nowrap">{gettext("Rationale")}</th>
                            </tr>
                        </thead>
                        {store.log_rows.map(data => <tbody>
                            <tr className="changelog__entry__header is-expanded">
                                <td>{data.date}</td>
                                <td>{(data.indicator)?data.indicator.number:'N/A'}</td>
                                <td>{(data.indicator)?data.indicator.name:'N/A'}</td>
                                <td>{data.user}</td>
                                <td>{data.organization}</td>
                                <td>{map_pretty_change_type(data.change_type)}</td>{/* SWEET FANCY MOSES WHAT IS THIS */}
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr className="changelog__entry__row" key={data.id}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="changelog__change--prev">
                                    {data.diff_list.map(changeset => {
                                        return <ChangesetEntry key={changeset.name} name={changeset.name} type={data.change_type} data={changeset.prev} />
                                    })}
                                </td>
                                <td className="changelog__change--new">
                                    {data.diff_list.map(changeset => {
                                        return <ChangesetEntry key={changeset.name} name={changeset.name} type={data.change_type} data={changeset.new} />
                                    })}
                                </td>
                                <td className="changelog__change--rationale">{data.rationale}</td>
                            </tr>
                        </tbody>
                        )}
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
