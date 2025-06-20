import { createApiService } from '../../shared/services/api.service';

const providerAPI = createApiService('provider');

/**
 * Servicios para gestión de ganancias del proveedor
 */
export default {
    /**
     * Obtiene las ganancias del proveedor
     * @param {Object} filters - Filtros opcionales (periodo, etc)
     * @returns {Promise<Object>}
     */
    async getEarnings(filters = {}) {
        try {
            const response = await providerAPI.get('/earnings', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error al obtener ganancias:', error);
            throw error;
        }
    },

    /**
     * Obtiene el historial de pagos recibidos
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>}
     */
    async getPaymentHistory(filters = {}) {
        try {
            const response = await providerAPI.get('/earnings/payments', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error al obtener historial de pagos:', error);
            throw error;
        }
    },

    /**
     * Obtiene estadísticas de ganancias
     * @param {string} period - Periodo de tiempo (month, year, all)
     * @returns {Promise<Object>}
     */
    async getEarningsStats(period = 'month') {
        try {
            const response = await providerAPI.get('/earnings/stats', { params: { period } });
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas de ganancias:', error);
            throw error;
        }
    }
};

