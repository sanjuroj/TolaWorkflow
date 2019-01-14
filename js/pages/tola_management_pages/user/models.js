import { observable, computed, action } from "mobx";
import api from './api';

export class UserStore {
    @observable users = []
    @observable users_count = null
    @observable fetching = false
    @observable saving = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false
    @observable editing_target = null

    //filter options
    @observable available_countries = []
    @observable available_organizations = []
    @observable available_programs = {}
    @observable programs_by_country = {}
    @observable available_users = []
    user_status_options = [
        {value: 1, label: 'Active'},
        {value: 0, label: 'Inactive'}
    ]

    admin_role_options = [
        {value: 1, label: 'Yes'},
        {value: 0, label: 'No'}
    ]

    @observable filters = {
        countries: [],
        base_countries: [],
        organizations: [],
        programs: [],
        user_status: '',
        admin_role: '',
        users: []
    }

    constructor(
        countries,
        organizations,
        programs,
        programs_by_country,
        users,
    ) {
        this.available_countries = countries
        this.available_organizations = organizations
        this.available_programs = programs
        this.programs_by_country = programs_by_country
        this.available_users = users.filter(user => user.name)
        this.fetchUsers()
    }

    /*******************
    we turn the complex intermediate filter objects into simple lists for
    transmission to the api, (while retaining their filter keys)

    eg

    {
    ...
    countries: [{label: 'Afghanistan', value: 1}]
    }

    becomes

    {
    ...
    countries: [1]
    }

    */
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
    fetchUsers() {
        this.fetching = true
        api.fetchUsersWithFilter(this.current_page + 1, this.marshalFilters(this.filters)).then(results => {
            this.fetching = false
            this.users = results.users
            this.bulk_targets = new Map(this.users.map(user => [user.id, false]))
            this.users_count = results.total_users
            this.total_pages = results.total_pages
            this.next_page = results.next_page
            this.previous_page = results.previous_page
        })
    }

    @action
    changePage(page) {
        this.current_page = page.selected
        this.fetchUsers()
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
    toggleBulkTarget(target_id) {
        this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id))
    }

    @action
    changeCountryFilter(countries) {
        this.filters.countries = countries
    }

    @action
    changeBaseCountryFilter(countries) {
        this.filters.base_countries = base_countries
    }

    @action
    changeOrganizationFilter(organizations) {
        this.filters.organizations = organizations
    }

    @action
    changeProgramFilter(programs) {
        this.filters.programs = programs
    }

    @action
    changeUserStatusFilter(status) {
        this.filters.user_status = status
    }

    @action
    changeAdminRoleFilter(role) {
        this.filters.admin_role = role
    }

    @action
    changeUserFilter(users) {
        this.filters.users = users
    }

    @action
    toggleEditingTarget(user_id) {
        if(this.editing_target == user_id) {
            this.editing_target = false;
        } else {
            this.editing_target = user_id;
        }
    }

    @action
    updateActiveEditPage(section_name) {
        this.active_edit_page = section_name
    }

    @action
    saveUserEdit(new_user_data) {
        const user_idx = this.users.findIndex(u => u.id == new_user_data.id)

        if(user_idx !== -1) {
            this.users[user_idx] = new_user_data
            this.saving = true
            api.saveUser(new_user_data).then(result => {
                this.saving = false
            })
        }
    }

    @action
    clearFilters() {
        this.filters = {
            countries: [],
            base_countries: [],
            organizations: [],
            programs: [],
            user_status: '',
            admin_role: '',
            users: []
        }
    }
}
