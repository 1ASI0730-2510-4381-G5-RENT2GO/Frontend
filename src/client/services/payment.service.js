import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

/**
 * Servicio para gestionar los pagos y métodos de pago de los clientes
 */
export const paymentService = {
    /**
     * Obtiene los métodos de pago guardados del cliente
     * @returns {Promise<Array>} - Lista de métodos de pago
     */
    async getPaymentMethods() {
        try {
            const response = await clientAPI.get('/payment-methods');
            return response.data;
        } catch (error) {
            console.error('Error al obtener métodos de pago:', error);
            throw error;
        }
    },


    async addPaymentMethod(paymentMethod) {
        try {
            const response = await clientAPI.post('/payment-methods', paymentMethod);
            return response.data;
        } catch (error) {
            console.error('Error al agregar método de pago:', error);
            throw error;
        }
    },

    async deletePaymentMethod(id) {
        try {
            await clientAPI.delete(`/payment-methods/${id}`);
        } catch (error) {
            console.error(`Error al eliminar método de pago ${id}:`, error);
            throw error;
        }
    },

    /**
     * Procesa un pago para una reserva
     * @param {string} reservationId - ID de la reserva
     * @param {Object} paymentData - Datos del pago
     * @returns {Promise<Object>} - Resultado del procesamiento del pago
     */
    async processPayment(reservationId, paymentData) {
        try {
            const response = await clientAPI.post(`/reservations/${reservationId}/payment`, paymentData);
            return response.data;
        } catch (error) {
            console.error('Error al procesar pago:', error);
            throw error;
        }
    },

    /**
     * Verifica el estado de un pago
     * @param {string} paymentId - ID del pago
     * @returns {Promise<Object>} - Estado actual del pago
     */
    async checkPaymentStatus(paymentId) {
        try {
            const response = await clientAPI.get(`/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al verificar estado del pago ${paymentId}:`, error);
            throw error;
        }
    }
};
