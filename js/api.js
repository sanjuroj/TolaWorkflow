import axios from 'axios';

export const api = axios.create({
    withCredentials: true,
    baseURL: '/api/',
    headers: {
        "X-CSRFToken": document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    }
});
