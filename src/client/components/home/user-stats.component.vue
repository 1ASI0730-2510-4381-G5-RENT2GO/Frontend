<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {{ $t('client.home.welcome', { name: userName }) }}
      </h2>
      <div class="text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 py-1 px-3 rounded-full">
        {{ $t('client.home.premium_status') }}
      </div>
    </div>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      {{ $t('client.home.quick_access') }}
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center">
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
          <i class="pi pi-calendar text-blue-600 dark:text-blue-400"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ activeReservations }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('client.home.active_reservations') }}</p>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center">
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
          <i class="pi pi-car text-green-600 dark:text-green-400"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ totalRentals }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('client.home.completed_rentals') }}</p>
        </div>
      </div>

      <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 flex items-center">
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
          <i class="pi pi-heart text-purple-600 dark:text-purple-400"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ favoriteVehicles }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('client.home.favorite_vehicles') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  userName: {
    type: String,
    default: 'Usuario'
  },
  activeReservations: {
    type: Number,
    default: 0
  },
  totalRentals: {
    type: Number,
    default: 0
  },
  favoriteVehicles: {
    type: Number,
    default: 0
  }
});
</script>