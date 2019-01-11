import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import UserEditor from './components/user_editor'
import EditUserProfile from './components/edit_user_profile'
import EditUserPrograms from './components/edit_user_programs'
import EditUserHistory from './components/edit_user_history'
import Pagination from 'components/pagination'


export const IndexView = observer(
    ({store}) => {
        const countries_listing = store.available_countries.map(country => ({value: country.id, label: country.country}))
        const organization_listing = store.available_organizations.map(org => ({value: org.id, label: org.name}))
        const program_listing = store.available_programs.map(program => ({value: program.id, label: program.name}))
        const user_listing = store.available_users.map(user => ({value: user.id, label: user.name}))

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <div className="form-group">
                    <label htmlFor="countries_permitted_filter">Countries Permitted</label>
                    <Select
                    value={store.filters.countries}
                    options={countries_listing}
                    onChange={(e) => store.changeCountryFilter(e)}
                    isMulti={true}
                    placeholder="None Selected"
                    id="countries_permitted_filter" />
                </div>
                <div className="form-group">
                    <label htmlFor="base_country_filter">Base Country</label>
                    <Select
                    value={store.filters.base_countries}
                    options={countries_listing}
                    onChange={(e) => store.changeBaseCountryFilter(e)}
                    isMulti={true}
                    placeholder="None Selected"
                    id="base_country_filter" />
                </div>
                <div className="form-group">
                    <label htmlFor="organization_filter">Organization</label>
                    <Select
                    value={store.filters.organizations}
                    options={organization_listing}
                    onChange={(e) => store.changeOrganizationFilter(e)}
                    isMulti={true}
                    placeholder="None Selected"
                    id="organization_filter" />
                </div>
                <div className="form-group">
                    <label htmlFor="programs_filter">Programs</label>
                    <Select
                    value={store.filters.programs}
                    options={program_listing}
                    onChange={(e) => store.changeProgramFilter(e)}
                    isMulti={true}
                    placeholder="None Selected"
                    id="programs_filter" />
                </div>
                <div className="form-group">
                    <label htmlFor="status_filter">Status</label>
                    <Select
                    value={store.filters.user_status}
                    options={store.user_status_options}
                    onChange={(e) => store.changeUserStatusFilter(e)}
                    placeholder="None Selected"
                    id="status_filter" />
                </div>
                <div className="form-group">
                    <label htmlFor="admin_role_filter">Admin Role</label>
                    <Select
                    value={store.filters.admin_role}
                    options={store.admin_role_options}
                    onChange={(e) => store.changeAdminRoleFilter(e)}
                    placeholder="None Selected"
                    id="admin_role_filter" />
                </div>
                <div className="form-group">
                    <label htmlFor="users_filter">Users</label>
                    <CheckboxedMultiSelect
                    value={store.filters.users}
                    options={user_listing}
                    onChange={(e) => store.changeUserFilter(e)}
                    placeholder="None Selected"
                    id="users_filter" />
                </div>
                <div className="filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.fetchUsers()}>Apply</button>
                    <button className="btn btn-outline-primary" onClick={() => store.clearFilters()}>Reset</button>
                </div>
            </div>
            <div className="col col-sm-9 list-section">
                <div className="list-controls row">
                    <div className="bulk-controls">
                        <Select className="selector" placeholder="Bulk Actions">
                        </Select>
                        <Select className="selector" placeholder="---">
                        </Select>
                        <button className="btn btn-outline-primary">Apply</button>
                    </div>
                    <div>
                        <button className="btn btn-primary"><i className="fa fa-plus-circle"></i>Add User</button>
                    </div>
                </div>
                <div className="list-table row">
                    <ManagementTable
                        data={store.users}
                        keyField="id"
                        HeaderRow={({Col, Row}) =>
                            <Row>
                                <Col size="0.5">
                                    <div className="td--stretch">
                                        <input type="checkbox" checked={store.bulk_targets_all} onChange={() => store.toggleBulkTargetsAll()}/>
                                        <div></div>
                                    </div>
                                </Col>
                                <Col size="2">User</Col>
                                <Col>Organization</Col>
                                <Col>Programs</Col>
                                <Col size="0.5">Admin Role</Col>
                                <Col size="0.25">Status</Col>
                            </Row>
                        }
                        Row={({Col, Row, data}) =>
                            <Row
                            expanded={data.id == store.editing_target}
                            Expando={({Wrapper}) =>
                                <Wrapper>
                                    <UserEditor
                                        ProfileSection={() =>
                                            <EditUserProfile
                                            userData={data}
                                            onSave={(new_user_data) => store.saveUserEdit(new_user_data)}
                                            organizations={store.available_organizations} />}
                                        ProgramSection={() => <EditUserPrograms />}
                                        HistorySection={() => <EditUserHistory />}
                                    />
                                </Wrapper>
                            }>
                                <Col size="0.5">
                                    <div className="td--stretch">
                                        <input type="checkbox" checked={store.bulk_targets.get(data.id) || false} onChange={() => store.toggleBulkTarget(data.id) }/>
                                        <div className="icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                            <i className="fa fa-user"></i>
                                        </div>
                                    </div>
                                </Col>
                                <Col size="2">{data.name}</Col>
                                <Col>{data.organization_name}</Col>
                                <Col><a href="">{data.user_programs} programs</a></Col>
                                <Col size="0.5">{data.is_admin?'Yes':'No'}</Col>
                                <Col size="0.25">{data.is_active?'Active':'Inactive'}</Col>
                            </Row>
                        }
                    />
                </div>
                <div className="list-metadata row">
                    <div id="users-count">{store.users_count?`${store.users_count} users`:`--`}</div>
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
