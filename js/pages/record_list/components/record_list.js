import React from 'react';
import classNames from 'classnames';
import { observer } from "mobx-react"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import eventBus from '../../../eventbus';

import {Select} from '../../../components/bootstrap_multiselect';
import {dateFromISOString, mediumDateFormatStr} from "../../../date_utils";



class RecordsFilterBar extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const {programs} = this.props.rootStore;

        const programOptions = programs.map(p => { return {value: p.id, label: p.name} });

        return <div className="row">
            <div className="col-3">
                <Select
                    options={programOptions}
                    selected={[]}
                />
            </div>
            <div className="col-3">
                <Select
                    options={programOptions}
                    selected={[]}
                />
            </div>
            <div className="col-3">
                <Select
                    options={programOptions}
                    selected={[]}
                />
            </div>
            <div className="col-3 text-right">
                <a href="/workflow/documentation_add" className="btn btn-link btn-add">
                    <i className="fas fa-plus-circle"/> {gettext("Add record")}</a>
            </div>
        </div>
    }

}



const RecordsListTable = observer(function ({rootStore}) {
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

    return <React.Fragment>
        <BootstrapTable
            keyField="id"
            data={rootStore.records}
            columns={columns}
            bootstrap4={true}
            pagination={paginationFactory()}
            defaultSorted={defaultSorted}
        />
    </React.Fragment>
});



export const RecordsView = observer(function ({rootStore}) {
    return <React.Fragment>
        <RecordsFilterBar rootStore={rootStore}/>
        <br/>
        <RecordsListTable rootStore={rootStore}/>
    </React.Fragment>
});
