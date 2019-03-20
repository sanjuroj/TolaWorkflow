import React from 'react'
import { observer } from "mobx-react"
import CheckboxedMultiSelect from 'components/checkboxed-multi-select'
import ManagementTable from 'components/management-table'
import Pagination from 'components/pagination'
import CountryEditor from './components/country_editor'
import EditCountryProfile from './components/edit_country_profile'
import EditDisaggregations from './components/edit_disaggregations'
import EditObjectives from './components/edit_objectives'
import LoadingSpinner from 'components/loading-spinner'
import FoldingSidebar from 'components/folding-sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CountryFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="countries_filter">{gettext("Countries")}</label>
        <CheckboxedMultiSelect
            value={store.filters.countries}
            options={filterOptions}
            onChange={(e) => store.changeFilter('countries', e)}
            placeholder={gettext("None Selected")}
            id="countries_filter" />
    </div>
})

const OrganizationFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="organizations_filter">{gettext("Organizations")}</label>
        <CheckboxedMultiSelect
            value={store.filters.organizations}
            options={filterOptions}
            onChange={(e) => store.changeFilter('organizations', e)}
            placeholder={gettext("None Selected")}
            id="organizations_filter" />
    </div>
})

const ProgramFilter = observer(({store, filterOptions}) => {
    return <div className="form-group">
        <label htmlFor="programs-filter">{gettext("Programs")}</label>
        <CheckboxedMultiSelect
            value={store.filters.programs}
            options={filterOptions}
            onChange={(e) => store.changeFilter('programs', e)}
            placeholder={gettext("None Selected")}
            id="programs-filter" />
    </div>
})


export const IndexView = observer(
    ({store}) => {
        const countryFilterOptions = store.allCountries.map(country => {return {value: country.id, label: country.country}})
        const organizationFilterOptions = Object.entries(store.organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        const programFilterOptions = Object.entries(store.allPrograms).map(([id, program]) => ({value: program.id, label: program.name}))

        return <div id="country-management-index-view" className="row">
            <FoldingSidebar>
                <div className="filter-section">
                    <OrganizationFilter store={store} filterOptions={organizationFilterOptions} />
                    <ProgramFilter store={store} filterOptions={programFilterOptions} />
                    <CountryFilter store={store} filterOptions={countryFilterOptions} />
                    <div className="filter-buttons">
                        <button className="btn btn-primary" onClick={() => store.applyFilters()}>{gettext("Apply")}</button>
                        <button className="btn btn-inverse" onClick={() => store.clearFilters()}>{gettext("Reset")}</button>
                    </div>
                </div>
            </FoldingSidebar>
            <div className="col admin-list">
                <div className="admin-list__controls">
                {store.is_superuser &&
                <div>
                    <a href="#" tabIndex="0" className="btn btn-link btn-add" onClick={() => store.addCountry()}>
                        <FontAwesomeIcon icon={'plus-circle'} />
                        {gettext("Add Country")}
                    </a>
                </div>
                }
                </div>
                <LoadingSpinner isLoading={store.fetching_main_listing || store.applying_bulk_updates }>
                    <div className="admin-list__table">
                        <ManagementTable
                            newData={store.new_country}
                            data={store.countries}
                            keyField="id"
                            HeaderRow={({Col, Row}) =>
                                <Row>
                                    <Col size=".2"></Col>
                                    <Col size="2" class="td--stretch">{gettext("Country")}</Col>
                                    <Col>{gettext("Organizations")}</Col>
                                    <Col>{gettext("Programs")}</Col>
                                    <Col>{gettext("Users")}</Col>
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
                                            StrategicObjectiveSection={observer(() =>
                                                <LoadingSpinner isLoading={store.fetching_editing_data}>
                                                    <EditObjectives
                                                        country_id={data.id}
                                                        objectives={store.editing_objectives_data}
                                                        addObjective={() => store.addObjective()}
                                                        onUpdate={(id, data) => store.updateObjective(id, data)}
                                                        onCreate={(data) => store.createObjective(data)}
                                                        onDelete={(id) => store.deleteObjective(id)}
                                                        errors={store.editing_objectives_errors}
                                                        clearErrors={() => store.clearObjectiveEditingErrors()}
                                                    />
                                                </LoadingSpinner>
                                            )}
                                            DisaggregationSection={observer(() =>
                                                <LoadingSpinner isLoading={store.fetching_editing_data}>
                                                    <EditDisaggregations
                                                        country_id={data.id}
                                                        disaggregations={store.editing_disaggregations_data}
                                                        addDisaggregation={() => store.addDisaggregation()}
                                                        onDelete={(id) => store.deleteDisaggregation(id)}
                                                        onUpdate={(id, data) => store.updateDisaggregation(id, data)}
                                                        onCreate={(data) => store.createDisaggregation(data)}
                                                        errors={store.editing_disaggregations_errors}
                                                        clearErrors={() => store.clearDisaggregationEditingErrors()}
                                                    />
                                                </LoadingSpinner>
                                            )}
                                            fetchObjectives={(countryId) => store.fetchObjectives(countryId)}
                                        />
                                    </Wrapper>
                                }>
                                    <Col size="0.2">
                                    </Col>
                                    <Col size="2" className="td--stretch">
                                        <div className="icon__clickable" onClick={() => store.toggleEditingTarget(data.id)} >
                                            <FontAwesomeIcon icon={'globe'} />&nbsp;
                                            {data.country || "---"}
                                        </div>
                                    </Col>
                                    <Col className="text-nowrap">
                                        { data.organizations.length ?
                                            <a href={`/tola_management/organization/?countries[]=${data.id}`}>
                                                <FontAwesomeIcon icon={'building'} />&nbsp;
                                                {data.organizations.length} {gettext("Organizations")}
                                            </a>
                                        : '---'}
                                    </Col>
                                    <Col className="text-nowrap">
                                        { data.programCount ?
                                            <a href={`/tola_management/program/?countries[]=${data.id}`}>
                                                <FontAwesomeIcon icon={'cubes'} />&nbsp;
                                                {data.programCount} {gettext("Programs")}
                                            </a>
                                        : "---"}
                                    </Col>
                                    <Col className="text-nowrap">
                                        { data.user_count ?
                                            <a href={`/tola_management/user/?countries[]=${data.id}`}>
                                                <FontAwesomeIcon icon={'users'} />&nbsp;
                                                {data.user_count} {gettext("Users")}
                                            </a>
                                        : '---'  }
                                    </Col>
                                </Row>
                            }
                        />
                    </div>
                </LoadingSpinner>
                <div className="admin-list__metadata">
                    <div id="users-count">{store.country_count ? `${store.country_count} ${gettext("countries")}`:`---`}</div>
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
