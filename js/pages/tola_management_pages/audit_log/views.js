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
        return <div className="change__field"><strong>{pretty_name}</strong>: {(data != 'N/A')?<a href={data}>Link</a>:data}</div>
    } else {
        return <div className="change__field"><strong>{pretty_name}</strong>: {data}</div>
    }
}

const ProgramDatesChangeset = ({data, name, pretty_name}) => {
    return <p>{pretty_name}: {data}</p>
}

const IndicatorChangeset = ({data, name, pretty_name}) => {
    if(name == 'targets') {
        return <div className="changelog__change__targets">
            <h4 className="text-small">{gettext('Targets changed')}</h4>
            {Object.entries(data).map(([id, target]) => {
                return <div className="change__field" key={id}><strong>{target.name}:</strong> {target.value}</div>
            })}
        </div>
    } else {
        return <div className="change__field">
            <strong>{pretty_name}:</strong> {(data !== null && data !== undefined)?data.toString():gettext('N/A')}
        </div>
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
        return <div id="audit-log-index-view">
            <header class="page-title">
                <h1><small>{gettext("Indicator change log:")}</small> {store.program_name}</h1>
            </header>

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
                                <td>{(data.indicator)?data.indicator.number:gettext('N/A')}</td>
                                <td>{(data.indicator)?data.indicator.name:gettext('N/A')}</td>
                                <td>{data.user}</td>
                                <td>{data.organization}</td>
                                <td>{data.pretty_change_type}</td>{/* SWEET FANCY MOSES WHAT IS THIS */}
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
                                        return <ChangesetEntry key={changeset.name} name={changeset.name} pretty_name={changeset.pretty_name} type={data.change_type} data={changeset.prev} />
                                    })}
                                </td>
                                <td className="changelog__change--new">
                                    {data.diff_list.map(changeset => {
                                         return <ChangesetEntry key={changeset.name} name={changeset.name} pretty_name={changeset.pretty_name} type={data.change_type} data={changeset.new} />
                                    })}
                                </td>
                                <td className="changelog__change--rationale">{data.rationale}</td>
                            </tr>
                        </tbody>
                        )}
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
