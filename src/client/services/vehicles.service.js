import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

/**
 * Servicio para la búsqueda y gestión de vehículos disponibles para clientes
 */
export const vehiclesService = {
    /**
     * Busca vehículos disponibles según los criterios proporcionados
     * @param {Object} searchParams - Parámetros de búsqueda
     * @param {string} searchParams.location - Ubicación de recogida
     * @param {string} searchParams.pickupDate - Fecha de recogida
     * @param {string} searchParams.returnDate - Fecha de devolución
     * @param {Object} [filters] - Filtros adicionales (precio, tipo, etc.)
     * @returns {Promise<Array>} - Lista de vehículos disponibles
     */
    async searchVehicles(searchParams, filters = {}) {
        try {
            const response = await clientAPI.get('/vehicles/search', {
                params: {
                    ...searchParams,
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al buscar vehículos:', error);
            throw error;
        }
    },

    /**
     * Obtiene los detalles completos de un vehículo específico
     * @param {string} id - ID del vehículo
     * @param {Object} [dateRange] - Rango de fechas para verificar disponibilidad
     * @returns {Promise<Object>} - Detalles del vehículo
     */
    async getVehicleDetails(id, dateRange = null) {
        try {
            const params = dateRange ? {
                pickupDate: dateRange.pickupDate,
                returnDate: dateRange.returnDate
            } : {};

            const response = await clientAPI.get(`/vehicles/${id}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error al obtener detalles del vehículo ${id}:`, error);
            throw error;
        }
    },

    /**
     * Verifica la disponibilidad de un vehículo en un rango de fechas
     * @param {string} id - ID del vehículo
     * @param {string} pickupDate - Fecha de recogida
     * @param {string} returnDate - Fecha de devolución
     * @returns {Promise<Object>} - Información de disponibilidad
     */
    async checkVehicleAvailability(id, pickupDate, returnDate) {
        try {
            const response = await clientAPI.get(`/vehicles/${id}/availability`, {
                params: { pickupDate, returnDate }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al verificar disponibilidad del vehículo ${id}:`, error);
            throw error;
        }
    }
};
