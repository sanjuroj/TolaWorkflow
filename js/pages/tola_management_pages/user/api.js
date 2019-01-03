import {api} from '../../../api';

export const fetchUsersWithFilter = (page) => api.get('/api/tola_management/user/', {params: {page: page}}).then(response => {
    let data = response.data

    let total_results_count = data.count
    let current_results_count = data.results.length
    let total_pages = Math.floor(total_results_count/current_results_count)

    return {
        users: data.results,
        total_pages: total_pages,
        total_users: total_results_count,
        next_page: data.next,
        prev_page: data.previous
    }
})
