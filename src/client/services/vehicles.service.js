import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de client
const clientAPI = createApiService('client');

// URL base del backend para construir URLs completas de imágenes
const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://rent2go-backend.onrender.com';

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
            // Asegurarnos de que searchParams es un objeto para evitar errores
            const params = searchParams || {};
            
            // Log para depuración
            console.log('Enviando parámetros de búsqueda a la API:', params);
            
            const response = await clientAPI.get('/vehicles/search', {
                params: params
            });
            
            // Procesar vehículos para asegurar que las imágenes tengan URLs completas
            let vehicles = response.data;
            
            // Manejar diferentes formatos de respuesta
            if (vehicles && vehicles.$values) {
                vehicles = vehicles.$values;
            } else if (!Array.isArray(vehicles)) {
                vehicles = [];
            }
            
            // Procesar cada vehículo para formatear correctamente sus imágenes
            return vehicles.map(vehicle => this.normalizeVehicleImages(vehicle));
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
            return this.normalizeVehicleImages(response.data);
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
    },

    /**
     * Normaliza las imágenes de un vehículo, asegurándose de que tengan URLs completas
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
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    }
};
