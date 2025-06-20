<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <RouterLink
        to="/provider/vehicles/add"
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex flex-col items-center text-center group"
    >
      <div class="p-3 mb-4 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
        <i class="pi pi-plus text-xl text-blue-600 dark:text-blue-300"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Publicar vehículo</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Añade un nuevo vehículo a tu flota
      </p>
    </RouterLink>

    <RouterLink
        to="/provider/reservations"
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex flex-col items-center text-center group"
    >
      <div class="p-3 mb-4 bg-green-100 dark:bg-green-900/50 rounded-full group-hover:scale-110 transition-transform">
        <i class="pi pi-calendar text-xl text-green-600 dark:text-green-300"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Gestionar reservas</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Ver y gestionar tus reservas activas
      </p>
    </RouterLink>

    <RouterLink
        to="/provider/earnings"
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex flex-col items-center text-center group"
    >
      <div class="p-3 mb-4 bg-purple-100 dark:bg-purple-900/50 rounded-full group-hover:scale-110 transition-transform">
        <i class="pi pi-money-bill text-xl text-purple-600 dark:text-purple-300"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Retirar ganancias</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Consulta y retira tus ganancias
      </p>
    </RouterLink>
  </div>
</template>