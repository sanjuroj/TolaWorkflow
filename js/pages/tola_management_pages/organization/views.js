import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'

import OrganizationEditor from './components/organization_editor'
import EditOrganizationProfile from './components/edit_organization_profile'
import EditOrganizationHistory from './components/edit_organization_history'

const CountryFilter = observer(({store, countryListing}) => {
    return <div className="form-group">
        <label htmlFor="countries_permitted_filter">Countries</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={countryListing}
            onChange={(e) => store.changeCountryFilter(e)}
            placeholder="None Selected"
            id="countries_permitted_filter" />
    </div>
})

const ProgramFilter = observer(({store, programListing}) => {
    return <div className="form-group">
        <label htmlFor="programs_filter">Programs</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={programListing}
            onChange={(e) => store.changeProgramFilter(e)}
            placeholder="None Selected"
            id="programs_filter" />
    </div>
})

const OrganizationFilter = observer(({store, organizationListing}) => {
    return <div className="form-group">
        <label htmlFor="organizations_filter">Organizations</label>
        <CheckboxedMultiSelect
            value={store.filters.organizations}
            options={organizationListing}
            onChange={(e) => store.changeOrganizationFilter(e)}
            placeholder="None Selected"
            id="organization_filter" />
    </div>
})

export const IndexView = observer(
    ({store}) => {
        const countries_listing = Object.entries(store.available_countries).map(([id, country]) => ({value: country.id, label: country.name}))
        const organization_listing = Object.entries(store.available_organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        const program_listing = Object.entries(store.available_programs).map(([id, program]) => ({value: program.id, label: program.name}))

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <CountryFilter store={store} countryListing={countries_listing} />
                <ProgramFilter store={store} programListing={program_listing} />
                <OrganizationFilter store={store} organizationListing={organization_listing} />
                <div className="form-group">
                    <label htmlFor="status_filter">Status</label>
                    <Select
                    value={store.filters.organization_status}
                    options={store.organization_status_options}
                    onChange={(e) => store.changeOrganizationStatusFilter(e)}
                    placeholder="None Selected"
                    id="status_filter" />
                </div>
                <div className="filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.fetchOrganizations()}>Apply</button>
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
                        <button className="btn btn-primary" onClick={() => store.createOrganization()}><i className="fa fa-plus-circle"></i>Add Organization</button>
                    </div>
                </div>
                <div className="list-table row">
                    <ManagementTable
                        data={store.organizations}
                        keyField="id"
                        HeaderRow={({Col, Row}) =>
                            <Row>
                                <Col size="0.5">
                                    <div className="td--stretch">
                                        <input type="checkbox" checked={store.bulk_targets_all} onChange={() => store.toggleBulkTargetsAll()}/>
                                        <div></div>
                                    </div>
                                </Col>
                                <Col size="2">Organization</Col>
                                <Col>Programs</Col>
                                <Col size="1">Users</Col>
                                <Col size="0.25">Status</Col>
                            </Row>
                        }
                        Row={({Col, Row, data}) =>
                            <Row
                            expanded={data.id == store.editing_target}
                            Expando={({Wrapper}) =>
                                <Wrapper>
                                    <OrganizationEditor
                                        new={data.id == 'new'}
                                        ProfileSection={() =>
                                            <EditOrganizationProfile
                                            new={data.id == 'new'}
                                            organizationData={data}
                                            countryListing={countries_listing}
                                            onSave={(new_organization_data) => store.updateOrganizationProfile(data.id, new_organization_data)}
                                            onSaveNew={(new_organization_data) => store.saveNewOrganization(new_organization_data)}
                                            onSaveNewAndAddAnother={(new_organization_data) => store.saveNewOrganizationAndAddAnother(new_organization_data)} />}
                                        HistorySection={() =>
                                            <EditOrganizationHistory
                                            onSave={(new_data) => store.saveOrganizationProfile(data.id, new_data)}/>}
                                    />
                                </Wrapper>
                            }>
                                <Col size="0.5">
                                    <div className="td--stretch">
                                        <input type="checkbox" checked={store.bulk_targets.get(data.id) || false} onChange={() => store.toggleBulkTarget(data.id) }/>
                                        <div className="icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                            <i className="fa fa-users"></i>
                                        </div>
                                    </div>
                                </Col>
                                <Col size="2">{data.name || "---"}</Col>
                                <Col size="1"><a href="">{data.program_count} programs</a></Col>
                                <Col size="1"><a href="">{data.user_count} users</a></Col>
                                <Col size="0.25">{data.is_active?'Active':'Inactive'}</Col>
                            </Row>
                        }
                    />
                </div>
                <div className="list-metadata row">
                    <div id="users-count">{store.organizations_count?`${store.organizations_count} organizations`:`--`}</div>
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
