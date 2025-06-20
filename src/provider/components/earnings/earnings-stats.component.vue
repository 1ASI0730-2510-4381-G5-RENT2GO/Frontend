<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="card-stats p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center border-l-4 border-primary-500 overflow-hidden relative">
      <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 opacity-50"></div>
      <i class="pi pi-money-bill text-primary-500 dark:text-primary-400 text-3xl mb-2"></i>
      <div class="text-3xl font-bold text-gray-800 dark:text-white mb-1">{{ formatCurrency(totalEarnings) }}</div>
      <div class="text-primary-600 dark:text-primary-400 font-medium uppercase text-sm tracking-wide">Balance disponible</div>
      <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Fondos disponibles para retirar</div>
      <button @click="$emit('withdraw')"
              :disabled="totalEarnings <= 0"
              class="mt-4 w-full py-2 px-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <i class="pi pi-wallet"></i>
        <span>Retirar fondos</span>
      </button>
    </div>

    <div class="card-stats p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center border-l-4 border-amber-500 overflow-hidden relative">
      <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 opacity-50"></div>
      <i class="pi pi-clock text-amber-500 dark:text-amber-400 text-3xl mb-2"></i>
      <div class="text-3xl font-bold text-gray-800 dark:text-white mb-1">{{ formatCurrency(pendingWithdrawals) }}</div>
      <div class="text-amber-600 dark:text-amber-400 font-medium uppercase text-sm tracking-wide">Retiros pendientes</div>
      <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">Los retiros pueden tardar hasta 3 días hábiles</div>
    </div>

    <div class="card-stats p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center border-l-4 border-green-500 overflow-hidden relative">
      <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 opacity-50"></div>
      <i class="pi pi-calendar text-green-500 dark:text-green-400 text-3xl mb-2"></i>
      <div class="text-3xl font-bold text-gray-800 dark:text-white mb-1">{{ formatCurrency(currentMonthEarnings) }}</div>
      <div class="text-green-600 dark:text-green-400 font-medium uppercase text-sm tracking-wide">Este mes</div>
      <div class="mt-2 flex items-center justify-center text-xs">
        <span class="text-gray-500 dark:text-gray-400 mr-2">vs. mes anterior:</span>
        <span :class="percentChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="flex items-center">
          <i :class="percentChange >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="mr-1"></i>
          {{ Math.abs(percentChange) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import earningsService from '../../services/earnings.service.js'

const props = defineProps({
  totalEarnings: {
    type: Number,
    default: 0
  },
  pendingWithdrawals: {
    type: Number,
    default: 0
  }
})

defineEmits(['withdraw'])

const currentMonthEarnings = ref(0)
const percentChange = ref(0)

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount || 0)
}

onMounted(async () => {
  try {
    const stats = await earningsService.getMonthlyStats()
    currentMonthEarnings.value = stats.currentMonth || 0
    percentChange.value = stats.percentChange || 0
  } catch (error) {
    console.error('Error al cargar estadísticas mensuales:', error)
  }
})
</script>

<style scoped>
.card-stats {
  transition: all 0.3s ease;
}

.card-stats:hover {
  transform: translateY(-5px);
}

@media (prefers-color-scheme: dark) {
  .card-stats {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .card-stats:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
  }
}
</style>