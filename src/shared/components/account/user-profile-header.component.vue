<template>
  <div class="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
    <div class="flex flex-col md:flex-row">
      <div class="flex items-center mb-4 md:mb-0">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-primary-100 dark:border-primary-900">
            <img v-if="user.profilePicture" :src="getImageUrl(user.profilePicture)" alt="Foto de perfil" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="pi pi-user text-4xl"></i>
            </div>
          </div>
          <button @click="triggerUpload" class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-md hover:bg-primary-600 transition-colors">
            <i class="pi pi-camera text-sm"></i>
          </button>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </div>
        <div class="ml-4">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ user.fullName }}</h1>
          <div class="flex items-center space-x-2 mt-1">
            <span class="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium">
              {{ roleName }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              <i class="pi pi-envelope mr-1"></i>{{ user.email }}
            </span>
          </div>
        </div>
      </div>

      <div class="md:ml-auto flex flex-col md:items-end space-y-2">
        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <i class="pi pi-id-card mr-2"></i>
          <span class="text-sm">ID: #{{ user.id }}</span>
        </div>

        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <i class="pi pi-clock mr-2"></i>
          <span class="text-sm">Última conexión: {{ lastLoginFormatted }}</span>
        </div>

        <div v-if="user.role === 'client'" class="flex items-center text-gray-600 dark:text-gray-400">
          <i class="pi pi-car mr-2"></i>
          <span class="text-sm">Cliente desde: {{ joinDateFormatted }}</span>
        </div>

        <div v-if="user.role === 'provider'" class="flex items-center text-gray-600 dark:text-gray-400">
          <i class="pi pi-building mr-2"></i>
          <span class="text-sm">Proveedor desde: {{ joinDateFormatted }}</span>
        </div>

        <div v-if="user.role === 'admin'" class="flex items-center text-gray-600 dark:text-gray-400">
          <i class="pi pi-shield mr-2"></i>
          <span class="text-sm">Administrador desde: {{ joinDateFormatted }}</span>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex items-center space-x-2 mb-2 md:mb-0">
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Cuenta activa</span>
        </div>

        <div class="flex-1 mx-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-gray-500 dark:text-gray-400">Perfil completado</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">85%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-primary-500 h-2 rounded-full" style="width: 85%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// URL base de la API (sin '/api' para recursos estáticos)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5239';
const FILE_BASE_URL = API_BASE.replace(/\/api$/, '');

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  roleName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['upload-file']);
const fileInput = ref(null);

function triggerUpload() {
  fileInput.value.click();
}

function onFileChange(event) {
  const file = event.target.files?.[0];
  if (file) emit('upload-file', file);
  event.target.value = null;
}

function getImageUrl(path) {
  if (!path) {
    console.log('getImageUrl: ruta vacía');
    return '';
  }
  
  console.log('getImageUrl - Ruta de imagen original:', path);
  console.log('getImageUrl - FILE_BASE_URL:', FILE_BASE_URL);

  if (path.startsWith('http')) {
    console.log('getImageUrl - URL completa detectada, devolviendo:', path);
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  console.log('getImageUrl - Ruta normalizada:', normalizedPath);

  const fullUrl = `${FILE_BASE_URL}${normalizedPath}`;
  console.log('getImageUrl - URL completa construida:', fullUrl);
  
  return fullUrl;
}

const lastLoginFormatted = computed(() => {
  return formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000)); // Ayer
});

const joinDateFormatted = computed(() => {
  return formatDate(new Date(2025, 3, 15)); // 15 de abril de 2025
});

function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}
</script>

