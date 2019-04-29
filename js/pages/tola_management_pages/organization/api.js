import {api} from '../../../api';

export const fetchOrganizationsWithFilter = (page, filters) => api.get('/tola_management/organization/', {params: {page: page, ...filters}}).then(response => {
    let data = response.data
    let total_results_count = data.count
    let current_results_count = data.results.length
    let total_pages = data.page_count

    return {
        organizations: data.results,
        total_pages: total_pages,
        total_organizations: total_results_count,
        next_page: data.next,
        prev_page: data.previous
    }
})

export const fetchOrganization = (id) => api.get(`/tola_management/organization/${id}/`).then(response => response.data)

export const updateOrganization = (id, new_data) => api.put(`/tola_management/organization/${id}/`, {
    ...new_data,
}).then(response => response.data)

export const createOrganization = (new_data) => api.post(`/tola_management/organization/`, {
    ...new_data,
}).then(response => response.data)

export const fetchOrganizationAggregates = id => api.get(`/tola_management/organization/${id}/aggregate_data/`).then(response => response.data)

export const fetchOrganizationHistory = id => api.get(`/tola_management/organization/${id}/history/`).then(response => response.data)

export default {
    fetchOrganizationsWithFilter,
    fetchOrganization,
    fetchOrganizationHistory,
    fetchOrganizationAggregates,
    updateOrganization,
    createOrganization,
}
