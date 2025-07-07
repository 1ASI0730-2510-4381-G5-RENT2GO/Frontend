import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

export const paymentMethodsService = {
  // Obtener todos los métodos de pago del usuario
  async getUserPaymentMethods() {
    try {
      const response = await clientAPI.get('/v1/payment-methods');
      return response.data;
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      throw error;
    }
  },

  // Obtener método de pago por ID
  async getPaymentMethodById(id) {
    try {
      const response = await clientAPI.get(`/v1/payment-methods/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener método de pago:', error);
      throw error;
    }
  },

  // Crear nuevo método de pago
  async createPaymentMethod(paymentMethodData) {
    try {
      const response = await clientAPI.post('/v1/payment-methods', paymentMethodData);
      return response.data;
    } catch (error) {
      console.error('Error al crear método de pago:', error);
      throw error;
    }
  },

  // Actualizar método de pago
  async updatePaymentMethod(id, updateData) {
    try {
      const response = await clientAPI.put(`/v1/payment-methods/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar método de pago:', error);
      throw error;
    }
  },

  // Eliminar método de pago
  async deletePaymentMethod(id) {
    try {
      await clientAPI.delete(`/v1/payment-methods/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar método de pago:', error);
      throw error;
    }
  },

  // Establecer método predeterminado
  async setDefaultPaymentMethod(id) {
    try {
      const response = await clientAPI.post(`/v1/payment-methods/${id}/set-default`);
      return response.data;
    } catch (error) {
      console.error('Error al establecer método predeterminado:', error);
      throw error;
    }
  },

  // Obtener método de pago predeterminado
  async getDefaultPaymentMethod() {
    try {
      const response = await clientAPI.get('/v1/payment-methods/default');
      return response.data;
    } catch (error) {
      console.error('Error al obtener método predeterminado:', error);
      throw error;
    }
  }
};
