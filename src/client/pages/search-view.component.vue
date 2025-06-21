<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <SearchFiltersComponent @filter-change="handleFilterChange" :initial-filters="filters" />
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else>
        <div class="flex flex-wrap items-center justify-between mb-6">
          <p class="text-gray-600 dark:text-gray-400 mb-3 md:mb-0">
            <span class="font-medium text-gray-800 dark:text-gray-200">{{ cars.length }}</span> {{ $t('client.search.vehicles_found') }}
          </p>

          <div class="flex items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400 mr-2">{{ $t('client.search.sort_by') }}:</span>
            <select
                v-model="sortBy"
                @change="sortCars"
                class="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm p-1.5 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
            >
              <option value="price_asc">{{ $t('client.search.sort_options.price_asc') }}</option>
              <option value="price_desc">{{ $t('client.search.sort_options.price_desc') }}</option>
              <option value="rating_desc">{{ $t('client.search.sort_options.rating_desc') }}</option>
              <option value="newest">{{ $t('client.search.sort_options.newest') }}</option>
            </select>
          </div>
        </div>

        <div v-if="cars.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="car in cars" :key="car.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
            <div class="relative bg-gray-100 dark:bg-gray-700">
              <!-- Mostrar imagen real si existe, de lo contrario mostrar ícono -->
              <div v-if="car.images && car.images.length > 0" class="w-full h-48">
                <img :src="car.images[0]" :alt="`${car.brand} ${car.model}`" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-full h-48 flex items-center justify-center">
                <i :class="getCarIcon(car)" class="text-6xl"></i>
              </div>
              <div class="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-xl shadow-md py-1 px-2 flex items-center">
                <i class="pi pi-star-fill text-yellow-400 mr-1"></i>
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ car.rating }}/5</span>
              </div>
            </div>

            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800 dark:text-gray-200 text-lg">{{ car.brand }} {{ car.model }}</h3>
                <div class="flex flex-col items-end">
                  <span class="font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(car.price) }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('client.home.per_day') }}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div class="flex items-center">
                  <i class="pi pi-users mr-1"></i>
                  <span>{{ car.seats }} {{ $t('client.home.seats') }}</span>
                </div>
                <div class="flex items-center">
                  <i class="pi pi-inbox mr-1"></i>
                  <span>{{ car.luggage }} {{ $t('client.home.luggage') }}</span>
                </div>
                <div class="flex items-center">
                  <i class="pi pi-cog mr-1"></i>
                  <span>{{ car.transmission === 'automatic' ? $t('client.home.automatic') : $t('client.home.manual') }}</span>
                </div>
              </div>

              <div class="flex mt-4 justify-end">
                <router-link
                    :to="{ name: 'car-detail', params: { id: car.id }, query: { pickupDate: filters.pickupDate, returnDate: filters.returnDate } }"
                    class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
                >
                  {{ $t('client.search.view_details') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <div class="text-8xl text-gray-300 dark:text-gray-600 flex justify-center mb-4">
            <i class="pi pi-search"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{{ $t('client.search.no_vehicles_found') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ $t('client.search.no_vehicles_message') }}
          </p>
          <button
              @click="resetFilters"
              class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
          >
            {{ $t('client.search.clear_filters') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SearchFiltersComponent from '@/client/components/vehicles/search-filters.component.vue';
import { vehiclesService } from '@/client/services/vehicles.service';

const route = useRoute();


const loading = ref(true);
const cars = ref([]);
const sortBy = ref('price_asc');

const filters = reactive({
  search: route.query.search || '',
  category: route.query.category || '',
  brand: route.query.brand || '',
  maxPrice: route.query.maxPrice || '',
  transmission: route.query.transmission || '',
  pickupDate: route.query.pickupDate || '',
  returnDate: route.query.returnDate || '',
  minSeats: route.query.minSeats || '',
  minLuggage: route.query.minLuggage || '',
  minYear: route.query.minYear || '',
  minRating: route.query.minRating || '',
});

const getCarIcon = (car) => {
  const brandColors = {
    'Toyota': 'text-blue-500',
    'Volkswagen': 'text-indigo-500',
    'BMW': 'text-sky-500',
    'Mercedes-Benz': 'text-gray-500',
    'Audi': 'text-red-500',
    'Tesla': 'text-green-500'
  };

  const categoryIcons = {
    'sedan': 'pi pi-car',
    'hatchback': 'pi pi-car',
    'suv': 'pi pi-truck',
    'electric': 'pi pi-bolt',
    'compact': 'pi pi-car',
    'luxury': 'pi pi-star'
  };

  const icon = categoryIcons[car.category] || 'pi pi-car';
  const color = brandColors[car.brand] || 'text-gray-500';

  return `${icon} ${color}`;
};

const loadCars = async () => {
  loading.value = true;

  try {
    // Crear un objeto con solo los parámetros que tienen valores
    const searchParams = {};
    
    // Añadir todos los filtros que tienen un valor (no vacío)
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
        searchParams[key] = filters[key];
      }
    });
    
    console.log("Parámetros de búsqueda para enviar:", searchParams);
    
    // Obtener datos del servicio con los parámetros válidos
    const response = await vehiclesService.searchVehicles(searchParams);
    
    // Extraer el array de la respuesta .NET
    let vehiclesArray = [];
    
    if (response && response.$values) {
      // Si tenemos la estructura esperada de .NET
      vehiclesArray = response.$values;
    } else if (Array.isArray(response)) {
      // Si ya es un array
      vehiclesArray = response;
    } else if (response && Array.isArray(response.data)) {
      // Si está dentro de un campo data
      vehiclesArray = response.data;
    }
    
    // Asegurar que cars.value siempre sea un array
    cars.value = vehiclesArray;
    console.log("Vehículos cargados:", cars.value.length);
    
    // Aplicar los filtros adicionales que no se procesaron en el backend
    applyFilters(false);
  } catch (error) {
    console.error('Error al cargar vehículos:', error);
    cars.value = [];
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = (newFilters) => {
  Object.keys(newFilters).forEach(key => {
    filters[key] = newFilters[key];
  });

  applyFilters(true);
};

const applyFilters = (reloadFromServer = true) => {
  if (reloadFromServer) {
    // Si cambiaron filtros principales, recargamos del servidor
    loadCars();
    return;
  }
  
  // Aplicar filtros adicionales localmente si es necesario
  sortCars();
};

const sortCars = () => {
  switch (sortBy.value) {
    case 'price_asc':
      cars.value.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      cars.value.sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      cars.value.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      cars.value.sort((a, b) => b.year - a.year);
      break;
  }
};

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = '';
  });
  loadCars();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

onMounted(() => {
  loadCars();
});
</script>

