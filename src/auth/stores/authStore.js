import { defineStore } from 'pinia';
import {
  getStoredUser,
  getAuthToken,
  login,
  register,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  loginWithProvider,
  verifyEmail,
  resendVerification,
  updateProfile,
  changePassword,
  checkEmailExists,
  uploadProfileImage as uploadService
} from '../services/auth.service.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser(),
    isAuthenticated: !!getAuthToken(),
    loading: false,
    error: null
  }),
  actions: {
    async initialize() {
      this.loading = true;
      try {
        if (getAuthToken()) {
          console.log('initialize: token presente, refrescando user');
          await this.refreshUserInfo();
        } else {
          console.log('initialize: sin token, no refrescar user');
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Error inicializando authStore:', error);
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.loading = false;
      }
    },
    async login(credentials) {
      this.loading = true; this.error = null;
      try {
        const resp = await login(credentials);
        this.user = resp.user || resp.data;
        this.isAuthenticated = true;
        return resp;
      } catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async register(data, isOAuth = false) {
      this.loading = true; this.error = null;
      try {
        const resp = await register(data, isOAuth);
        return resp;
      } catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async refreshUserInfo() {
      try {
        const u = await getCurrentUser();
        if (u) { this.user = u; this.isAuthenticated = true; }
        return u;
      } catch { return null; }
    },
    async updateProfile(profileData) {
      this.loading = true; this.error = null;
      try {
        const res = await updateProfile(profileData);
        this.user = res.data || this.user;
        return res;
      } catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async uploadProfileImage(file) {
      this.loading = true; this.error = null;
      try {
        const updated = await uploadService(file);
        console.log('Respuesta de uploadProfileImage en el store:', updated);
        
        // Mapear correctamente el campo recibido de la respuesta API
        const profileImagePath = updated.profileImage || updated.profile_image || updated.path;
        console.log('Ruta de imagen asignada:', profileImagePath);
        
        // Actualizar el objeto user con la ruta de la imagen
        if (profileImagePath) {
          this.user = {
            ...this.user,
            profilePicture: profileImagePath
          };
          
          // Guardar en localStorage para persistencia
          localStorage.setItem('user', JSON.stringify(this.user));
          console.log('Usuario actualizado con nueva imagen:', this.user);
        } else {
          console.error('No se encontró la ruta de la imagen en la respuesta:', updated);
        }
        
        return profileImagePath;
      } catch (e) { 
        console.error('Error al subir imagen de perfil:', e);
        this.error = e.message; 
        throw e; 
      } finally { 
        this.loading = false; 
      }
    },
    async changePassword(currentPassword, newPassword) {
      this.loading = true; this.error = null;
      try { const res = await changePassword(currentPassword, newPassword); return res; }
      catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async resetPassword(token, newPassword) {
      this.loading = true; this.error = null;
      try { const res = await resetPassword(token, newPassword); return res; }
      catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async resendEmailVerification(email) {
      this.loading = true; this.error = null;
      try { const res = await resendVerification(email); return res; }
      catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async verifyEmailToken(token) {
      this.loading = true; this.error = null;
      try { const res = await verifyEmail(token); return res; }
      catch (e) { this.error = e.message; throw e; } finally { this.loading = false; }
    },
    async checkEmailExists(email) {
      try { return await checkEmailExists(email); } catch { return { exists: false, isOAuth: false, provider: null }; }
    },
    logout() {
      logout();
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    },
    clearError() { this.error = null; }
  }
});

