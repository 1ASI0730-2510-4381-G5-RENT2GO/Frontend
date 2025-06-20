import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de provider
const providerAPI = createApiService('provider');

/**
 * Servicios relacionados con el proveedor
 */
export default {
    /**
     * Obtiene los datos del proveedor actual
     * @returns {Promise<Provider>}
     */
    async getProviderProfile() {
        try {
            const response = await providerAPI.get('/profile');
            return response.data;
        } catch (error) {
            console.error('Error al obtener el perfil del proveedor:', error);
            throw error;
        }
    },

    /**
     * Actualiza los datos del proveedor
     * @param {Object} providerData - Datos actualizados del proveedor
     * @returns {Promise<Provider>}
     */
    async updateProviderProfile(providerData) {
        try {
            const response = await providerAPI.put('/profile', providerData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el perfil del proveedor:', error);
            throw error;
        }
    },

    /**
     * Obtiene las estadísticas del proveedor
     * @returns {Promise<Object>}
     */
    async getProviderStats() {
        try {
            const response = await providerAPI.get('/stats');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas del proveedor:', error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario está registrado como proveedor
     * @returns {Promise<boolean>}
     */
    async isProvider() {
        try {
            const response = await providerAPI.get('/status');
            return response.data.isProvider;
        } catch (error) {
            console.error('Error al verificar estado de proveedor:', error);
            return false;
        }
    }
};

