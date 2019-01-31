import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'

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


export const IndexView = observer(
    ({store}) => {

        const countryFilterOptions = Object.entries(store.countries).map(([id, country]) => ({value: country.id, label: country.name}))
        const organizationFilterOptions = Object.entries(store.organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        const sectorFilterOptions = store.sectors.map(x => ({value: x.id, label: x.name}))
        const programFilterOptions = Object.entries(store.allPrograms).map(([id, program]) => ({value: program.id, label: program.name}))

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <CountryFilter store={store} filterOptions={countryFilterOptions} />
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
                <div className="list-controls row">
                    <div className="bulk-controls">
                        <Select className="selector" placeholder="Bulk Actions">
                        </Select>
                        <Select className="selector" placeholder="---">
                        </Select>
                        <button className="btn btn-outline-primary">Apply</button>
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={() => console.log('add a program')}><i className="fa fa-plus-circle"></i>Add Program</button>
                    </div>
                </div>
                <div className="list-table row">
                    <ManagementTable
                        newData={store.new_program}
                        data={store.programs}
                        keyField="id"
                        HeaderRow={({Col, Row}) =>
                            <Row>
                                <Col size="0.5">
                                    <div className="td--stretch">
                                        <input type="checkbox" checked={store.bulk_targets_all} onChange={() => console.log('select all for bulk action')}/>
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
                                    {/*
                                    <ProgramEditor
                                        new={data.id == 'new'}
                                        ProfileSection={() =>
                                            <EditProgramProfile
                                            new={data.id == 'new'}
                                            userData={data}
                                            onUpdate={(new_user_data) => store.updateUserProfile(data.id, new_user_data)}
                                            onCreate={(new_user_data) => store.saveNewUser(new_user_data)}
                                            onCreateAndAddAnother={(new_user_data) => store.saveNewUserAndAddAnother(new_user_data)}
                                            organizations={store.organizations} />}
                                        HistorySection={() =>
                                            <ProgramHistory
                                            userData={data}
                                            history={store.editing_target_data.history}
                                            onSave={(new_data) => store.saveUserProfile(data.id, new_data)}/>}
                                    />
                                    */}
                                </Wrapper>
                            }>
                                <Col size="0.5">
                                    <div className="td--stretch">
                                        <input type="checkbox" checked={store.bulk_targets.get(data.id) || false} onChange={() => console.log(`select this for bulk action: ${data.id}`) }/>
                                        <div className="icon__clickable" onClick={() => console.log(`edit this one: ${data.id}`)} >
                                            <i className="fa fa-cog"></i>
                                        </div>
                                    </div>
                                </Col>
                                <Col size="2">{data.name || "---"}</Col>
                                <Col>{data.onlyOrganizationId ? store.organizations[data.onlyOrganizationId].name : data.organizations ? data.organizations : "---"}</Col>
                                <Col>{<a href="">{data.program_users} users</a>}</Col>
                                <Col>{data.funding_status}</Col>
                            </Row>
                        }
                    />
                </div>
                <div className="list-metadata row">
                    <div id="users-count">{store.program_count ? `${store.program_count} programs`:`--`}</div>
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
