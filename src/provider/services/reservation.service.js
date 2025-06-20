import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de provider
const providerAPI = createApiService('provider');

/**
 * Servicio para gestión de reservas del proveedor
 */
export default {
    /**
     * Obtiene todas las reservas del proveedor
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>}
     */
    async getReservations(filters = {}) {
        try {
            const response = await providerAPI.get('/reservations', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            throw error;
        }
    },

    /**
     * Obtiene una reserva por su ID
     * @param {string} id - ID de la reserva
     * @returns {Promise<Object>}
     */
    async getReservationById(id) {
        try {
            const response = await providerAPI.get(`/reservations/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza el estado de una reserva
     * @param {string} id - ID de la reserva
     * @param {string} status - Nuevo estado (confirmed, cancelled, completed)
     * @param {string} [reason] - Razón del cambio de estado (opcional)
     * @returns {Promise<Object>}
     */
    async updateReservationStatus(id, status, reason) {
        try {
            const response = await providerAPI.patch(`/reservations/${id}/status`, {
                status,
                reason
            });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar estado de reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Registra la entrega de un vehículo
     * @param {string} id - ID de la reserva
     * @param {Object} deliveryData - Datos de la entrega
     * @returns {Promise<Object>}
     */
    async registerDelivery(id, deliveryData) {
        try {
            const response = await providerAPI.post(`/reservations/${id}/delivery`, deliveryData);
            return response.data;
        } catch (error) {
            console.error(`Error al registrar entrega para reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Registra la devolución de un vehículo
     * @param {string} id - ID de la reserva
     * @param {Object} returnData - Datos de la devolución
     * @returns {Promise<Object>}
     */
    async registerReturn(id, returnData) {
        try {
            const response = await providerAPI.post(`/reservations/${id}/return`, returnData);
            return response.data;
        } catch (error) {
            console.error(`Error al registrar devolución para reserva ${id}:`, error);
            throw error;
        }
    }
};

