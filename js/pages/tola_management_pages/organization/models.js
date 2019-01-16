import { observable, computed, action } from "mobx";
import {fetchOrganizationsWithFilter} from './api';

export class OrganizationStore {
    @observable organizations = [];
    @observable fetching = false;

    constructor() {
    }

    @action
    async fetchOrganizations() {
        this.fetching = true
        this.organizations = await fetchOrganizationsWithFilter()
        // this.organizations = ['cats', 'america', 'coffee']
    }
}
