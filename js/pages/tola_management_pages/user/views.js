import React from 'react'
import ReactPaginate from 'react-paginate'
import { observer } from "mobx-react"
import BootstrapTable from 'react-bootstrap-table-next'


export const IndexView = observer(
    ({store}) => {
        const {bulk_targets, bulk_targets_all} = store
        const table_definition = [
            {
                dataField: 'id',
                text: '',
                formatter: (cell, row) => {
                    return <div className="td--stretch">
                        <input type="checkbox" checked={bulk_targets.get(cell) || false} onChange={() => store.toggleBulkTarget(cell) }/>
                        <div><i className="fa fa-user"></i></div>
                    </div>
                },
                headerFormatter: (col, idx, components) => {
                    return <div className="td--stretch">
                        <input type="checkbox" checked={bulk_targets_all} onChange={() => store.toggleBulkTargetsAll()}/>
                        <div></div>
                    </div>
                }
            },
            {
                dataField: 'name',
                text: 'User'
            },
            {
                dataField: 'organization_name',
                text: 'Organization',
                formatter: (cell, row) => {
                    return <a href="">{cell}</a>
                }
            },
            {
                dataField: 'user_programs',
                text: 'Programs',
                formatter: (cell, row) => {
                    return <a href="">{cell} programs</a>
                }
            },
            {
                dataField: 'is_active',
                text: 'Status',
                formatter: (cell, row) => {
                    return (cell)?'Active':'Inactive'
                }
            },
        ]

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <div className="form-group">
                    <label htmlFor="countries_permitted_filter">Countries Permitted</label>
                    <select value={store.filters.country} onChange={(e) => store.changeCountryFilter(e.target.value)} className="form-control" id="countries_permitted_filter">
                        <option value=''>None Selected</option>
                        {store.available_countries.map(country => <option value={country.id} key={country.id}>{country.country}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="base_country_filter">Base Country</label>
                    <select value={store.filters.base_country} onChange={(e) => store.changeBaseCountryFilter(e.target.value)} className="form-control" id="base_country_filter">
                        <option value=''>None Selected</option>
                        {store.available_countries.map(country => <option value={country.id} key={country.id}>{country.country}</option>)}
                    </select>
                </div>
                <div className="foorm-group">
                    <label htmlFor="organization_filter">Organization</label>
                    <select className="form-control" id="organization_filter">
                        <option>None Selected</option>
                    </select>
                </div>
                <div className="foorm-group">
                    <label htmlFor="programs_filter">Programs</label>
                    <select className="form-control" id="programs_filter">
                        <option>None Selected</option>
                    </select>
                </div>
                <div className="foorm-group">
                    <label htmlFor="status_filter">Status</label>
                    <select className="form-control" id="status_filter">
                        <option>None Selected</option>
                    </select>
                </div>
                <div className="foorm-group">
                    <label htmlFor="roles_and_perms_filter">Roles And Permissions</label>
                    <select className="form-control" id="roles_and_perms_filter">
                        <option>None Selected</option>
                    </select>
                </div>
                <div className="foorm-group">
                    <label htmlFor="users_filter">Users</label>
                    <select className="form-control" id="users_filter">
                        <option>None Selected</option>
                    </select>
                </div>
                <div className="filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.fetchUsers()}>Apply</button>
                    <button className="btn btn-outline-primary" onClick={() => store.clearFilters()}>Reset</button>
                </div>
            </div>
            <div className="col col-sm-9 list-section">
                <div className="list-controls">
                    <select>
                        <option>Bulk actions</option>
                    </select>
                    <button>Add User</button>
                </div>
                <div className="list-table">
                    <BootstrapTable keyField="id" data={store.users} columns={table_definition} />
                </div>
                <div className="list-metadata">
                    <div id="users-count">{store.users_count?`${store.users_count} users`:`--`}</div>
                    <div id ="pagination-controls">
                        {store.total_pages &&
                         <ReactPaginate
                             previousLabel={<i className="fa fa-angle-left"></i>}
                             nextLabel={<i className="fa fa-angle-right"></i>}
                             breakLabel={"..."}
                             breakClassName={"break-me"}
                             pageCount={store.total_pages}
                             initialPage={store.current_page}
                             marginPagesDisplayed={2}
                             pageRangeDisplayed={5}
                             onPageChange={page => store.changePage(page)}
                             containerClassName={"pagination"}
                             subContainerClassName={"pages pagination"}
                             activeClassName={"active"} />
                        }
                    </div>
                </div>
            </div>
        </div>
    }
)
