<template>
  <form class="flex flex-col gap-6 w-full animate-slide-in shadow-md px-8 py-10 bg-white bg-opacity-30 rounded-2xl border border-white border-opacity-20 transition-all duration-500">
    <div class="flex flex-col items-center justify-center">
      <img src="@/assets/logo.svg" alt="Logo" class="h-14 mb-3 opacity-90 select-none" />
      <h2 class="text-2xl font-extrabold text-white drop-shadow-md mb-2">{{ $t("auth.verify_title") }}</h2>
      <p class="text-white text-opacity-90 text-sm">{{ $t("auth.verify_subtitle") }}</p>
    </div>
    <input type="text" class="rounded-xl px-4 py-3 ..." :placeholder="$t('auth.code_placeholder')" maxlength="6" required />
    <button class="rounded-xl mt-3 py-3 font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 text-white shadow-xl hover:from-pink-500 hover:to-blue-500 hover:scale-105 transition-all duration-300 active:scale-95 focus:ring-4 focus:ring-white focus:ring-opacity-70"> {{ $t('auth.verify_button') }}</button>
  </form>
</template>
<script setup>
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