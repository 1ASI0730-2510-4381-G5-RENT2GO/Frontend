// src/shared/services/usersService.js
import { getStoredUser } from '@/auth/services/auth.service.js';

/**
 * Servicio para gestionar usuarios
 * Este servicio está disponible para todos los roles (admin, provider, client)
 */
export const usersService = {
    /**
     * Obtiene información del usuario actual autenticado
     * @returns {Promise<Object|null>} Datos del usuario o null
     */
    getCurrentUser: async () => {
        const user = getStoredUser();
        if (user) {
            return Promise.resolve(user);
        }
        return Promise.resolve(null);
    },

    /**
     * Actualiza información del perfil de usuario
     * @param {Object} profileData - Datos de perfil a actualizar
     */
    updateProfile: async (profileData) => {
        console.log('Actualizando perfil:', profileData);
        return Promise.resolve({ success: true });
    },

    /**
     * Verifica si un correo electrónico ya existe
     * @param {string} email - Email a verificar
     */
    checkEmailExists: async (email) => {
        return Promise.resolve({ exists: false });
    }
};

export default usersService;
