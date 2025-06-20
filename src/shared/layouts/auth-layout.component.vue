<template>
  <div class="min-h-screen relative flex flex-col
              bg-[linear-gradient(to_bottom,_#020817,_#1e293b)]
              dark:bg-[linear-gradient(to_bottom,_#0f172a,_#1e293b)]
              transition-colors duration-500">

    <div class="w-full flex justify-between items-start p-4 z-10">
      <ThemeSwitcherComponent />

      <LanguageSwitcherComponent />
    </div>

    <div class="flex-grow flex items-center justify-center">
      <router-view class="animate-fade-in" />
    </div>
  </div>
</template>

<script setup>
import ThemeSwitcherComponent from "@/public/components/theme-switcher.component.vue";
import LanguageSwitcherComponent from "@/public/components/language-switcher.component.vue";
</script>

<style scoped>
@keyframes fade-in {
  0% {opacity: 0; transform: translateY(30px);}
  100% {opacity: 1; transform: none;}
}
.animate-fade-in {
  animation: fade-in 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
</style>