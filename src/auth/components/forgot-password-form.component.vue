<template>
  <form
      @submit.prevent="handleSubmit"
      class="max-w-md w-full animate-slide-in shadow-lg px-8 py-10
         bg-white dark:bg-gray-800
         rounded-2xl border border-gray-200 dark:border-gray-700
         transition-all duration-500">
    <div class="flex flex-col items-center justify-center mb-8">
      <img src="@/assets/logo.svg" alt="Logo" class="h-16 mb-4 drop-shadow-md select-none" draggable="false" />
      <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-2 transition-colors">
        {{ $t('auth.forgot_title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm text-center transition-colors">
        {{ $t('auth.forgot_subtitle') }}
      </p>
    </div>

    <div class="space-y-4 mb-6">
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <i class="pi pi-envelope"></i>
        </div>
        <input
            v-model="email"
            type="email"
            class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
              focus:border-primary-500 dark:focus:border-primary-600
              outline-none transition-colors duration-300
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :placeholder="$t('auth.email_placeholder')"
            required
            autocomplete="email"
        />
      </div>
    </div>

    <button
        type="submit"
        :disabled="loading"
        class="w-full rounded-xl py-3 font-bold
          bg-primary-600 dark:bg-primary-500
          text-white shadow-md hover:shadow-lg
          hover:bg-primary-700 dark:hover:bg-primary-600
          transition-all duration-300
          focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/60
          disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span v-if="!loading" class="flex items-center justify-center">
        {{ $t('auth.send_code_button') }}
      </span>
      <span v-else class="flex items-center justify-center">
        <i class="pi pi-spin pi-spinner mr-2"></i>
        {{ $t('auth.loading') }}
      </span>
    </button>

    <transition name="fade-slide" mode="out-in">
      <div
          v-if="error"
          key="error"
          class="mt-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 font-medium rounded-xl py-3 px-4 flex items-center"
      >
        <i class="pi pi-exclamation-circle mr-2"></i>
        {{ error }}
      </div>
    </transition>

    <transition name="fade-slide" mode="out-in">
      <div
          v-if="success"
          key="success"
          class="mt-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 font-medium rounded-xl py-3 px-4 flex items-center"
      >
        <i class="pi pi-check-circle mr-2"></i>
        {{ success }}
      </div>
    </transition>

    <div class="text-sm text-center text-gray-600 dark:text-gray-400 mt-6 transition-colors">
      {{ $t('auth.remember_password') }}
      <router-link to="/login" class="font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors">
        {{ $t('auth.login') }}
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { forgotPassword } from '../services/auth.service.js';

const router = useRouter();
const { t } = useI18n();
const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

async function handleSubmit() {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await forgotPassword(email.value);

    success.value = t('auth.success_code_sent');

    setTimeout(() => {
      router.push({ name: 'Login' });
    }, 2000);
  } catch (err) {
    console.error('Error al enviar solicitud:', err);
    error.value = err.message || t('auth.error_send_failed');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@keyframes slide-in {
  0% {opacity: 0; transform: translateY(-20px) scale(0.98);}
  100% {opacity: 1; transform: none;}
}
.animate-slide-in {
  animation: slide-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>

