import {api} from '../../../api';

export const fetchUsersWithFilter = (page, filters) => api.get('/tola_management/user/', {params: {page: page, ...filters}}).then(response => {
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

export const saveUserProfile = (user_id, data) => api.put(`/tola_management/user/${user_id}/`, data).then((response) => {
})

export const fetchUserProgramAccess = (user_id) => api.get(`/tola_management/user/${user_id}/program_access/`).then(response => response.data)

export const saveUserPrograms = (user_id, data) => api.put(`/tola_management/user/${user_id}/program_access/`, data).then(response => {

})

export const fetchUserHistory = (user_id) => api.get(`/tola_management/user/${user_id}/history/`).then(response => response.data)

export const createUser = (new_user_data) => api.post(`/tola_management/user/`).then(response => {

})

export default {
    fetchUsersWithFilter,
    saveUserProfile,
    fetchUserProgramAccess,
    saveUserPrograms,
    fetchUserHistory,
    createUser
}
