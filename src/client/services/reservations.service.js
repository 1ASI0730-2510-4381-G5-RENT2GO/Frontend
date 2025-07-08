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
    },

    /**
     * Obtiene reservas filtradas por estado
     * @param {string} status Estado de las reservas (confirmed, in_progress, completed, cancelled)
     * @returns {Promise<Array>} Lista de reservas filtradas
     */
    async getReservationsByStatus(status) {
        try {
            const response = await clientAPI.get('/reservations', {
                params: { status }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al obtener reservas con estado ${status}:`, error);
            throw error;
        }
    },

    /**
     * Normaliza los datos de una reserva del backend
     * @param {Object} reservation Reserva del backend
     * @returns {Object} Reserva normalizada
     */
    normalizeReservation(reservation) {
        console.log('Normalizando reservación:', reservation);

        // Normalizar imágenes del vehículo usando el mismo patrón que vehicles
        if (reservation.vehicle) {
            console.log('Vehículo encontrado:', reservation.vehicle);
            reservation.vehicle = this.normalizeVehicleImages(reservation.vehicle);
        }

        // Asegurar que las fechas estén en formato correcto
        if (reservation.pickupDate) {
            reservation.pickupDate = new Date(reservation.pickupDate).toISOString().split('T')[0];
        }
        if (reservation.returnDate) {
            reservation.returnDate = new Date(reservation.returnDate).toISOString().split('T')[0];
        }
        if (reservation.bookingDate) {
            reservation.bookingDate = new Date(reservation.bookingDate).toISOString().split('T')[0];
        }

        console.log('Reservación normalizada:', reservation);
        return reservation;
    },

    /**
     * Normaliza las imágenes de un vehículo (copiado del vehiclesService)
     * @param {Object} vehicle - Datos del vehículo
     * @returns {Object} - Vehículo con imágenes normalizadas
     */
    normalizeVehicleImages(vehicle) {
        if (!vehicle) return vehicle;

        const normalizedVehicle = { ...vehicle };

        // Procesar imágenes según su formato
        if (vehicle.images) {
            normalizedVehicle.images = this.processVehicleImages(vehicle.images);
        } else {
            normalizedVehicle.images = [];
        }

        return normalizedVehicle;
    },

    /**
     * Procesa un array o objeto de imágenes para obtener URLs completas
     * @param {Array|Object} images - Imágenes a procesar
     * @returns {Array} - Array de URLs de imágenes procesadas
     */
    processVehicleImages(images) {
        if (!images) return [];

        // Caso 1: Si es un array normal
        if (Array.isArray(images)) {
            return images.map(image => this.getImageUrl(image));
        }

        // Caso 2: Si tiene la propiedad $values (formato específico del backend)
        if (images.$values && Array.isArray(images.$values)) {
            return images.$values.map(image => this.getImageUrl(image));
        }

        // Caso 3: Si es un objeto con una única imagen
        if (typeof images === 'object' && !Array.isArray(images)) {
            const singleImage = this.getImageUrl(images);
            return singleImage ? [singleImage] : [];
        }

        return [];
    },

    /**
     * Obtiene la URL completa de una imagen
     * @param {String|Object} image - Imagen a procesar
     * @returns {String} - URL completa de la imagen
     */
    getImageUrl(image) {
        // Si es null o undefined, devolver string vacío
        if (!image) return '';

        // Caso 1: Si la imagen es una cadena directamente
        if (typeof image === 'string') {
            return this.formatImageUrl(image);
        }

        // Caso 2: Si la imagen es un objeto con propiedades específicas
        if (typeof image === 'object') {
            // Buscar propiedades comunes que podrían contener la URL
            const possibleProps = ['url', 'path', 'imageUrl', 'imagePath', 'filePath'];
            for (const prop of possibleProps) {
                if (image[prop] && typeof image[prop] === 'string') {
                    return this.formatImageUrl(image[prop]);
                }
            }
        }

        return '';
    },

    /**
     * Formatea una URL de imagen para asegurarse de que sea completa
     * @param {String} path - Ruta de la imagen
     * @returns {String} - URL completa de la imagen
     */
    formatImageUrl(path) {
        // Si es null o undefined, devolver string vacío
        if (!path) return '';

        // Si ya es una URL completa, devolverla directamente
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        // Construir URL completa usando la base del backend
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://rent2go-backend.onrender.com';
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    }
};
