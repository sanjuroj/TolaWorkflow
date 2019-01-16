import {api} from '../../../api';

export const fetchUsersWithFilter = (page, filters) => api.get('/api/tola_management/user/', {params: {page: page, ...filters}}).then(response => {
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

export const fetchEditingTarget = (user_id) => api.get(`/api/tola_management/user/${user_id}/program_access`).then(response => {
    const data = response.data

    return {
        country_access: data.country_access.reduce((xs, x) => {
            xs[x] = true
            return xs
        },{}),
        program_access: data.program_access.reduce((xs, x) => {
            xs[x] = true
            return xs
        },{})
    }
})

export const saveUser = (data) => api.post(`/api/tola_managment/user/${data.id}/update_user`, data).then((response) => {
})

export default {
    fetchUsersWithFilter,
    saveUser,
    fetchEditingTarget
}
