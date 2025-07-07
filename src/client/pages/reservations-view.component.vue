<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px space-x-8">
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
            {{ $t(`client.reservations.tabs.${tab.id}`) }}
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
        <div v-if="filteredReservations.length > 0" class="space-y-6">
          <ReservationCardComponent
              v-for="reservation in filteredReservations"
              :key="reservation.id"
              :reservation="reservation"
              @cancel="handleCancelReservation"
              @modify="handleModifyReservation"
              @review="handleReviewReservation"
              @view-details="handleViewDetails"
          />
        </div>

        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div class="text-8xl text-gray-300 dark:text-gray-600 flex justify-center mb-4">
            <i class="pi pi-calendar-times"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {{ $t(`client.reservations.empty_states.${activeTab}.title`) }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ $t(`client.reservations.empty_states.${activeTab}.description`) }}
          </p>
          <router-link
              to="/client/search"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {{ $t('client.reservations.explore_vehicles') }}
          </router-link>
        </div>
      </div>
    </div>

    <ReviewModalComponent
        :show="showReviewModal"
        :reservation="selectedReservation"
        :vehicle="selectedVehicle"
        @close="showReviewModal = false"
        @submit="handleReviewSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ReservationCardComponent from '@/client/components/reservations/reservation-card.component.vue';
import ReviewModalComponent from '@/client/components/vehicles/review-modal.component.vue';
import { useRouter } from 'vue-router';
import { reservationsService } from '@/client/services/reservations.service';

const router = useRouter();

const loading = ref(true);
const reservations = ref([]);
const activeTab = ref('all');
const showReviewModal = ref(false);
const selectedReservation = ref({});
const selectedVehicle = ref({});
const error = ref(false);

const tabs = [
  { id: 'all' },
  { id: 'upcoming' },
  { id: 'in_progress' },
  { id: 'completed' },
  { id: 'cancelled' }
];

const loadReservations = async () => {
  loading.value = true;
  error.value = false;

  try {
    console.log('Cargando reservaciones del backend...');

    // Obtener todas las reservaciones del usuario
    let reservationsData = await reservationsService.getMyReservations();

    // Manejar diferentes formatos de respuesta del backend
    if (reservationsData && reservationsData.$values) {
      reservationsData = reservationsData.$values;
    } else if (!Array.isArray(reservationsData)) {
      reservationsData = [];
    }

    // Normalizar los datos de cada reservación
    reservations.value = reservationsData.map(reservation =>
      reservationsService.normalizeReservation(reservation)
    );

    console.log('Reservaciones cargadas:', reservations.value);

  } catch (err) {
    console.error('Error al cargar reservaciones:', err);
    error.value = true;

    // No usar datos de ejemplo - mostrar la lista vacía si hay error
    reservations.value = [];
  } finally {
    loading.value = false;
  }
};

const filteredReservations = computed(() => {
  if (activeTab.value === 'all') {
    return reservations.value;
  }

  return reservations.value.filter(res => {
    if (activeTab.value === 'upcoming') {
      return res.status === 'confirmed';
    } else if (activeTab.value === 'in_progress') {
      return res.status === 'in_progress';
    } else if (activeTab.value === 'completed') {
      return res.status === 'completed';
    } else if (activeTab.value === 'cancelled') {
      return res.status === 'cancelled';
    }
    return false;
  });
});

const getReservationCount = (tabId) => {
  if (tabId === 'all') {
    return reservations.value.length;
  }

  return reservations.value.filter(res => {
    if (tabId === 'upcoming') {
      return res.status === 'confirmed';
    } else if (tabId === 'in_progress') {
      return res.status === 'in_progress';
    } else if (tabId === 'completed') {
      return res.status === 'completed';
    } else if (tabId === 'cancelled') {
      return res.status === 'cancelled';
    }
    return false;
  }).length;
};

const handleCancelReservation = async (id) => {
  try {
    loading.value = true;

    // Cancelar en el backend
    await reservationsService.cancelReservation(id, 'Cancelado por el usuario');

    // Actualizar estado local
    const index = reservations.value.findIndex(res => res.id === id);
    if (index !== -1) {
      reservations.value[index].status = 'cancelled';
      reservations.value[index].paymentStatus = 'refunded';
    }

    console.log(`Reservación ${id} cancelada exitosamente`);

  } catch (error) {
    console.error('Error al cancelar reservación:', error);
    alert('Error al cancelar la reservación. Por favor, intenta nuevamente.');
  } finally {
    loading.value = false;
  }
};

const handleModifyReservation = (id) => {
  router.push(`/client/my-reservations/${id}/edit`);
};

const handleReviewReservation = (id) => {
  const reservation = reservations.value.find(res => res.id === id);
  if (reservation) {
    selectedReservation.value = reservation;
    selectedVehicle.value = reservation.vehicle;
    showReviewModal.value = true;
  }
};

const handleViewDetails = (id) => {
  router.push(`/client/my-reservations/${id}`);
};

const handleReviewSubmit = (reviewData) => {
  console.log('Valoración enviada:', reviewData);

  const index = reservations.value.findIndex(res => res.id === reviewData.reservationId);
  if (index !== -1) {
    reservations.value[index].reviewed = true;
  }

  showReviewModal.value = false;
};

onMounted(() => {
  loadReservations();
});
</script>
