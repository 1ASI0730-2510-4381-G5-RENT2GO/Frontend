<template>
  <form
      @submit.prevent="onSubmit"
      class="flex flex-col gap-6 w-full animate-slide-in shadow-md px-8 py-10 bg-white bg-opacity-30
           rounded-2xl border border-white border-opacity-20
           transition-all duration-500"
  >
    <div class="flex flex-col items-center justify-center">
      <img src="@/assets/logo.svg" alt="Logo" class="h-14 mb-3 opacity-90 select-none" draggable="false" />
      <h2 class="text-2xl font-extrabold text-white drop-shadow-md mb-2">{{ $t('auth.login_title') }}</h2>
      <p class="text-white text-opacity-90 text-sm">{{ $t('auth.login_subtitle') }}</p>
    </div>

    <div class="flex flex-col gap-4">
      <input
          v-model="email"
          type="email"
          class="rounded-xl px-4 py-3 border-none focus:ring-4
               focus:ring-purple-300 outline-none transition bg-white bg-opacity-70
               placeholder:text-gray-400 text-gray-800 font-medium
               shadow hover:shadow-lg"
          :placeholder="$t('auth.email_placeholder')"
          required
          autocomplete="username"
      />

      <input
          v-model="password"
          type="password"
          class="rounded-xl px-4 py-3 border-none focus:ring-4
               focus:ring-pink-300 outline-none transition bg-white bg-opacity-70
               placeholder:text-gray-400 text-gray-800 font-medium
               shadow hover:shadow-lg"
          :placeholder="$t('auth.password_placeholder')"
          required
          autocomplete="current-password"
      />
    </div>

    <button
        type="submit"
        :disabled="loading"
        class="rounded-xl mt-3 py-3 font-bold bg-gradient-to-r
             from-purple-500 via-pink-400 to-blue-400 text-white shadow-xl
             hover:from-pink-500 hover:to-blue-500 hover:scale-105
             transition-all duration-300 active:scale-95
             focus:ring-4 focus:ring-white focus:ring-opacity-70
             disabled:opacity-50"
    >
      <span v-if="!loading">{{ $t('auth.login_button') }}</span>
      <span v-else class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-1 text-white" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4"></circle>
        </svg>
        {{ $t('auth.loading') }}
      </span>
    </button>

    <transition name="fade-slide" mode="out-in">
      <p v-if="error" key="error" class="mt-1 bg-red-100 bg-opacity-80 text-red-600 font-semibold rounded py-2 px-4 shadow">{{ error }}</p>
    </transition>

    <div class="text-sm text-white text-opacity-80 mt-2 text-center">
      {{ $t('auth.no_account') }}
      <a href="#" class="underline hover:text-pink-300 transition-colors">{{ $t('auth.register') }}</a>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { login } from "../services/auth.service";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await login(email.value, password.value);
    // Redirige aquí según tu flujo, por ejemplo:
    window.location.href = '/'; // o usa Vue Router push
  } catch (err) {
    error.value = "Credenciales incorrectas";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@keyframes slide-in {
  0% {opacity: 0; transform: translateY(-40px) scale(0.95);}
  100% {opacity: 1; transform: none;}
}
.animate-slide-in {
  animation: slide-in 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s;
}
</style>