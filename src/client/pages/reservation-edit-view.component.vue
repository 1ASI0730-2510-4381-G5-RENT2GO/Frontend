<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div v-if="loading" class="py-10 text-center">
        <i class="pi pi-spin pi-spinner text-3xl text-primary-500"></i>
        <p class="mt-3 text-gray-600 dark:text-gray-300">Cargando datos de la reserva...</p>
      </div>

      <div v-else-if="error" class="py-10 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <i class="pi pi-exclamation-circle text-3xl text-red-500"></i>
        <p class="mt-3 text-gray-600 dark:text-gray-300">{{ error }}</p>
        <button
            @click="goBack"
            class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
        >
          Volver a mis reservas
        </button>
      </div>

      <div v-else>
        <div class="flex items-center mb-6">
          <button @click="goBack" class="mr-2 text-gray-500 hover:text-primary-600">
            <i class="pi pi-arrow-left"></i>
          </button>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Modificar reserva #{{ reservationId }}
          </h1>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <form @submit.prevent="handleSubmit">
              <!-- Datos del vehículo (no modificables) -->
              <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Vehículo seleccionado
                </h2>
                <div class="flex flex-col md:flex-row">
                  <div class="md:w-1/3 mb-4 md:mb-0">
                    <img
                        :src="reservation.vehicle?.imageUrl || '/img/vehicle-placeholder.jpg'"
                        :alt="reservation.vehicle?.brand + ' ' + reservation.vehicle?.model"
                        class="rounded-xl w-full h-40 object-cover"
                    >
                  </div>
                  <div class="md:w-2/3 md:pl-6">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {{ reservation.vehicle?.brand }} {{ reservation.vehicle?.model }}
                    </h3>
                    <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div class="flex items-center">
                        <i class="pi pi-car text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle?.category }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="pi pi-users text-primary-500 mr-2"></i>
                        <span class="text-gray-600 dark:text-gray-400">{{ reservation.vehicle?.seats }} asientos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Fechas de alquiler
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha de recogida
                    </label>
                    <input
                        type="date"
                        v-model="formData.pickupDate"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        :min="minPickupDate"
                        required
                    >
                    <p v-if="errors.pickupDate" class="mt-1 text-sm text-red-600">
                      {{ errors.pickupDate }}
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha de devolución
                    </label>
                    <input
                        type="date"
                        v-model="formData.returnDate"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        :min="minReturnDate"
                        required
                    >
                    <p v-if="errors.returnDate" class="mt-1 text-sm text-red-600">
                      {{ errors.returnDate }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Lugar de recogida y devolución
                </h2>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ubicación
                  </label>
                  <select
                      v-model="formData.location"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      required
                  >
                    <option value="">Selecciona una ubicación</option>
                    <option value="Madrid - Aeropuerto">Madrid - Aeropuerto</option>
                    <option value="Madrid - Centro">Madrid - Centro</option>
                    <option value="Barcelona - Aeropuerto">Barcelona - Aeropuerto</option>
                    <option value="Barcelona - Centro">Barcelona - Centro</option>
                    <option value="Valencia - Aeropuerto">Valencia - Aeropuerto</option>
                    <option value="Valencia - Centro">Valencia - Centro</option>
                  </select>
                  <p v-if="errors.location" class="mt-1 text-sm text-red-600">
                    {{ errors.location }}
                  </p>
                </div>
              </div>

              <div class="mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Extras y servicios adicionales
                </h2>
                <div class="space-y-3">
                  <div
                      v-for="extra in availableExtras"
                      :key="extra.id"
                      class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <div class="flex items-center">
                      <input
                          type="checkbox"
                          :id="`extra-${extra.id}`"
                          v-model="formData.extras"
                          :value="extra.id"
                          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      >
                      <label :for="`extra-${extra.id}`" class="ml-3">
                        <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ extra.name }}
                        </span>
                        <span class="block text-xs text-gray-500 dark:text-gray-400">
                          {{ extra.description }}
                        </span>
                      </label>
                    </div>
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ formatPrice(extra.price) }}
                      <span v-if="extra.priceType === 'per_day'">/día</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  Resumen de precios
                </h2>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">
                      Alquiler del vehículo ({{ rentalDays }} días)
                    </span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ formatPrice(basePrice) }}
                    </span>
                  </div>
                  <div v-if="extrasPrice > 0" class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">
                      Extras y servicios
                    </span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ formatPrice(extrasPrice) }}
                    </span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600 font-bold">
                    <span class="text-gray-800 dark:text-gray-200">
                      Total
                    </span>
                    <span class="text-gray-800 dark:text-gray-200">
                      {{ formatPrice(totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                    type="button"
                    @click="goBack"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                    :disabled="loading"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const reservationId = route.params.id;

const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const reservation = ref({});
const formData = ref({
  pickupDate: '',
  returnDate: '',
  location: '',
  extras: []
});
const errors = ref({});

const availableExtras = [
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
    description: 'Sistema de navegación integrado',
    price: 5,
    priceType: 'per_day'
  },
  {
    id: 3,
    name: 'Silla infantil',
    description: 'Para niños de 9 meses a 4 años',
    price: 8,
    priceType: 'per_day'
  },
  {
    id: 4,
    name: 'Conductor adicional',
    description: 'Añade un conductor extra a tu reserva',
    price: 10,
    priceType: 'per_day'
  }
];

const minPickupDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const minReturnDate = computed(() => {
  if (formData.value.pickupDate) {
    return formData.value.pickupDate;
  }
  return minPickupDate.value;
});

const rentalDays = computed(() => {
  if (!formData.value.pickupDate || !formData.value.returnDate) return 1;

  const start = new Date(formData.value.pickupDate);
  const end = new Date(formData.value.returnDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 1;
});

const basePrice = computed(() => {
  if (!reservation.value.vehicle) return 0;
  return reservation.value.vehiclePrice * rentalDays.value;
});

const extrasPrice = computed(() => {
  let total = 0;

  formData.value.extras.forEach(extraId => {
    const extra = availableExtras.find(e => e.id === extraId);
    if (extra) {
      if (extra.priceType === 'per_day') {
        total += extra.price * rentalDays.value;
      } else {
        total += extra.price;
      }
    }
  });

  return total;
});

const totalPrice = computed(() => {
  return basePrice.value + extrasPrice.value;
});

async function loadReservation() {
  loading.value = true;
  try {

    setTimeout(() => {

      reservation.value = {
        id: reservationId,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        bookingDate: '2023-10-15',
        pickupDate: '2023-11-20',
        returnDate: '2023-11-25',
        location: 'Madrid - Aeropuerto',
        totalPrice: 350,
        vehiclePrice: 60,
        vehicle: {
          id: 1,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2022,
          category: 'Sedán',
          licensePlate: '1234 ABC',
          seats: 5,
          transmission: 'automatic',
          fuelType: 'Híbrido',
          imageUrl: '/img/toyota-corolla.jpg'
        },
        extras: [1, 2]
      };

      formData.value = {
        pickupDate: reservation.value.pickupDate,
        returnDate: reservation.value.returnDate,
        location: reservation.value.location,
        extras: reservation.value.extras
      };

      loading.value = false;
    }, 800);
  } catch (err) {
    error.value = 'Error al cargar la reserva: ' + err.message;
    console.error(err);
    loading.value = false;
  }
}

function validateForm() {
  errors.value = {};
  let isValid = true;

  if (!formData.value.pickupDate) {
    errors.value.pickupDate = 'La fecha de recogida es obligatoria';
    isValid = false;
  }

  if (!formData.value.returnDate) {
    errors.value.returnDate = 'La fecha de devolución es obligatoria';
    isValid = false;
  } else if (formData.value.returnDate < formData.value.pickupDate) {
    errors.value.returnDate = 'La fecha de devolución debe ser posterior a la fecha de recogida';
    isValid = false;
  }

  if (!formData.value.location) {
    errors.value.location = 'La ubicación es obligatoria';
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  if (!validateForm()) return;

  saving.value = true;
  try {

    await new Promise(resolve => setTimeout(resolve, 1000));

    router.push(`/client/my-reservations/${reservationId}?updated=true`);
  } catch (err) {
    error.value = 'Error al actualizar la reserva: ' + err.message;
    console.error(err);
  } finally {
    saving.value = false;
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

function goBack() {
  router.push(`/client/my-reservations/${reservationId}`);
}

onMounted(loadReservation);
</script>