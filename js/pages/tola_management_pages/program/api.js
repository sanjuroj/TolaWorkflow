import {api} from '../../../api';


export const fetchPrograms = (page, filters) => {
    return api.get('/tola_management/program/', {params: {page: page, ...filters}}).then(response => {
        let data = response.data
        let results = data.results
        let total_results = data.count
        let total_pages = data.page_count
        let next_page = data.next
        let prev_page = data.previous

        return {
            results,
            total_results,
            total_pages,
            next_page,
            prev_page,
        }
    })
}

export const updateProgram = (id, data) => api.put(`/tola_management/program/${id}/`, data).then(response => {
    console.log(response)
})

export const updateProgramFundingStatusBulk = (ids, funding_status) => {
    return api.post('/tola_management/program/bulk_update_status/', {ids, funding_status}).then(response => {
        return response.data
    })
}


export default {
    fetchPrograms,
    updateProgramFundingStatusBulk,
}
