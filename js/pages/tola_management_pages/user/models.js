import { observable, computed, action } from "mobx";
import {fetchUsersWithFilter} from './api';

export class UserStore {
    @observable users = [];
    @observable fetching = false;

    constructor() {
    }

    @action
    async fetchUsers() {
        this.fetching = true
        this.users = await fetchUsersWithFilter()
    }
}
