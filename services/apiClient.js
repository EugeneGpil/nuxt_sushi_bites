import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.API_URL + '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default apiClient;
