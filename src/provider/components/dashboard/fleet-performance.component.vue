<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Rendimiento de tu flota</h3>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Últimos 30 días
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
    </div>

    <div v-else>
      <div class="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
        <h4 class="text-base font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <i class="pi pi-star text-yellow-500"></i> Vehículos más rentables
        </h4>

        <div v-if="topVehicles.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
          <i class="pi pi-car text-4xl mb-3 opacity-70"></i>
          <p class="text-lg">Sin datos suficientes</p>
          <p class="text-sm mt-2 max-w-md text-center mx-auto">Cuando tus vehículos reciban reservas, verás aquí cuáles generan más ingresos</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(vehicle, index) in topVehicles" :key="vehicle.id"
               class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <i class="pi pi-car text-lg text-gray-500 dark:text-gray-400"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-800 dark:text-gray-200 truncate">{{ vehicle.brand }} {{ vehicle.model }}</p>
                <div class="flex items-center mt-1">
                  <i class="pi pi-tag text-xs text-gray-400 mr-1"></i>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ vehicle.licensePlate || 'Sin matrícula' }}</p>
                </div>
              </div>
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300 text-xs font-bold">
                {{ index + 1 }}
              </div>
            </div>

            <div class="mt-auto pt-3 border-t border-gray-200 dark:border-gray-600/50 flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.reservationsCount }} reservas</span>
              <span class="font-medium text-green-600 dark:text-green-400">{{ formatCurrency(vehicle.earnings) }}</span>
            </div>
          </div>
        </div>

        <div v-if="topVehicles.length > 0" class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p class="italic">Los vehículos se ordenan por ingresos generados durante los últimos 30 días.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  topVehicles: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
}
</script>

