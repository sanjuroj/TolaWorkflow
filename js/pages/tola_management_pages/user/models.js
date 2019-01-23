import { observable, computed, action } from "mobx";
import api from './api';

export class UserStore {
    @observable users_listing = []
    @observable users_count = null
    @observable fetching_users_listing = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    @observable saving_user_profile = false
    @observable saving_user_programs = false

    @observable fetching_editing_target = false
    @observable editing_target = null
    @observable editing_target_data = {
        programs: {
            country: {},
            program: {}
        },
        history: []
    }

    @observable new_user = null

    //filter options
    @observable countries = []
    @observable organizations = []
    @observable programs = {}
    @observable users = []

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
        users,
    ) {
        this.countries = countries
        this.organizations = organizations
        this.programs = programs
        this.users = users.filter(user => user.name)
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
        this.fetching_users_listing = true
        api.fetchUsersWithFilter(this.current_page + 1, this.marshalFilters(this.filters)).then(results => {
            this.fetching_users_listing = false
            this.users_listing = results.users
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
    changeBaseCountryFilter(base_countries) {
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
        if(this.editing_target == 'new') {
            this.users_listing.shift()
        }

        if(this.editing_target == user_id) {
            this.editing_target = false
        } else {
            this.editing_target = user_id
            this.fetching_editing_target = true
            Promise.all([api.fetchUserProgramAccess(user_id), api.fetchUserHistory(user_id)]).then(([program_data, history_data]) => {
                this.fetching_editing_target = false
                this.editing_target_data = {
                    programs: program_data,
                    history: history_data
                }
            })
        }
    }

    @action
    updateActiveEditPage(section_name) {
        this.active_edit_page = section_name
    }

    @action
    createUser() {
        if(this.editing_target == 'new') {
            this.users_listing.shift()
        }

        let new_user = {
            id: "new",
            name: "",
            email: "",
            phone_number: "",
            organization_id: null,
            mode_of_address: "",
            mode_of_contact: "",
            title: "",
            user_programs: 0,
        }
        this.users_listing.unshift(new_user)
        this.editing_target = 'new'
    }

    @action
    updateUserProfile(user_id, new_user_data) {
        const user_idx = this.users_listing.findIndex(u => u.id == new_user_data.id)
        if(user_idx !== -1) {
            this.saving_user_profile = true
            api.saveUserProfile(user_id, new_user_data).then(result => {
                this.saving_user_profile = false
                this.users_listing[user_idx] = {
                    ...this.users_listing[user_idx],
                    ...new_user_data
                }
            })
        }
    }

    @action
    resendRegistrationEmail(user_id) {
        api.resendRegistrationEmail(user_id).then(result => {
            console.log(result)
        })
    }

    @action
    saveNewUser(new_user_data) {
        this.saving_user_profile = true
        api.createUser(new_user_data).then(result => {
            this.saving_user_profile = false
        })
    }

    @action
    saveNewUserAndAddAnother(new_user_data) {
        this.saving_user_profile = true
        api.createUser(new_user_data).then(result => {
            this.saving_user_profile = false
            this.createUser()
        })
    }

    @action
    saveUserPrograms(user_id, new_user_programs_data) {
        this.save_user_programs = true
        api.saveUserPrograms(user_id, new_user_programs_data).then(result => {
            this.save_user_programs = false
        })
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
