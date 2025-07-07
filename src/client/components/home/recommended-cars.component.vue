<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ $t('client.home.recommended') }}</h2>
      <router-link to="/client/search" class="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
        {{ $t('client.home.view_more') }}
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="car in cars" :key="car.id" class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all hover:shadow-md group">
        <div class="relative bg-gray-100 dark:bg-gray-700 p-4">
          <div class="w-full h-32 flex items-center justify-center">
            <!-- Mostrar imagen real del vehículo si está disponible -->
            <img 
              v-if="getVehicleImage(car)"
              :src="getVehicleImage(car)"
              :alt="`${car.brand} ${car.model}`"
              class="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
              @error="handleImageError($event, car)"
            />
            <!-- Fallback a icono si no hay imagen -->
            <i v-else :class="getCarIcon(car)" class="text-5xl group-hover:scale-110 transition-transform"></i>
          </div>
          <div v-if="car.discount" class="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
            -{{ car.discount }}%
          </div>
          <button @click="toggleFavorite(car)" class="absolute top-2 left-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors">
            <i :class="car.isFavorite ? 'pi pi-heart-fill text-red-500' : 'pi pi-heart text-gray-400 dark:text-gray-300'"></i>
          </button>
        </div>

        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-gray-800 dark:text-gray-200">{{ car.brand }} {{ car.model }}</h3>
            <div class="flex flex-col items-end">
              <span class="font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(car.price) }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('client.home.per_day') }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
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

          <router-link
              :to="{ name: 'vehicle-detail', params: { id: car.id } }"
              class="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            {{ $t('client.home.view_details') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  cars: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['toggle-favorite']);

const imageErrors = ref(new Set());

const getVehicleImage = (car) => {
  // Si hay un error de imagen para este auto, no mostrar imagen
  if (imageErrors.value.has(car.id)) return null;
  
  // Si hay imágenes disponibles, usar la primera
  if (car.images && Array.isArray(car.images) && car.images.length > 0) {
    return car.images[0];
  }
  
  return null;
};

const handleImageError = (event, car) => {
  imageErrors.value.add(car.id);
  event.target.style.display = 'none';
};

const getCarIcon = (car) => {
  const brandColors = {
    'Tesla': 'text-green-500',
    'BMW': 'text-blue-500',
    'Mercedes-Benz': 'text-gray-500',
    'Mercedes': 'text-gray-500',
    'Audi': 'text-red-500',
    'Toyota': 'text-red-600',
    'Honda': 'text-blue-600',
    'Volkswagen': 'text-blue-700',
    'Ford': 'text-blue-800'
  };

  const categoryIcons = {
    'sedan': 'pi pi-car',
    'hatchback': 'pi pi-car',
    'suv': 'pi pi-truck',
    'electric': 'pi pi-bolt',
    'pickup': 'pi pi-truck',
    'coupe': 'pi pi-car'
  };

  const category = car.category?.toLowerCase() || (car.brand === 'Tesla' ? 'electric' : 'sedan');
  const icon = categoryIcons[category] || 'pi pi-car';
  const color = brandColors[car.brand] || 'text-gray-500';

  return `${icon} ${color}`;
};

const formatPrice = (price) => {
  if (!price || price === 0) return 'Consultar precio';
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const toggleFavorite = (car) => {
  emit('toggle-favorite', car);
};
</script>
