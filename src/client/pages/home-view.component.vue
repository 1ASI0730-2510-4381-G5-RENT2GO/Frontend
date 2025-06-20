<template>
  <div>
    <UserStatsComponent
        :user-name="userName"
        :active-reservations="activeReservations"
        :total-rentals="totalRentals"
        :favorite-vehicles="favoriteVehicles"
    />

    <NextReservationComponent
        :reservation="nextReservation"
    />

    <QuickSearchComponent @search="searchVehicles" />

    <RecommendedCarsComponent
        :cars="recommendedCars"
        @toggle-favorite="toggleFavorite"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/auth/stores/authStore.js';
import UserStatsComponent from '@/client/components/home/user-stats.component.vue';
import NextReservationComponent from '@/client/components/home/next-reservation.component.vue';
import QuickSearchComponent from '@/client/components/home/quick-search.component.vue';
import RecommendedCarsComponent from '@/client/components/home/recommended-cars.component.vue';

const router = useRouter();
const authStore = useAuthStore();

const userName = ref(authStore.user?.name || 'Usuario');
const activeReservations = ref(1);
const totalRentals = ref(5);
const favoriteVehicles = ref(3);

const nextReservation = ref({
  id: 'RSV-2023-0042',
  status: 'confirmed',
  car: {
    brand: 'Audi',
    model: 'Q5',
    category: 'suv'
  },
  location: 'Madrid - Aeropuerto (T4)',
  pickupDate: '2023-11-15T10:00:00',
  returnDate: '2023-11-18T18:00:00',
  totalPrice: 245
});

const recommendedCars = ref([
  {
    id: 1,
    brand: 'Tesla',
    model: 'Model 3',
    price: 85,
    discount: 15,
    seats: 5,
    luggage: 2,
    transmission: 'automatic',
    category: 'electric',
    isFavorite: true
  },
  {
    id: 2,
    brand: 'BMW',
    model: 'X3',
    price: 75,
    discount: null,
    seats: 5,
    luggage: 4,
    transmission: 'automatic',
    category: 'suv',
    isFavorite: false
  },
  {
    id: 3,
    brand: 'Mercedes-Benz',
    model: 'Clase C',
    price: 80,
    discount: 10,
    seats: 5,
    luggage: 3,
    transmission: 'automatic',
    category: 'sedan',
    isFavorite: false
  }
]);

onMounted(async () => {
  if (!authStore.user) {
    await authStore.refreshUserInfo();
    userName.value = authStore.user?.name || 'Usuario';
  }
});

const searchVehicles = (searchParams) => {
  router.push({
    path: '/client/search',
    query: searchParams
  });
};

const toggleFavorite = (car) => {
  car.isFavorite = !car.isFavorite;

  console.log(`${car.isFavorite ? 'Añadido a' : 'Eliminado de'} favoritos: ${car.brand} ${car.model}`);
};
</script>