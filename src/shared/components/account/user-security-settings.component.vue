<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-2">
          <i class="pi pi-lock"></i>
        </div>
        Seguridad
      </h2>
      <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
        <i class="pi pi-shield mr-1"></i>Cuenta protegida
      </span>
    </div>

    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
          <i class="pi pi-shield text-yellow-500 mr-2"></i>
          Estado de seguridad de la cuenta
        </h3>
        <span class="text-sm font-medium text-yellow-600 dark:text-yellow-400">Medio</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div class="bg-yellow-500 h-2 rounded-full w-2/3"></div>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        <i class="pi pi-info-circle mr-1"></i>
        Recomendaciones: Actualice su contraseña y active la autenticación de dos factores para mayor seguridad.
      </div>
    </div>

    <div class="max-w-md mx-auto">
      <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
        <i class="pi pi-key text-primary-500 mr-2"></i>
        Cambio de contraseña
      </h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Contraseña actual <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-lock"></i>
            </span>
            <input
                type="password"
                v-model="localSecurityData.currentPassword"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Ingrese su contraseña actual"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Nueva contraseña <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-lock"></i>
            </span>
            <input
                type="password"
                v-model="localSecurityData.newPassword"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Ingrese nueva contraseña"
            />
            <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                @click="togglePasswordVisibility('new')"
            >
              <i class="pi" :class="showNewPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
            </button>
          </div>

          <div class="mt-2" v-if="localSecurityData.newPassword">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">Fortaleza de contraseña</span>
              <span class="text-xs font-medium" :class="passwordStrengthColor">{{ passwordStrength }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div class="h-1.5 rounded-full" :class="passwordStrengthBarColor" :style="`width: ${passwordStrengthWidth}%`"></div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Confirmar nueva contraseña <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-lock"></i>
            </span>
            <input
                type="password"
                v-model="localSecurityData.confirmPassword"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Confirme nueva contraseña"
            />
          </div>
          <p
              v-if="passwordMismatch"
              class="mt-1 text-xs text-red-500"
          >
            <i class="pi pi-times-circle mr-1"></i>Las contraseñas no coinciden
          </p>
        </div>
      </div>

      <div class="mt-4 mb-6 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 text-sm text-gray-600 dark:text-gray-400">
        <h4 class="font-medium text-blue-700 dark:text-blue-400 mb-2">Requisitos de contraseña:</h4>
        <ul class="space-y-1 list-inside">
          <li class="flex items-start">
            <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Mínimo 8 caracteres</span>
          </li>
          <li class="flex items-start">
            <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Al menos una letra mayúscula</span>
          </li>
          <li class="flex items-start">
            <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Al menos un número</span>
          </li>
          <li class="flex items-start">
            <i class="pi pi-check-circle text-green-500 mr-2 mt-0.5"></i>
            <span>Al menos un carácter especial</span>
          </li>
        </ul>
      </div>

      <div class="mt-8 mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <i class="pi pi-mobile text-primary-500 mr-2"></i>
            Autenticación de dos factores
          </h3>
          <div class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="twoFactorEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta al requerir un código de verificación además de tu contraseña.
        </p>
        <div v-if="twoFactorEnabled" class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 mt-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <i class="pi pi-check-circle text-green-500 mr-2"></i>
            Autenticación de dos factores está activada
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500">
            Configurada el 15/05/2025 • Último uso: hace 2 días
          </p>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <button
            @click="handleChangePassword"
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
            :disabled="!canSubmit"
            :class="{'opacity-50 cursor-not-allowed': !canSubmit}"
        >
          <i class="pi pi-lock mr-2"></i>Cambiar contraseña
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  securityData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['change-password']);

const localSecurityData = ref({
  currentPassword: props.securityData.currentPassword,
  newPassword: props.securityData.newPassword,
  confirmPassword: props.securityData.confirmPassword
});

const showNewPassword = ref(false);
const twoFactorEnabled = ref(false);

watch(() => props.securityData, (newVal) => {
  localSecurityData.value = { ...newVal };
}, { deep: true });

const passwordMismatch = computed(() => {
  return localSecurityData.value.newPassword &&
      localSecurityData.value.confirmPassword &&
      localSecurityData.value.newPassword !== localSecurityData.value.confirmPassword;
});

const passwordStrength = computed(() => {
  const password = localSecurityData.value.newPassword;
  if (!password) return '';

  const lengthScore = password.length >= 8 ? 25 : (password.length / 8) * 25;
  const uppercaseScore = /[A-Z]/.test(password) ? 25 : 0;
  const numberScore = /[0-9]/.test(password) ? 25 : 0;
  const specialScore = /[^A-Za-z0-9]/.test(password) ? 25 : 0;

  const totalScore = lengthScore + uppercaseScore + numberScore + specialScore;

  if (totalScore < 25) return 'Muy débil';
  if (totalScore < 50) return 'Débil';
  if (totalScore < 75) return 'Media';
  if (totalScore < 100) return 'Fuerte';
  return 'Muy fuerte';
});

const passwordStrengthWidth = computed(() => {
  const password = localSecurityData.value.newPassword;
  if (!password) return 0;

  const lengthScore = password.length >= 8 ? 25 : (password.length / 8) * 25;
  const uppercaseScore = /[A-Z]/.test(password) ? 25 : 0;
  const numberScore = /[0-9]/.test(password) ? 25 : 0;
  const specialScore = /[^A-Za-z0-9]/.test(password) ? 25 : 0;

  return lengthScore + uppercaseScore + numberScore + specialScore;
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 'Muy débil') return 'text-red-600 dark:text-red-400';
  if (strength === 'Débil') return 'text-orange-600 dark:text-orange-400';
  if (strength === 'Media') return 'text-yellow-600 dark:text-yellow-400';
  if (strength === 'Fuerte') return 'text-green-600 dark:text-green-400';
  return 'text-green-600 dark:text-green-400';
});

const passwordStrengthBarColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 'Muy débil') return 'bg-red-500';
  if (strength === 'Débil') return 'bg-orange-500';
  if (strength === 'Media') return 'bg-yellow-500';
  if (strength === 'Fuerte') return 'bg-green-500';
  return 'bg-green-500';
});

const canSubmit = computed(() => {
  return localSecurityData.value.currentPassword &&
      localSecurityData.value.newPassword &&
      localSecurityData.value.confirmPassword &&
      !passwordMismatch.value;
});

const togglePasswordVisibility = (field) => {
  if (field === 'new') {
    showNewPassword.value = !showNewPassword.value;
  }
};

const handleChangePassword = () => {
  if (canSubmit.value) {
    emit('change-password', localSecurityData.value);
  }
};
</script>

