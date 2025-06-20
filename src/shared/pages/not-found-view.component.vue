<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-surface-dark transition-colors duration-300">
    <div class="max-w-lg w-full text-center">
      <div class="mb-8 relative">
        <div class="text-9xl font-extrabold text-primary-600/15 dark:text-primary-500/15">404</div>
        <div class="absolute left-0 right-0 top-full mt-2 flex justify-center">
          <div class="px-4 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium inline-flex items-center">
            <i class="pi pi-exclamation-circle mr-2"></i>
            <span>Ruta no encontrada</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-6 border border-gray-100 dark:border-gray-700">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center">
          <span class="border-b-2 border-primary-500 pb-1"><strong>Página no encontrada</strong></span>
        </h1>

        <div class="flex items-center justify-center mb-6 text-gray-500 dark:text-gray-400">
          <div class="h-px bg-gray-200 dark:bg-gray-700 w-16"></div>
          <i class="pi pi-compass mx-3 text-xl text-primary-500"></i>
          <div class="h-px bg-gray-200 dark:bg-gray-700 w-16"></div>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Lo sentimos, la ruta <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ currentPath }}</span> no existe.
        </p>

        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Es posible que el enlace que has seguido esté roto o que la página haya sido eliminada.
        </p>

        <div class="flex justify-center space-x-4 mb-6">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-2">
              <i class="pi pi-times text-lg"></i>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">Ruta inválida</p>
          </div>
          <div class="relative">
            <div class="h-px w-8 bg-gray-200 dark:bg-gray-700 absolute top-6 -left-6"></div>
            <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-2">
              <i class="pi pi-search text-lg"></i>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">Búsqueda</p>
          </div>
          <div class="relative">
            <div class="h-px w-8 bg-gray-200 dark:bg-gray-700 absolute top-6 -left-6"></div>
            <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-2">
              <i class="pi pi-home text-lg"></i>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">Inicio</p>
          </div>
        </div>

        <button
            @click="navigateToHome"
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 inline-flex items-center relative group"
        >
          <span class="absolute inset-0 rounded-xl bg-primary-600 animate-pulse opacity-30 group-hover:opacity-0 transition-opacity duration-300"></span>
          <i class="pi pi-home mr-2"></i>
          Volver al inicio
        </button>
      </div>

      <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <i class="pi pi-question-circle"></i>
        <span>¿Necesitas ayuda? <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline">Contacta con soporte</a></span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from '@/shared/utils/useTheme';

useTheme();

const router = useRouter();
const route = useRoute();

const currentPath = computed(() => {
  return route.path;
});

const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.role) {
        return user.role;
      }
    } catch (e) {
      console.error('Error al analizar datos de usuario', e);
    }
  }

  if (route.path.includes('/admin')) return 'admin';
  if (route.path.includes('/provider')) return 'provider';
  if (route.path.includes('/client')) return 'client';
  return 'guest';
};

const navigateToHome = () => {
  const role = getUserRole();

  switch (role) {
    case 'admin':
      router.push('/admin/dashboard');
      break;
    case 'provider':
      router.push('/provider/dashboard');
      break;
    case 'client':
      router.push('/client/home');
      break;
    default:
      router.push('/login');
      break;
  }
};
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
button:hover {
  @apply transform scale-[1.02] shadow-md;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.text-9xl {
  animation: float 6s ease-in-out infinite;
}
</style>