<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-wrap justify-between items-center mb-6">
        <div>
          <div class="flex items-center gap-3">
            <button @click="goBack" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
              <i class="pi pi-arrow-left"></i>
            </button>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Detalle de reserva</h1>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Reserva #{{ reservation.id?.substring(0, 8) }}
          </p>
        </div>

        <div class="flex gap-3 mt-3 sm:mt-0">
          <button
              v-if="canUpdateStatus"
              @click="openUpdateStatusModal"
              class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <i class="pi pi-sync mr-2"></i> Cambiar estado
          </button>
          <button
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-print mr-2"></i> Imprimir
          </button>
        </div>
      </div>

      <div class="mb-6 flex flex-wrap gap-4 items-center">
        <span
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
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
              class="mr-1.5"
          ></i>
          {{ getStatusLabel(reservation.status) }}
        </span>

        <span class="text-gray-500 dark:text-gray-400">
          <i class="pi pi-calendar mr-1.5"></i> Creada el {{ formatDate(reservation.createdAt) }}
        </span>

        <span
            v-if="reservation.paymentStatus"
            :class="{
              'text-green-600 dark:text-green-400': reservation.paymentStatus === 'paid',
              'text-yellow-600 dark:text-yellow-400': reservation.paymentStatus === 'pending'
            }">
          <i :class="{
            'pi pi-check-circle': reservation.paymentStatus === 'paid',
            'pi pi-clock': reservation.paymentStatus === 'pending'
          }" class="mr-1.5"></i>
          {{ reservation.paymentStatus === 'paid' ? 'Pago completado' : 'Pago pendiente' }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Vehículo
              </h2>

              <div class="flex items-start">
                <img
                    :src="reservation.vehicle?.imageUrl || '/img/car-placeholder.jpg'"
                    :alt="reservation.vehicle?.model"
                    class="w-32 h-24 object-cover rounded-xl mr-4">

                <div>
                  <h3 class="font-bold text-gray-800 dark:text-gray-200">
                    {{ reservation.vehicle?.brand }} {{ reservation.vehicle?.model }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ reservation.vehicle?.year }} · {{ reservation.vehicle?.category }}
                  </p>

                  <div class="mt-3 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <i class="pi pi-id-card mr-2 text-primary-500"></i>
                      <span>{{ reservation.vehicle?.licensePlate }}</span>
                    </div>
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <i class="pi pi-users mr-2 text-primary-500"></i>
                      <span>{{ reservation.vehicle?.seats }} asientos</span>
                    </div>
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <i class="pi pi-cog mr-2 text-primary-500"></i>
                      <span>{{ reservation.vehicle?.transmission === 'automatic' ? 'Automática' : 'Manual' }}</span>
                    </div>
                    <div class="flex items-center text-gray-600 dark:text-gray-400">
                      <i class="pi pi-car mr-2 text-primary-500"></i>
                      <span>{{ reservation.vehicle?.fuelType || 'Gasolina' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Detalles de la reserva
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Fechas</h3>
                  <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div class="mb-3">
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

                <div>
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Ubicación</h3>
                  <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                    <div class="flex items-center text-gray-700 dark:text-gray-300">
                      <i class="pi pi-map-marker mr-2 text-primary-500"></i>
                      <span>{{ reservation.location || 'Oficina principal' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Extras contratados</h3>
                <div v-if="reservation.extras && reservation.extras.length > 0" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  <ul class="space-y-2">
                    <li v-for="extra in reservation.extras" :key="extra.id" class="flex justify-between">
                      <span class="text-gray-700 dark:text-gray-300">{{ extra.name }}</span>
                      <span class="font-medium text-gray-800 dark:text-gray-200">
                        {{ formatPrice(extra.price) }}
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ extra.priceType === 'per_day' ? '/día' : '' }}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
                <div v-else class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl text-gray-500 dark:text-gray-400 text-sm">
                  No hay extras contratados
                </div>
              </div>

              <div class="mt-6">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notas</h3>
                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  <p v-if="reservation.notes" class="text-gray-700 dark:text-gray-300 text-sm">
                    {{ reservation.notes }}
                  </p>
                  <p v-else class="text-gray-500 dark:text-gray-400 text-sm">
                    No hay notas adicionales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Cliente
              </h2>

              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl">
                  <i class="pi pi-user"></i>
                </div>
                <div class="ml-3">
                  <h3 class="font-medium text-gray-800 dark:text-gray-200">
                    {{ reservation.client?.name }}
                  </h3>
                  <p class="text-sm text-primary-600 dark:text-primary-400">
                    Cliente desde {{ formatDate(reservation.client?.createdAt || '2025-01-01') }}
                  </p>
                </div>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-center">
                  <i class="pi pi-envelope mr-2 text-primary-500"></i>
                  <span>{{ reservation.client?.email }}</span>
                </div>

                <div class="flex items-center">
                  <i class="pi pi-phone mr-2 text-primary-500"></i>
                  <span>{{ reservation.client?.phone }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Detalles de pago
              </h2>

              <div v-if="reservation.paymentStatus === 'paid'" class="flex items-center mb-3 text-green-600 dark:text-green-400">
                <i class="pi pi-check-circle mr-2"></i>
                <span class="font-medium">Pago completado</span>
              </div>

              <div v-else class="flex items-center mb-3 text-yellow-600 dark:text-yellow-400">
                <i class="pi pi-clock mr-2"></i>
                <span class="font-medium">Pago pendiente</span>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mt-3">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Método de pago:</span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ getPaymentMethodLabel(reservation.paymentMethod) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Precio por día:</span>
                    <span class="text-gray-800 dark:text-gray-200">{{ formatPrice(reservation.vehiclePrice) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Extras:</span>
                    <span class="text-gray-800 dark:text-gray-200">{{ formatPrice(getTotalExtras()) }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                    <span class="font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(reservation.totalAmount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Acciones
              </h2>

              <div class="space-y-3">
                <button
                    v-if="canCancel"
                    @click="openCancelModal"
                    class="w-full py-2 px-4 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-times-circle mr-2"></i>
                  Cancelar reserva
                </button>

                <button
                    v-if="canStartRental"
                    @click="startRental"
                    class="w-full py-2 px-4 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-car mr-2"></i>
                  Iniciar alquiler
                </button>

                <button
                    v-if="canCompleteRental"
                    @click="completeRental"
                    class="w-full py-2 px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-flag mr-2"></i>
                  Finalizar alquiler
                </button>

                <button
                    class="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-envelope mr-2"></i>
                  Contactar cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showStatusModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Cambiar estado de la reserva
        </h3>

        <div class="space-y-4 mb-6">
          <div v-for="status in availableStatuses" :key="status.value" class="flex items-center">
            <input
                type="radio"
                :id="status.value"
                v-model="selectedStatus"
                :value="status.value"
                class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            >
            <label :for="status.value" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ status.label }}
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
              @click="showStatusModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
              @click="updateStatus"
              class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Cancelar reserva
        </h3>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
          ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Motivo de cancelación
          </label>
          <textarea
              v-model="cancellationReason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
              placeholder="Ingrese el motivo de la cancelación"
          ></textarea>
        </div>

        <div class="flex justify-end gap-3">
          <button
              @click="showCancelModal = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            No cancelar
          </button>
          <button
              @click="cancelReservation"
              class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import reservationService from '../services/reservation.service.js';

const router = useRouter();
const route = useRoute();
const reservation = ref({});
const showStatusModal = ref(false);
const showCancelModal = ref(false);
const selectedStatus = ref('');
const cancellationReason = ref('');

const availableStatuses = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' }
];

const canUpdateStatus = computed(() => {
  return reservation.value.status !== 'cancelled' && reservation.value.status !== 'completed';
});

const canCancel = computed(() => {
  return reservation.value.status !== 'cancelled' && reservation.value.status !== 'completed';
});

const canStartRental = computed(() => {
  return reservation.value.status === 'confirmed';
});

const canCompleteRental = computed(() => {
  return reservation.value.status === 'in_progress';
});

const getReservationDetails = async () => {
  try {
    const id = route.params.id;
    const response = await reservationService.getReservationById(id);
    reservation.value = response;
  } catch (error) {
    console.error('Error al obtener detalles de la reserva:', error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const getStatusLabel = (status) => {
  const statusMap = {
    'pending': 'Pendiente',
    'confirmed': 'Confirmada',
    'in_progress': 'En curso',
    'completed': 'Completada',
    'cancelled': 'Cancelada'
  };
  return statusMap[status] || status;
};

const getPaymentMethodLabel = (method) => {
  const methodMap = {
    'credit_card': 'Tarjeta de crédito',
    'debit_card': 'Tarjeta de débito',
    'paypal': 'PayPal',
    'bank_transfer': 'Transferencia bancaria',
    'cash': 'Efectivo'
  };
  return methodMap[method] || method;
};

const getTotalExtras = () => {
  if (!reservation.value.extras || !reservation.value.extras.length) return 0;

  return reservation.value.extras.reduce((total, extra) => {
    return total + extra.price;
  }, 0);
};

const goBack = () => {
  router.back();
};

const openUpdateStatusModal = () => {
  selectedStatus.value = reservation.value.status;
  showStatusModal.value = true;
};

const updateStatus = async () => {
  try {
    await reservationService.updateReservationStatus(reservation.value.id, selectedStatus.value);
    reservation.value.status = selectedStatus.value;
    showStatusModal.value = false;
  } catch (error) {
    console.error('Error al actualizar estado:', error);
  }
};

const openCancelModal = () => {
  cancellationReason.value = '';
  showCancelModal.value = true;
};

const cancelReservation = async () => {
  try {
    await reservationService.cancelReservation(reservation.value.id, cancellationReason.value);
    reservation.value.status = 'cancelled';
    showCancelModal.value = false;
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
  }
};

const startRental = async () => {
  try {
    await reservationService.updateReservationStatus(reservation.value.id, 'in_progress');
    reservation.value.status = 'in_progress';
  } catch (error) {
    console.error('Error al iniciar alquiler:', error);
  }
};

const completeRental = async () => {
  try {
    await reservationService.updateReservationStatus(reservation.value.id, 'completed');
    reservation.value.status = 'completed';
  } catch (error) {
    console.error('Error al completar alquiler:', error);
  }
};

onMounted(() => {
  getReservationDetails();
});
</script>