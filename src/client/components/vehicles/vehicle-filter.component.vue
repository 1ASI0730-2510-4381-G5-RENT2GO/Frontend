<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
    <div class="flex flex-col space-y-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="pi pi-search text-gray-400"></i>
        </div>
        <input
            type="text"
            v-model="filters.search"
            placeholder="Buscar por marca, modelo..."
            class="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
      </div>

      <div class="flex flex-wrap -mx-2">
        <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <select
              v-model="filters.category"
              class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Marca
          </label>
          <select
              v-model="filters.brand"
              class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="">Todas las marcas</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>

        <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Precio máximo
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400">€</span>
            </div>
            <input
                type="number"
                v-model="filters.maxPrice"
                min="0"
                placeholder="Cualquier precio"
                class="pl-7 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
          </div>
        </div>

        <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Transmisión
          </label>
          <select
              v-model="filters.transmission"
              class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="">Cualquiera</option>
            <option value="automatic">Automática</option>
            <option value="manual">Manual</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap -mx-2">
        <div class="px-2 w-full lg:w-1/3 mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de recogida
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-calendar text-gray-400"></i>
            </div>
            <input
                type="date"
                v-model="filters.pickupDate"
                class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
          </div>
        </div>

        <div class="px-2 w-full lg:w-1/3 mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de devolución
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-calendar text-gray-400"></i>
            </div>
            <input
                type="date"
                v-model="filters.returnDate"
                :min="filters.pickupDate"
                class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
          </div>
        </div>

        <div class="px-2 w-full lg:w-1/3 mb-4 flex items-end">
          <button
              @click="applyFilters"
              class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl mr-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
          >
            <i class="pi pi-filter mr-1.5"></i>
            Aplicar filtros
          </button>
          <button
              @click="resetFilters"
              class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-xl transition-colors text-sm font-medium"
          >
            <i class="pi pi-refresh mr-1.5"></i>
            Reiniciar
          </button>
        </div>
      </div>

      <div>
        <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <i :class="[
            'mr-1.5',
            showAdvancedFilters ? 'pi pi-chevron-up' : 'pi pi-chevron-down'
          ]"></i>
          {{ showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados' }}
        </button>

        <div v-if="showAdvancedFilters" class="mt-4 flex flex-wrap -mx-2">
          <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mínimo de asientos
            </label>
            <select
                v-model="filters.minSeats"
                class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">Cualquiera</option>
              <option v-for="n in 7" :key="n" :value="n">{{ n }}+ asientos</option>
            </select>
          </div>

          <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mínimo de maletas
            </label>
            <select
                v-model="filters.minLuggage"
                class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">Cualquiera</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}+ maletas</option>
            </select>
          </div>

          <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Año mínimo
            </label>
            <select
                v-model="filters.minYear"
                class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">Cualquiera</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <div class="px-2 w-full sm:w-1/2 lg:w-1/4 mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calificación mínima
            </label>
            <select
                v-model="filters.minRating"
                class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="">Cualquiera</option>
              <option value="4">4+ estrellas</option>
              <option value="4.5">4.5+ estrellas</option>
              <option value="3">3+ estrellas</option>
              <option value="3.5">3.5+ estrellas</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['filter-change']);

const showAdvancedFilters = ref(false);

const filters = reactive({
  search: '',
  category: '',
  brand: '',
  maxPrice: '',
  transmission: '',
  pickupDate: '',
  returnDate: '',
  minSeats: '',
  minLuggage: '',
  minYear: '',
  minRating: '',
  ...props.initialFilters
});

const categories = ref([
  { id: 'sedan', name: 'Sedán' },
  { id: 'suv', name: 'SUV' },
  { id: 'hatchback', name: 'Hatchback' },
  { id: 'convertible', name: 'Convertible' },
  { id: 'pickup', name: 'Pickup' },
  { id: 'van', name: 'Furgoneta' },
  { id: 'luxury', name: 'Lujo' },
  { id: 'electric', name: 'Eléctrico' },
  { id: 'hybrid', name: 'Híbrido' }
]);

const brands = ref([
  { id: 'toyota', name: 'Toyota' },
  { id: 'volkswagen', name: 'Volkswagen' },
  { id: 'ford', name: 'Ford' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'audi', name: 'Audi' },
  { id: 'honda', name: 'Honda' },
  { id: 'hyundai', name: 'Hyundai' },
  { id: 'kia', name: 'Kia' },
  { id: 'nissan', name: 'Nissan' },
  { id: 'renault', name: 'Renault' },
  { id: 'peugeot', name: 'Peugeot' },
  { id: 'tesla', name: 'Tesla' }
]);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

const applyFilters = () => {
  emit('filter-change', { ...filters });
};

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = '';
  });
  applyFilters();
};

onMounted(() => {
  if (!filters.pickupDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    filters.pickupDate = tomorrow.toISOString().split('T')[0];

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 4);
    filters.returnDate = returnDate.toISOString().split('T')[0];
  }
});
</script>