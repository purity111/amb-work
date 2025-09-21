import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.20.1.185:3000/api',
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.reuse-tenshoku.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api; 
