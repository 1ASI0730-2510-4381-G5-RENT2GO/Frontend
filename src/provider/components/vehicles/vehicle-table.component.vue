<template>
  <div class="space-y-4">
    <div class="flex flex-wrap justify-between items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Mis Vehículos</h2>
      <div class="flex space-x-3">
        <button
            @click="$emit('add-vehicle')"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700
                 transition-colors flex items-center gap-2 shadow-sm"
        >
          <i class="pi pi-plus"></i> Publicar vehículo
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px] relative">
          <i class="pi pi-search absolute left-3 top-2.5 text-gray-400"></i>
          <input
              v-model="filters.search"
              placeholder="Buscar por marca, modelo..."
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
          <option value="available">Disponible</option>
          <option value="rented">Alquilado</option>
          <option value="maintenance">En mantenimiento</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
      <p class="mt-3 text-gray-600 dark:text-gray-300">Cargando vehículos...</p>
    </div>

    <div v-else-if="vehicles.length === 0" class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-car text-5xl text-gray-400 dark:text-gray-500"></i>
      <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">No tienes vehículos publicados</p>
      <button
          @click="$emit('add-vehicle')"
          class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700
                 transition-colors shadow-sm hover:shadow-md transform hover:scale-[1.02]"
      >
        Publicar tu primer vehículo
      </button>
    </div>

    <div v-else-if="filteredVehicles.length > 0" class="w-full overflow-x-auto rounded-xl shadow-md dark:shadow-gray-900/30 custom-scrollbar">
      <table class="min-w-max w-full bg-white dark:bg-gray-800 border-collapse">
        <thead>
        <tr class="bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-b border-gray-200 dark:border-gray-700">
          <th class="px-4 py-3 text-left font-medium">Vehículo</th>
          <th class="px-4 py-3 text-left font-medium">Tipo</th>
          <th class="px-4 py-3 text-left font-medium">Precio/día</th>
          <th class="px-4 py-3 text-left font-medium">Estado</th>
          <th class="px-4 py-3 text-center font-medium">Acciones</th>
        </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
        <tr
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <td class="px-4 py-3">
            <div class="flex items-center space-x-3">
              <div class="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                <img
                    v-if="vehicle.images && vehicle.images.length > 0"
                    :src="vehicle.images[0]"
                    alt="Imagen del vehículo"
                    class="w-full h-full object-cover"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  <i class="pi pi-car text-xl"></i>
                </div>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ vehicle.brand }} {{ vehicle.model }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.year }}</p>
              </div>
            </div>
          </td>

          <td class="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
            {{ getTypeLabel(vehicle.type) }}
          </td>

          <td class="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
              <span class="text-primary-600 dark:text-primary-400 font-bold">
                {{ vehicle.dailyRate.toFixed(2) }}S/
              </span>
          </td>

          <td class="px-4 py-3">
              <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="{
                    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300': vehicle.status === 'available',
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300': vehicle.status === 'rented',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300': vehicle.status === 'maintenance',
                    'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300': vehicle.status === 'inactive'
                  }"
              >
                <i
                    :class="{
                      'pi pi-check-circle': vehicle.status === 'available',
                      'pi pi-car': vehicle.status === 'rented',
                      'pi pi-wrench': vehicle.status === 'maintenance',
                      'pi pi-ban': vehicle.status === 'inactive'
                    }"
                    class="mr-1"
                ></i>
                {{ getStatusLabel(vehicle.status) }}
              </span>
          </td>

          <td class="px-4 py-3">
            <div class="flex justify-center space-x-2">
              <button
                  @click="$emit('edit-vehicle', vehicle.id)"
                  class="inline-flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all
                         hover:scale-110 hover:shadow-sm"
                  title="Editar"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                  @click="$emit('view-vehicle', vehicle.id)"
                  class="inline-flex items-center justify-center w-8 h-8 text-primary-600 dark:text-primary-400
                         hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all
                         hover:scale-110 hover:shadow-sm"
                  title="Ver detalles"
              >
                <i class="pi pi-eye"></i>
              </button>
              <button
                  v-if="vehicle.status !== 'maintenance'"
                  @click="$emit('maintenance-vehicle', vehicle.id)"
                  class="inline-flex items-center justify-center w-8 h-8 text-yellow-600 dark:text-yellow-400
                         hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all
                         hover:scale-110 hover:shadow-sm"
                  title="Marcar en mantenimiento"
              >
                <i class="pi pi-wrench"></i>
              </button>
              <button
                  v-if="vehicle.status === 'inactive'"
                  @click="$emit('activate-vehicle', vehicle.id)"
                  class="inline-flex items-center justify-center w-8 h-8 text-green-600 dark:text-green-400
                         hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all
                         hover:scale-110 hover:shadow-sm"
                  title="Activar"
              >
                <i class="pi pi-check"></i>
              </button>
              <button
                  v-if="vehicle.status !== 'inactive'"
                  @click="$emit('deactivate-vehicle', vehicle.id)"
                  class="inline-flex items-center justify-center w-8 h-8 text-red-600 dark:text-red-400
                         hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all
                         hover:scale-110 hover:shadow-sm"
                  title="Desactivar"
              >
                <i class="pi pi-ban"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-filter-slash text-5xl text-gray-400 dark:text-gray-500"></i>
      <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">No hay vehículos que coincidan con los filtros</p>
      <div class="mt-4 flex justify-center gap-3">
        <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          <i class="pi pi-refresh mr-1.5"></i> Limpiar filtros
        </button>
        <button
            @click="$emit('add-vehicle')"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700
                 transition-colors shadow-sm"
        >
          <i class="pi pi-plus mr-1.5"></i> Publicar vehículo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import vehicleService from '../../services/vehicle.service.js'

const emit = defineEmits(['add-vehicle', 'edit-vehicle', 'view-vehicle', 'maintenance-vehicle', 'activate-vehicle', 'deactivate-vehicle'])

const vehicles = ref([])
const loading = ref(true)
const error = ref(null)
const filters = ref({
  search: '',
  status: ''
})

async function loadVehicles() {
  loading.value = true
  try {
    const data = await vehicleService.getVehicles()
    vehicles.value = data
  } catch (err) {
    error.value = 'Error al cargar los vehículos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredVehicles = computed(() => {
  return vehicles.value.filter(vehicle => {
    // Filtrar por estado
    if (filters.value.status && vehicle.status !== filters.value.status) {
      return false
    }

    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      return (
          vehicle.brand.toLowerCase().includes(searchTerm) ||
          vehicle.model.toLowerCase().includes(searchTerm) ||
          vehicle.year.toString().includes(searchTerm)
      )
    }

    return true
  })
})

function resetFilters() {
  filters.value.search = ''
  filters.value.status = ''
}

function getStatusLabel(status) {
  const labels = {
    available: 'Disponible',
    rented: 'Alquilado',
    maintenance: 'Mantenimiento',
    inactive: 'Inactivo'
  }
  return labels[status] || status
}

function getTypeLabel(type) {
  const labels = {
    sedan: 'Sedán',
    suv: 'SUV',
    hatchback: 'Hatchback',
    pickup: 'Pickup',
    van: 'Van/Minivan'
  }
  return labels[type] || type
}

onMounted(loadVehicles)

watch(filters, () => {
}, { deep: true })
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #8d99ad transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #8d99ad;
  border-radius: 9999px;
}

@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    --scrollbar-thumb: #8d99ad;
  }
}

button {
  transition: all 0.2s ease;
}

table {
  border-spacing: 0;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}
.pi-car, .pi-filter-slash, .pi-spin {
  animation: pulse-subtle 2s infinite;
}
</style>

