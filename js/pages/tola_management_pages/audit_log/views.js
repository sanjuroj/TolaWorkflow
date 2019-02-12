import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import classNames from 'classnames'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'

import LoadingSpinner from 'components/loading-spinner'

const map_pretty_change_type = change_type => {
    switch(change_type){
    case 'indicator_changed':
        return 'Indicator changed'
        break;
    case 'indicator_created':
        return 'Indicator created'
        break;
    case 'indicator_deleted':
        return 'Indicator deleted'
        break;
    }
}

const ChangeSetViewComponent = ({changeType, data}) => <div>
    {(changeType == 'indicator_changed' || changeType == 'indicator_created' || changeType == 'indicator_deleted') &&
    <IndicatorChangesetView data={data} />
    }

    {(changeType == 'result_changed' || changeType == 'result_created' || changeType == 'result_deleted') &&
    <div></div>
    }
</div>

const is_field_changed = (p, n, field) => {
    if(!p && n) return true
    if(!n && p) return true
    return p[field] !== n[field]
}

const ChangesetRow = ({data, field, name}) => {
    return <tr className={classNames({'change-table-row__is-changed': is_field_changed(data.previous_entry, data.new_entry, field)})}>
        <td>{name}</td>
        <td>{(data.previous_entry && data.previous_entry[field]) || 'N/A'}</td>
        <td>{(data.new_entry && data.new_entry[field]) || 'N/A'}</td>
    </tr>
}

const TargetChangesetRow = ({data}) => {
    var name = ''
    if(data.new_target) {
        name = data.new_target.name
    } else if (data.prev_target) {
        name = data.prev_target.name
    }
    return <tr className={classNames({'change-table-row__is-changed': is_field_changed(data.prev_target, data.new_target, 'value')})}>
        <td>{name}</td>
        <td>{(data.prev_target && data.prev_target.value) || 'N/A'}</td>
        <td>{(data.new_target && data.new_target.value) || 'N/A'}</td>
    </tr>
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

const IndicatorChangesetView = ({data}) => {
    const previous_entry_targets_table = (data.previous_entry)?hash_targets(data.previous_entry.targets):{}
    const new_entry_targets_table = (data.new_entry)?hash_targets(data.new_entry.targets):{}
    const targets_table = merge_previous_and_new_targets(previous_entry_targets_table, new_entry_targets_table)
    return <div className="container">
        <div className="row">
            <div className="col">
                <h3>Rationale</h3>
                <div>{data.rationale}</div>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <h3>Changeset</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Old Value</th>
                            <th>New Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <ChangesetRow data={data} field="name" name="Name" />
                        <ChangesetRow data={data} field="unit_of_measure" name="Unit of Measure" />
                        <ChangesetRow data={data} field="unit_of_measure_type" name="Unit of Measure Type" />
                        <ChangesetRow data={data} field="is_cumulative" name="Is Cumulative" />
                        <ChangesetRow data={data} field="lop_target" name="LOP Target" />
                        <ChangesetRow data={data} field="direction_of_change" name="Direction of Change" />
                        <ChangesetRow data={data} field="rationale_for_target" name="Rationale for Target" />
                        <ChangesetRow data={data} field="baseline_value" name="Baseline Value" />
                        <ChangesetRow data={data} field="baseline_na" name="Baseline N/A" />
                    </tbody>
                </table>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <h3>Target Changesets</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Target</th>
                            <th>Old Value</th>
                            <th>New Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(targets_table).map(([id, data]) => <TargetChangesetRow data={data}/>)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export const IndexView = observer(
    ({store}) => {
        return <div id="organization-management-index-view" className="container-fluid row">
            <div className="col col-sm-12 list-section">
                <LoadingSpinner isLoading={store.fetching}>
                    <div className="list-table">
                        <ManagementTable
                            data={store.log_rows}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size="0.5"></Col>
                                    <Col>Date and Time</Col>
                                    <Col size="0.5">No.</Col>
                                    <Col size="2">Indicator</Col>
                                    <Col>User</Col>
                                    <Col>Organization</Col>
                                    <Col>Change Type</Col>
                                </Row>
                            }
                            Row={({Col, Row, data}) =>
                                <Row
                                expanded={data.id == store.details_target}
                                Expando={({Wrapper}) =>
                                    <Wrapper>
                                        <ChangeSetViewComponent changeType={data.change_type} data={data} />
                                    </Wrapper>
                                }>
                                    <Col size="0.5">
                                        <div className="td--stretch">
                                            <div className="icon__clickable" onClick={() => store.toggleDetailsTarget(data.id)} >
                                                <i className="fa fa-eye"></i>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>{data.date}</Col>
                                    <Col size="0.5">{(data.indicator)?data.indicator.number:'N/A'}</Col>
                                    <Col size="2">{(data.indicator)?data.indicator.name:'N/A'}</Col>
                                    <Col>{data.user}</Col>
                                    <Col>{data.organization}</Col>
                                    <Col>{map_pretty_change_type(data.change_type)}</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="list-metadata row">
                </div>
            </div>
        </div>
    }
)
