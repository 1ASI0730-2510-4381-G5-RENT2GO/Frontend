<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8">Completar reserva</h1>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
        <div class="text-6xl text-red-500 flex justify-center mb-4">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Error al cargar el vehículo</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          No se pudo cargar la información del vehículo para completar la reserva.
        </p>
        <router-link
          to="/client/search"
          class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-sm font-medium"
        >
          Volver a búsqueda
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="flex p-4 border-b border-gray-200 dark:border-gray-700">
              <img
                  :src="car.images && car.images.length > 0 ? car.images[0] : '/img/car-placeholder.jpg'"
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
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Datos personales</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Esta reserva se realizará a tu nombre como titular. La información se ha completado desde tu perfil.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="customerInfo.firstName"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                    readonly
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellidos <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="customerInfo.lastName"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                    readonly
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="customerInfo.email"
                    type="email"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                    readonly
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="customerInfo.phone"
                    type="tel"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                    :class="{'bg-gray-100 dark:bg-gray-800': customerInfo.phone}"
                    :readonly="!!customerInfo.phone"
                    placeholder="Ingresa tu número de teléfono"
                >
                <p v-if="!customerInfo.phone" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Por favor, completa tu número de teléfono para la reserva
                </p>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección de recogida <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="customerInfo.address"
                  type="text"
                  class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                  :class="{'bg-gray-100 dark:bg-gray-800': customerInfo.address}"
                  :readonly="!!customerInfo.address"
                  placeholder="Ingresa la dirección de recogida"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ciudad <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="customerInfo.city"
                    type="text"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                    :class="{'bg-gray-100 dark:bg-gray-800': customerInfo.city}"
                    :readonly="!!customerInfo.city"
                    placeholder="Ingresa tu ciudad"
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
                    :class="{'bg-gray-100 dark:bg-gray-800': customerInfo.zipCode}"
                    :readonly="!!customerInfo.zipCode"
                    placeholder="Código postal"
                >
              </div>
            </div>
            
            <div class="mt-4 text-right">
              <button 
                type="button" 
                @click="editProfile" 
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Editar perfil
              </button>
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

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Información de pago</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Total a pagar: <span class="font-medium text-primary-600">{{ formatPrice(totalPrice) }}</span>
            </p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de tarjeta <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="paymentInfo.cardNumber"
                  placeholder="1234 5678 9012 3456"
                  class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha de expiración <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="paymentInfo.expiryDate"
                    placeholder="MM/AA"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Código CVV <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="paymentInfo.cvv"
                    placeholder="123"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre en la tarjeta <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="paymentInfo.cardholderName"
                  placeholder="Juan Pérez"
                  class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
              </div>
              
              <div class="flex items-center mt-2">
                <input
                  id="saveCard"
                  type="checkbox"
                  v-model="paymentInfo.saveCard"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <label for="saveCard" class="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                  Guardar esta tarjeta para futuras reservas
                </label>
              </div>
            </div>
          </div>
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
import { vehiclesService } from '@/client/services/vehicles.service';
import { getStoredUser } from '@/auth/services/auth.service';
import { usersService } from '@/shared/services/usersService';

const router = useRouter();
const route = useRoute();

// Estado
const car = ref({});
const loading = ref(true);
const error = ref(false);
const reservationId = ref('RES-' + Math.floor(Math.random() * 10000));
const isProcessing = ref(false);
const showConfirmation = ref(false);

// Datos de la reserva
const bookingDetails = ref({
  pickupDate: route.query.pickupDate || new Date().toISOString().split('T')[0],
  returnDate: route.query.returnDate || ''
});

// Información del cliente
const customerInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: ''
});

// Información de pago
const paymentInfo = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  saveCard: false
});

// Extras disponibles
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

// Cargar los datos del vehículo seleccionado y del usuario
const loadVehicleData = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    const vehicleId = route.params.id;
    if (!vehicleId) {
      throw new Error('ID de vehículo no proporcionado');
    }
    
    // Cargar datos del vehículo desde el backend
    const dateRange = {
      pickupDate: bookingDetails.value.pickupDate,
      returnDate: bookingDetails.value.returnDate
    };
    
    const vehicleData = await vehiclesService.getVehicleDetails(vehicleId, dateRange);
    car.value = vehicleData;
    
    console.log('Datos del vehículo cargados para checkout:', vehicleData);
    
    // Cargar datos del usuario autenticado
    await loadUserData();
    
  } catch (err) {
    console.error('Error al cargar datos del vehículo para checkout:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// Cargar información del usuario logueado
const loadUserData = async () => {
  try {
    // Verificar si hay un usuario autenticado
    const currentUser = getStoredUser();
    if (!currentUser) {
      console.log('No hay usuario autenticado, redirigiendo a login');
      router.push('/login');
      return;
    }
    
    // Usar el método correcto del servicio para obtener datos del usuario
    const userProfile = await usersService.getCurrentUser();
    
    if (userProfile) {
      console.log('Datos del usuario obtenidos:', userProfile);
      
      // Pre-rellenar el formulario con los datos del usuario
      customerInfo.value = {
        firstName: userProfile.firstName || userProfile.name?.split(' ')[0] || '',
        lastName: userProfile.lastName || (userProfile.name?.split(' ').length > 1 ? userProfile.name.split(' ').slice(1).join(' ') : ''),
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        zipCode: userProfile.zipCode || ''
      };
      
      // Prellenar el nombre en la tarjeta con el nombre del usuario
      paymentInfo.value.cardholderName = `${customerInfo.value.firstName} ${customerInfo.value.lastName}`;
      
      console.log('Datos cargados en el formulario:', customerInfo.value);
    } else {
      console.warn('No se pudieron obtener los datos del perfil');
    }
  } catch (err) {
    console.error('Error al cargar datos del usuario:', err);
  }
};

// Cálculo del número total de días
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

// Cálculo del precio total
const totalPrice = computed(() => {
  if (!car.value || !car.value.price) return 0;
  
  let price = 0;

  // Precio base del vehículo por los días
  price += car.value.price * totalDays.value;

  // Seguro básico
  price += 15 * totalDays.value;

  // Tasa de servicio
  price += 25;

  // Extras seleccionados
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

// Obtener un extra por su ID
const getExtraById = (id) => {
  return extras.value.find(extra => extra.id === id) || { name: '', price: 0 };
};

// Validación del formulario
const isFormValid = computed(() => {
  return (
    customerInfo.value.firstName &&
    customerInfo.value.lastName &&
    customerInfo.value.email &&
    customerInfo.value.phone &&
    customerInfo.value.address &&
    customerInfo.value.city &&
    paymentInfo.value.cardNumber &&
    paymentInfo.value.expiryDate &&
    paymentInfo.value.cvv &&
    paymentInfo.value.cardholderName
  );
});

// Formateo de precio en soles
const formatPrice = (price) => {
  if (!price) return 'S/ 0.00';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

// Formateo de fecha
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-PE', options);
};

// Navegar a la página de edición de perfil
const editProfile = () => {
  router.push('/client/profile');
};

// Procesar la orden
const placeOrder = () => {
  if (!isFormValid.value) return;

  isProcessing.value = true;

  // Simulación de procesamiento de pago (reemplazar con llamada a API real)
  setTimeout(() => {
    isProcessing.value = false;
    showConfirmation.value = true;
  }, 1500);
};

// Navegación
const goToReservations = () => {
  router.push('/client/reservations');
};

const goToHome = () => {
  router.push('/client/home');
};

// Cargar datos al montar el componente
onMounted(() => {
  loadVehicleData();
});
</script>
