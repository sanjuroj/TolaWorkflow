import { observable, computed, action, runInAction } from "mobx";
import api from './api';

const default_user = {
    id: null,
    name: "",
    email: "",
    phone_number: "",
    organization_id: null,
    mode_of_address: "",
    mode_of_contact: "",
    title: "",
    user_programs: 0,
    user: {is_active:true},
}

const default_editing_target_data = {
    profile: {...default_user},
    programs: {country: {}, programs:{}},
    history: []
}

export class UserStore {
    @observable users = {}
    @observable users_listing = []
    @observable users_count = null
    @observable fetching_users_listing = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false
    @observable applying_bulk_updates = false

    @observable saving_user_profile = false
    @observable saving_user_programs = false

    @observable current_user_program_roles = {}
    @observable current_user_country_roles = {}
    @observable current_user_is_super_admin = false

    @observable fetching_editing_target = false
    @observable editing_target = null
    @observable editing_target_data = {...default_editing_target_data}
    @observable editing_errors = {}

    @observable new_user = null

    //filter options
    @observable countries = []
    @observable organizations = []
    @observable programs = {}
    @observable available_users = []

    @observable countries_selections = []
    @observable organization_selections = []
    @observable program_selections = []
    @observable user_selections = []

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
        current_user_program_roles,
        current_user_country_roles,
        is_super_admin,
        programs_filter,
        organizations_filter
    ) {
        this.countries = countries
        this.organizations = organizations
        this.programs = programs
        this.available_users = users.filter(user => user.name)

        this.countries_selections = Object.entries(countries).map(([id, country]) => ({value: country.id, label: country.name}))
        this.organization_selections = Object.entries(organizations).map(([id, org]) => ({value: org.id, label: org.name}))
        this.program_selections = Object.entries(programs).map(([id, program]) => ({value: program.id, label: program.name}))
        this.user_selections = this.available_users.map(user => ({value: user.id, label: user.name}))

        this.current_user_program_roles = current_user_program_roles
        this.current_user_country_roles = current_user_country_roles
        this.current_user_is_super_admin = is_super_admin
        this.filters.programs = programs_filter.map(id => this.programs[id]).map(program => ({label: program.name, value: program.id}))
        this.filters.organizations = organizations_filter.map(id => this.organizations[id]).map(org => ({label: org.name, value: org.id}))
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

    getSelectedBulkTargetIDs() {
        return [...this.bulk_targets.entries()]
            .filter(([_, selected]) => selected)
            .map(([user_id, _]) => user_id)
    }

    onSaveErrorHandler() {
        PNotify.error({text: 'Saving Failed', delay: 5000});
    }

    onSaveSuccessHandler() {
        PNotify.success({text: 'Successfully Saved', delay: 5000})
    }

    @action
    fetchUsers() {
        this.fetching_users_listing = true
        api.fetchUsersWithFilter(this.current_page + 1, this.marshalFilters(this.filters)).then(results => {
            runInAction(() => {
                this.fetching_users_listing = false
                this.users = results.users.reduce((xs, x) => {
                    xs[x.id] = x
                    return xs
                }, {})
                this.users_listing = results.users.map(u => u.id)
                this.bulk_targets_all = false
                this.bulk_targets = new Map()
                this.users_count = results.total_users
                this.total_pages = results.total_pages
                this.next_page = results.next_page
                this.previous_page = results.previous_page
            })
        })
    }

    @action
    changePage(page) {
        if(page.selected != this.current_page) {
            this.current_page = page.selected
            this.fetchUsers()
        }
    }

    @action
    toggleBulkTargetsAll() {
        this.bulk_targets_all = !this.bulk_targets_all
        let user_ids = Object.values(this.users_listing)
        this.bulk_targets = new Map(user_ids.map(id => [id, this.bulk_targets_all]))
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
        this.editing_errors = {}
        this.editing_target_data = {...default_editing_target_data}
        if(this.editing_target == 'new') {
            this.users_listing.shift()
        }

        if(this.editing_target == user_id) {
            this.editing_target = null
        } else {
            this.editing_target = user_id
            this.fetching_editing_target = true
            Promise.all([api.fetchUser(user_id), api.fetchUserProgramAccess(user_id), api.fetchUserHistory(user_id)]).then(([user, program_data, history_data]) => {
                runInAction(() => {
                    this.fetching_editing_target = false
                    this.editing_target_data = {
                        profile: user,
                        programs: program_data,
                        history: history_data
                    }
                })
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

        this.editing_target_data = {...default_editing_target_data}

        this.users["new"] = {
            id: "new",
            name: "",
            organization_name: "",
            user_programs: 0,
            is_admin: false,
            is_active: false
        }

        this.users_listing.unshift("new")
        this.editing_target = 'new'
    }

    @action
    updateUserProfile(user_id, new_user_data) {
        this.saving_user_profile = true
        this.editing_errors = {}
        api.saveUserProfile(user_id, new_user_data).then(result => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[user_id] = result
            })
        }).catch(errors => {
            this.onSaveErrorHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
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
        this.editing_errors = {}
        api.createUser(new_user_data).then(result => api.fetchUserAggregates(result.id).then(aggregates => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[result.id] = {
                    id: result.id,
                    name: result.name,
                    organization_name: this.organizations[result.organization_id].name,
                    user_programs: aggregates.program_count,
                    is_admin: result.user.is_staff,
                    is_active: result.user.is_active
                }
                this.users_listing[0] = result.id
                this.editing_target = null
                this.toggleEditingTarget(result.id)
                delete this.users["new"]
            })
        })).catch(errors => {
            this.onSaveErrorHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
    }

    @action
    saveNewUserAndAddAnother(new_user_data) {
        this.saving_user_profile = true
        this.editing_errors = {}
        api.createUser(new_user_data).then(result => api.fetchUserAggregates(result.id).then(aggregates => {
            this.onSaveSuccessHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.users[result.id] = {
                    id: result.id,
                    name: result.name,
                    organization_name: this.organizations.find(o => o.id = result.organization_id).name,
                    user_programs: aggregates.program_count,
                    is_admin: result.user.is_staff,
                    is_active: result.user.is_active
                }
                this.users_listing[0] = result.id
                delete this.users["new"]
                this.createUser()
            })
        })).catch(errors => {
            this.onSaveErrorHandler()
            runInAction(() => {
                this.saving_user_profile = false
                this.editing_errors = errors.response.data
            })
        })
    }

    @action
    saveUserPrograms(user_id, new_user_programs_data) {
        this.save_user_programs = true
        api.saveUserPrograms(user_id, new_user_programs_data).then(result => {
            runInAction(() => {
                this.save_user_programs = false
            })
            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.save_user_programs = false
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    bulkUpdateUserStatus(new_status) {
        this.applying_bulk_updates = true
        api.bulkUpdateUserStatus(
            this.getSelectedBulkTargetIDs(),
            new_status
        ).then(result => {
            runInAction(() => {
                result.forEach(updated => {
                    let user = Object.assign(this.users[updated.id], updated)
                    this.users[user.id] = user
                })
                this.applying_bulk_updates = false
            })
            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    bulkAddPrograms(added_programs) {
        this.applying_bulk_updates = true
        api.bulkAddPrograms(
            this.getSelectedBulkTargetIDs(),
            added_programs
        ).then(result => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveErrorHandler()
        })
    }

    @action
    bulkRemovePrograms(removed_programs) {
        this.applying_bulk_updates = true
        api.bulkRemovePrograms(
            this.getSelectedBulkTargetIDs(),
            removed_programs
        ).then(result => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveSuccessHandler()
        }).catch(response => {
            runInAction(() => {
                this.applying_bulk_updates = false
            })
            this.onSaveErrorHandler()
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
