<template>
  <div class="space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Mis Reservas</h2>
      <div class="flex space-x-3">
        <button
            @click="loadReservations"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors
                 shadow-sm flex items-center gap-2"
        >
          <i class="pi pi-refresh"></i> Actualizar
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
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
        <select
            v-model="filters.status"
            class="p-2.5 border rounded-xl border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500
                 focus:border-primary-500 transition-colors"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
          <option value="cancelled">Cancelada</option>
        </select>
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
      </div>
    </div>

    <div v-if="loading" class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
      <p class="mt-3 text-gray-600 dark:text-gray-300">Cargando reservas...</p>
    </div>

    <div v-else-if="reservations.length === 0" class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-calendar-times text-5xl text-gray-400 dark:text-gray-500"></i>
      <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">No tienes reservas registradas</p>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Las reservas aparecerán aquí cuando los clientes alquilen tus vehículos
      </p>
    </div>

    <div v-else-if="filteredReservations.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
          v-for="reservation in filteredReservations"
          :key="reservation.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
      >

        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div class="flex items-center">
            <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                :class="{
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300': reservation.status === 'pending',
                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300': reservation.status === 'confirmed',
                'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300': reservation.status === 'in_progress',
                'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300': reservation.status === 'completed',
                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300': reservation.status === 'cancelled'
              }"
            >
              <i
                  :class="{
                  'pi pi-clock': reservation.status === 'pending',
                  'pi pi-check-circle': reservation.status === 'confirmed',
                  'pi pi-car': reservation.status === 'in_progress',
                  'pi pi-flag-fill': reservation.status === 'completed',
                  'pi pi-times-circle': reservation.status === 'cancelled'
                }"
                  class="mr-1"
              ></i>
              {{ getStatusLabel(reservation.status) }}
            </span>
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Reserva #{{ reservation.id.substring(0, 8) }}
            </span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(reservation.createdAt) }}
          </div>
        </div>

        <div class="p-4 md:flex">
          <div class="md:w-2/5 mb-4 md:mb-0 md:pr-4">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 flex-shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <i class="pi pi-car text-xl text-primary-500"></i>
              </div>
              <div>
                <div class="font-bold text-gray-800 dark:text-gray-200">
                  {{ reservation.vehicle.brand }} {{ reservation.vehicle.model }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ reservation.vehicle.year }} · {{ reservation.vehicle.licensePlate }}
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl">
              <div class="text-sm text-gray-600 dark:text-gray-400">Total de la reserva:</div>
              <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
                {{ reservation.totalAmount.toFixed(2) }}€
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span v-if="reservation.paymentStatus === 'paid'">
                  <i class="pi pi-check-circle text-green-500 mr-1"></i> Pago completado
                </span>
                <span v-else-if="reservation.paymentStatus === 'pending'">
                  <i class="pi pi-clock text-yellow-500 mr-1"></i> Pago pendiente
                </span>
              </div>
            </div>
          </div>

          <div class="md:w-3/5 md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-4">
            <!-- Cliente -->
            <div class="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Cliente:</div>
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <i class="pi pi-user"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-800 dark:text-gray-200">{{ reservation.client.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    <i class="pi pi-phone mr-1"></i> {{ reservation.client.phone || 'No disponible' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Fechas:</div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div class="flex items-center text-green-600 dark:text-green-400">
                    <i class="pi pi-calendar-plus mr-2 text-xs"></i>
                    <span class="text-sm">Recogida:</span>
                  </div>
                  <div class="text-gray-800 dark:text-gray-200 font-medium pl-5">
                    {{ formatDate(reservation.startDate) }}
                  </div>
                </div>
                <div>
                  <div class="flex items-center text-red-600 dark:text-red-400">
                    <i class="pi pi-calendar-minus mr-2 text-xs"></i>
                    <span class="text-sm">Devolución:</span>
                  </div>
                  <div class="text-gray-800 dark:text-gray-200 font-medium pl-5">
                    {{ formatDate(reservation.endDate) }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="reservation.location" class="mb-3">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Ubicación:</div>
              <div class="flex items-center text-gray-700 dark:text-gray-300">
                <i class="pi pi-map-marker mr-2 text-primary-500"></i>
                <span>{{ reservation.location }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center">
          <button
              @click="viewReservationDetails(reservation.id)"
              class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700
         transition-colors flex items-center gap-2 transform hover:scale-[1.02] shadow-sm"
          >
            <i class="pi pi-eye"></i> Ver detalles
          </button>
        </div>
      </div>
    </div>

    <div v-else class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-filter-slash text-5xl text-gray-400 dark:text-gray-500"></i>
      <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">No hay reservas que coincidan con los filtros</p>
      <button
          @click="resetFilters"
          class="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
               rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
      >
        <i class="pi pi-refresh mr-1.5"></i> Limpiar filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import reservationService from '../../services/reservation.service.js';

const router = useRouter();
const emit = defineEmits(['view-reservation']);

const viewReservationDetails = (reservationId) => {
  router.push(`/provider/reservations/${reservationId}`);
};

const reservations = ref([])
const loading = ref(true)
const error = ref(null)
const filters = ref({
  search: '',
  status: '',
  date: ''
})

async function loadReservations() {
  loading.value = true
  try {
    const data = await reservationService.getReservations()
    reservations.value = data
  } catch (err) {
    error.value = 'Error al cargar las reservas'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredReservations = computed(() => {
  return reservations.value.filter(reservation => {
    // Filtrar por estado
    if (filters.value.status && reservation.status !== filters.value.status) {
      return false
    }

    if (filters.value.date) {
      const selectedDate = new Date(filters.value.date)
      const startDate = new Date(reservation.startDate)
      const endDate = new Date(reservation.endDate)

      if (!(selectedDate >= startDate && selectedDate <= endDate)) {
        return false
      }
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      return (
          reservation.id.toLowerCase().includes(searchTerm) ||
          `${reservation.vehicle.brand} ${reservation.vehicle.model}`.toLowerCase().includes(searchTerm) ||
          reservation.client.name.toLowerCase().includes(searchTerm)
      )
    }

    return true
  })
})

function resetFilters() {
  filters.value.search = ''
  filters.value.status = ''
  filters.value.date = ''
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
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

onMounted(loadReservations)
</script>

<style scoped>
button {
  transition: all 0.2s ease;
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