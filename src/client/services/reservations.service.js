import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

/**
 * Servicio para la gestión de reservas de vehículos por parte de los clientes
 */
export const reservationsService = {
    /**
     * Obtiene todas las reservas del cliente actual
     * @returns {Promise<Array>} Lista de reservas
     */
    async getMyReservations() {
        try {
            const response = await clientAPI.get('/reservations');
            return response.data;
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            throw error;
        }
    },

    /**
     * Obtiene los detalles de una reserva específica
     * @param {string} id ID de la reserva
     * @returns {Promise<Object>} Detalles de la reserva
     */
    async getReservationById(id) {
        try {
            const response = await clientAPI.get(`/reservations/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea una nueva reserva
     * @param {Object} reservationData Datos de la reserva
     * @returns {Promise<Object>} Reserva creada
     */
    async createReservation(reservationData) {
        try {
            const response = await clientAPI.post('/reservations', reservationData);
            return response.data;
        } catch (error) {
            console.error('Error al crear reserva:', error);
            throw error;
        }
    },

    /**
     * Actualiza una reserva existente
     * @param {string} id ID de la reserva
     * @param {Object} reservationData Datos actualizados
     * @returns {Promise<Object>} Reserva actualizada
     */
    async updateReservation(id, reservationData) {
        try {
            const response = await clientAPI.put(`/reservations/${id}`, reservationData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Cancela una reserva
     * @param {string} id ID de la reserva
     * @param {string} reason Motivo de la cancelación
     * @returns {Promise<Object>} Reserva cancelada
     */
    async cancelReservation(id, reason) {
        try {
            const response = await clientAPI.post(`/reservations/${id}/cancel`, { reason });
            return response.data;
        } catch (error) {
            console.error(`Error al cancelar reserva ${id}:`, error);
            throw error;
        }
    }
};
