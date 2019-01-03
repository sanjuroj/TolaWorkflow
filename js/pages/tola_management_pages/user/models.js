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

    constructor() {
    }

    @action
    async fetchUsers() {
        this.fetching = true
        let results = await fetchUsersWithFilter(this.current_page + 1)
        this.fetching = false
        this.users = results.users
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
}
