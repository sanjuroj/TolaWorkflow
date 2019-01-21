import { observable, computed, action } from "mobx";
import api from './api';

export class OrganizationStore {
    @observable organizations = []
    @observable organizations_count = 0
    @observable total_pagees = 0
    @observable fetching = false
    @observable fetching_editing_target = false
    @observable editing_target = null
    @observable current_page = 0

    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    @observable available_countries = {}
    @observable available_programs = {}
    @observable available_organizations = {}

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

    constructor(countries, programs, organizations) {
        this.fetchOrganizations()
        this.available_countries = countries
        this.available_programs = programs
        this.available_organizations = organizations
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

    @action
    fetchOrganizations() {
        this.fetching = true

        api.fetchOrganizationsWithFilter(this.current_page + 1, this.marshalFilters(this.filters)).then(results => {
            this.organizations = results.organizations
            this.organizations_count = results.total_organizations
            this.total_pages = results.total_pages
            this.bulk_targets = new Map(this.organizations.map(organization => [organization.id, false]))
        })
    }

    @action
    createOrganization() {
        if(this.editing_target == 'new') {
            this.organizations.shift()
        }
        const new_organization = {
            id: "new",
            name: "",
            program_count: 0,
            user_count: 0,
            is_active: false
        }
        this.organizations.unshift(new_organization)
        this.editing_target = new_organization.id
    }

    @action
    updateOrganizationProfile(id, new_data) {
        this.saving = true
        api.updateOrganization(id, new_data).then(result => {
            this.saving = false
        })
    }

    @action
    saveNewOrganization(new_data) {
        this.saving = true
        api.createOrganization(new_data).then(result => {
            this.saving = false

        })
    }

    @action
    saveNewOrganizationAndAddAnother(new_data) {
        this.saving = true
        api.createOrganization(new_data).then(result => {
            this.saving = false

        })
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
        this.current_page = page.selected
        this.fetchOrganizations()
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
        if(this.editing_target == 'new') {
            this.organizations.shift()
        }

        if(this.editing_target == organization_id) {
            this.editing_target = false
        } else {
            this.editing_target = organization_id
            this.fetching_editing_target = true
            if(!this.editing_target == 'new') {
                // Promise.all([api.fetchUserProgramAccess(user_id), api.fetchUserHistory(user_id)]).then(([program_data, history_data]) => {
                //     this.fetching_editing_target = false
                //     this.editing_target_data = {
                //         programs: program_data,
                //         history: history_data
                //     }
                // })
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
