import axios from 'axios';

const api = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.20.1.185:3000/api',
    // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://43.206.154.15:3000/api',
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.reuse-tenshoku.com/api',
    // Optional: add headers or timeout
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${'newToken'}`
    },
    // timeout: 10000,
});

export default api;