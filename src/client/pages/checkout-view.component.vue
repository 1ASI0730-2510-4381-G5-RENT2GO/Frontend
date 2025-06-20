<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">Completar reserva</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="flex p-4 border-b border-gray-200 dark:border-gray-700">
              <img
                  :src="car.imageUrl || '/img/car-placeholder.jpg'"
                  :alt="car.model"
                  class="w-24 h-16 rounded-xl object-cover mr-4"
              >
              <div class="flex-1">
                <h2 class="font-bold text-gray-800 dark:text-gray-200">{{ car.brand }} {{ car.model }}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ car.year }} · {{ car.category }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-primary-600 dark:text-primary-400">{{ formatPrice(car.price) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">por día</p>
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 text-sm">
              <div class="flex justify-between mb-2">
                <div class="flex items-center">
                  <i class="pi pi-calendar-plus mr-2 text-primary-500"></i>
                  <span class="text-gray-700 dark:text-gray-300">Recogida:</span>
                </div>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatDate(bookingDetails.pickupDate) }}</span>
              </div>
              <div class="flex justify-between">
                <div class="flex items-center">
                  <i class="pi pi-calendar-minus mr-2 text-primary-500"></i>
                  <span class="text-gray-700 dark:text-gray-300">Devolución:</span>
                </div>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatDate(bookingDetails.returnDate) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Datos personales</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                    v-model="customerInfo.firstName"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellidos
                </label>
                <input
                    v-model="customerInfo.lastName"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                    v-model="customerInfo.email"
                    type="email"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                    v-model="customerInfo.phone"
                    type="tel"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección
              </label>
              <input
                  v-model="customerInfo.address"
                  type="text"
                  class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
              >
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ciudad
                </label>
                <input
                    v-model="customerInfo.city"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Código Postal
                </label>
                <input
                    v-model="customerInfo.zipCode"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  País
                </label>
                <select
                    v-model="customerInfo.country"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
                  <option value="ES">España</option>
                  <option value="FR">Francia</option>
                  <option value="PT">Portugal</option>
                  <option value="DE">Alemania</option>
                  <option value="IT">Italia</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Extras opcionales</h2>

            <div class="space-y-4">
              <div
                  v-for="extra in extras"
                  :key="extra.id"
                  class="p-3 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="flex items-center">
                  <input
                      :id="`extra-${extra.id}`"
                      type="checkbox"
                      v-model="selectedExtras"
                      :value="extra.id"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  >
                  <label :for="`extra-${extra.id}`" class="ml-3">
                    <span class="block font-medium text-gray-800 dark:text-gray-200">{{ extra.name }}</span>
                    <span class="block text-xs text-gray-500 dark:text-gray-400">{{ extra.description }}</span>
                  </label>
                </div>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatPrice(extra.price) }}</span>
              </div>
            </div>
          </div>

          <PaymentFormComponent
              :amount="totalPrice"
              :reservation-id="reservationId"
              @payment-complete="handlePaymentComplete"
              @payment-error="handlePaymentError"
          />
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Resumen del pedido</h2>

            <div class="space-y-3 text-sm">
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

              <!-- Extras seleccionados -->
              <template v-if="selectedExtras.length > 0">
                <div class="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span class="font-medium text-gray-700 dark:text-gray-300">Extras:</span>
                </div>

                <div
                    v-for="extraId in selectedExtras"
                    :key="extraId"
                    class="flex justify-between"
                >
                  <span class="text-gray-600 dark:text-gray-400">{{ getExtraById(extraId).name }}</span>
                  <span class="text-gray-800 dark:text-gray-200">{{ formatPrice(getExtraById(extraId).price) }}</span>
                </div>
              </template>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div class="flex justify-between font-bold text-base">
                  <span class="text-gray-800 dark:text-gray-200">Total</span>
                  <span class="text-primary-600 dark:text-primary-400">{{ formatPrice(totalPrice) }}</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">IVA incluido</p>
              </div>
            </div>

            <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
              <h3 class="font-medium text-blue-700 dark:text-blue-300 text-sm mb-1">Política de cancelación</h3>
              <p class="text-xs text-blue-600 dark:text-blue-400">
                Cancelación gratuita hasta 48 horas antes de la recogida. Después se aplicará un cargo de cancelación.
              </p>
            </div>

            <button
                @click="placeOrder"
                :disabled="!isFormValid || isProcessing"
                class="mt-6 w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              <i v-if="isProcessing" class="pi pi-spin pi-spinner mr-2"></i>
              Confirmar reserva
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
            <i class="pi pi-check-circle text-3xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            ¡Reserva confirmada!
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Tu reserva ha sido procesada correctamente. Hemos enviado la confirmación a tu email.
          </p>
        </div>

        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
          <div class="flex justify-between mb-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">Número de reserva:</span>
            <span class="font-medium text-gray-800 dark:text-gray-200">{{ reservationId }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Importe total:</span>
            <span class="font-medium text-primary-600 dark:text-primary-400">{{ formatPrice(totalPrice) }}</span>
          </div>
        </div>

        <div class="flex flex-col space-y-3">
          <button
              @click="goToReservations"
              class="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Ver mis reservas
          </button>
          <button
              @click="goToHome"
              class="w-full py-2 px-4 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PaymentFormComponent from '@/client/components/payment/payment-form.component.vue';

const router = useRouter();
const route = useRoute();

const reservationId = ref('RES-' + Math.floor(Math.random() * 10000));

const isProcessing = ref(false);
const showConfirmation = ref(false);
const paymentCompleted = ref(false);

const car = ref({
  id: route.params.id || 1,
  brand: 'Toyota',
  model: 'Corolla',
  year: 2023,
  category: 'Sedán',
  price: 45,
  imageUrl: '/img/toyota-corolla.jpg'
});

const bookingDetails = ref({
  pickupDate: route.query.pickupDate || new Date().toISOString().split('T')[0],
  returnDate: route.query.returnDate || ''
});

const customerInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  country: 'ES'
});

const extras = ref([
  {
    id: 1,
    name: 'Seguro a todo riesgo',
    description: 'Cobertura completa sin franquicia',
    price: 15,
    priceType: 'per_day'
  },
  {
    id: 2,
    name: 'GPS',
    description: 'Navegación por GPS con mapas actualizados',
    price: 8,
    priceType: 'per_day'
  },
  {
    id: 3,
    name: 'Asiento infantil',
    description: 'Para niños de 9 a 36 kg (de 9 meses a 12 años)',
    price: 10,
    priceType: 'per_day'
  },
  {
    id: 4,
    name: 'Conductor adicional',
    description: 'Añade un conductor adicional a tu reserva',
    price: 12,
    priceType: 'fixed'
  }
]);

const selectedExtras = ref([]);

const totalDays = computed(() => {
  if (!bookingDetails.value.pickupDate || !bookingDetails.value.returnDate) {
    return 1;
  }

  const pickupDate = new Date(bookingDetails.value.pickupDate);
  const returnDate = new Date(bookingDetails.value.returnDate);

  const diffTime = returnDate.getTime() - pickupDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
});

const totalPrice = computed(() => {
  let price = 0;

  price += car.value.price * totalDays.value;

  price += 15 * totalDays.value;

  price += 25;

  for (const extraId of selectedExtras.value) {
    const extra = getExtraById(extraId);
    if (extra.priceType === 'per_day') {
      price += extra.price * totalDays.value;
    } else {
      price += extra.price;
    }
  }

  return price;
});

const getExtraById = (id) => {
  return extras.value.find(extra => extra.id === id) || { name: '', price: 0 };
};

const isFormValid = computed(() => {
  return (
      customerInfo.value.firstName &&
      customerInfo.value.lastName &&
      customerInfo.value.email &&
      customerInfo.value.phone &&
      paymentCompleted.value
  );
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const handlePaymentComplete = () => {
  paymentCompleted.value = true;
};

const handlePaymentError = (error) => {
  console.error('Error de pago:', error);
  paymentCompleted.value = false;
};

const placeOrder = () => {
  if (!isFormValid.value) return;

  isProcessing.value = true;

  setTimeout(() => {
    isProcessing.value = false;
    showConfirmation.value = true;
  }, 1500);
};

const goToReservations = () => {
  router.push('/client/reservations');
};

const goToHome = () => {
  router.push('/client/home');
};

onMounted(() => {
  setTimeout(() => {
    car.value = {
      id: route.params.id,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2023,
      category: 'Sedán',
      price: 45,
      imageUrl: '/img/toyota-corolla.jpg'
    };
  }, 500);
});
</script>