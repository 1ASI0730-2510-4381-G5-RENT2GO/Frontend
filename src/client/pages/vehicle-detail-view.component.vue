<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
      <div class="text-6xl text-red-500 flex justify-center mb-4">
        <i class="pi pi-exclamation-triangle"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Error al cargar el vehículo</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        No se pudo cargar la información del vehículo solicitado.
      </p>
      <router-link
        to="/client/search"
        class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
      >
        Volver a búsqueda
      </router-link>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div class="relative">
        <button
          @click="goBack"
          class="absolute top-4 left-4 z-10 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <i class="pi pi-arrow-left text-gray-600 dark:text-gray-300 text-xl"></i>
        </button>

        <img
            :src="selectedImage || (car.images && car.images.length > 0 ? car.images[0] : '/img/car-placeholder.jpg')"
            :alt="`${car.brand} ${car.model}`"
            class="w-full h-64 md:h-96 object-cover"
        >

        <div class="absolute top-4 right-4">
          <span
              v-if="car.status"
              class="px-3 py-1.5 text-sm font-medium rounded-full"
              :class="statusClasses[car.status]"
          >
            {{ statusLabels[car.status] }}
          </span>
        </div>

        <button
            @click="toggleFavorite"
            class="absolute top-4 left-16 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <i :class="[
            car.isFavorite ? 'pi pi-heart-fill text-red-500' : 'pi pi-heart text-gray-600 dark:text-gray-300',
            'text-xl'
          ]"></i>
        </button>

        <div v-if="car.images && car.images.length > 1" class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <button
              v-for="(image, index) in car.images"
              :key="index"
              @click="selectedImage = image"
              class="w-12 h-12 overflow-hidden rounded-md border-2 focus:outline-none"
              :class="selectedImage === image ? 'border-primary-500' : 'border-white/70 dark:border-gray-600'"
          >
            <img :src="image" class="w-full h-full object-cover">
          </button>
        </div>
      </div>

      <div class="p-6">
        <div class="md:flex md:justify-between md:items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ car.brand }} {{ car.model }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ car.year }} · {{ car.category }}</p>
          </div>
          <div class="mt-4 md:mt-0 text-right">
            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(car.price) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">por día</p>
          </div>
        </div>

        <div class="mt-4 flex items-center">
          <div class="flex">
            <i v-for="i in 5" :key="i" :class="[
              i <= Math.floor(car.rating) ? 'pi pi-star-fill text-yellow-400' : (
                i <= car.rating + 0.5 ? 'pi pi-star text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-600'
              ),
              'text-lg mr-0.5'
            ]"></i>
          </div>
          <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{{ car.rating }}/5</span>
          <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">({{ car.reviewCount }} reseñas)</span>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Disponibilidad</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de recogida
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="pi pi-calendar text-gray-400"></i>
                </div>
                <input
                    type="date"
                    v-model="bookingDetails.pickupDate"
                    :min="minDate"
                    class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de devolución
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="pi pi-calendar text-gray-400"></i>
                </div>
                <input
                    type="date"
                    v-model="bookingDetails.returnDate"
                    :min="bookingDetails.pickupDate"
                    class="pl-10 w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>
            </div>
          </div>

          <div v-if="totalDays > 0" class="mt-6 bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Resumen de precios</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{{ car.price }} × {{ totalDays }} días</span>
                <span class="text-gray-800 dark:text-gray-200">{{ formatPrice(car.price * totalDays) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Seguro básico</span>
                <span class="text-gray-800 dark:text-gray-200">{{ formatPrice(15 * totalDays) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Tasa de servicio</span>
                <span class="text-gray-800 dark:text-gray-200">{{ formatPrice(25) }}</span>
              </div>
              <div class="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-medium">
                <span class="text-gray-800 dark:text-gray-200">Total</span>
                <span class="text-primary-600 dark:text-primary-400">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>
          </div>


          <button
              @click="proceedToCheckout"
              :disabled="!isValidBooking || car.status !== 'available'"
              class="mt-4 w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{
              car.status !== 'available' ? 'No disponible' :
                  isValidBooking ? 'Reservar ahora' : 'Selecciona fechas'
            }}
          </button>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
              'px-6 py-3 font-medium text-sm focus:outline-none',
              activeTab === tab.id
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="p-6">
          <div v-if="activeTab === 'features'" class="space-y-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="flex items-center">
                <i class="pi pi-users text-primary-500 mr-2 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ car.seats }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Asientos</p>
                </div>
              </div>
              <div class="flex items-center">
                <i class="pi pi-cog text-primary-500 mr-2 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ car.transmission === 'automatic' ? 'Automática' : 'Manual' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Transmisión</p>
                </div>
              </div>
              <div class="flex items-center">
                <i class="pi pi-inbox text-primary-500 mr-2 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ car.luggage }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Maletas</p>
                </div>
              </div>
              <div class="flex items-center">
                <i class="pi pi-car text-primary-500 mr-2 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ car.fuelType || 'Gasolina' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Combustible</p>
                </div>
              </div>
            </div>

            <div v-if="car.features && car.features.length > 0">
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Características adicionales</h3>
              <ul class="grid grid-cols-2 gap-x-4 gap-y-2">
                <li v-for="feature in car.features" :key="feature" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i class="pi pi-check text-green-500 mr-2"></i>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div v-if="car.description">
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Descripción</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">{{ car.description }}</p>
            </div>
          </div>

          <div v-if="activeTab === 'conditions'" class="space-y-6">
            <div>
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Requisitos de alquiler</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li class="flex items-start">
                  <i class="pi pi-id-card text-primary-500 mr-2 mt-0.5"></i>
                  <span>Edad mínima del conductor: 21 años</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-check-circle text-primary-500 mr-2 mt-0.5"></i>
                  <span>Permiso de conducir válido con al menos 2 años de antigüedad</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-wallet text-primary-500 mr-2 mt-0.5"></i>
                  <span>Tarjeta de crédito a nombre del conductor principal</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Política de combustible</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Se entrega con el depósito lleno y debe devolverse con el depósito lleno.
              </p>
            </div>

            <div>
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Política de cancelación</h3>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li class="flex items-start">
                  <i class="pi pi-check text-green-500 mr-2 mt-0.5"></i>
                  <span>Cancelación gratuita hasta 48 horas antes de la recogida</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-info-circle text-yellow-500 mr-2 mt-0.5"></i>
                  <span>Cancelación con menos de 48 horas: cargo del 50% del importe total</span>
                </li>
                <li class="flex items-start">
                  <i class="pi pi-times text-red-500 mr-2 mt-0.5"></i>
                  <span>No presentarse sin cancelar: cargo del 100% del importe total</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="mr-4">
                  <span class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ car.rating }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">/5</span>
                </div>
                <div>
                  <div class="flex">
                    <i v-for="i in 5" :key="i" :class="[
                      i <= Math.floor(car.rating) ? 'pi pi-star-fill text-yellow-400' : (
                        i <= car.rating + 0.5 ? 'pi pi-star text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-600'
                      ),
                      'text-lg mr-0.5'
                    ]"></i>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ car.reviewCount }} valoraciones</p>
                </div>
              </div>
            </div>

            <div v-if="reviews.length > 0" class="space-y-4">
              <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div class="flex justify-between items-start">
                  <div class="flex items-center">
                    <img
                        :src="review.user.avatar || '/img/avatar-placeholder.jpg'"
                        :alt="review.user.name"
                        class="w-10 h-10 rounded-full object-cover mr-3"
                    >
                    <div>
                      <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ review.user.name }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(review.date) }}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <i v-for="i in 5" :key="i" :class="[
                      i <= review.rating ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-600',
                      'text-sm mr-0.5'
                    ]"></i>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="py-8 text-center">
              <p class="text-gray-500 dark:text-gray-400">Este vehículo aún no tiene valoraciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { vehiclesService } from '@/client/services/vehicles.service';

const router = useRouter();
const route = useRoute();
const vehicleId = route.params.id;

// Estado
const car = ref({});
const loading = ref(true);
const error = ref(false);
const reviews = ref([]);
const selectedImage = ref('');
const activeTab = ref('features');
const bookingDetails = ref({
  pickupDate: new Date().toISOString().split('T')[0],
  returnDate: ''
});

const tabs = [
  { id: 'features', label: 'Características' },
  { id: 'conditions', label: 'Condiciones' },
  { id: 'reviews', label: 'Opiniones' }
];

// Cargar datos del vehículo
const loadVehicleData = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    // Obtener datos del vehículo desde el backend
    const dateRange = {
      pickupDate: route.query.pickupDate || '',
      returnDate: route.query.returnDate || ''
    };
    
    const vehicleData = await vehiclesService.getVehicleDetails(vehicleId, dateRange);
    console.log('Datos del vehículo cargados:', vehicleData);
    
    // Asignar datos al estado
    car.value = vehicleData;
    
    // Si hay imágenes, seleccionar la primera como imagen principal
    if (vehicleData.images && vehicleData.images.length > 0) {
      selectedImage.value = vehicleData.images[0];
    }
    
    // Inicializar fechas de reserva si vienen en la URL
    if (route.query.pickupDate) {
      bookingDetails.value.pickupDate = route.query.pickupDate;
    }
    if (route.query.returnDate) {
      bookingDetails.value.returnDate = route.query.returnDate;
    } else {
      // Si no hay fecha de devolución, establecer una por defecto (3 días después)
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 3);
      bookingDetails.value.returnDate = returnDate.toISOString().split('T')[0];
    }
    
  } catch (err) {
    console.error('Error al cargar datos del vehículo:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const totalDays = computed(() => {
  if (!bookingDetails.value.pickupDate || !bookingDetails.value.returnDate) {
    return 0;
  }

  const pickupDate = new Date(bookingDetails.value.pickupDate);
  const returnDate = new Date(bookingDetails.value.returnDate);

  const diffTime = returnDate.getTime() - pickupDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
});

const totalPrice = computed(() => {
  if (totalDays.value === 0 || !car.value || !car.value.price) return 0;

  return (car.value.price * totalDays.value) + (15 * totalDays.value) + 25;
});

const isValidBooking = computed(() => {
  return totalDays.value > 0;
});

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
  if (!price) return '0.00';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const toggleFavorite = () => {
  car.value.isFavorite = !car.value.isFavorite;
  // Aquí se implementaría la lógica para guardar el estado de favorito en el backend
};

const proceedToCheckout = () => {
  if (!isValidBooking.value) return;

  router.push({
    path: `/client/checkout/${car.value.id}`,
    query: {
      pickupDate: bookingDetails.value.pickupDate,
      returnDate: bookingDetails.value.returnDate
    }
  });
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadVehicleData();
});
</script>
