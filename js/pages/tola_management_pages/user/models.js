import { observable, computed, action } from "mobx";
import {fetchUsersWithFilter} from './api';

export class UserStore {
    @observable users = []
    @observable users_count = null
    @observable fetching = false
    @observable current_page = 0
    @observable previous_page = null
    @observable next_page = null
    @observable total_pages = null
    @observable available_countries = []
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    @observable filters = {
        country: '',
        base_country: '',
        organization: '',
        programs: '',
        status: '',
        roles_and_perms: '',
        users: ''
    }

    constructor(available_countries) {
        this.available_countries = available_countries
    }

    @action
    async fetchUsers() {
        this.fetching = true
        let results = await fetchUsersWithFilter(this.current_page + 1, this.filters)
        this.fetching = false
        this.users = results.users
        this.bulk_targets = new Map(this.users.map(user => [user.id, false]))
        this.users_count = results.total_users
        this.total_pages = results.total_pages
        this.next_page = results.next_page
        this.previous_page = results.previous_page
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
            this.bulk_targets = new Map(this.users.map(user => [user.id, true]))
        } else {
            this.bulk_targets = new Map(this.users.map(user => [user.id, false]))
        }
    }

    @action
    toggleBulkTarget(target_id) {
        this.bulk_targets.set(target_id, !this.bulk_targets.get(target_id))
    }

    @action
    changeCountryFilter(country_id) {
        this.filters.country = country_id;
    }

    @action
    changeBaseCountryFilter(country_id) {
        this.filters.base_country = country_id;
    }

    @action
    clearFilters() {
        this.filters = {
            country: '',
            base_country: '',
            organization: '',
            programs: '',
            status: '',
            roles_and_perms: '',
            users: ''
        }
    }
}
