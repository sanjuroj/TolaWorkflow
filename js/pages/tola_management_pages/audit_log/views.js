import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import classNames from 'classnames'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import Expander from 'components/expander'

import LoadingSpinner from 'components/loading-spinner'

const ResultChangeset = ({data, name, pretty_name}) => {
    if(name == 'evidence_url') {
        return <p>{pretty_name}: {(data != 'N/A')?<a href={data}>Link</a>:data}</p>
    } else {
        return <p>{pretty_name}: {data}</p>
    }
}

const ProgramDatesChangeset = ({data, name, pretty_name}) => {
    return <p>{pretty_name}: {data}</p>
}

const IndicatorChangeset = ({data, name, pretty_name}) => {
    if(name == 'targets') {
        return <div>
            <p>Targets</p>
            {Object.entries(data).map(([id, target]) => {
                return <p key={id}>{target.name}: {target.value}</p>
            })}
        </div>
    } else {
        return <p>
            {pretty_name}: {(data !== null && data !== undefined)?data.toString():'N/A'}
        </p>
    }
}

class ChangesetEntry extends React.Component {
    renderType(type, data, name, pretty_name) {
        switch(type) {
            case 'indicator_changed':
            case 'indicator_created':
            case 'indicator_deleted':
                return <IndicatorChangeset data={data} name={name} pretty_name={pretty_name} />
                break
            case 'result_changed':
            case 'result_created':
            case 'result_deleted':
                return <ResultChangeset data={data} name={name} pretty_name={pretty_name} />
                break
            case 'program_dates_changed':
                return <ProgramDatesChangeset data={data} name={name} pretty_name={pretty_name} />
                break
        }
    }

    render() {
        const {data, type, name, pretty_name} = this.props
        return this.renderType(type, data, name, pretty_name)
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
                                <td>{data.pretty_change_type}</td>
                                <td className="expand-section">
                                    <Expander>
                                        {data.diff_list.map(changeset => {
                                             return <ChangesetEntry key={changeset.name} name={changeset.name} pretty_name={changeset.pretty_name} type={data.change_type} data={changeset.prev} />
                                        })}
                                    </Expander>
                                </td>
                                <td className="expand-section">
                                    <Expander>
                                        {data.diff_list.map(changeset => {
                                             return <ChangesetEntry key={changeset.name} name={changeset.name} pretty_name={changeset.pretty_name} type={data.change_type} data={changeset.new} />
                                        })}
                                    </Expander>
                                </td>
                                <td className="expand-section"><Expander>{data.rationale}</Expander></td>
                            </tr>)}
                        </tbody>
                    </table>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div className="metadata__count text-muted text-small">{store.entries_count?`${store.entries_count} ${gettext("entries")}`:`--`}</div>
                    <div className="metadata__controls">
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
