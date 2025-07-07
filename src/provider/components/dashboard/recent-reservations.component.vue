<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Reservas recientes</h3>
      <RouterLink
          to="/provider/reservations"
          class="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
      >
        Ver todas <i class="pi pi-arrow-right"></i>
      </RouterLink>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
    </div>

    <div v-else-if="reservations.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <i class="pi pi-calendar-times text-4xl mb-3 opacity-70"></i>
      <p class="text-lg">No hay reservas recientes</p>
      <p class="text-sm mt-2 max-w-md text-center">Las reservas que recibas aparecerán aquí para que puedas gestionarlas fácilmente</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehículo</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fechas</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
        </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
            v-for="reservation in reservations"
            :key="reservation.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                <i class="pi pi-user text-xs"></i>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ reservation.client.name }}</div>
              </div>
            </div>
          </td>
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-gray-100">{{ reservation.vehicle.brand }} {{ reservation.vehicle.model }}</div>
          </td>
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-gray-100">
              {{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}
            </div>
          </td>
          <td class="px-4 py-4 whitespace-nowrap">
              <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(reservation.status)"
              >
                {{ getStatusLabel(reservation.status) }}
              </span>
          </td>
          <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ formatCurrency(reservation.totalAmount) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reservations: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    in_progress: 'En progreso',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }
  return labels[status] || status
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}
</script>

