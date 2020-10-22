import axios from 'axios';

const authClient = axios.create({
    baseURL: process.env.API_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
})

export default authClient;
