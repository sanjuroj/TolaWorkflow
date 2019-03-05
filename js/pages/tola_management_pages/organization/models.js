import { observable, computed, action, runInAction } from "mobx";
import api from './api';

const default_organization = {
    id: null ,
    is_active: false,
    mode_of_contact: "",
    name: "",
    organization_url: null,
    primary_address: "",
    primary_contact_email: "",
    primary_contact_name: "",
    primary_contact_phone: "",
    sectors: [],
}

export class OrganizationStore {
    @observable organizations = {}
    @observable organizations_listing = []
    @observable organizations_count = 0
    @observable total_pagees = 0
    @observable fetching = false
    @observable fetching_editing_target = false
    @observable current_page = 0
    @observable saving = false

    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    available_programs = {}
    available_organizations = {}
    available_sectors = {}
    available_countries = {}
    program_selections = []
    organization_selections = []
    sector_selections = []
    country_selections = []

    @observable editing_target = null
    @observable editing_target_data = {...default_organization}
    @observable editing_target_history = []
    @observable editing_errors = {}

    @observable filters = {
        countries: [],
        organizations: [],
        programs: [],
        sectors: [],
        organization_status: '',
    }

    organization_status_options = [
        {value: 1, label: 'Active'},
        {value: 0, label: 'Inactive'}
    ]

    constructor(programs, organizations, sectors, countries, country_filter, program_filter) {
        this.available_programs = programs
        this.available_organizations = organizations
        this.available_sectors = sectors
        this.available_countries = countries
        this.organization_selections = Object.entries(organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        this.program_selections = Object.entries(programs).map(([id, program]) => ({value: program.id, label: program.name}))
        this.sector_selections = Object.entries(sectors).map(([id, sector]) => ({value: sector.id, label: sector.name}))
        this.country_selections = Object.entries(countries).map(([id, country]) => ({value: country.id, label: country.name}))
        this.filters.countries = country_filter.map(id => this.available_countries[id]).map(country => ({label: country.name, value: country.id}))
        this.filters.programs = program_filter.filter(id => programs[id]).map(id => ({label: programs[id].name, value: id}))
        this.fetchOrganizations()
    }

    marshalFilters(filters) {
        return Object.entries(filters).reduce((xs, x) => {
            if(Array.isArray(x[1])) {
                xs[x[0]] = x[1].map(x => x.value)
            } else {
                xs[x[0]] = x[1].value
            }
            return xs
        }, {})
    }

    updateLocalOrganization(id, applied_data, aggregates) {
        this.organizations[id] = {
            id: id,
            name: applied_data.name,
            program_count: aggregates.program_count,
            user_count: aggregates.user_count,
            is_active: applied_data.is_active
        }
    }

    onSaveErrorHandler() {
        PNotify.error({text: 'Saving Failed', delay: 5000});
    }

    onSaveSuccessHandler() {
        PNotify.success({text: 'Successfully Saved', delay: 5000})
    }

    @action
    fetchOrganizations() {
        this.fetching = true

        api.fetchOrganizationsWithFilter(this.current_page + 1, this.marshalFilters(this.filters)).then(results => {
            runInAction(() => {
                this.fetching = false
                this.organizations = results.organizations.reduce((xs, x) => {
                    xs[x.id] = x
                    return xs
                }, {})
                this.organizations_listing = results.organizations.map(o => o.id)
                this.organizations_count = results.total_organizations
                this.total_pages = results.total_pages
                this.bulk_targets = new Map(Object.entries(this.organizations).map(([_, organization]) => [organization.id, false]))
            })
        })
    }

    @action
    createOrganization() {
        const new_organization = {
            id: "new",
            name: "",
            program_count: 0,
            user_count: 0,
            is_active: false
        }
        if(this.editing_target !== "new") {
            this.organizations_listing.unshift("new")
        }
        this.organizations["new"] = new_organization
        this.editing_target = new_organization.id
        this.editing_target_data = {...default_organization}
    }

    @action
    updateOrganizationProfile(id, new_data) {
        this.saving = true
        api.updateOrganization(id, new_data).then(updated_data => api.fetchOrganizationAggregates(id).then(aggregates => {
            runInAction(() => {
                this.saving = false
                this.updateLocalOrganization(id, updated_data, aggregates)
                this.editing_target = null
                this.editing_target_data = {...default_organization}
            })
            this.onSaveSuccessHandler()
        })).catch((errors) => {
            runInAction(() => {
                this.saving = false
                this.editing_errors = errors.response.data
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    saveNewOrganization(new_data) {
        this.saving = true
        new_data.is_active = true;
        api.createOrganization(new_data).then(result => {
            runInAction(() => {
                this.saving = false
                this.updateLocalOrganization(result.id, result, {program_count: 0, user_count: 0})
                this.organizations_listing.shift()
                delete this.organizations["new"]
                this.organizations_listing.unshift(result.id)
                this.editing_target = null
                this.editing_target_data = {...default_organization}
                this.bulk_targets = new Map(Object.entries(this.organizations).map(([_, organization]) => [organization.id, false]))
            })
            this.onSaveSuccessHandler()
        }).catch(error => {
            runInAction(() => {
                this.saving = false
                this.editing_errors = errors.response.data
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    saveNewOrganizationAndAddAnother(new_data) {
        this.saving = true
        new_data.is_active = true;
        api.createOrganization(new_data).then(result => {
            runInAction(() => {
                this.saving = false
                this.updateLocalOrganization(result.id, result, {program_count: 0, user_count: 0})
                this.organizations_listing.shift()
                delete this.organizations["new"]
                this.organizations_listing.unshift(result.id)
                this.editing_target = null
                this.editing_target_data = {...default_organization}
                this.bulk_targets = new Map(Object.entries(this.organizations).map(([_, organization]) => [organization.id, false]))
            })
            this.onSaveSuccessHandler()
        }).catch(error => {
            runInAction(() => {
                this.saving = false
                this.editing_errors = errors.response.data
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    changeSectorFilter(sectors) {
        this.filters.sectors = sectors
    }

    @action
    changeCountryFilter(countries) {
        this.filters.countries = countries
    }

    @action
    changeProgramFilter(programs) {
        this.filters.programs = programs
    }

    @action
    changeOrganizationFilter(organizations) {
        this.filters.organizations = organizations
    }

    @action
    changeOrganizationStatusFilter(status) {
        this.filters.organization_status = status
    }

    @action
    changePage(page) {
        if(this.current_page != page.selected) {
            this.current_page = page.selected
            this.fetchOrganizations()
        }
    }

    @action
    toggleBulkTargetsAll() {
        this.bulk_targets_all = !this.bulk_targets_all;
        if(this.bulk_targets_all) {
            this.bulk_targets.forEach((val, key, map) => {
                map.set(key, true)
            })
        } else {
            this.bulk_targets.forEach((val, key, map) => {
                map.set(key, false)
            })
        }
    }

    @action
    toggleEditingTarget(organization_id) {
        this.editing_target_data = {...default_organization}

        if(this.editing_target == "new") {
            this.organizations_listing.shift()
        }

        if(this.editing_target == organization_id) {
            this.editing_target = false
        } else {
            this.editing_target = organization_id
            this.fetching_editing_target = true
            if(!(this.editing_target == 'new')) {
                Promise.all([api.fetchOrganization(organization_id), api.fetchOrganizationHistory(organization_id)]).then(([organization, history]) => {
                    runInAction(() => {
                        this.fetching_editing_target = false
                        this.editing_target_data = organization
                        this.editing_target_history = history
                    })
                })
            }
        }
    }

    @action
    toggleBulkTarget(target_id) {
        this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id))
    }

    @action
    clearFilters() {
        this.filters = {
            countries: [],
            organizations: [],
            programs: [],
            sectors: [],
            organization_status: '',
        }
    }
}
