<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
      {{ $t('client.home.search_title') }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.home.location') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-map-marker text-gray-400"></i>
          </div>
          <select
              v-model="searchParams.location"
              class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
            <option value="">{{ $t('client.home.select_location') }}</option>
            <option value="lima">{{ $t('client.locations.lima') }}</option>
            <option value="arequipa">{{ $t('client.locations.arequipa') }}</option>
            <option value="cusco">{{ $t('client.locations.cusco') }}</option>
            <option value="trujillo">{{ $t('client.locations.trujillo') }}</option>
            <option value="piura">{{ $t('client.locations.piura') }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.home.pickup_date') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-calendar text-gray-400"></i>
          </div>
          <input
              type="date"
              v-model="searchParams.pickupDate"
              class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.home.return_date') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-calendar text-gray-400"></i>
          </div>
          <input
              type="date"
              v-model="searchParams.returnDate"
              :min="searchParams.pickupDate"
              class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button
          @click="onSearch"
          class="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
      >
        <i class="pi pi-search mr-2"></i>
        {{ $t('client.home.search_button') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';

const emit = defineEmits(['search']);

const searchParams = ref({
  location: '',
  pickupDate: '',
  returnDate: ''
});

const onSearch = () => {
  emit('search', { ...searchParams.value });
};

const initializeDates = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  searchParams.value.pickupDate = tomorrow.toISOString().split('T')[0];

  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 4);
  searchParams.value.returnDate = returnDate.toISOString().split('T')[0];
};

onMounted(() => {
  initializeDates();
});
</script>

