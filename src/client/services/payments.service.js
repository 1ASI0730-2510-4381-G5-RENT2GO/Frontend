import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

export const paymentsService = {
  // Obtener historial de pagos del usuario
  async getUserPayments() {
    try {
      const response = await clientAPI.get('/v1/payments');
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error);
      throw error;
    }
  },

  // Obtener historial paginado
  async getPaymentHistory(page = 1, pageSize = 10) {
    try {
      const response = await clientAPI.get('/v1/payments/history', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error);
      throw error;
    }
  },

  // Obtener pago por ID
  async getPaymentById(id) {
    try {
      const response = await clientAPI.get(`/v1/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pago:', error);
      throw error;
    }
  },

  // Obtener pago por ID de reserva
  async getPaymentByReservationId(reservationId) {
    try {
      const response = await clientAPI.get(`/v1/payments/reservation/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pago de reserva:', error);
      // Si no encuentra el pago, retornar null en lugar de lanzar error
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Crear nuevo pago
  async createPayment(paymentData) {
    try {
      const response = await clientAPI.post('/v1/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw error;
    }
  },

  // Procesar pago (para checkout)
  async processPayment(paymentData) {
    try {
      const response = await clientAPI.post('/v1/payments/process', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      // Mejorar manejo de errores específicos de pago
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        if (serverError.message) {
          throw new Error(serverError.message);
        }
      }
      throw error;
    }
  },

  // Actualizar estado de pago
  async updatePaymentStatus(id, status, notes = null) {
    try {
      const response = await clientAPI.put(`/v1/payments/${id}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado de pago:', error);
      throw error;
    }
  }
};
