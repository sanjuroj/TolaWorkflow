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
import LoadingSpinner from 'components/loading-spinner'

const UserFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="users_filter">Users</label>
        <CheckboxedMultiSelect
            value={store.filters.user}
            options={selections}
            onChange={(e) => store.changeUserFilter(e)}
            placeholder="None Selected"
            id="users_filter" />
    </div>
})

const CountryFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="countries_permitted_filter">Countries Permitted</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={selections}
            onChange={(e) => store.changeCountryFilter(e)}
            placeholder="None Selected"
            id="countries_permitted_filter" />
    </div>
})

const BaseCountryFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="base_country_filter">Base Country</label>
        <CheckboxedMultiSelect
            value={store.filters.base_countries}
            options={selections}
            onChange={(e) => store.changeBaseCountryFilter(e)}
            placeholder="None Selected"
            id="base_country_filter" />
    </div>
})

const ProgramFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="programs_filter">Programs</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={selections}
            onChange={(e) => store.changeProgramFilter(e)}
            placeholder="None Selected"
            id="programs_filter" />
    </div>
})

class SetUserStatusBulkAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: []
        }
    }

    onChange(new_val) {
        this.setState({
            value: new_val
        })
    }

    onApply() {
        this.props.onApply(this.state.value)
    }

    render() {
        return <Select options={this.props.options} value={this.state.value} onChange={(val) => this.onChange(val)} />
    }
}

class UpdateProgramsBulkAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            values: []
        }
    }

    onChange(new_vals) {
        this.setState({
            values: new_vals
        })
    }

    render() {
        return <CheckboxedMultiSelect options={this.props.options} value={this.state.values} onChange={(val) => this.onChange(val)} />
    }
}

class BulkActions extends React.Component {
    constructor(props) {
        super(props)
        this.active_child = React.createRef()
        this.state = {
            current_action: null,
            current_vals: []
        }
    }

    onActionChanged(new_action) {
        this.setState({
            current_action: new_action.value,
            current_vals: [],
        })
    }

    onChange(vals) {
        this.setState({
            current_vals: vals
        })
    }

    onApply() {
        const selected = this.props.secondaryOptions[this.state.current_action]
        if(selected) {
            selected.onApply(this.state.current_vals)
        }
    }

    render() {
        const selected = this.props.secondaryOptions[this.state.current_action]
        const SecondaryComponent = selected && selected.component
        return <div className="bulk-controls">
            <div className="bulk-select">
                <Select
                className="bulk-select"
                placeholder="Bulk Actions"
                value={this.props.primaryOptions.find((o) => o.value == this.state.current_action)}
                options={this.props.primaryOptions} onChange={(val) => this.onActionChanged(val)} />
            </div>
            {selected &&
            <div className="bulk-select">
                <SecondaryComponent value={this.state.current_vals} onChange={(vals) => this.onChange(vals)}/>
            </div>
            }
            {!selected &&
            <div className="bulk-select">
                <Select className="bulk-select" placeholder="---"/>
            </div>
            }
            <button className="btn btn-secondary" disabled={!this.state.current_action} onClick={() => this.onApply()}>Apply</button>
        </div>
    }
}

export const IndexView = observer(
    ({store}) => {
        const programOptions = store.program_selections
        const bulk_actions = {
            primary_options: [
                {label: 'Set account status', value: 'set_account_status'},
                {label: 'Add to program', value: 'add_to_program'},
                {label: 'Remove from program', value: 'remove_from_program'},
            ],
            secondary_options: {
                set_account_status: {
                    component: (props) => <Select options={store.user_status_options} {...props} />,
                    onApply: (option) => store.bulkUpdateUserStatus(option.value)
                },
                add_to_program: {
                    component: (props) => <CheckboxedMultiSelect options={programOptions} {...props} />,
                    onApply: (vals) => store.bulkAddPrograms(vals.map(option => option.value))
                },
                remove_from_program: {
                    component: (props) => <CheckboxedMultiSelect options={programOptions} {...props} />,
                    onApply: (vals) => store.bulkRemovePrograms(vals.map(option => option.value))
                },
            }
        }

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <CountryFilter store={store} selections={store.countries_selections} />
                <BaseCountryFilter store={store} selections={store.countries_selections} />
                <ProgramFilter store={store} selections={store.program_selections} />
                <div className="form-group">
                    <label htmlFor="organization_filter">Organization</label>
                    <Select
                    value={store.filters.organizations}
                    options={store.organization_selections}
                    onChange={(e) => store.changeOrganizationFilter(e)}
                    isMulti={true}
                    placeholder="None Selected"
                    id="organization_filter" />
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
                <UserFilter store={store} selections={store.user_selections} />
                <div className="filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.fetchUsers()}>Apply</button>
                    <button className="btn btn-outline-primary" onClick={() => store.clearFilters()}>Reset</button>
                </div>
            </div>
            <div className="col col-sm-9 list-section">
                <div className="list-controls">
                    <BulkActions primaryOptions={bulk_actions.primary_options} secondaryOptions={bulk_actions.secondary_options}/>
                    <div>
                        <button className="btn btn-primary" onClick={() => store.createUser()}><i className="fa fa-plus-circle"></i>Add User</button>
                    </div>
                </div>
                <LoadingSpinner isLoading={store.fetching_users_listing || store.applying_bulk_updates}>
                    <div className="list-table">
                        <ManagementTable
                            data={store.users_listing.map(id => store.users[id])}
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
                                        <LoadingSpinner isLoading={store.fetching_editing_target || store.saving_user_profile || store.saving_user_programs}>
                                            <UserEditor
                                                new={data.id == 'new'}
                                                ProfileSection={observer(() =>
                                                    <EditUserProfile
                                                        new={data.id == 'new'}
                                                        userData={store.editing_target_data.profile}
                                                        errors={store.editing_errors}
                                                        key={store.editing_target_data.profile.id}
                                                        onUpdate={(new_user_data) => store.updateUserProfile(data.id, new_user_data)}
                                                        onCreate={(new_user_data) => store.saveNewUser(new_user_data)}
                                                        onCreateAndAddAnother={(new_user_data) => store.saveNewUserAndAddAnother(new_user_data)}
                                                        organizations={store.organizations} />
                                                )}
                                                ProgramSection={() =>
                                                    <EditUserPrograms
                                                        store={store}
                                                            user={data}
                                                            adminUserProgramRoles={store.current_user_program_roles}
                                                            adminUserCountryRoles={store.current_user_country_roles}
                                                            onSave={(new_program_data) => store.saveUserPrograms(data.id, new_program_data)}/>}
                                                HistorySection={() =>
                                                    <EditUserHistory
                                                        userData={data}
                                                                history={store.editing_target_data.history}
                                                                onResendRegistrationEmail={() => store.resendRegistrationEmail(data.id)}
                                                                onSave={(new_data) => store.saveUserProfile(data.id, new_data)}/>}
                                            />
                                        </LoadingSpinner>
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
                                    <Col size="2">{data.name || "---"} {data.is_super && <span className="badge badge-danger">Super Admin</span>}</Col>
                                    <Col>{data.organization_name || "---"}</Col>
                                    <Col><a href="">{data.user_programs} programs</a></Col>
                                    <Col size="0.5">{data.is_admin?'Yes':'No'}</Col>
                                    <Col size="0.25">{data.is_active?'Active':'Inactive'}</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="list-metadata">
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
