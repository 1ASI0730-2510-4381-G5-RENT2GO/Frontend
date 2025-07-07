<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
    <!-- Header con estado -->
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

    <!-- Contenido principal -->
    <div class="p-4 md:flex">
      <!-- Imagen del vehículo - Nueva sección más grande -->
      <div class="md:w-1/3 mb-4 md:mb-0 md:pr-4">
        <div class="relative">
          <!-- Imagen del vehículo más grande -->
          <div class="w-full h-48 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm">
            <img 
                :src="getVehicleImage(reservation.vehicle)" 
                :alt="`${reservation.vehicle?.brand} ${reservation.vehicle?.model}`"
                class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
            />
          </div>
          
          <!-- Badge del estado del vehículo -->
          <div class="absolute top-2 right-2">
            <span class="px-2 py-1 bg-white/90 dark:bg-gray-800/90 text-xs font-medium rounded-full text-gray-700 dark:text-gray-300 shadow-sm">
              {{ reservation.vehicle?.category || 'Vehículo' }}
            </span>
          </div>
        </div>
        
        <!-- Información básica del vehículo -->
        <div class="mt-3">
          <div class="font-bold text-lg text-gray-800 dark:text-gray-200">
            {{ reservation.vehicle?.brand || 'Vehículo' }} {{ reservation.vehicle?.model || 'Desconocido' }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>{{ reservation.vehicle?.year || 'N/A' }}</span>
            <span>•</span>
            <span class="flex items-center">
              <i class="pi pi-users mr-1"></i>
              {{ reservation.vehicle?.seats || 'N/A' }} asientos
            </span>
          </div>
        </div>

        <!-- Total de la reserva -->
        <div class="mt-4 p-3 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">Total de la reserva:</div>
          <div class="text-xl font-bold text-primary-600 dark:text-primary-400">
            S/ {{ formatCurrency(reservation.totalAmount) }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span v-if="reservation.paymentStatus === 'paid'">
              <i class="pi pi-check-circle text-green-500 mr-1"></i> Pago completado
            </span>
            <span v-else-if="reservation.paymentStatus === 'pending'">
              <i class="pi pi-clock text-yellow-500 mr-1"></i> Pago pendiente
            </span>
            <span v-else>
              <i class="pi pi-exclamation-triangle text-red-500 mr-1"></i> {{ getPaymentStatusLabel(reservation.paymentStatus) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Información del cliente y fechas -->
      <div class="md:w-2/3 md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-4">
        <!-- Cliente -->
        <div class="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Cliente:</div>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <i class="pi pi-user text-lg"></i>
            </div>
            <div>
              <div class="font-medium text-gray-800 dark:text-gray-200">
                {{ reservation.client?.name || 'Cliente no disponible' }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                <i class="pi pi-envelope mr-1"></i> {{ reservation.client?.email || 'Email no disponible' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Fechas -->
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
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <i class="pi pi-clock mr-1"></i>
            {{ calculateDuration(reservation.startDate, reservation.endDate) }} días
          </div>
        </div>

        <!-- Ubicación -->
        <div v-if="reservation.location" class="mb-3">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Ubicación:</div>
          <div class="flex items-center text-gray-700 dark:text-gray-300">
            <i class="pi pi-map-marker mr-2 text-primary-500"></i>
            <span>{{ reservation.location }}</span>
          </div>
        </div>

        <!-- Notas -->
        <div v-if="reservation.notes" class="mb-3">
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Notas:</div>
          <div class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
            {{ reservation.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con acciones -->
    <div class="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        <i class="pi pi-calendar mr-1"></i>
        Creada: {{ formatDate(reservation.createdAt) }}
      </div>
      <div class="flex space-x-2">
        <!-- Botón de ver detalles -->
        <button
            @click="$emit('viewReservation', reservation.id)"
            class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700
                   transition-colors flex items-center gap-2 transform hover:scale-[1.02] shadow-sm"
        >
          <i class="pi pi-eye"></i> Ver detalles
        </button>
        
        <!-- Botón de confirmar (solo para reservas pendientes) -->
        <button
            v-if="reservation.status === 'pending'"
            @click="$emit('confirmReservation', reservation.id)"
            class="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700
                   transition-colors flex items-center gap-2 transform hover:scale-[1.02] shadow-sm"
        >
          <i class="pi pi-check"></i> Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Props
const props = defineProps({
  reservation: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['viewReservation', 'confirmReservation'])

// Estado local
const imageError = ref(false)

// Computed para la imagen del vehículo
const vehicleImage = computed(() => {
  if (imageError.value) return null
  
  if (props.reservation.vehicle?.images?.length > 0) {
    return props.reservation.vehicle.images[0]
  }
  
  return null
})

// Métodos para manejar imágenes
const getVehicleImage = (vehicle) => {
  console.log('Obteniendo imagen para vehículo:', vehicle);

  // Verificar si el vehículo tiene imágenes procesadas correctamente
  if (vehicle && vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    console.log('Usando primera imagen del array:', vehicle.images[0]);
    return vehicle.images[0]; // Usar la primera imagen
  }
  
  // Si tiene imageUrl (formato legacy)
  if (vehicle && vehicle.imageUrl) {
    console.log('Usando imageUrl legacy:', vehicle.imageUrl);
    return vehicle.imageUrl;
  }
  
  // Imagen por defecto que SÍ existe en public/images/
  console.log('Usando imagen por defecto');
  return '/images/default-vehicle.jpg';
};

const handleImageError = (event) => {
  console.error('Error al cargar imagen:', event.target.src);

  // Intentar con diferentes imágenes de fallback
  if (event.target.src.includes('/images/default-vehicle.jpg')) {
    // Si la imagen por defecto falla, usar un placeholder SVG inline
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial, sans-serif" font-size="16" fill="%236b7280" text-anchor="middle" dy=".3em"%3EVehículo%3C/text%3E%3C/svg%3E';
  } else {
    // Si la imagen del backend falla, usar la imagen por defecto
    event.target.src = '/images/default-vehicle.jpg';
  }
};

function onImageError() {
  imageError.value = true
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

function formatCurrency(amount) {
  if (!amount) return '0.00'
  return Number(amount).toFixed(2)
}

function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
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

function getPaymentStatusLabel(status) {
  const labels = {
    paid: 'Pago completado',
    pending: 'Pago pendiente', 
    refunded: 'Reembolsado',
    failed: 'Pago fallido'
  }
  return labels[status] || 'Estado desconocido'
}
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px) scale(1.02);
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
}
</style>
