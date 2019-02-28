import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import ProgramEditor from './components/program_editor'
import EditProgramProfile from './components/edit_program_profile'
import ProgramHistory from './components/program_history'
import LoadingSpinner from 'components/loading-spinner'

const UserFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="users_filter">Users</label>
        <CheckboxedMultiSelect
            value={store.filters.users}
            options={selections}
            onChange={(e) => store.changeUserFilter(e)}
            placeholder="None Selected"
            id="users_filter" />
    </div>
})

const CountryFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="countries_filter">Countries</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={filterOptions}
            onChange={(e) => store.changeFilter('countries', e)}
            placeholder="None Selected"
            id="countries_filter" />
    </div>
})

const OrganizationFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="organizations_filter">Organizations</label>
        <CheckboxedMultiSelect
            value={store.filters.organizations}
            options={filterOptions}
            onChange={(e) => store.changeFilter('organizations', e)}
            placeholder="None Selected"
            id="organizations_filter" />
    </div>
})

const SectorFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="sector-filter">Sectors</label>
        <CheckboxedMultiSelect
            value={store.filters.sectors}
            options={filterOptions}
            onChange={(e) => store.changeFilter('sectors', e)}
            placeholder="None Selected"
            id="sector-filter" />
    </div>
})

const ProgramStatusFilter = observer(({store}) => {
    const statusFilterOptions = [
        {value: 'Active', label: 'Active'},
        {value: 'Closed', label: 'Closed'},
    ]
    return <div className="form-group">
        <label htmlFor="program-status-filter">Status</label>
        <Select
            isMulti={false}
            value={store.filters.programStatus}
            options={statusFilterOptions}
            onChange={(e) => store.changeFilter('programStatus', e)}
            placeholder="None Selected"
            id="program-status-filter" />
    </div>
})

const ProgramFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="programs-filter">Programs</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={filterOptions}
            onChange={(e) => store.changeFilter('programs', e)}
            placeholder="None Selected"
            id="programs-filter" />
    </div>
})


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
            current_action: new_action.value
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

        const countryFilterOptions = Object.entries(store.countries).map(([id, country]) => ({value: country.id, label: country.name}))
        const organizationFilterOptions = Object.entries(store.organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        const sectorFilterOptions = store.sectors.map(x => ({value: x.id, label: x.name}))
        const programFilterOptions = Object.entries(store.allPrograms).map(([id, program]) => ({value: program.id, label: program.name}))
        const userFilterOptions = Object.entries(store.users).map(([id, user]) => ({value: user.id, label: user.name}))
        const bulkProgramStatusOptions = [
            {value: 'Funded', label: 'Funded'},
            {value: 'Completed', label: 'Completed'},
        ]

        const bulk_actions = {
            primary_options: [
                {label: 'Set program status', value: 'set_program_status'},
            ],
            secondary_options: {
                set_program_status: {
                    component: (props) => <Select options={bulkProgramStatusOptions} {...props} />,
                    onApply: (option) => store.bulkUpdateProgramStatus(option.value)
                },
            }
        }

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <CountryFilter store={store} filterOptions={countryFilterOptions} />
                <UserFilter store={store} filterOptions={userFilterOptions} />
                <OrganizationFilter store={store} filterOptions={organizationFilterOptions} />
                <SectorFilter store={store} filterOptions={sectorFilterOptions} />
                <ProgramStatusFilter store={store} />
                <ProgramFilter store={store} filterOptions={programFilterOptions} />
                <div className="filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.fetchPrograms()}>Apply</button>
                    <button className="btn btn-outline-primary" onClick={() => store.clearFilters()}>Reset</button>
                </div>
            </div>
            <div className="col col-sm-9 list-section">
                <div className="list-controls">
                    <BulkActions primaryOptions={bulk_actions.primary_options} secondaryOptions={bulk_actions.secondary_options}/>
                    <div>
                        <button className="btn btn-primary" onClick={() => store.createProgram()}><i className="fa fa-plus-circle"></i>Add Program</button>
                    </div>
                </div>
                <LoadingSpinner isLoading={store.fetching_main_listing || store.applying_bulk_updates }>
                    <div className="list-table">
                        <ManagementTable
                            newData={store.new_program}
                            data={store.programs}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size="0.5">
                                        <div className="td--stretch">
                                            <input type="checkbox" checked={store.bulk_targets_all} onChange={() => store.toggleBulkTargetsAll()}/>
                                            <div></div>
                                        </div>
                                    </Col>
                                    <Col size="2">Program</Col>
                                    <Col>Organizations</Col>
                                    <Col>Users</Col>
                                    <Col>Status</Col>
                                </Row>
                            }
                            Row={({Col, Row, data}) =>
                            <Row
                                expanded={data.id == store.editing_target}
                                Expando={({Wrapper}) =>
                                    <Wrapper>
                                        <ProgramEditor
                                            new={data.id == 'new'}
                                            ProfileSection={observer(() =>
                                                <EditProgramProfile
                                                    new={data.id == 'new'}
                                                    program_data={data}
                                                    onUpdate={(id, data) => store.updateProgram(id, data)}
                                                    onCreate={(new_program_data) => store.saveNewProgram(new_program_data)}
                                                    sectorOptions={sectorFilterOptions}
                                                    countryOptions={countryFilterOptions}
                                                    errors={store.editing_errors}
                                                />)}
                                            HistorySection={observer(() =>
                                                <ProgramHistory
                                                    program_data={data}
                                                    fetching_history={store.fetching_editing_history}
                                                    history={store.editing_history}
                                                    saving={store.saving}
                                                    onSave={(id, data) => store.updateProgram(id, data)}
                                                />)}
                                        />
                                    </Wrapper>
                                }>
                                    <Col size="0.5">
                                        <div className="td--stretch">
                                            <input type="checkbox" checked={store.bulk_targets.get(data.id) || false} onChange={() => store.toggleBulkTarget(data.id) }/>
                                            <div className="icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                                <i className="fa fa-cog"></i>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col size="2">{data.name || "---"}</Col>
                                    <Col>{data.onlyOrganizationId ? store.organizations[data.onlyOrganizationId].name : data.organizations ? data.organizations : "---"}</Col>
                                    <Col>{data.program_users ? <a href={`/tola_management/user/?programs[]=${data.id}`}>{data.program_users} users</a> : '---'  }</Col>
                                    <Col>{data.funding_status ? data.funding_status : '---'}</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="list-metadata row">
                    <div id="users-count">{store.program_count ? `${store.program_count} programs`:`---`}</div>
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
