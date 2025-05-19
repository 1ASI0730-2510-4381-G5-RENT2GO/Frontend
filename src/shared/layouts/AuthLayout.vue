<template>
  <div class="min-h-screen flex items-center justify-center
              bg-[linear-gradient(to_bottom,_#020817,_#1e293b)]
              transition-colors duration-500">
    <div
        class="relative p-10 w-full max-w-md rounded-2xl shadow-2xl
             bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30
             flex flex-col items-center
             animate-fade-in"
    >
      <router-view />
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% {opacity: 0; transform: translateY(30px);}
  100% {opacity: 1; transform: none;}
}
.animate-fade-in {
  animation: fade-in 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
</style>