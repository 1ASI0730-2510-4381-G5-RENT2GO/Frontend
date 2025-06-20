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
              to="/search"
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

const router = useRouter();

const loading = ref(true);
const reservations = ref([]);
const activeTab = ref('all');
const showReviewModal = ref(false);
const selectedReservation = ref({});
const selectedVehicle = ref({});

const tabs = [
  { id: 'all' },
  { id: 'upcoming' },
  { id: 'in_progress' },
  { id: 'completed' },
  { id: 'cancelled' }
];

const getVehicleImage = (vehicleType) => {
  const defaultIcon = 'pi pi-car';
  return defaultIcon;
};

const loadReservations = async () => {
  loading.value = true;

  setTimeout(() => {
    reservations.value = [
      {
        id: 'RES-1234',
        status: 'confirmed',
        paymentStatus: 'paid',
        bookingDate: '2023-10-15',
        pickupDate: '2023-11-20',
        returnDate: '2023-11-25',
        location: 'Madrid - Aeropuerto',
        totalPrice: 350,
        reviewed: false,
        vehicle: {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          imageIcon: 'pi pi-car text-blue-500'
        },
        extras: [
          { id: 1, name: 'Seguro a todo riesgo' },
          { id: 2, name: 'GPS' }
        ]
      },
      {
        id: 'RES-5678',
        status: 'in_progress',
        paymentStatus: 'paid',
        bookingDate: '2023-10-20',
        pickupDate: '2023-11-01',
        returnDate: '2023-11-08',
        location: 'Barcelona - Estación Sants',
        totalPrice: 420,
        reviewed: false,
        vehicle: {
          id: 2,
          brand: 'Volkswagen',
          model: 'Golf',
          imageIcon: 'pi pi-car text-green-500'
        },
        extras: [
          { id: 3, name: 'Asiento infantil' }
        ]
      },
      {
        id: 'RES-9012',
        status: 'completed',
        paymentStatus: 'paid',
        bookingDate: '2023-09-05',
        pickupDate: '2023-09-10',
        returnDate: '2023-09-15',
        location: 'Valencia - Centro',
        totalPrice: 275,
        reviewed: true,
        vehicle: {
          id: 3,
          brand: 'Audi',
          model: 'A4',
          imageIcon: 'pi pi-car text-red-500'
        },
        extras: []
      },
      {
        id: 'RES-3456',
        status: 'cancelled',
        paymentStatus: 'refunded',
        bookingDate: '2023-08-20',
        pickupDate: '2023-09-01',
        returnDate: '2023-09-05',
        location: 'Sevilla - Santa Justa',
        totalPrice: 220,
        reviewed: false,
        vehicle: {
          id: 4,
          brand: 'BMW',
          model: 'Serie 3',
          imageIcon: 'pi pi-car text-purple-500'
        },
        extras: []
      },
      {
        id: 'RES-7890',
        status: 'completed',
        paymentStatus: 'paid',
        bookingDate: '2023-07-10',
        pickupDate: '2023-07-15',
        returnDate: '2023-07-20',
        location: 'Málaga - Aeropuerto',
        totalPrice: 245,
        reviewed: false,
        vehicle: {
          id: 5,
          brand: 'Mercedes',
          model: 'Clase C',
          imageIcon: 'pi pi-car text-gray-500'
        },
        extras: [
          { id: 2, name: 'GPS' },
          { id: 4, name: 'Conductor adicional' }
        ]
      }
    ];

    loading.value = false;
  }, 1000);
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

const handleCancelReservation = (id) => {
  const index = reservations.value.findIndex(res => res.id === id);
  if (index !== -1) {
    reservations.value[index].status = 'cancelled';
    reservations.value[index].paymentStatus = 'refunded';
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

const viewDetails = () => {
  router.push(`/client/my-reservations/${props.reservation.id}`);
};

const handleReviewSubmit = (reviewData) => {
  console.log('Valoración enviada:', reviewData);

  const index = reservations.value.findIndex(res => res.id === reviewData.reservationId);
  if (index !== -1) {
    reservations.value[index].reviewed = true;
  }
};

onMounted(() => {
  loadReservations();
});
</script>