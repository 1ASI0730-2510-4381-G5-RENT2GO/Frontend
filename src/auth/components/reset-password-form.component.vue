<template>
  <form
      @submit.prevent="handleResetPassword"
      class="max-w-md w-full animate-slide-in shadow-lg px-8 py-10
         bg-white dark:bg-gray-800
         rounded-2xl border border-gray-200 dark:border-gray-700
         transition-all duration-500">
    <div class="flex flex-col items-center justify-center mb-8">
      <img src="@/assets/logo.svg" alt="Logo" class="h-16 mb-4 drop-shadow-md select-none" draggable="false" />
      <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-2 transition-colors">
        {{ $t('auth.reset_title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm text-center transition-colors">
        {{ $t('auth.reset_subtitle') }}
      </p>
    </div>

    <div class="space-y-4 mb-6">
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <i class="pi pi-lock"></i>
        </div>
        <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded-xl px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
              focus:border-primary-500 dark:focus:border-primary-600
              outline-none transition-colors duration-300
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :placeholder="$t('auth.password_placeholder')"
            required
            autocomplete="new-password"
        />
        <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </button>
      </div>

      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <i class="pi pi-lock"></i>
        </div>
        <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full rounded-xl px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
              focus:border-primary-500 dark:focus:border-primary-600
              outline-none transition-colors duration-300
              placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :placeholder="$t('auth.repeat_password_placeholder')"
            required
            autocomplete="new-password"
        />
        <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </button>
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
        {{ $t('auth.reset_button') }}
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
      {{ $t('auth.back_to') }}
      <router-link to="/login" class="font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors">
        {{ $t('auth.login') }}
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const token = route.query.token || '';

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

async function handleResetPassword() {
  error.value = '';
  success.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = $t('auth.passwords_dont_match');
    return;
  }

  if (password.value.length < 8) {
    error.value = $t('auth.password_requirement');
    return;
  }

  loading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Cambiando contraseña con token:', token);

    success.value = $t('auth.success_password_reset');

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    error.value = $t('auth.error_reset_failed');
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