import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import eventBus from '../../../eventbus';

import {dateFromISOString, mediumDateFormatStr} from "../../../date_utils";


// Given the full documents list in rootStore, and the selected filters in uiStore, apply filtering (sans individual document select)
function filterDocuments(rootStore, uiStore) {
    let documents = rootStore.documents;

    if (uiStore.selectedProgramId) {
        documents = documents.filter(r => r.program === uiStore.selectedProgramId);
    }

    if (uiStore.selectedProjectId) {
        documents = documents.filter(r => r.project && r.project.id === uiStore.selectedProjectId);
    }

    return documents
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
class DocumentFilterSelect extends React.Component {
    constructor(props) {
        super(props);

        this.onSelection = this.onSelection.bind(this);
    }

    onSelection(selectedObject) {
        let documentId = selectedObject ? selectedObject.value : null;
        eventBus.emit('document-id-filter-selected', documentId);
    }

    render() {
        const {rootStore, uiStore} = this.props;
        const documents = filterDocuments(rootStore, uiStore);
        const selectedDocumentId = uiStore.selectedDocumentId;

        let documentOptions = documents.map(r => {
            return {value: r.id, label: r.name}
        });

        let selectedValue = null;
        if (selectedDocumentId) {
            selectedValue = documentOptions.find(r => r.value === selectedDocumentId);
        }

        return <Select
            options={documentOptions}
            value={selectedValue}
            isClearable={true}
            placeholder={gettext('Find a document')}
            onChange={this.onSelection}
        />
    }
}


@observer
class DocumentsFilterBar extends React.Component {
    render() {
        const {rootStore, uiStore, readonly} = this.props;

        return <div className="row">
            <div className="col-3">
                <ProgramFilterSelect rootStore={rootStore} uiStore={uiStore} />
            </div>
            <div className="col-3">
                <DocumentFilterSelect rootStore={rootStore} uiStore={uiStore} />
            </div>
            <div className="col-3 text-right">
            {!readonly &&
            <a href="/workflow/documentation_add" className="btn btn-link btn-add">
                <i className="fas fa-plus-circle"/> {gettext("Add document")}
            </a>
            }
            </div>
        </div>
    }
}


const DocumentsListTable = observer(function ({rootStore, uiStore, access}) {
    // Apply filters to displayed list of documents
    let documents = filterDocuments(rootStore, uiStore);

    // filter down by individual document select
    if (uiStore.selectedDocumentId) {
        documents = documents.filter(r => r.id === uiStore.selectedDocumentId);
    }

    // If no documents, don't show a table
    if (documents.length === 0) {
        return <div>
            <span>No documents available</span>
        </div>
    }

    const columns = [
        {
            dataField: 'name',
            text: gettext('Document'),
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
                if(access[row.program] && (access[row.program].role == 'high' || access[row.program].role == 'medium')) {
                    return <div className="text-nowrap">
                        <a href={"/workflow/documentation_delete/" + row.id} className="btn p-0 pr-4 btn-sm btn-text text-danger">
                            <i className="fas fa-trash-alt"/>&nbsp;{gettext("Delete")}</a>
                            <a href={"/workflow/documentation_update/" + row.id} className="btn p-0 btn-sm btn-text">
                                <i className="fas fa-edit"/>&nbsp;{gettext("Edit")}</a>
                    </div>
                } else {
                    return null
                }
            }
        }
    ];

    const defaultSorted = [{
        dataField: 'create_date',
        order: 'desc'
    }];

    const paginationOptions = {
        prePageText: '‹',
        nextPageText: '›',
        firstPageText: '«',
        lastPageText: '»',
        sizePerPage: 50,
        // page: 2,
        showTotal: true,
        paginationTotalRenderer: (from, to, size) => {
            /* # Translators: Ex. Showing rows 1 to 50 of 92 */
            const str = interpolate(gettext('Showing rows %(fromCount)s to %(toCount)s of %(totalCount)s'), {
                fromCount: from,
                toCount: to,
                totalCount: size,
            }, true);
            return <span className="metadata__count text-muted text-small">&nbsp;{str}</span>
        }
    };

    return <BootstrapTable
        keyField="id"
        data={documents}
        columns={columns}
        bootstrap4={true}
        pagination={paginationFactory(paginationOptions)}
        defaultSorted={defaultSorted}
    />
});



export const DocumentsView = observer(function ({rootStore, uiStore, readonly, access}) {
    return <React.Fragment>
        <DocumentsFilterBar rootStore={rootStore} uiStore={uiStore} readonly={readonly}/>
        <br/>
        <DocumentsListTable rootStore={rootStore} uiStore={uiStore} access={access}/>
    </React.Fragment>
});
