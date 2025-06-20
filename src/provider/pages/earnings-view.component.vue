<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white">Mis Ganancias</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Consulta y retira las ganancias de tus vehículos alquilados
      </p>
    </div>

    <EarningsStatsComponent
        :total-earnings="providerBalance"
        :pending-withdrawals="pendingWithdrawals"
        @withdraw="showWithdrawalForm = true"
    />

    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
      <div class="flex items-center bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm w-full md:w-auto border border-gray-100 dark:border-gray-700">
        <i class="pi pi-calendar text-gray-500 dark:text-gray-400 mr-2"></i>
        <select v-model="dateFilter" class="bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <option value="all">Todas las fechas</option>
          <option value="this-month">Este mes</option>
          <option value="last-month">Mes anterior</option>
          <option value="last-3-months">Últimos 3 meses</option>
        </select>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <button @click="loadEarningsData" class="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
          <i class="pi pi-refresh"></i>
          <span>Actualizar</span>
        </button>

        <button @click="exportTransactions" class="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
          <i class="pi pi-download"></i>
          <span>Exportar</span>
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Historial de transacciones</h2>
      </div>

      <div v-if="loading" class="py-16 text-center">
        <i class="pi pi-spin pi-spinner text-2xl text-primary-500"></i>
        <p class="mt-2 text-gray-500 dark:text-gray-400">Cargando historial...</p>
      </div>

      <div v-else-if="transactions.length === 0" class="py-16 text-center flex flex-col items-center">
        <i class="pi pi-inbox text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400 font-medium">No hay transacciones para mostrar</p>
        <p class="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-md">
          Las transacciones aparecerán aquí una vez que recibas pagos o realices retiros
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-750">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Concepto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Importe</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ formatDate(tx.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center">
                  <span class="flex items-center justify-center w-8 h-8 rounded-full mr-2" :style="{backgroundColor: getTypeBackgroundColor(tx.type), color: getTypeTextColor(tx.type)}">
                    <i :class="getTypeIcon(tx.type)"></i>
                  </span>
                <span class="text-gray-700 dark:text-gray-300 capitalize">{{ tx.type }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ tx.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getStatusClass(tx.status)" class="px-3 py-1 text-xs rounded-full inline-flex items-center">
                  <i :class="getStatusIcon(tx.status)" class="mr-1"></i>
                  {{ getStatusLabel(tx.status) }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="{'text-green-600 dark:text-green-400': tx.type === 'ingreso', 'text-red-600 dark:text-red-400': tx.type === 'retiro'}">
              {{ tx.type === 'ingreso' ? '+' : '-' }} {{ formatCurrency(tx.amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex gap-2">
                <button v-if="tx.status === 'pending' && tx.type === 'retiro'"
                        @click="cancelWithdrawal(tx.id)"
                        class="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        title="Cancelar retiro">
                  <i class="pi pi-times"></i>
                </button>
                <button
                    @click="showTransactionDetails(tx)"
                    class="p-1.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
                    title="Ver detalles">
                  <i class="pi pi-eye"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showWithdrawalForm" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full animate__animated animate__fadeInUp border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Solicitar retiro</h2>
          <button @click="showWithdrawalForm = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <WithdrawalFormComponent
            :available-balance="providerBalance"
            @submit="handleWithdrawalSubmit"
            @cancel="showWithdrawalForm = false"
        />
      </div>
    </div>

    <div v-if="selectedTransaction" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full animate__animated animate__fadeInUp border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Detalles de la transacción</h2>
          <button @click="selectedTransaction = null" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <TransactionDetailsComponent
            :transaction="selectedTransaction"
            @close="selectedTransaction = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import EarningsStatsComponent from '../components/earnings/earnings-stats.component.vue'
import WithdrawalFormComponent from '../components/earnings/withdrawal-form.component.vue'
import TransactionDetailsComponent from '../components/earnings/transaction-details.component.vue'
import earningsService from '../services/earnings.service.js'
import providerService from '../services/provider.service.js'

const transactions = ref([])
const loading = ref(true)
const showWithdrawalForm = ref(false)
const providerBalance = ref(0)
const dateFilter = ref('all')
const selectedTransaction = ref(null)

const pendingWithdrawals = computed(() => {
  return transactions.value
      .filter(tx => tx.type === 'retiro' && tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0)
})

async function loadEarningsData() {
  loading.value = true
  try {
    const providerData = await providerService.getProviderProfile()
    providerBalance.value = providerData.balance || 0

    // Obtener historial de transacciones
    const txHistory = await earningsService.getTransactions(dateFilter.value)
    transactions.value = txHistory
  } catch (error) {
    console.error('Error al cargar datos de ganancias:', error)
  } finally {
    loading.value = false
  }
}

async function handleWithdrawalSubmit(withdrawalData) {
  try {
    await earningsService.requestWithdrawal(withdrawalData)

    showWithdrawalForm.value = false

    await loadEarningsData()
  } catch (error) {
    console.error('Error al procesar el retiro:', error)
    alert('Error al procesar el retiro. Por favor, intenta de nuevo.')
  }
}

async function cancelWithdrawal(transactionId) {
  if (!confirm('¿Estás seguro de que deseas cancelar este retiro?')) {
    return
  }

  try {
    await earningsService.cancelWithdrawal(transactionId)
    await loadEarningsData()
  } catch (error) {
    console.error('Error al cancelar el retiro:', error)
    alert('Error al cancelar el retiro. Por favor, intenta de nuevo.')
  }
}

function showTransactionDetails(transaction) {
  selectedTransaction.value = transaction
}

function exportTransactions() {
  // Lógica para exportar transacciones a CSV o PDF
  alert('Función de exportación en desarrollo')
}

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    processing: 'En proceso',
    completed: 'Completado',
    failed: 'Fallido',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/70 dark:text-gray-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/70 dark:text-gray-300'
}

function getStatusIcon(status) {
  const icons = {
    pending: 'pi pi-clock',
    processing: 'pi pi-spin pi-spinner',
    completed: 'pi pi-check-circle',
    failed: 'pi pi-times-circle',
    cancelled: 'pi pi-ban'
  }
  return icons[status] || 'pi pi-circle'
}

function getTypeIcon(type) {
  return type === 'ingreso' ? 'pi pi-arrow-down' : 'pi pi-arrow-up'
}

function getTypeBackgroundColor(type) {
  return type === 'ingreso'
      ? 'rgba(16, 185, 129, 0.15)'
      : 'rgba(239, 68, 68, 0.15)'
}

function getTypeTextColor(type) {
  return type === 'ingreso'
      ? 'var(--green-600)'
      : 'var(--red-600)'
}

onMounted(loadEarningsData)
</script>

