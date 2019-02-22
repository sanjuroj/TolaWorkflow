import {api} from '../../../api';

export const fetchProgramAuditLogWithFilter = (program_id, page) => api.get(`/tola_management/program/${program_id}/audit_log/`, {params: {page: page}}).then(response => {
    let data = response.data
    let total_results_count = data.count
    let current_results_count = data.results.length
    let total_pages = data.page_count

    return {
        logs: data.results,
        total_pages: total_pages,
        total_entries: total_results_count,
        next_page: data.next,
        prev_page: data.previous
    }
})

export default {
    fetchProgramAuditLogWithFilter
}
