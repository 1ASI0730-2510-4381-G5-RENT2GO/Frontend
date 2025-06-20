<template>
  <form
      @submit.prevent="handleVerification"
      class="max-w-md w-full animate-slide-in shadow-lg px-8 py-10
         bg-white dark:bg-gray-800
         rounded-2xl border border-gray-200 dark:border-gray-700
         transition-all duration-500">
    <div class="flex flex-col items-center justify-center mb-8">
      <img src="@/assets/logo.svg" alt="Logo" class="h-16 mb-4 drop-shadow-md select-none" draggable="false" />
      <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-2 transition-colors">
        {{ $t('auth.verify_title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm text-center transition-colors">
        {{ $t('auth.verify_subtitle') }}
      </p>
    </div>

    <div class="space-y-4 mb-6">
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <i class="pi pi-lock"></i>
        </div>
        <input
            v-model="verificationCode"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
              focus:border-primary-500 dark:focus:border-primary-600
              outline-none transition-colors duration-300
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              text-center font-medium tracking-wider"
            :placeholder="$t('auth.code_placeholder')"
            required
        />
      </div>
    </div>

    <button
        type="submit"
        :disabled="loading || verificationCode.length < 6"
        class="w-full rounded-xl py-3 font-bold
          bg-primary-600 dark:bg-primary-500
          text-white shadow-md hover:shadow-lg
          hover:bg-primary-700 dark:hover:bg-primary-600
          transition-all duration-300
          focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-500/60
          disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span v-if="!loading" class="flex items-center justify-center">
        {{ $t('auth.verify_button') }}
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

    <div v-if="!canResend" class="text-sm text-center text-gray-600 dark:text-gray-400 mt-6 transition-colors">
      {{ $t('auth.resend_code_in') }} {{ resendCountdown }} {{ $t('auth.seconds') }}
    </div>

    <button
        v-if="canResend"
        type="button"
        @click="handleResendCode"
        :disabled="resendLoading"
        class="text-sm text-center text-primary-600 dark:text-primary-400 hover:underline mt-6 transition-colors mx-auto"
    >
      <span v-if="!resendLoading">{{ $t('auth.resend_code') }}</span>
      <span v-else class="flex items-center justify-center">
        <i class="pi pi-spin pi-spinner mr-2"></i>
        {{ $t('auth.sending') }}
      </span>
    </button>

    <div class="text-sm text-center text-gray-600 dark:text-gray-400 mt-6 transition-colors">
      {{ $t('auth.back_to') }}
      <router-link to="/login" class="font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors">
        {{ $t('auth.login') }}
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const email = decodeURIComponent(route.query.email || '');

console.log("Email recibido en la URL:", email);

const verificationCode = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const resendCountdown = ref(60);
const canResend = ref(false);
const resendLoading = ref(false);

onMounted(() => {
  startResendCountdown();
});

function startResendCountdown() {
  canResend.value = false;
  resendCountdown.value = 60;

  const interval = setInterval(() => {
    resendCountdown.value -= 1;

    if (resendCountdown.value <= 0) {
      clearInterval(interval);
      canResend.value = true;
    }
  }, 1000);
}

async function handleVerification() {
  error.value = '';
  success.value = '';

  if (!/^\d{6}$/.test(verificationCode.value)) {
    error.value = t('auth.error_code_invalid');
    return;
  }

  if (!email) {
    error.value = t('auth.error_email_missing');
    return;
  }

  loading.value = true;

  try {
    const cleanCode = verificationCode.value.trim();
    console.log(`Enviando código: [${cleanCode}]`); // Log para depuración

    const response = await fetch('http://localhost:5239/api/Auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        code: cleanCode
      })
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error al parsear JSON:', jsonError);
        throw new Error(t('auth.error_server_response'));
      }
    } else if (!response.ok) {
      const textResponse = await response.text();
      console.error('Respuesta de error no-JSON:', textResponse);
      throw new Error(t('auth.error_server_error'));
    }

    if (!response.ok) {
      throw new Error(data?.message || t('auth.error_code_invalid'));
    }

    if (data?.alreadyVerified) {
      success.value = t('auth.already_verified');
    } else {
      success.value = t('auth.success_code_verified');
    }

    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    console.error('Error al verificar código:', err);
    error.value = err.message || t('auth.error_code_invalid');
  } finally {
    loading.value = false;
  }
}

async function handleResendCode() {
  resendLoading.value = true;
  error.value = '';
  success.value = '';

  try {
    const response = await fetch('http://localhost:5239/api/Auth/resend-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || t('auth.error_resend_failed'));
    }

    startResendCountdown();

    success.value = t('auth.success_code_resent');
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (err) {
    console.error('Error al reenviar código:', err);
    error.value = err.message || t('auth.error_resend_failed');
  } finally {
    resendLoading.value = false;
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
