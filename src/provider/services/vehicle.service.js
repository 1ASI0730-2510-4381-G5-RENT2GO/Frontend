import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de provider
const providerAPI = createApiService('provider');

/**
 * Servicios para gestión de vehículos del proveedor
 */
export default {
    /**
     * Obtiene todos los vehículos del proveedor
     * @returns {Promise<Array>}
     */
    async getVehicles() {
        try {
            const response = await providerAPI.get('/vehicles');
            return response.data;
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            throw error;
        }
    },

    /**
     * Obtiene un vehículo por ID
     * @param {string} id - ID del vehículo
     * @returns {Promise<Object>}
     */
    async getVehicleById(id) {
        try {
            const response = await providerAPI.get(`/vehicles/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener vehículo ${id}:`, error);
            throw error;
        }
    },

    /**
     * Registra un nuevo vehículo
     * @param {Object} vehicleData - Datos del vehículo
     * @returns {Promise<Object>}
     */
    async registerVehicle(vehicleData) {
        try {
            const response = await providerAPI.post('/vehicles', vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error al registrar vehículo:', error);
            throw error;
        }
    },

    /**
     * Actualiza un vehículo existente
     * @param {string} id - ID del vehículo
     * @param {Object} vehicleData - Datos actualizados
     * @returns {Promise<Object>}
     */
    async updateVehicle(id, vehicleData) {
        try {
            const response = await providerAPI.put(`/vehicles/${id}`, vehicleData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar vehículo ${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un vehículo
     * @param {string} id - ID del vehículo
     * @returns {Promise<void>}
     */
    async deleteVehicle(id) {
        try {
            await providerAPI.delete(`/vehicles/${id}`);
        } catch (error) {
            console.error(`Error al eliminar vehículo ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza la disponibilidad de un vehículo
     * @param {string} id - ID del vehículo
     * @param {boolean} available - Estado de disponibilidad
     * @returns {Promise<Object>}
     */
    async updateAvailability(id, available) {
        try {
            const response = await providerAPI.patch(`/vehicles/${id}/availability`, {
                available
            });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar disponibilidad del vehículo ${id}:`, error);
            throw error;
        }
    }
};

