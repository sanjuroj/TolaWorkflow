import {api} from '../../../api';

export const fetchOrganizationsWithFilter = () => api.get('/api/organization', {}).then(response => response.data)
