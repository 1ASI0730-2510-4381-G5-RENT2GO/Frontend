<template>
  <div class="min-h-screen p-4 bg-white dark:bg-surface-dark transition-colors duration-300">
    <div class="max-w-4xl mx-auto">
      <user-profile-header-component :user="user" :role-name="roleName" @upload-file="handleUploadImage" />

      <user-account-tabs-component
          :active-tab="activeTab"
          @change-tab="activeTab = $event"
      />

      <user-personal-info-component
          v-if="activeTab === 'profile'"
          :user="user"
          :profile-data="profileData"
          @save="saveProfile"
      />

      <user-security-settings-component
          v-if="activeTab === 'security'"
          :security-data="securityData"
          @change-password="changePassword"
      />

      <user-preferences-component
          v-if="activeTab === 'preferences'"
          :preferences="preferences"
          @toggle-dark-mode="toggleDarkMode"
          @save="savePreferences"
      />
    </div>
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import { useTheme } from '@/shared/utils/useTheme';
import { useAuthStore } from '@/auth/stores/authStore.js';
import UserProfileHeaderComponent from '@/shared/components/account/user-profile-header.component.vue';
import UserAccountTabsComponent from '@/shared/components/account/user-account-tabs.component.vue';
import UserPersonalInfoComponent from '@/shared/components/account/user-personal-info.component.vue';
import UserSecuritySettingsComponent from '@/shared/components/account/user-security-settings.component.vue';
import UserPreferencesComponent from '@/shared/components/account/user-preferences.component.vue';

const { theme, setTheme } = useTheme();
const authStore = useAuthStore();

const activeTab = ref('profile');

const user = ref({
  id: null,
  fullName: '',
  email: '',
  role: 'client',
  profilePicture: null
});

const profileData = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dni: '',
  driverLicense: '',
  birthDate: '',
  licenseIssueDate: '',
  companyName: '',
  taxId: '',
  department: '',
  position: ''
});

const securityData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});


const preferences = ref({
  darkMode: theme.value === 'dark',
  notifications: {
    email: true,
    sms: false,
    app: true
  },
  language: 'es'
});

const roleName = computed(() => {
  const names = {
    client: 'Cliente',
    provider: 'Proveedor',
    admin: 'Administrador'
  };
  return names[user.value.role] || 'Usuario';
});


const loadUserData = async () => {

  await authStore.refreshUserInfo();
  const storeUser = authStore.user;
  if (!storeUser) return;
  user.value = {
    id: storeUser.id,
    fullName: storeUser.name || '',
    email: storeUser.email || '',
    role: storeUser.role || 'client',
    profilePicture: storeUser.profilePicture || storeUser.profile_image || null
  };


  profileData.value = {
    fullName: storeUser.fullName || storeUser.name || '',
    email: storeUser.email || '',
    phone: storeUser.phone || '',
    address: storeUser.address || '',
    dni: storeUser.dni || '',
    driverLicense: storeUser.driverLicense || storeUser.licenseNumber || '',
    birthDate: storeUser.birthDate || '',
    licenseIssueDate: storeUser.licenseIssueDate || '',
    companyName: storeUser.companyName || '',
    taxId: storeUser.taxId || '',
    department: storeUser.department || '',
    position: storeUser.position || ''
  };
};

const saveProfile = async (data) => {
  try {
    await authStore.updateProfile(data);
    await loadUserData();
    alert('Perfil actualizado correctamente');
  } catch (error) {
    alert('Error al actualizar el perfil: ' + error.message);
  }
};

const changePassword = async (passwordData) => {
  try {
    await authStore.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
    );
    alert('Contraseña cambiada correctamente');
    securityData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error) {
    alert('Error al cambiar la contraseña: ' + error.message);
  }
};

const toggleDarkMode = () => {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  preferences.value.darkMode = newTheme === 'dark';
};

const savePreferences = (prefs) => {
  localStorage.setItem('preferences', JSON.stringify(prefs));
  alert('Preferencias guardadas correctamente');
};

const handleUploadImage = async (file) => {
  try {
    await authStore.uploadProfileImage(file);
    await loadUserData();
    alert('Imagen de perfil actualizada correctamente');
  } catch (err) {
    alert('Error al subir imagen: ' + err.message);
  }
};

onMounted(loadUserData);
</script>

