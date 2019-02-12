import { observable, computed, action, runInAction } from "mobx"
import api from './api'

export class ProgramAuditLogStore {
    @observable program_id = null
    @observable log_rows = []
    @observable fetching = false
    @observable current_page = 0
    @observable details_target = null

    constructor(program_id) {
        this.program_id = program_id
        this.fetchProgramAuditLog()
    }

    @action
    fetchProgramAuditLog() {
        this.fetching = true

        api.fetchProgramAuditLogWithFilter(this.program_id, this.current_page + 1).then(results => {
            runInAction(() => {
                this.fetching = false
                this.log_rows = results.logs
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

}
