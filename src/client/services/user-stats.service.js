import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

/**
 * Servicio para obtener estadísticas del usuario
 */
export const userStatsService = {
    /**
     * Obtiene las estadísticas completas del usuario
     * @returns {Promise<Object>} Estadísticas del usuario
     */
    async getUserStats() {
        try {
            const response = await clientAPI.get('/user/stats');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas del usuario:', error);
            // Retornar datos por defecto si hay error
            return {
                activeReservations: 0,
                totalRentals: 0,
                favoriteVehicles: 0
            };
        }
    },

    /**
     * Obtiene el conteo de reservas activas
     * @returns {Promise<number>} Número de reservas activas
     */
    async getActiveReservationsCount() {
        try {
            const response = await clientAPI.get('/reservations', {
                params: { status: 'confirmed' }
            });
            
            // Manejar diferentes formatos de respuesta
            let reservations = response.data;
            if (reservations && reservations.$values) {
                reservations = reservations.$values;
            }
            
            return Array.isArray(reservations) ? reservations.length : 0;
        } catch (error) {
            console.error('Error al obtener reservas activas:', error);
            return 0;
        }
    },

    /**
     * Obtiene el conteo total de alquileres completados
     * @returns {Promise<number>} Número total de alquileres
     */
    async getTotalRentalsCount() {
        try {
            const response = await clientAPI.get('/reservations', {
                params: { status: 'completed' }
            });
            
            // Manejar diferentes formatos de respuesta
            let reservations = response.data;
            if (reservations && reservations.$values) {
                reservations = reservations.$values;
            }
            
            return Array.isArray(reservations) ? reservations.length : 0;
        } catch (error) {
            console.error('Error al obtener total de alquileres:', error);
            return 0;
        }
    },

    /**
     * Obtiene el conteo de vehículos favoritos (simulado por ahora)
     * @returns {Promise<number>} Número de vehículos favoritos
     */
    async getFavoriteVehiclesCount() {
        try {
            // Por ahora retornamos un valor simulado ya que no tenemos endpoint específico
            // En el futuro se puede implementar un sistema de favoritos real
            return 0;
        } catch (error) {
            console.error('Error al obtener vehículos favoritos:', error);
            return 0;
        }
    }
};
