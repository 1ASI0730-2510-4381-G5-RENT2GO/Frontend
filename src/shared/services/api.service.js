import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5239/api';

/**
 * Crea una instancia de axios configurada con base URL y tokens
 * @param {string} domain - Dominio o segmento de URL (ej: 'auth', 'client', 'provider')
 * @returns {AxiosInstance}
 */
export function createApiService(domain) {
    const api = axios.create({
        baseURL: `${API_BASE_URL}/${domain}`,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Interceptor para añadir token de autenticación
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

    // Interceptor para manejo de errores
    api.interceptors.response.use(
        response => response,
        error => {
            const status = error.response?.status;
            
            // Redirigir a login si hay error 401 (no autorizado)
            if (status === 401 && window.location.pathname !== '/login') {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );

    return api;
}

export default {
    createApiService
};
