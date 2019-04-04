import { observable, computed, action, runInAction } from "mobx"
import api from './api'

export class ProgramAuditLogStore {
    @observable program_id = null
    @observable program_name = null
    @observable log_rows = []
    @observable fetching = false
    @observable current_page = 0
    @observable details_target = null

    @observable entries_count = 0
    @observable total_pages = 0
    @observable next_page = null
    @observable previous_page = null
    @observable current_page = 0

    constructor(program_id, program_name) {
        this.program_id = program_id
        this.program_name = program_name
        this.fetchProgramAuditLog()
    }

    @action
    fetchProgramAuditLog() {
        this.fetching = true

        api.fetchProgramAuditLogWithFilter(this.program_id, this.current_page + 1).then(results => {
            runInAction(() => {
                this.fetching = false
                this.log_rows = results.logs
                this.entries_count = results.total_entries
                this.total_pages = results.total_pages
                this.next_page = results.next_page
                this.previous_page = results.previous_page
            })
        })
    }

    @action
    toggleDetailsTarget(row_id) {
        if(this.details_target == row_id) {
            this.details_target = null
        } else {
            this.details_target = row_id
        }
    }

    @action
    changePage(page) {
        if(page.selected != this.current_page) {
            this.current_page = page.selected
            this.fetchProgramAuditLog()
        }
    }
}
