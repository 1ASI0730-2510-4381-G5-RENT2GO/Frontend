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
            let reservations = response.data;
            
            // Manejar diferentes formatos de respuesta del backend
            if (reservations && reservations.$values) {
                reservations = reservations.$values;
            }
            
            console.log('Datos de reservas recibidos del backend:', reservations);
            
            if (reservations.length > 0) {
                console.log('Primera reserva (estructura):', {
                    id: reservations[0].id,
                    client: reservations[0].client,
                    vehicle: reservations[0].vehicle,
                    clientId: reservations[0].clientId,
                    vehicleId: reservations[0].vehicleId
                });
            }
            
            // Normalizar cada reserva usando la misma lógica del cliente
            const normalizedReservations = reservations.map(reservation => this.normalizeReservation(reservation));
            
            return normalizedReservations;
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            throw error;
        }
    },

    /**
     * Normaliza los datos de una reserva del backend (copiado del cliente)
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
        const baseUrl = 'http://localhost:5239';
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    },

    /**
     * Obtiene una reserva por su ID
     * @param {string} id - ID de la reserva
     * @returns {Promise<Object>}
     */
    async getReservationById(id) {
        try {
            const response = await providerAPI.get(`/reservations/${id}`);
            const reservation = response.data;
            
            // Cargar imágenes del vehículo si existe
            if (reservation.vehicle?.id) {
                try {
                    const imgResponse = await providerAPI.get(`/vehicles/${reservation.vehicle.id}/images`);
                    if (Array.isArray(imgResponse.data)) {
                        reservation.vehicle.images = imgResponse.data;
                    } else {
                        reservation.vehicle.images = [];
                    }
                } catch (imgError) {
                    console.warn(`No se pudieron cargar imágenes para el vehículo ${reservation.vehicle.id}:`, imgError);
                    reservation.vehicle.images = [];
                }
            }
            
            return reservation;
        } catch (error) {
            console.error(`Error al obtener reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza el estado de una reserva
     * @param {string} id - ID de la reserva
     * @param {string} status - Nuevo estado (confirmed, cancelled, completed)
     * @param {string} [notes] - Notas adicionales (opcional)
     * @returns {Promise<Object>}
     */
    async updateReservationStatus(id, status, notes) {
        try {
            const payload = { status };
            if (notes) {
                payload.notes = notes;
            }
            
            const response = await providerAPI.put(`/reservations/${id}/status`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar estado de reserva ${id}:`, error);
            throw error;
        }
    },

    /**
     * Confirma una reserva
     * @param {string} id - ID de la reserva
     * @param {string} [notes] - Notas adicionales (opcional)
     * @returns {Promise<Object>}
     */
    async confirmReservation(id, notes) {
        return this.updateReservationStatus(id, 'confirmed', notes);
    },

    /**
     * Cancela una reserva
     * @param {string} id - ID de la reserva
     * @param {string} [reason] - Razón de la cancelación (opcional)
     * @returns {Promise<Object>}
     */
    async cancelReservation(id, reason) {
        return this.updateReservationStatus(id, 'cancelled', reason);
    },

    /**
     * Completa una reserva
     * @param {string} id - ID de la reserva
     * @param {string} [notes] - Notas adicionales (opcional)
     * @returns {Promise<Object>}
     */
    async completeReservation(id, notes) {
        return this.updateReservationStatus(id, 'completed', notes);
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
