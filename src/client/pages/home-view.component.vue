<template>
  <div>
    <UserStatsComponent
        :user-name="userName"
        :active-reservations="activeReservations"
        :total-rentals="totalRentals"
        :favorite-vehicles="favoriteVehicles"
    />

    <NextReservationComponent
        v-if="nextReservation"
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
import { reservationsService } from '@/client/services/reservations.service.js';
import { userStatsService } from '@/client/services/user-stats.service.js';
import { vehiclesService } from '@/client/services/vehicles.service.js';
import UserStatsComponent from '@/client/components/home/user-stats.component.vue';
import NextReservationComponent from '@/client/components/home/next-reservation.component.vue';
import QuickSearchComponent from '@/client/components/home/quick-search.component.vue';
import RecommendedCarsComponent from '@/client/components/home/recommended-cars.component.vue';

const router = useRouter();
const authStore = useAuthStore();

// Estado reactivo
const userName = ref(authStore.user?.name || 'Usuario');
const activeReservations = ref(0);
const totalRentals = ref(0);
const favoriteVehicles = ref(0);
const nextReservation = ref(null);
const recommendedCars = ref([]);
const loading = ref(false);

/**
 * Carga las estadísticas del usuario desde la API
 */
const loadUserStats = async () => {
  try {
    loading.value = true;
    
    // Cargar estadísticas en paralelo
    const [activeCount, totalCount, favoritesCount] = await Promise.all([
      userStatsService.getActiveReservationsCount(),
      userStatsService.getTotalRentalsCount(),
      userStatsService.getFavoriteVehiclesCount()
    ]);

    activeReservations.value = activeCount;
    totalRentals.value = totalCount;
    favoriteVehicles.value = favoritesCount;
    
    console.log('Estadísticas cargadas:', {
      activeReservations: activeCount,
      totalRentals: totalCount,
      favoriteVehicles: favoritesCount
    });
  } catch (error) {
    console.error('Error al cargar estadísticas del usuario:', error);
    // Mantener valores por defecto en caso de error
  }
};

/**
 * Carga la próxima reserva del usuario
 */
const loadNextReservation = async () => {
  try {
    const reservations = await reservationsService.getReservationsByStatus('confirmed');
    
    if (reservations && reservations.length > 0) {
      // Buscar la reserva más próxima por fecha de pickup
      const upcomingReservations = reservations
        .filter(reservation => new Date(reservation.pickupDate) > new Date())
        .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));
      
      if (upcomingReservations.length > 0) {
        nextReservation.value = reservationsService.normalizeReservation(upcomingReservations[0]);
        console.log('Próxima reserva cargada:', nextReservation.value);
      }
    }
  } catch (error) {
    console.error('Error al cargar próxima reserva:', error);
    nextReservation.value = null;
  }
};

/**
 * Carga vehículos recomendados
 */
const loadRecommendedCars = async () => {
  try {
    // Buscar vehículos disponibles para mostrar como recomendados
    const searchParams = {
      // Usar fechas futuras por defecto para mostrar disponibilidad
      pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    const vehicles = await vehiclesService.searchVehicles(searchParams);
    
    // Tomar solo los primeros 6 vehículos para recomendaciones
    if (vehicles && vehicles.length > 0) {
      recommendedCars.value = vehicles.slice(0, 6).map(vehicle => ({
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        price: vehicle.pricePerDay || vehicle.price || 0,
        discount: vehicle.discount || null,
        seats: vehicle.seats || 5,
        luggage: vehicle.luggage || 2,
        transmission: vehicle.transmission || 'automatic',
        category: vehicle.category || 'sedan',
        isFavorite: false, // Por ahora todos son false hasta implementar favoritos
        images: vehicle.images || []
      }));
      
      console.log('Vehículos recomendados cargados:', recommendedCars.value.length);
    }
  } catch (error) {
    console.error('Error al cargar vehículos recomendados:', error);
    // Mantener array vacío en caso de error
    recommendedCars.value = [];
  }
};

/**
 * Carga todos los datos del dashboard
 */
const loadDashboardData = async () => {
  try {
    loading.value = true;
    
    // Cargar datos en paralelo para mejor rendimiento
    await Promise.all([
      loadUserStats(),
      loadNextReservation(),
      loadRecommendedCars()
    ]);
    
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Asegurar que tenemos información del usuario
  if (!authStore.user) {
    await authStore.refreshUserInfo();
    userName.value = authStore.user?.name || 'Usuario';
  }
  
  // Cargar todos los datos del dashboard
  await loadDashboardData();
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
  
  // TODO: Implementar llamada a API para guardar/quitar favorito
  // favoritesService.toggleFavorite(car.id);
};
</script>