import {api} from '../../../api';

export const fetchOrganizationsWithFilter = (page, filters) => api.get('/tola_management/organization/', {params: {page: page, ...filters}}).then(response => {
    let data = response.data
    let total_results_count = data.count
    let current_results_count = data.results.length
    let total_pages = Math.floor(total_results_count/current_results_count)

    return {
        organizations: data.results,
        total_pages: total_pages,
        total_organizations: total_results_count,
        next_page: data.next,
        prev_page: data.previous
    }
})

export default {
    fetchOrganizationsWithFilter
}
