import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://localhost:3001',
    baseURL: 'https://rent2go-cars.free.beeceptor.com/vehicules',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
