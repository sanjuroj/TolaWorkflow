import { observable, computed, action, runInAction } from "mobx";


export class CountryStore {

    //filter options
    @observable organizations = {}
    @observable users = []
    @observable sectors = []

    @observable filters = {
        countries: [],
        organizations: [],
        sectors: [],
        programStatus: null,
        programs: [],
    }

    @observable allCountries = []
    @observable countries = []
    @observable country_count = 0
    @observable new_country = null
    @observable fetching_main_listing = false
    @observable current_page = 0
    @observable total_pages = null
    @observable bulk_targets = new Map()
    @observable bulk_targets_all = false

    @observable editing_target = null
    @observable editing_errors = {}
    @observable fetching_editing_history = true
    @observable editing_target_history = null
    @observable saving = false

    @observable bulk_targets = new Map()
    @observable applying_bulk_updates = false
    @observable bulk_targets_all = false

    constructor(
        api,
        initialData,
    ) {
        this
        this.api = api
        Object.assign(this, initialData)
        this.fetchCountries()
    }

    marshalFilters(filters) {
        return Object.entries(filters).reduce((xs, [filterKey, filterValue]) => {
            if (Array.isArray(filterValue)) {
                xs[filterKey] = filterValue.map(x => x.value)
            } else if (filterValue) {
                xs[filterKey] = filterValue.value
            }
            return xs
        }, {})
    }

    @action
    fetchCountries() {
        this.fetching_main_listing = true
        this.api.fetchCountries(this.current_page + 1, this.marshalFilters(this.filters)).then(results => {
            runInAction(() => {
                this.fetching_main_listing = false
                this.countries = results.results
                this.country_count = results.total_results
                this.total_pages = results.total_pages
                this.next_page =results.next_page
                this.previous_page = results.previous_page
            })
        })

    }

    @action
    changePage(page) {
        if (page.selected == this.current_page) {
            return
        }
        this.current_page = page.selected
        this.bulk_targets = new Map()
        this.bulk_targets_all = false;
        this.fetchCountries()
    }

    @action
    changeFilter(filterKey, value) {
        this.filters = Object.assign(this.filters, {[filterKey]: value})
    }

    @action
    clearFilters() {
        let clearFilters = {
            countries: [],
            organizations: [],
            sectors: [],
            programStatus: null,
            programs: [],
        }
        this.filters = Object.assign(this.filters, clearFilters);
    }

    @action
    toggleEditingTarget(id) {
        if(this.editing_target == 'new') {
            this.countries.shift()
        }

        if(this.editing_target == id) {
            this.editing_target = false
        } else {
            this.editing_target = id
            this.fetching_editing_history = true
            /*
            this.api.fetchCountryHistory(id).then(resp => {
                runInAction(() => {
                    this.fetching_editing_history = false
                    this.editing_history = resp.data
                })
            })
            */
        }
    }

    updateLocalList(updated) {
        this.countries = this.countries.reduce((acc, current) => {
            if (current.id == updated.id) {
                acc.push(updated)
            } else {
                acc.push(current)
            }
            return acc
        }, [])
    }

    onSaveSuccessHandler() {
        PNotify.success({text: "Successfully Saved", delay: 5000})
    }

    onSaveErrorHandler() {
        PNotify.error({text: "Saving Failed", delay: 5000})
    }

    @action
    createProgram() {
        if(this.editing_target == 'new') {
            this.countries.shift()
        }

        let new_country_data = {
            id: "new",
            country: "",
            description: "",
            code: "",
            organizations: [],
        }
        this.countries.unshift(new_country_data)
        this.editing_target = 'new'
    }

    @action
    saveNewCountry(country_data) {
        country_data.id = null
        this.saving = true
        this.api.createCountry(country_data).then(response => {
            runInAction(()=> {
                this.saving = false
                this.editing_target = false
                this.countries.shift()
                this.countries.unshift(response.data)
            })
        }).catch(error => {
            runInAction(()=> {
                let errors = error.response.data
                this.saving = false
                this.editing_errors = errors
            })
        })
    }

    @action updateCountry(id, country_data) {
        this.saving = true
        this.api.updateCountry(id, country_data).then(response => {
            runInAction(() => {
                this.saving = false
                this.editing_target = false
                this.updateLocalList(response.data)
                this.onSaveSuccessHandler()
            })
        }).catch((errors) => {
            runInAction(() => {
                this.saving = false
                this.editing_errors = errors.response.data
                this.onSaveErrorHandler()
            })
        })
    }

}
