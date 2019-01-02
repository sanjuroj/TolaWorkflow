import {api} from '../../../api';

export const fetchUsersWithFilter = () => api.get('/api/tolauser', {}).then(response => response.data)
