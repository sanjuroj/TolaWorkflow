import React from 'react'
import { observer } from "mobx-react"
import Select from 'react-select'
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CountryEditor from './components/country_editor'
import EditCountryProfile from './components/edit_country_profile'
import LoadingSpinner from 'components/loading-spinner'

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
        const organizationColumn = (organizations) => {
            if (organizations.length == 1) {
                return store.organizations[organizations[0]].name
            } if (organizations.length) {
                return `${organizations.length} Organizations`
            }
            return '---'
        }
        const countryFilterOptions = store.allCountries.map(country => {return {value: country.id, label: country.country}})
        const organizationFilterOptions = Object.entries(store.organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        const programFilterOptions = Object.entries(store.allPrograms).map(([id, program]) => ({value: program.id, label: program.name}))

        return <div id="user-management-index-view" className="container-fluid row">
            <div className="col col-sm-3 filter-section">
                <OrganizationFilter store={store} filterOptions={organizationFilterOptions} />
                <ProgramFilter store={store} filterOptions={programFilterOptions} />
                <CountryFilter store={store} filterOptions={countryFilterOptions} />
                <div className="filter-buttons">
                    <button className="btn btn-primary" onClick={() => store.fetchCountries()}>Apply</button>
                    <button className="btn btn-outline-primary" onClick={() => store.clearFilters()}>Reset</button>
                </div>
            </div>
            <div className="col col-sm-9 list-section">
                <div className="list-controls">
                    <button className="btn btn-primary" onClick={() => store.createProgram()}><i className="fa fa-plus-circle"></i>Add Country</button>
                </div>
                <LoadingSpinner isLoading={store.fetching_main_listing || store.applying_bulk_updates }>
                    <div className="list-table">
                        <ManagementTable
                            newData={store.new_country}
                            data={store.countries}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size=".2"></Col>
                                    <Col size="2">Country</Col>
                                    <Col>Organizations</Col>
                                    <Col>Programs</Col>
                                    <Col>Users</Col>
                                </Row>
                            }
                            Row={({Col, Row, data}) =>
                            <Row
                                expanded={data.id == store.editing_target}
                                Expando={({Wrapper}) =>
                                    <Wrapper>
                                        <CountryEditor
                                            new={data.id == 'new'}
                                            ProfileSection={observer(() =>
                                                <EditCountryProfile
                                                    new={data.id == 'new'}
                                                    country_data={data}
                                                    organizationOptions={organizationFilterOptions}
                                                    onUpdate={(id, data) => store.updateCountry(id, data)}
                                                    onCreate={(new_country_data) => store.saveNewCountry(new_country_data)}
                                                    errors={store.editing_errors}
                                                />)}
                                            HistorySection={observer(() => null)}
                                        />
                                    </Wrapper>
                                }>
                                    <Col size="0.2">
                                        <div className="td--stretch">
                                            <div className="icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                                <i className="fa fa-globe"></i>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col size="2">{data.country || "---"}</Col>
                                    <Col>{data.organizations ? organizationColumn(data.organizations) : '---'}</Col>
                                    <Col>{data.programCount ? <a href={`/tola_management/program/?countries[]=${data.id}`}>{data.programCount} Programs</a> : "---"}</Col>
                                    <Col>{data.users ? <a href="">{data.users} Users</a> : '---'  }</Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="list-metadata row">
                    <div id="users-count">{store.country_count ? `${store.country_count} countries`:`---`}</div>
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
