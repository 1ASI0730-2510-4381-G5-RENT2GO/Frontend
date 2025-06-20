<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <div v-if="loading" class="py-10 text-center">
        <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
        <p class="mt-3 text-gray-600 dark:text-gray-300">{{ $t('client.reservations.detail.loading') }}</p>
      </div>

      <div v-else-if="error" class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <i class="pi pi-exclamation-circle text-3xl text-red-500"></i>
        <p class="mt-3 text-gray-600 dark:text-gray-300">{{ error }}</p>
        <button
            @click="goBack"
            class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
        >
          {{ $t('client.reservations.detail.back_to_reservations') }}
        </button>
      </div>

      <div v-else>
        <div class="flex flex-wrap justify-between items-center mb-6">
          <div>
            <div class="flex items-center mb-2">
              <button @click="goBack" class="mr-2 text-gray-500 hover:text-primary-600">
                <i class="pi pi-arrow-left"></i>
              </button>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {{ $t('client.reservations.reservation_number') }}{{ reservation.id }}
              </h1>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ $t('client.reservations.detail.booking_date') }} {{ formatDate(reservation.bookingDate) }}
            </p>
          </div>

          <div class="flex gap-2 mt-2 sm:mt-0">
            <button
                v-if="canCancel"
                @click="confirmCancel"
                class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              <i class="pi pi-times mr-2"></i>
              {{ $t('client.reservations.detail.cancel_reservation') }}
            </button>
            <button
                v-if="canModify"
                @click="handleModifyReservation"
                class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <i class="pi pi-pencil mr-2"></i>
              {{ $t('client.reservations.detail.modify_reservation') }}
            </button>
            <button
                v-if="canReview"
                @click="openReviewModal"
                class="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
            >
              <i class="pi pi-star mr-2"></i>
              {{ $t('client.reservations.detail.rate_vehicle') }}
            </button>
          </div>
        </div>

        <div class="mb-6 flex flex-wrap gap-4 items-center">
          <span
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="statusClass"
          >
            {{ statusLabel }}
          </span>
          <span v-if="reservation.paymentStatus" class="flex items-center">
            <i :class="[paymentStatusIcon, 'mr-2']"></i>
            <span class="text-sm font-medium" :class="paymentStatusClass">
              {{ paymentStatusLabel }}
            </span>
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {{ $t('client.reservations.detail.vehicle_details') }}
                </h2>
              </div>

              <div class="p-4">
                <div class="flex flex-col md:flex-row">
                  <div class="md:w-1/3 mb-4 md:mb-0">
                    <img
                        :src="reservation.vehicle.imageUrl || '/img/vehicle-placeholder.jpg'"
                        :alt="reservation.vehicle.brand + ' ' + reservation.vehicle.model"
                        class="rounded-xl w-full h-48 object-cover"
                    >
                  </div>

                  <div class="md:w-2/3 md:pl-6">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {{ reservation.vehicle.brand }} {{ reservation.vehicle.model }}
                    </h3>

                    <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div class="flex items-center">
                        <i class="pi pi-calendar text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle.year }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="pi pi-car text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle.category }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="pi pi-id-card text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle.licensePlate }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="pi pi-users text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle.seats }} {{ $t('client.reservations.detail.seats') }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="pi pi-cog text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">
                          {{ reservation.vehicle.transmission === 'automatic' ? $t('client.home.automatic') : $t('client.home.manual') }}
                        </span>
                      </div>
                      <div class="flex items-center">
                        <i class="pi pi-bolt text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle.fuelType }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Detalles de la reserva
                </h2>
              </div>

              <div class="p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl mr-3">
                      <i class="pi pi-calendar-plus text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de recogida</p>
                      <p class="text-gray-800 dark:text-gray-200">{{ formatDate(reservation.pickupDate) }}</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl mr-3">
                      <i class="pi pi-calendar-minus text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de devolución</p>
                      <p class="text-gray-800 dark:text-gray-200">{{ formatDate(reservation.returnDate) }}</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl mr-3">
                      <i class="pi pi-clock text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Duración</p>
                      <p class="text-gray-800 dark:text-gray-200">{{ getDurationDays() }} días</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl mr-3">
                      <i class="pi pi-map-marker text-primary-600 dark:text-primary-400"></i>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ubicación</p>
                      <p class="text-gray-800 dark:text-gray-200">{{ reservation.location }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="reservation.extras && reservation.extras.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Extras contratados
                </h2>
              </div>

              <div class="p-4">
                <ul class="space-y-3">
                  <li v-for="extra in reservation.extras" :key="extra.id" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <i class="pi pi-check-circle text-green-500 mr-2"></i>
                      <span class="text-gray-800 dark:text-gray-200">{{ extra.name }}</span>
                    </div>
                    <span v-if="extra.price" class="text-gray-600 dark:text-gray-400">
                      {{ formatPrice(extra.price) }}
                      <span v-if="extra.priceType === 'per_day'">/ día</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Resumen de pago
                </h2>
              </div>

              <div class="p-4">
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">
                      Alquiler del vehículo ({{ getDurationDays() }} días)
                    </span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ formatPrice(reservation.vehiclePrice * getDurationDays()) }}
                    </span>
                  </div>

                  <div v-if="getExtrasTotal() > 0" class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Extras</span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ formatPrice(getExtrasTotal()) }}
                    </span>
                  </div>

                  <div class="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span class="font-medium text-gray-800 dark:text-gray-200">Total</span>
                    <span class="font-bold text-gray-800 dark:text-gray-200">
                      {{ formatPrice(reservation.totalPrice) }}
                    </span>
                  </div>

                  <div v-if="reservation.paymentMethod" class="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span class="text-gray-600 dark:text-gray-400">Método de pago</span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ getPaymentMethodLabel(reservation.paymentMethod) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Información importante
                </h2>
              </div>

              <div class="p-4">
                <ul class="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                  <li class="flex items-start">
                    <i class="pi pi-info-circle text-blue-500 mr-2 mt-0.5"></i>
                    <span>
                      Para la recogida del vehículo necesitarás presentar tu documento de identidad y permiso de conducir.
                    </span>
                  </li>
                  <li class="flex items-start">
                    <i class="pi pi-info-circle text-blue-500 mr-2 mt-0.5"></i>
                    <span>
                      El vehículo se entregará con el depósito lleno y deberá devolverse en las mismas condiciones.
                    </span>
                  </li>
                  <li v-if="canCancel" class="flex items-start">
                    <i class="pi pi-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                    <span>
                      Si cancelas la reserva, se aplicará una tarifa de cancelación del 20% del total.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div class="p-4">
                <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-2">
                  ¿Necesitas ayuda?
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Contacta con nuestro servicio de atención al cliente
                </p>
                <a
                    href="tel:+34900123456"
                    class="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium"
                >
                  <i class="pi pi-phone mr-2"></i>
                  +34 900 123 456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Cancelar reserva
        </h3>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
          ¿Estás seguro de que deseas cancelar esta reserva?
          <span v-if="cancellationFee > 0" class="font-medium text-red-600 dark:text-red-400">
            Se aplicará una tarifa de cancelación de {{ formatPrice(cancellationFee) }}.
          </span>
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
              @click="showCancelModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            No, volver
          </button>
          <button
              @click="cancelReservation"
              class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>

    <ReviewModalComponent
        v-if="showReviewModal"
        :show="showReviewModal"
        :reservation="reservation"
        :vehicle="reservation.vehicle"
        @close="showReviewModal = false"
        @submit="handleReviewSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ReviewModalComponent from '@/client/components/vehicles/review-modal.component.vue';

const router = useRouter();
const route = useRoute();
const reservationId = route.params.id;

const reservation = ref({});
const loading = ref(true);
const error = ref(null);
const showCancelModal = ref(false);
const showReviewModal = ref(false);

const statusClass = computed(() => {
  const classes = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  };

  return classes[reservation.value.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
});

const statusLabel = computed(() => {
  const labels = {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    cancelled: 'Cancelada',
    completed: 'Completada',
    in_progress: 'En curso'
  };

  return labels[reservation.value.status] || 'Desconocido';
});

const paymentStatusClass = computed(() => {
  const classes = {
    paid: 'text-green-600 dark:text-green-400',
    pending: 'text-yellow-600 dark:text-yellow-400',
    refunded: 'text-blue-600 dark:text-blue-400',
    failed: 'text-red-600 dark:text-red-400'
  };

  return classes[reservation.value.paymentStatus] || 'text-gray-600 dark:text-gray-400';
});

const paymentStatusLabel = computed(() => {
  const labels = {
    paid: 'Pago completado',
    pending: 'Pago pendiente',
    refunded: 'Reembolsado',
    failed: 'Pago fallido'
  };

  return labels[reservation.value.paymentStatus] || 'Estado desconocido';
});

const paymentStatusIcon = computed(() => {
  const icons = {
    paid: 'pi pi-check-circle text-green-600 dark:text-green-400',
    pending: 'pi pi-clock text-yellow-600 dark:text-yellow-400',
    refunded: 'pi pi-replay text-blue-600 dark:text-blue-400',
    failed: 'pi pi-exclamation-circle text-red-600 dark:text-red-400'
  };

  return icons[reservation.value.paymentStatus] || 'pi pi-question-circle text-gray-600 dark:text-gray-400';
});

const canCancel = computed(() => {
  return ['confirmed', 'pending'].includes(reservation.value.status);
});

const canModify = computed(() => {
  return ['confirmed', 'pending'].includes(reservation.value.status);
});

const canReview = computed(() => {
  return reservation.value.status === 'completed' && !reservation.value.reviewed;
});

const cancellationFee = computed(() => {
  if (reservation.value.status === 'confirmed') {
    return reservation.value.totalPrice * 0.2;
  }
  return 0;
});

async function loadReservation() {
  loading.value = true;
  try {

    setTimeout(() => {
      // Datos de ejemplo
      reservation.value = {
        id: reservationId,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        bookingDate: '2023-10-15',
        pickupDate: '2023-11-20',
        returnDate: '2023-11-25',
        location: 'Madrid - Aeropuerto',
        totalPrice: 350,
        vehiclePrice: 60,
        reviewed: false,
        vehicle: {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2022,
          category: 'Sedán',
          licensePlate: '1234 ABC',
          seats: 5,
          transmission: 'automatic',
          fuelType: 'Híbrido',
          imageUrl: '/img/toyota-corolla.jpg'
        },
        extras: [
          { id: 1, name: 'Seguro a todo riesgo', price: 15, priceType: 'per_day' },
          { id: 2, name: 'GPS', price: 5, priceType: 'per_day' }
        ]
      };

      loading.value = false;
    }, 800);
  } catch (err) {
    error.value = 'Error al cargar la reserva: ' + err.message;
    console.error(err);
  }
}

function getDurationDays() {
  if (!reservation.value.pickupDate || !reservation.value.returnDate) return 1;

  const start = new Date(reservation.value.pickupDate);
  const end = new Date(reservation.value.returnDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
}

function getExtrasTotal() {
  if (!reservation.value.extras || !reservation.value.extras.length) return 0;

  return reservation.value.extras.reduce((total, extra) => {
    if (extra.priceType === 'per_day') {
      return total + (extra.price * getDurationDays());
    } else {
      return total + extra.price;
    }
  }, 0);
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function formatDate(dateString) {
  if (!dateString) return 'No disponible';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

function getPaymentMethodLabel(method) {
  const labels = {
    credit_card: 'Tarjeta de crédito',
    paypal: 'PayPal',
    bank_transfer: 'Transferencia bancaria',
    cash: 'Efectivo'
  };

  return labels[method] || method;
}

function confirmCancel() {
  showCancelModal.value = true;
}

function cancelReservation() {
  reservation.value.status = 'cancelled';
  reservation.value.paymentStatus = 'refunded';
  showCancelModal.value = false;

}

function openReviewModal() {
  showReviewModal.value = true;
}

function handleModifyReservation() {
  router.push(`/client/my-reservations/${reservationId}/edit`);
}

function handleReviewSubmit(reviewData) {

  reservation.value.reviewed = true;
  showReviewModal.value = false;

}

// Volver atrás
function goBack() {
  router.push('/client/reservations');
}

// Cargar datos al montar el componente
onMounted(loadReservation);
</script>









