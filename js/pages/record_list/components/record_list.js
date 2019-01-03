import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import eventBus from '../../../eventbus';

import {dateFromISOString, mediumDateFormatStr} from "../../../date_utils";


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
            selectedValue = programOptions.filter(p => p.value === selectedProgramId)[0];
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
        const placeholderText = gettext('Filter by indicator');

        // Only enabled if a program is selected
        if (! selectedProgramId) {
            return <Select
                isDisabled={true}
                placeholder={placeholderText}
            />
        }

        const indicators = rootStore.getIndicators(selectedProgramId);

        let indicatorOptions = indicators.map(i => {
            return {value: i.id, label: i.name}
        });

        let selectedValue = null;
        if (selectedIndicatorId) {
            selectedValue = indicatorOptions.filter(p => p.value === selectedIndicatorId)[0];
        }

        return <Select
            options={indicatorOptions}
            value={selectedValue}
            isClearable={true}
            placeholder={placeholderText}
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
    let records = rootStore.records;

    if (uiStore.selectedProgramId) {
        records = records.filter(r => r.program === uiStore.selectedProgramId);
    }

    if (uiStore.selectedIndicatorId) {
        records = records.filter(r => r.indicator === uiStore.selectedIndicatorId);
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
