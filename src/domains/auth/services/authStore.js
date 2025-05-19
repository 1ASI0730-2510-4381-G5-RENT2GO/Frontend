import { defineStore } from 'pinia';

// ejemplo simple de un store llamado 'authStore'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
    }),
    actions: {
        async login(email, password) {
            // Aquí podrías usar el servicio login si quieres
            // Por ejemplo: const response = await login(email, password)
            // this.user = response.usuario

            // Mock para prueba:
            if (email && password) {
                this.user = { email };
                this.isAuthenticated = true;
                return true;
            }
            return false;
        },
        logout() {
            this.user = null;
            this.isAuthenticated = false;
        },
    },
});