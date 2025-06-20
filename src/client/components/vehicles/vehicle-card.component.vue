<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="relative">
      <img
          :src="car.imageUrl || '/img/car-placeholder.jpg'"
          :alt="car.model"
          class="w-full h-48 object-cover"
      >
      <div
          v-if="car.status"
          class="absolute top-3 right-3"
      >
        <span
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="statusClasses[car.status]"
        >
          {{ statusLabels[car.status] }}
        </span>
      </div>
      <button
          v-if="showFavoriteButton"
          @click.stop="toggleFavorite"
          class="absolute top-3 left-3 bg-white/80 dark:bg-gray-800/80 p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
      >
        <i :class="[
          car.isFavorite ? 'pi pi-heart-fill text-red-500' : 'pi pi-heart text-gray-600 dark:text-gray-300'
        ]"></i>
      </button>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-bold text-gray-800 dark:text-gray-200">{{ car.brand }} {{ car.model }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ car.year }} · {{ car.category }}</p>
        </div>
        <div>
          <p class="font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(car.price) }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-right">por día</p>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-3 gap-2">
        <div class="flex items-center">
          <i class="pi pi-users text-gray-400 mr-1.5"></i>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ car.seats }} plazas</span>
        </div>
        <div class="flex items-center">
          <i class="pi pi-cog text-gray-400 mr-1.5"></i>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ car.transmission === 'automatic' ? 'Auto' : 'Manual' }}</span>
        </div>
        <div class="flex items-center">
          <i class="pi pi-inbox text-gray-400 mr-1.5"></i>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ car.luggage }} maletas</span>
        </div>
      </div>

      <div class="mt-3 flex items-center">
        <div class="flex items-center mr-2">
          <i class="pi pi-star-fill text-yellow-400 text-sm"></i>
          <span class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{{ car.rating }}</span>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">({{ car.reviewCount }} reseñas)</span>
      </div>

      <button
          v-if="actionEnabled"
          @click="$emit('action-click', car)"
          class="mt-3 w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  car: {
    type: Object,
    required: true
  },
  showFavoriteButton: {
    type: Boolean,
    default: true
  },
  actionEnabled: {
    type: Boolean,
    default: true
  },
  actionLabel: {
    type: String,
    default: 'Ver detalles'
  }
});

const emit = defineEmits(['favorite-toggle', 'action-click']);

const statusClasses = {
  available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  reserved: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  maintenance: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const statusLabels = {
  available: 'Disponible',
  reserved: 'Reservado',
  maintenance: 'Mantenimiento'
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const toggleFavorite = () => {
  emit('favorite-toggle', props.car.id);
};
</script>