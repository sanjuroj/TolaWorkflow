import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import eventBus from '../../../eventbus';

import {dateFromISOString, mediumDateFormatStr} from "../../../date_utils";


// Given the full records list in rootStore, and the selected filters in uiStore, apply filtering (sans individual record select)
function filterRecords(rootStore, uiStore) {
    let records = rootStore.records;

    if (uiStore.selectedProgramId) {
        records = records.filter(r => r.program === uiStore.selectedProgramId);
    }

    if (uiStore.selectedProjectId) {
        records = records.filter(r => r.project && r.project.id === uiStore.selectedProjectId);
    }

    if (uiStore.selectedIndicatorId) {
        let recordsForIndicator = new Set(rootStore.getRecordsForIndicator(uiStore.selectedIndicatorId));
        records = records.filter(r => recordsForIndicator.has(r.id));
    }

    return records
}


@observer
class ProgramFilterSelect extends React.Component {
    constructor(props) {
        super(props);

        this.onSelection = this.onSelection.bind(this);
    }

    onSelection(selectedObject) {
        let programId = selectedObject ? selectedObject.value : null;
        eventBus.emit('program-id-filter-selected', programId);
    }

    render() {
        const {rootStore, uiStore} = this.props;
        const programs = rootStore.programs;
        const selectedProgramId = uiStore.selectedProgramId;

        let programOptions = programs.map(p => {
            return {value: p.id, label: p.name}
        });

        let selectedValue = null;
        if (selectedProgramId) {
            selectedValue = programOptions.find(p => p.value === selectedProgramId);
        }

        return <Select
            options={programOptions}
            value={selectedValue}
            isClearable={true}
            placeholder={gettext('Filter by program')}
            onChange={this.onSelection}
        />
    }
}


@observer
class IndicatorFilterSelect extends React.Component {
    constructor(props) {
        super(props);

        this.onSelection = this.onSelection.bind(this);
    }

    onSelection(selectedObject) {
        let indicatorId = selectedObject ? selectedObject.value : null;
        eventBus.emit('indicator-id-filter-selected', indicatorId);
    }

    render() {
        const {rootStore, uiStore} = this.props;
        const {selectedProgramId, selectedIndicatorId} = uiStore;

        let indicatorOptions = [];
        if (selectedProgramId) {
            indicatorOptions = rootStore.getIndicators(selectedProgramId).map(i => {
                return {value: i.id, label: i.number ? i.number + ' ' + i.name : i.name}
            });
        }

        let selectedValue = null;
        if (selectedIndicatorId) {
            selectedValue = indicatorOptions.find(p => p.value === selectedIndicatorId);
        }

        return <Select
            isDisabled={! selectedProgramId}
            options={indicatorOptions}
            value={selectedValue}
            isClearable={true}
            placeholder={gettext('Filter by indicator')}
            onChange={this.onSelection}
        />
    }
}


@observer
class RecordFilterSelect extends React.Component {
    constructor(props) {
        super(props);

        this.onSelection = this.onSelection.bind(this);
    }

    onSelection(selectedObject) {
        let recordId = selectedObject ? selectedObject.value : null;
        eventBus.emit('record-id-filter-selected', recordId);
    }

    render() {
        const {rootStore, uiStore} = this.props;
        const records = filterRecords(rootStore, uiStore);
        const selectedRecordId = uiStore.selectedRecordId;

        let recordOptions = records.map(r => {
            return {value: r.id, label: r.name}
        });

        let selectedValue = null;
        if (selectedRecordId) {
            selectedValue = recordOptions.find(r => r.value === selectedRecordId);
        }

        return <Select
            options={recordOptions}
            value={selectedValue}
            isClearable={true}
            placeholder={gettext('Find a record')}
            onChange={this.onSelection}
        />
    }
}


@observer
class RecordsFilterBar extends React.Component {
    render() {
        const {rootStore, uiStore} = this.props;

        return <div className="row">
            <div className="col-3">
                <ProgramFilterSelect rootStore={rootStore} uiStore={uiStore} />
            </div>
            <div className="col-3">
                <IndicatorFilterSelect rootStore={rootStore} uiStore={uiStore} />
            </div>
            <div className="col-3">
                <RecordFilterSelect rootStore={rootStore} uiStore={uiStore} />
            </div>
            <div className="col-3 text-right">
                <a href="/workflow/documentation_add" className="btn btn-link btn-add">
                    <i className="fas fa-plus-circle"/> {gettext("Add record")}</a>
            </div>
        </div>
    }

}


const RecordsListTable = observer(function ({rootStore, uiStore}) {
    // Apply filters to displayed list of records
    let records = filterRecords(rootStore, uiStore);

    // filter down by individual record select
    if (uiStore.selectedRecordId) {
        records = records.filter(r => r.id === uiStore.selectedRecordId);
    }

    // If no records, don't show a table
    if (records.length === 0) {
        return <div>
            <span>No records available</span>
        </div>
    }

    const columns = [
        {
            dataField: 'name',
            text: gettext('Record'),
            sort: true,
            formatter: (cell, row) => {
                return <a href={row.url} target="_blank">{row.name}</a>
            }
        },
        {
            dataField: 'create_date',
            text: gettext('Date added'),
            sort: true,
            formatter: (cell, row) => {
                return <span>{mediumDateFormatStr(dateFromISOString(row.create_date))}</span>
            }
        },
        {
            dataField: 'project.project_name',
            text: gettext('Project'),
            hidden: ! rootStore.allowProjectsAccess
        },
        {
            dataField: 'actions',
            isDummyField: true,
            text: '',
            align: 'right',
            formatter: (cell, row) => {
                return <div className="text-nowrap">
                    <a href={"/workflow/documentation_delete/" + row.id} className="btn p-0 pr-4 btn-sm btn-text text-danger">
                        <i className="fas fa-trash-alt"/>&nbsp;{gettext("Delete")}</a>
                    <a href={"/workflow/documentation_update/" + row.id} className="btn p-0 btn-sm btn-text">
                        <i className="fas fa-edit"/>&nbsp;{gettext("Edit")}</a>
                </div>
            }
        }
    ];

    const defaultSorted = [{
        dataField: 'create_date',
        order: 'desc'
    }];

    return <BootstrapTable
        keyField="id"
        data={records}
        columns={columns}
        bootstrap4={true}
        pagination={paginationFactory()}
        defaultSorted={defaultSorted}
    />
});



export const RecordsView = observer(function ({rootStore, uiStore}) {
    return <React.Fragment>
        <RecordsFilterBar rootStore={rootStore} uiStore={uiStore}/>
        <br/>
        <RecordsListTable rootStore={rootStore} uiStore={uiStore}/>
    </React.Fragment>
});
