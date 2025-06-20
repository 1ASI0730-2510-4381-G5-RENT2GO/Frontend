<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div class="relative">
        <img
            :src="selectedImage || car.imageUrl || '/img/car-placeholder.jpg'"
            :alt="car.model"
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
            class="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <i :class="[
            car.isFavorite ? 'pi pi-heart-fill text-red-500' : 'pi pi-heart text-gray-600 dark:text-gray-300',
            'text-xl'
          ]"></i>
        </button>

        <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
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

            <div>
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Características adicionales</h3>
              <ul class="grid grid-cols-2 gap-x-4 gap-y-2">
                <li v-for="feature in car.features" :key="feature" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <i class="pi pi-check text-green-500 mr-2"></i>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div>
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
              <button
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors"
              >
                Filtrar valoraciones
              </button>
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

                <div v-if="review.images && review.images.length" class="mt-3 flex space-x-2">
                  <img
                      v-for="(image, index) in review.images"
                      :key="index"
                      :src="image"
                      class="w-16 h-16 rounded-xl object-cover cursor-pointer"
                  >
                </div>
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
import { useRouter } from 'vue-router';

const router = useRouter();

const car = ref({
  id: 1,
  brand: 'Toyota',
  model: 'Corolla',
  year: 2025,
  category: 'Sedán',
  price: 45,
  imageUrl: '/img/toyota-corolla.jpg',
  images: [
    '/img/toyota-corolla.jpg',
    '/img/toyota-corolla-interior.jpg',
    '/img/toyota-corolla-back.jpg'
  ],
  status: 'available',
  rating: 4.7,
  reviewCount: 127,
  seats: 5,
  luggage: 3,
  transmission: 'automatic',
  fuelType: 'Híbrido',
  isFavorite: false,
  features: [
    'Aire acondicionado',
    'Bluetooth',
    'Cámara trasera',
    'Control de crucero',
    'Navegación GPS',
    'Asientos eléctricos',
    'Sensor de aparcamiento',
    'USB'
  ],
  description: 'El Toyota Corolla es un sedán compacto espacioso y eficiente, ideal para viajes en ciudad y carretera. Con su sistema híbrido, ofrece bajo consumo de combustible sin sacrificar rendimiento. Interior cómodo con tecnología moderna para una experiencia de conducción superior.'
});

const reviews = ref([
  {
    id: 1,
    user: {
      name: 'Carlos Martínez',
      avatar: '/img/user-avatar-1.jpg'
    },
    rating: 5,
    date: '2025-08-15',
    comment: 'Excelente vehículo, muy económico en consumo y cómodo para viajes largos. La recogida y entrega fueron rápidas y sin problemas. Lo recomiendo totalmente.',
    images: ['/img/user-review-1.jpg', '/img/user-review-2.jpg']
  },
  {
    id: 2,
    user: {
      name: 'Laura Sánchez',
      avatar: '/img/user-avatar-2.jpg'
    },
    rating: 4,
    date: '2025-07-22',
    comment: 'Muy buen coche, limpio y en perfectas condiciones. El único problema fue un pequeño retraso en la entrega, pero por lo demás todo perfecto.',
    images: []
  }
]);

const selectedImage = ref(car.value.imageUrl);
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
  if (totalDays.value === 0) return 0;

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

onMounted(() => {
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 3);
  bookingDetails.value.returnDate = returnDate.toISOString().split('T')[0];
});
</script>

