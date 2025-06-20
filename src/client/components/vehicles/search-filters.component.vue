<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ $t('client.search.filters.title') }}</h2>
      <button
          @click="resetFilters"
          class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
      >
        <i class="pi pi-refresh mr-1"></i>
        {{ $t('client.search.filters.reset_filters') }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.sort_by') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-search text-gray-400"></i>
          </div>
          <input
              v-model="filters.search"
              type="text"
              :placeholder="$t('client.search.filters.search_placeholder')"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              @input="debounceEmitChange"
          />
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
              v-model="filters.pickupDate"
              type="date"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          />
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
              v-model="filters.returnDate"
              type="date"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.category') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-list text-gray-400"></i>
          </div>
          <select
              v-model="filters.category"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_category') }}</option>
            <option value="sedan">{{ $t('client.search.filters.sedan') }}</option>
            <option value="hatchback">{{ $t('client.search.filters.hatchback') }}</option>
            <option value="suv">{{ $t('client.search.filters.suv') }}</option>
            <option value="electric">{{ $t('client.search.filters.electric') }}</option>
            <option value="compact">{{ $t('client.search.filters.compact') }}</option>
            <option value="luxury">{{ $t('client.search.filters.luxury') }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.brand') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-tag text-gray-400"></i>
          </div>
          <select
              v-model="filters.brand"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_brand') }}</option>
            <option value="Toyota">Toyota</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Audi">Audi</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.max_price') }}: {{ filters.maxPrice ? `${filters.maxPrice}€` : $t('common.no_limit') }}
        </label>
        <div class="px-2">
          <input
              v-model="filters.maxPrice"
              type="range"
              min="0"
              max="200"
              step="5"
              class="w-full"
              @change="emitChange"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0€</span>
            <span>200€</span>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.transmission') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-cog text-gray-400"></i>
          </div>
          <select
              v-model="filters.transmission"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_transmission') }}</option>
            <option value="automatic">{{ $t('client.home.automatic') }}</option>
            <option value="manual">{{ $t('client.home.manual') }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.min_seats') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-users text-gray-400"></i>
          </div>
          <select
              v-model="filters.minSeats"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_transmission') }}</option>
            <option value="2">2+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
            <option value="7">7+</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.min_luggage') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-inbox text-gray-400"></i>
          </div>
          <select
              v-model="filters.minLuggage"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_transmission') }}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.min_year') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-calendar text-gray-400"></i>
          </div>
          <select
              v-model="filters.minYear"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_transmission') }}</option>
            <option value="2018">2018+</option>
            <option value="2019">2019+</option>
            <option value="2020">2020+</option>
            <option value="2021">2021+</option>
            <option value="2022">2022+</option>
            <option value="2023">2023+</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.search.filters.min_rating') }}
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="pi pi-star text-gray-400"></i>
          </div>
          <select
              v-model="filters.minRating"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              @change="emitChange"
          >
            <option value="">{{ $t('client.search.filters.any_transmission') }}</option>
            <option value="3">3.0+</option>
            <option value="3.5">3.5+</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end">
      <button
          @click="applyFilters"
          class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
      >
        {{ $t('client.search.filters.apply_filters') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const props = defineProps({
  initialFilters: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['filter-change']);

const filters = reactive({ ...props.initialFilters });
let searchTimeout = null;

const debounceEmitChange = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emitChange();
  }, 300);
};

const emitChange = () => {
  emit('filter-change', { ...filters });
};

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    // Mantener fechas pero reiniciar los demás filtros
    if (key !== 'pickupDate' && key !== 'returnDate') {
      filters[key] = '';
    }
  });

  emitChange();
};

onMounted(() => {
  if (!filters.pickupDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    filters.pickupDate = tomorrow.toISOString().split('T')[0];
  }

  if (!filters.returnDate) {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 4);
    filters.returnDate = returnDate.toISOString().split('T')[0];
  }
});
</script>
