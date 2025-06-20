<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-2">
          <i class="pi pi-cog"></i>
        </div>
        Preferencias
      </h2>
      <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
        <i class="pi pi-sliders-h mr-1"></i>Personalización
      </span>
    </div>

    <div class="max-w-lg mx-auto">
      <div class="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <i class="pi pi-moon text-primary-500 mr-2"></i>
              Modo oscuro
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cambia entre modo claro y oscuro para mejorar la legibilidad.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localPreferences.darkMode" class="sr-only peer" @change="handleToggleDarkMode">
            <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-2">
          <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-sm font-medium" :class="{'ring-2 ring-primary-500': !localPreferences.darkMode}">
            <i class="pi pi-sun text-yellow-500 mr-2"></i>
            Modo claro
          </div>
          <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 text-white flex items-center justify-center text-sm font-medium" :class="{'ring-2 ring-primary-500': localPreferences.darkMode}">
            <i class="pi pi-moon text-blue-300 mr-2"></i>
            Modo oscuro
          </div>
        </div>
      </div>

      <div class="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center mb-4">
          <i class="pi pi-globe text-primary-500 mr-2"></i>
          Idioma
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
              v-for="lang in languages"
              :key="lang.code"
              @click="localPreferences.language = lang.code"
              class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="{'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800': localPreferences.language === lang.code, 'bg-white dark:bg-gray-800': localPreferences.language !== lang.code}"
          >
            <div class="flex items-center">
              <img :src="lang.flag" :alt="lang.name" class="w-8 h-6 mr-3 rounded shadow-sm">
              <div>
                <div class="font-medium text-gray-700 dark:text-gray-300">{{ lang.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ lang.nativeName }}</div>
              </div>
              <div v-if="localPreferences.language === lang.code" class="ml-auto">
                <i class="pi pi-check-circle text-primary-500"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center mb-4">
          <i class="pi pi-bell text-primary-500 mr-2"></i>
          Notificaciones
        </h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-700 dark:text-gray-300">Notificaciones por email</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Recibe alertas importantes por correo electrónico</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="localPreferences.emailNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-700 dark:text-gray-300">Notificaciones push</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones en tiempo real</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="localPreferences.pushNotifications" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <button @click="$emit('save')" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center">
          <i class="pi pi-save mr-2"></i>Guardar preferencias
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  preferences: {
    type: Object,
    required: true,
    default: () => ({
      darkMode: false,
      language: 'es',
      emailNotifications: true,
      pushNotifications: false
    })
  }
});

const emit = defineEmits(['toggle-dark-mode', 'save']);

const localPreferences = ref({
  darkMode: props.preferences.darkMode,
  language: props.preferences.language,
  emailNotifications: props.preferences.emailNotifications || true,
  pushNotifications: props.preferences.pushNotifications || false
});

// Lista de idiomas disponibles
const languages = ref([
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: 'https://flagcdn.com/w40/es.png'
  },
  {
    code: 'en',
    name: 'Inglés',
    nativeName: 'English',
    flag: 'https://flagcdn.com/w40/gb.png'
  },
  {
    code: 'fr',
    name: 'Francés',
    nativeName: 'Français',
    flag: 'https://flagcdn.com/w40/fr.png'
  },
  {
    code: 'de',
    name: 'Alemán',
    nativeName: 'Deutsch',
    flag: 'https://flagcdn.com/w40/de.png'
  }
]);

watch(() => props.preferences, (newVal) => {
  localPreferences.value = {
    ...localPreferences.value,
    ...newVal
  };
}, { deep: true });

const handleToggleDarkMode = () => {
  emit('toggle-dark-mode');
};
</script>