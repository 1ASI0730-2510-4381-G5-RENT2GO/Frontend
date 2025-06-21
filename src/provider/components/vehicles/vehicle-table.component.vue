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
                   focus:border-primary-500 transition-colors text-gray-800 dark:text-white"
          />
        </div>
        <select
            v-model="filters.status"
            class="p-2.5 border rounded-xl border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500
                 focus:border-primary-500 transition-colors text-gray-800 dark:text-white"
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
                    v-if="vehicle.images && vehicle.images.length > 0 && !vehicle.imageError"
                    :src="getImageUrl(vehicle.images[0])"
                    alt="Imagen del vehículo"
                    class="w-full h-full object-cover"
                    @error="handleImageError($event, vehicle)"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  <i class="pi pi-car text-xl"></i>
                </div>
              </div>
              <div>
                <div class="font-medium text-gray-800 dark:text-white">{{ vehicle.brand }} {{ vehicle.model }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.year }}</div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-gray-800 dark:text-white">
            <span class="capitalize">{{ getVehicleTypeText(vehicle.type) }}</span>
          </td>
          <td class="px-4 py-3 text-gray-800 dark:text-white">
            <span class="font-medium">S/ {{ vehicle.dailyRate.toFixed(2) }}</span>
          </td>
          <td class="px-4 py-3">
            <span
                :class="getStatusClass(vehicle.status)"
                class="px-2 py-1 rounded-lg text-xs font-medium"
            >
              {{ getStatusText(vehicle.status) }}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="flex justify-center space-x-2">
              <button
                  @click="$emit('view-vehicle', vehicle.id)"
                  class="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400
                       hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  title="Ver detalles"
              >
                <i class="pi pi-eye"></i>
              </button>
              
              <button
                  @click="$emit('edit-vehicle', vehicle.id)"
                  class="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400
                       hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  title="Editar vehículo"
              >
                <i class="pi pi-pencil"></i>
              </button>
              
              <template v-if="vehicle.status !== 'rented'">
                <button
                    v-if="vehicle.status !== 'available'"
                    @click="activateVehicle(vehicle.id)"
                    class="p-1.5 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300
                         hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Marcar como disponible"
                >
                  <i class="pi pi-check-circle"></i>
                </button>
                
                <button
                    v-if="vehicle.status !== 'maintenance'"
                    @click="maintenanceVehicle(vehicle.id)"
                    class="p-1.5 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300
                         hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                    title="Poner en mantenimiento"
                >
                  <i class="pi pi-wrench"></i>
                </button>
                
                <button
                    v-if="vehicle.status !== 'inactive'"
                    @click="deactivateVehicle(vehicle.id)"
                    class="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300
                         hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Desactivar"
                >
                  <i class="pi pi-times-circle"></i>
                </button>
              </template>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <i class="pi pi-search text-4xl text-gray-400 dark:text-gray-500"></i>
      <p class="mt-3 text-lg text-gray-600 dark:text-gray-300">No se encontraron vehículos con los filtros actuales</p>
      <button
          @click="resetFilters"
          class="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl
               hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import vehicleService from '../../services/vehicle.service.js'

// Variables reactivas
const vehicles = ref([])
const loading = ref(true)
const filters = ref({
  search: '',
  status: ''
})


const emit = defineEmits(['add-vehicle', 'edit-vehicle', 'view-vehicle', 'deactivate-vehicle', 'activate-vehicle', 'maintenance-vehicle'])

const toast = useToast()

const filteredVehicles = computed(() => {
  return vehicles.value.filter(vehicle => {
    const searchMatch = !filters.value.search ||
      `${vehicle.brand} ${vehicle.model} ${vehicle.year}`.toLowerCase()
        .includes(filters.value.search.toLowerCase())
    
    const statusMatch = !filters.value.status || vehicle.status === filters.value.status

    return searchMatch && statusMatch
  })
})

onMounted(async () => {
  await loadVehicles()
})

function resetFilters() {
  filters.value = {
    search: '',
    status: ''
  }
}

async function loadVehicles() {
  loading.value = true
  try {
    const data = await vehicleService.getVehicles()
    vehicles.value = data.map(vehicle => ({
      ...vehicle,
      imageError: false
    }))
  } catch (error) {
    console.error('Error al cargar vehículos:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los vehículos',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

function handleImageError(event, vehicle) {
  console.log(`Error al cargar la imagen para el vehículo ${vehicle.id}`, event)
  vehicle.imageError = true
}

function getImageUrl(image) {
  if (image && typeof image === 'object') {
    if (image.$values && Array.isArray(image.$values) && image.$values.length > 0) {
      const imageValue = image.$values[0];
      
      if (typeof imageValue === 'string') {
        return formatImageUrl(imageValue);
      }
      else if (typeof imageValue === 'object') {
        if (imageValue.url) return formatImageUrl(imageValue.url);
        if (imageValue.path) return formatImageUrl(imageValue.path);
      }
    }
    
    console.log('Estructura completa de imagen:', JSON.stringify(image));
    return '';
  }
  
  if (typeof image === 'string') {
    return formatImageUrl(image);
  }
  
  console.error('Formato de imagen no válido:', image);
  return '';
}

function formatImageUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const baseUrl = 'http://localhost:5239'; // Ajusta esto a tu URL real
  
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
}

function deactivateVehicle(id) {
  emit('deactivate-vehicle', id)
}

function activateVehicle(id) {
  emit('activate-vehicle', id)
}

function maintenanceVehicle(id) {
  emit('maintenance-vehicle', id)
}

function getVehicleTypeText(type) {
  const types = {
    sedan: 'Sedán',
    suv: 'SUV',
    hatchback: 'Hatchback',
    pickup: 'Pickup',
    van: 'Van/Minivan'
  }
  return types[type] || type
}

function getStatusText(status) {
  const statuses = {
    available: 'Disponible',
    rented: 'Alquilado',
    maintenance: 'En mantenimiento',
    inactive: 'Inactivo'
  }
  return statuses[status] || status
}

function getStatusClass(status) {
  const statusClasses = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rented: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return statusClasses[status] || ''
}

defineExpose({
  loadVehicles
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded-b-xl;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>

