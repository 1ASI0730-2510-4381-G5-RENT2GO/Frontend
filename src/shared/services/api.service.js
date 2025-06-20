  import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5239/api';

/**
 * Crea una instancia de axios configurada para conectarse a un endpoint específico
 * @param {string} endpoint - El endpoint base para este servicio (ej: 'admin', 'client')
 * @returns {AxiosInstance} - Una instancia de axios configurada
 */
export const createApiService = (endpoint) => {
    const api = axios.create({
        baseURL: `${API_BASE_URL}/${endpoint}`,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        response => response,
        error => {
            const status = error.response?.status;

            if (status === 401 && window.location.pathname !== '/login') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );

    return api;
};
