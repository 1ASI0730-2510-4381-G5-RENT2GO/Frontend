<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-xs font-medium px-2 py-1 rounded-full"
              :class="statusClass">
          {{ $t(`client.rental_status.${reservation.status}`) }}
        </span>
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t('client.reservations.reservation_number') }}{{ reservation.id }}
        </span>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDate(reservation.bookingDate) }}
      </div>
    </div>

    <div class="p-4 md:flex">
      <div class="md:w-1/3 mb-4 md:mb-0 md:pr-4">
        <img
            :src="getVehicleImage(reservation.vehicle)"
            :alt="`${reservation.vehicle.brand} ${reservation.vehicle.model}`"
            class="rounded-xl w-full h-40 object-cover"
            @error="handleImageError"
        >
      </div>

      <div class="md:w-2/3">
        <h3 class="font-bold text-gray-800 dark:text-gray-200 text-lg">
          {{ reservation.vehicle.brand }} {{ reservation.vehicle.model }}
        </h3>

        <div class="mt-2 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap">
          <div class="w-full md:w-1/2 flex items-center mb-2">
            <i class="pi pi-calendar-plus mr-2 text-primary-500"></i>
            <span>{{ $t('client.home.pickup') }}: {{ formatDate(reservation.pickupDate) }}</span>
          </div>
          <div class="w-full md:w-1/2 flex items-center mb-2">
            <i class="pi pi-calendar-minus mr-2 text-primary-500"></i>
            <span>{{ $t('client.home.return') }}: {{ formatDate(reservation.returnDate) }}</span>
          </div>
          <div class="w-full md:w-1/2 flex items-center mb-2">
            <i class="pi pi-map-marker mr-2 text-primary-500"></i>
            <span>{{ reservation.location }}</span>
          </div>
          <div class="w-full md:w-1/2 flex items-center mb-2">
            <i class="pi pi-wallet mr-2 text-primary-500"></i>
            <span>{{ formatPrice(reservation.totalPrice) }}</span>
          </div>
        </div>

        <div v-if="reservation.extras && reservation.extras.length" class="mt-3">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('client.reservations.extras_included') }}:</p>
          <div class="flex flex-wrap gap-2">
            <span
                v-for="extra in reservation.extras"
                :key="extra.id"
                class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
            >
              {{ extra.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-2">
      <div v-if="reservation.paymentStatus" class="flex items-center">
        <i :class="[
          paymentStatusIcon,
          'mr-2'
        ]"></i>
        <span class="text-sm font-medium" :class="paymentStatusClass">
          {{ $t(`client.reservations.payment_status.${reservation.paymentStatus}`) }}
        </span>
      </div>
      <div v-else class="w-5"></div>

      <div class="flex space-x-2">
        <button
            v-if="canCancel"
            @click="confirmCancel"
            class="px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 rounded-xl text-sm font-medium transition-colors"
        >
          <i class="pi pi-times mr-1"></i>
          {{ $t('client.reservations.actions.cancel') }}
        </button>

        <button
            v-if="canModify"
            @click="$emit('modify', reservation.id)"
            class="px-3 py-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-xl text-sm font-medium transition-colors"
        >
          <i class="pi pi-pencil mr-1"></i>
          {{ $t('client.reservations.actions.modify') }}
        </button>

        <button
            v-if="canReview"
            @click="$emit('review', reservation.id)"
            class="px-3 py-1 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800/40 rounded-xl text-sm font-medium transition-colors"
        >
          <i class="pi pi-star mr-1"></i>
          {{ $t('client.reservations.actions.review') }}
        </button>

        <button
            @click="viewDetails"
            class="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
        >
          <i class="pi pi-eye mr-1"></i>
          {{ $t('client.reservations.actions.details') }}
        </button>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          {{ $t('client.reservations.cancel_modal.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ $t('client.reservations.cancel_modal.confirmation') }}
          <span v-if="cancellationFee > 0" class="font-medium text-red-600 dark:text-red-400">
            {{ $t('client.reservations.cancel_modal.fee', { fee: formatPrice(cancellationFee) }) }}
          </span>
        </p>
        <div class="flex justify-end space-x-3">
          <button
              @click="showCancelModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
          >
            {{ $t('client.reservations.cancel_modal.go_back') }}
          </button>
          <button
              @click="cancelReservation"
              class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl text-sm font-medium transition-colors"
          >
            {{ $t('client.reservations.cancel_modal.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  reservation: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['cancel', 'modify', 'review', 'view-details']);

const showCancelModal = ref(false);

const statusClass = computed(() => {
  const classes = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  };

  return classes[props.reservation.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
});

const statusLabel = computed(() => {
  const labels = {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
    completed: 'Completada',
    in_progress: 'En curso'
  };

  return labels[props.reservation.status] || 'Desconocido';
});

const paymentStatusClass = computed(() => {
  const classes = {
    paid: 'text-green-600 dark:text-green-400',
    completed: 'text-green-600 dark:text-green-400', // Sinónimo de paid
    pending: 'text-yellow-600 dark:text-yellow-400',
    refunded: 'text-blue-600 dark:text-blue-400',
    failed: 'text-red-600 dark:text-red-400'
  };

  return classes[props.reservation.paymentStatus] || 'text-gray-600 dark:text-gray-400';
});

const paymentStatusLabel = computed(() => {
  const labels = {
    paid: 'Pago completado',
    completed: 'Pago completado', // Sinónimo de paid
    pending: 'Pago pendiente',
    refunded: 'Reembolsado',
    failed: 'Pago fallido'
  };

  return labels[props.reservation.paymentStatus] || 'Estado desconocido';
});

const paymentStatusIcon = computed(() => {
  const icons = {
    paid: 'pi pi-check-circle text-green-600 dark:text-green-400',
    pending: 'pi pi-clock text-yellow-600 dark:text-yellow-400',
    refunded: 'pi pi-replay text-blue-600 dark:text-blue-400',
    failed: 'pi pi-exclamation-circle text-red-600 dark:text-red-400'
  };

  return icons[props.reservation.paymentStatus] || 'pi pi-question-circle text-gray-600 dark:text-gray-400';
});

const canCancel = computed(() => {
  return ['confirmed', 'pending'].includes(props.reservation.status);
});

const canModify = computed(() => {
  return ['confirmed', 'pending'].includes(props.reservation.status);
});

const canReview = computed(() => {
  return props.reservation.status === 'completed' && !props.reservation.reviewed;
});

const cancellationFee = computed(() => {
  if (props.reservation.status === 'confirmed') {
    return props.reservation.totalPrice * 0.2;
  }
  return 0;
});

const viewDetails = () => {
  router.push(`/client/my-reservations/${props.reservation.id}`);
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const confirmCancel = () => {
  showCancelModal.value = true;
};

const cancelReservation = () => {
  emit('cancel', props.reservation.id);
  showCancelModal.value = false;
};

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
</script>
