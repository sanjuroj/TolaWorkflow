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


export default {
    fetchPrograms,
}
