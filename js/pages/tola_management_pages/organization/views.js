import React from 'react';
import { observer } from "mobx-react"
import Select from 'react-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'

import OrganizationEditor from './components/organization_editor'
import EditOrganizationProfile from './components/edit_organization_profile'
import EditOrganizationHistory from './components/edit_organization_history'

import LoadingSpinner from 'components/loading-spinner'

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

const OrganizationFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="organizations_filter">Organizations</label>
        <CheckboxedMultiSelect
            value={store.filters.organizations}
            options={selections}
            onChange={(e) => store.changeOrganizationFilter(e)}
            placeholder="None Selected"
            id="organization_filter" />
    </div>
})

const SectorFilter = observer(({store, selections}) => {
    return <div className="form-group">
        <label htmlFor="sector_filter">Sectors</label>
        <CheckboxedMultiSelect
            value={store.filters.sectors}
            options={selections}
            onChange={(e) => store.changeSectorFilter(e)}
            placeholder="None Selected"
            id="sector_filter" />
    </div>
})

export const IndexView = observer(
    ({store}) => {
        return <div id="organization-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <SectorFilter store={store} selections={store.sector_selections} />
                <ProgramFilter store={store} selections={store.program_selections} />
                <OrganizationFilter store={store} selections={store.organization_selections} />
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
                <div className="list-controls">
                    <div>
                        <button className="btn btn-primary" onClick={() => store.createOrganization()}><i className="fa fa-plus-circle"></i>Add Organization</button>
                    </div>
                </div>
                <LoadingSpinner isLoading={store.fetching}>
                    <div className="list-table">
                        <ManagementTable
                            data={store.organizations_listing.map(id => store.organizations[id])}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size="0.15">
                                        <div className="td--stretch">
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
                                                             ProfileSection={observer(() =>
                                                                 <LoadingSpinner isLoading={store.fetching_editing_target || store.saving}>
                                                                     <EditOrganizationProfile
                                                                         new={data.id == 'new'}
                                                                             sectorSelections={store.sector_selections}
                                                                             organizationData={store.editing_target_data}
                                                                             errors={store.editing_errors}
                                                                             key={store.editing_target_data.id}
                                                                             onSave={(new_organization_data) => store.updateOrganizationProfile(data.id, new_organization_data)}
                                                                             onSaveNew={(new_organization_data) => store.saveNewOrganization(new_organization_data)}
                                                                             onSaveNewAndAddAnother={(new_organization_data) => store.saveNewOrganizationAndAddAnother(new_organization_data)} />
                                                                 </LoadingSpinner>
                                                             )}
                                                             HistorySection={() =>
                                                                 <EditOrganizationHistory
                                                                     organizationData={store.editing_target_data}
                                                                                      organizationHistoryData={store.editing_target_history}
                                                                                      onSave={(new_organization_data) => store.updateOrganizationProfile(data.id, new_organization_data)}/>}
                                                     />
                                                 </Wrapper>
                                             }>
                                    <Col size="0.15">
                                        <div className="td--stretch">
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
                </LoadingSpinner>
                <div className="list-metadata">
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
