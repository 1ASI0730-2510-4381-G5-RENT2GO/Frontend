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
            <i :class="getCarIcon(car)" class="text-5xl group-hover:scale-110 transition-transform"></i>
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
              :to="{ name: 'car-detail', params: { id: car.id } }"
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
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  cars: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['toggle-favorite']);

const getCarIcon = (car) => {
  const brandColors = {
    'Tesla': 'text-green-500',
    'BMW': 'text-blue-500',
    'Mercedes-Benz': 'text-gray-500',
    'Audi': 'text-red-500'
  };

  const categoryIcons = {
    'sedan': 'pi pi-car',
    'hatchback': 'pi pi-car',
    'suv': 'pi pi-truck',
    'electric': 'pi pi-bolt'
  };

  const category = car.category || (car.brand === 'Tesla' ? 'electric' : 'sedan');
  const icon = categoryIcons[category] || 'pi pi-car';
  const color = brandColors[car.brand] || 'text-gray-500';

  return `${icon} ${color}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const toggleFavorite = (car) => {
  emit('toggle-favorite', car);
};
</script>