<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">

      <div class="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px space-x-8 overflow-x-auto">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              ]"
          >
            {{ tab.name }}
            <span
                v-if="getReservationCount(tab.id) > 0"
                class="ml-2 py-0.5 px-2 rounded-full text-xs font-medium"
                :class="activeTab === tab.id ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
            >
              {{ getReservationCount(tab.id) }}
            </span>
          </button>
        </nav>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px] relative">
              <i class="pi pi-search absolute left-3 top-2.5 text-gray-400"></i>
              <input
                  v-model="filters.search"
                  placeholder="Buscar por cliente, vehículo..."
                  class="w-full p-2.5 pl-9 border rounded-xl bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                       focus:border-primary-500 transition-colors"
              />
            </div>
            <div class="relative">
              <i class="pi pi-calendar absolute left-3 top-2.5 text-gray-400"></i>
              <input
                  v-model="filters.date"
                  type="date"
                  class="p-2.5 pl-9 border rounded-xl border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500
                       focus:border-primary-500 transition-colors"
              />
            </div>
            <button
                @click="resetFilters"
                class="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
                     rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <i class="pi pi-filter-slash"></i>
            </button>
          </div>
        </div>

        <div v-if="filteredReservations.length > 0" class="grid grid-cols-1 gap-6">
          <ReservationCardComponent
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              :reservation="reservation"
              @view-reservation="navigateToReservationDetail"
          />
        </div>

        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div class="text-8xl text-gray-300 dark:text-gray-600 flex justify-center mb-4">
            <i class="pi pi-calendar-times"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {{ emptyStateMessage }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ emptyStateDescription }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          ¿Cancelar reserva?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <button
              @click="showCancelModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
          >
            No, volver
          </button>
          <button
              @click="cancelReservation"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-medium transition-colors"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import reservationService from '../services/reservation.service.js'
import ReservationCardComponent from '../components/reservations/reservation-card.component.vue'

const router = useRouter()

const loading = ref(true)
const reservations = ref([])
const activeTab = ref('all')
const filters = ref({
  search: '',
  date: ''
})
const showCancelModal = ref(false)
const selectedReservationId = ref(null)

const tabs = [
  { id: 'all', name: 'Todas' },
  { id: 'pending', name: 'Pendientes' },
  { id: 'confirmed', name: 'Confirmadas' },
  { id: 'in_progress', name: 'En curso' },
  { id: 'completed', name: 'Completadas' },
  { id: 'cancelled', name: 'Canceladas' }
]

async function loadReservations() {
  loading.value = true
  try {
    const data = await reservationService.getReservations()
    reservations.value = data
  } catch (err) {
    console.error('Error al cargar las reservas:', err)
  } finally {
    loading.value = false
  }
}

const filteredReservations = computed(() => {
  let filtered = reservations.value

  if (activeTab.value !== 'all') {
    filtered = filtered.filter(res => res.status === activeTab.value)
  }

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(res =>
        res.id.toLowerCase().includes(searchTerm) ||
        `${res.vehicle.brand} ${res.vehicle.model}`.toLowerCase().includes(searchTerm) ||
        res.client.name.toLowerCase().includes(searchTerm) ||
        (res.vehicle.licensePlate && res.vehicle.licensePlate.toLowerCase().includes(searchTerm))
    )
  }

  if (filters.value.date) {
    const selectedDate = new Date(filters.value.date)
    filtered = filtered.filter(res => {
      const startDate = new Date(res.startDate)
      const endDate = new Date(res.endDate)
      return selectedDate >= startDate && selectedDate <= endDate
    })
  }

  return filtered
})

function getReservationCount(tabId) {
  if (tabId === 'all') {
    return reservations.value.length
  }

  return reservations.value.filter(res => res.status === tabId).length
}

const emptyStateMessage = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return 'No hay reservas pendientes'
    case 'confirmed':
      return 'No hay reservas confirmadas'
    case 'in_progress':
      return 'No hay vehículos en circulación'
    case 'completed':
      return 'No hay reservas completadas'
    case 'cancelled':
      return 'No hay reservas canceladas'
    default:
      return 'No hay reservas disponibles'
  }
})

const emptyStateDescription = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return 'Las reservas pendientes aparecerán aquí cuando los clientes reserven tus vehículos'
    case 'confirmed':
      return 'Las reservas confirmadas aparecerán aquí cuando confirmes las solicitudes de los clientes'
    case 'in_progress':
      return 'Los vehículos en circulación aparecerán aquí cuando entregues un vehículo a un cliente'
    case 'completed':
      return 'El historial de reservas completadas aparecerá aquí'
    case 'cancelled':
      return 'Las reservas canceladas aparecerán en esta sección'
    default:
      return 'Cuando recibas reservas, aparecerán en esta sección'
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
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
    confirmed: 'Confirmada',
    in_progress: 'En curso',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }
  return labels[status] || status
}

function getPaymentStatusLabel(status) {
  const labels = {
    paid: 'Pago completado',
    pending: 'Pago pendiente',
    refunded: 'Reembolsado',
    failed: 'Pago fallido'
  }
  return labels[status] || 'Estado desconocido'
}

function navigateToReservationDetail(reservationId) {
  router.push(`/provider/reservations/${reservationId}`)
}

function confirmCancelReservation(reservationId) {
  selectedReservationId.value = reservationId
  showCancelModal.value = true
}

async function cancelReservation() {
  if (!selectedReservationId.value) return

  try {
    await reservationService.updateReservationStatus(selectedReservationId.value, 'cancelled')

    // Actualizar localmente
    const index = reservations.value.findIndex(r => r.id === selectedReservationId.value)
    if (index !== -1) {
      reservations.value[index].status = 'cancelled'
    }

    showCancelModal.value = false
  } catch (error) {
    console.error('Error al cancelar la reserva:', error)
  }
}

function resetFilters() {
  filters.value.search = ''
  filters.value.date = ''
}

onMounted(loadReservations)
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
button:hover {
  @apply transform scale-[1.02] transition-transform;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}

.pi-calendar-times, .pi-filter-slash, .pi-spin {
  animation: pulse-subtle 2s infinite;
}

.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
}
</style>

