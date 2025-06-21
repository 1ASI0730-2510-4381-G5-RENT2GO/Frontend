import { createApiService } from '../../shared/services/api.service';

// Crear instancia de axios configurada para el endpoint de provider
const providerAPI = createApiService('provider');
export default {
    /**
     * Obtiene todos los vehículos del proveedor
     * @returns {Promise<Array>}
     */
    async getVehicles() {
        try {
            const response = await providerAPI.get('/vehicles');
            // Construir array bruto de vehículos según estructura
            let rawVehicles = [];
            if (Array.isArray(response.data)) {
                rawVehicles = response.data;
            } else if (response.data && typeof response.data === 'object') {
                if (Array.isArray(response.data.value)) {
                    rawVehicles = response.data.value;
                } else {
                    const possibleArrayProps = Object.keys(response.data).filter(key => Array.isArray(response.data[key]));
                    if (possibleArrayProps.length > 0) rawVehicles = response.data[possibleArrayProps[0]];
                    else rawVehicles = Array.isArray(Object.values(response.data)) ? Object.values(response.data) : [response.data];
                }
            }
            const normalizedVehicles = rawVehicles.map(vehicle => this.normalizeImageProperty(vehicle));
            // Obtener imágenes por separado desde el nuevo endpoint
            const vehiclesWithImages = await Promise.all(
                normalizedVehicles.map(async vehicle => {
                    try {
                        const imgRes = await providerAPI.get(`/vehicles/${vehicle.id}/images`);
                        if (Array.isArray(imgRes.data)) vehicle.images = imgRes.data;
                    } catch (e) {
                        console.error(`Error al obtener imágenes del vehículo ${vehicle.id}:`, e);
                    }
                    return vehicle;
                })
            );
            return vehiclesWithImages;
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
            return this.normalizeImageProperty(response.data);
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
            // Agregar logs de depuración
            console.log('Datos enviados al backend:', JSON.stringify(vehicleData, null, 2));
            
            // Configurar contenido específico para solucionar problema de compatibilidad
            // con el formato esperado por el backend
            const vehicle = {
                ...vehicleData,
                // Asegurar que estos campos existan explícitamente
                doors: vehicleData.doors || 0,
                seats: vehicleData.seats || 0,
                transmission: vehicleData.transmission || '',
                fuelType: vehicleData.fuelType || '',
                airConditioner: vehicleData.airConditioner || false,
            };
            
            console.log('Datos procesados para enviar:', JSON.stringify(vehicle, null, 2));
            
            const response = await providerAPI.post('/vehicles', vehicle);
            return response.data;
        } catch (error) {
            console.error('Error al registrar vehículo:', error);
            
            // Agregar más detalles del error para depuración
            if (error.response) {
                console.error('Detalles de respuesta de error:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            
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
    },

    /**
     * Actualiza el estado de un vehículo
     * @param {string} id - ID del vehículo
     * @param {string} status - Nuevo estado ('available', 'rented', 'maintenance', 'inactive')
     * @returns {Promise<Object>}
     */
    async updateVehicleStatus(id, status) {
        try {
            console.log(`Actualizando estado del vehículo ${id} a ${status}`);
            const response = await providerAPI.patch(`/vehicles/${id}/status`, {
                status: status
            });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar estado del vehículo ${id}:`, error);
            
            // Agregar más detalles del error para depuración
            if (error.response) {
                console.error('Detalles de respuesta de error:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            
            throw error;
        }
    },

    /**
     * Desactiva un vehículo (cambia su estado a 'inactive')
     * @param {string} id - ID del vehículo
     * @returns {Promise<Object>}
     */
    async deactivateVehicle(id) {
        return this.updateVehicleStatus(id, 'inactive');
    },

    /**
     * Activa un vehículo (cambia su estado a 'available')
     * @param {string} id - ID del vehículo
     * @returns {Promise<Object>}
     */
    async activateVehicle(id) {
        return this.updateVehicleStatus(id, 'available');
    },

    /**
     * Marca un vehículo en mantenimiento
     * @param {string} id - ID del vehículo
     * @returns {Promise<Object>}
     */
    async setVehicleMaintenance(id) {
        return this.updateVehicleStatus(id, 'maintenance');
    },

    /**
     * Sube imágenes para un vehículo
     * @param {string} id - ID del vehículo
     * @param {File[]} files - Archivos de imagen a subir
     * @returns {Promise<Object>}
     */
    async uploadVehicleImages(id, files) {
        try {
            // Crear un FormData para enviar los archivos
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            
            const response = await providerAPI.post(`/vehicles/${id}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error(`Error al subir imágenes para el vehículo ${id}:`, error);
            
            // Agregar más detalles del error para depuración
            if (error.response) {
                console.error('Detalles de respuesta de error:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            
            throw error;
        }
    },

    // Función para normalizar la propiedad de imágenes
    normalizeImageProperty(vehicle) {
        if (!vehicle) return vehicle;
        const normalized = { ...vehicle };
        // Usar images (camelCase) o Images (pascal) o array vacío
        const imgs = vehicle.images ?? vehicle.Images ?? [];
        normalized.images = Array.isArray(imgs) ? imgs : [imgs];
        return normalized;
    },
};
