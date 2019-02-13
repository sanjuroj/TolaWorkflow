import {api} from '../../../api';


export const fetchCountries = (page, filters) => {
    return api.get('/tola_management/country/', {params: {page: page, ...filters}}).then(response => {
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

export const createCountry = (data) => api.post('/tola_management/country/', data)

export const updateCountry = (id, data) => api.put(`/tola_management/country/${id}/`, data)

//export const fetchCountryHistory = (id) => api.get(`/tola_management/country/${id}/history/`)


export default {
    fetchCountries,
    //fetchCountryHistory,
    createCountry,
    updateCountry,
}
