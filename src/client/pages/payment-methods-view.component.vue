<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Tarjetas guardadas</h2>
          <button
              @click="showAddCardModal = true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <i class="pi pi-plus mr-2"></i>
            Añadir tarjeta
          </button>
        </div>

        <div v-if="loading" class="py-8 flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="paymentMethods.length > 0" class="space-y-4">
          <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center">
              <div class="w-12 h-8 mr-4 flex items-center justify-center">
                <i :class="getCardIcon(method.type)" class="text-2xl"></i>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">
                  •••• •••• •••• {{ method.last4 }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Caduca: {{ method.expMonth }}/{{ method.expYear }}
                  <span v-if="method.isDefault" class="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                    Predeterminada
                  </span>
                </p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                  v-if="!method.isDefault"
                  @click="setDefaultPaymentMethod(method.id)"
                  class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Establecer como predeterminada"
              >
                <i class="pi pi-check-circle"></i>
              </button>
              <button
                  @click="editPaymentMethod(method)"
                  class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Editar"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                  @click="confirmDeletePaymentMethod(method.id)"
                  class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  title="Eliminar"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <div class="text-8xl text-gray-300 dark:text-gray-600 flex justify-center mb-4">
            <i class="pi pi-credit-card"></i>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            No tienes ningún método de pago guardado.
          </p>
          <button
              @click="showAddCardModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <i class="pi pi-plus mr-2"></i>
            Añadir tu primera tarjeta
          </button>
        </div>
      </div>

      <PaymentHistoryTableComponent
          :payment-history="paymentHistory"
          :loading-payments="loadingPayments"
      />
    </div>

    <div v-if="showAddCardModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">
            {{ editingCard ? 'Editar tarjeta' : 'Añadir nueva tarjeta' }}
          </h3>
          <button
              @click="closeCardModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Número de tarjeta
            </label>
            <input
                v-model="cardForm.number"
                type="text"
                placeholder="1234 5678 9012 3456"
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de caducidad
              </label>
              <div class="flex space-x-2">
                <select
                    v-model="cardForm.expMonth"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
                  <option v-for="month in 12" :key="month" :value="month.toString().padStart(2, '0')">
                    {{ month.toString().padStart(2, '0') }}
                  </option>
                </select>
                <span class="flex items-center text-gray-500 dark:text-gray-400">/</span>
                <select
                    v-model="cardForm.expYear"
                    class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
                >
                  <option v-for="year in getYearOptions()" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <input
                  v-model="cardForm.cvv"
                  type="text"
                  placeholder="123"
                  class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre en la tarjeta
            </label>
            <input
                v-model="cardForm.name"
                type="text"
                placeholder="NOMBRE APELLIDO"
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
            >
          </div>

          <div class="flex items-center">
            <input
                id="set-default"
                v-model="cardForm.setDefault"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <label for="set-default" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Establecer como método de pago predeterminado
            </label>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
              @click="closeCardModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
              @click="saveCard"
              :disabled="isSaving"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <i v-if="isSaving" class="pi pi-spin pi-spinner mr-2"></i>
            {{ editingCard ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-4">
            <i class="pi pi-exclamation-triangle text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
            ¿Eliminar método de pago?
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer.
          </p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
              @click="showDeleteConfirmation = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
              @click="deletePaymentMethod"
              :disabled="isDeleting"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <i v-if="isDeleting" class="pi pi-spin pi-spinner mr-2"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PaymentHistoryTableComponent from '@/client/components/payment/payment-history-table.component.vue';

const loading = ref(true);
const loadingPayments = ref(true);
const paymentMethods = ref([]);
const paymentHistory = ref([]);
const showAddCardModal = ref(false);
const showDeleteConfirmation = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const editingCard = ref(false);
const cardToDeleteId = ref(null);

const cardForm = ref({
  id: null,
  number: '',
  expMonth: '',
  expYear: '',
  cvv: '',
  name: '',
  setDefault: false
});

const loadPaymentMethods = () => {
  loading.value = true;

  setTimeout(() => {
    paymentMethods.value = [
      {
        id: 'pm_1',
        type: 'visa',
        last4: '4242',
        expMonth: '12',
        expYear: '2025',
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'mastercard',
        last4: '5678',
        expMonth: '06',
        expYear: '2026',
        isDefault: false
      }
    ];

    loading.value = false;
  }, 1000);
};

const loadPaymentHistory = () => {
  loadingPayments.value = true;

  setTimeout(() => {
    paymentHistory.value = [
      {
        id: 'py_1',
        date: '2023-10-15T14:22:00Z',
        description: 'Alquiler Toyota Corolla',
        method: 'visa',
        last4: '4242',
        amount: 250.50,
        status: 'completed'
      },
      {
        id: 'py_2',
        date: '2023-09-05T09:45:00Z',
        description: 'Alquiler BMW Serie 3',
        method: 'mastercard',
        last4: '5678',
        amount: 320.75,
        status: 'completed'
      },
      {
        id: 'py_3',
        date: '2023-08-12T16:30:00Z',
        description: 'Alquiler Audi A4',
        method: 'visa',
        last4: '4242',
        amount: 280.00,
        status: 'refunded'
      }
    ];

    loadingPayments.value = false;
  }, 1200);
};

const getCardIcon = (type) => {
  const icons = {
    visa: 'pi pi-credit-card text-blue-500',
    mastercard: 'pi pi-credit-card text-red-500',
    amex: 'pi pi-credit-card text-purple-500',
    discover: 'pi pi-credit-card text-orange-500'
  };

  return icons[type] || 'pi pi-credit-card text-gray-500';
};

const getStatusClass = (status) => {
  const classes = {
    succeeded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getStatusText = (status) => {
  const texts = {
    succeeded: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  };

  return texts[status] || status;
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < 10; i++) {
    years.push((currentYear + i).toString());
  }

  return years;
};

const closeCardModal = () => {
  showAddCardModal.value = false;
  editingCard.value = false;
  resetCardForm();
};

const resetCardForm = () => {
  cardForm.value = {
    id: null,
    number: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    name: '',
    setDefault: false
  };
};

const editPaymentMethod = (method) => {
  editingCard.value = true;
  cardForm.value = {
    id: method.id,
    number: '•••• •••• •••• ' + method.last4,
    expMonth: method.expMonth,
    expYear: method.expYear,
    cvv: '',
    name: '',
    setDefault: method.isDefault
  };
  showAddCardModal.value = true;
};

const saveCard = () => {
  if (!cardForm.value.name) {
    alert('Por favor, introduce el nombre en la tarjeta');
    return;
  }

  isSaving.value = true;

  setTimeout(() => {
    if (editingCard.value) {
      const index = paymentMethods.value.findIndex(m => m.id === cardForm.value.id);
      if (index !== -1) {
        paymentMethods.value[index].expMonth = cardForm.value.expMonth;
        paymentMethods.value[index].expYear = cardForm.value.expYear;

        if (cardForm.value.setDefault && !paymentMethods.value[index].isDefault) {
          paymentMethods.value.forEach(m => m.isDefault = false);
          paymentMethods.value[index].isDefault = true;
        }
      }
    } else {
      const last4 = cardForm.value.number.replace(/\D/g, '').slice(-4);
      const newCard = {
        id: 'pm_' + Date.now(),
        type: 'visa',
        last4,
        expMonth: cardForm.value.expMonth,
        expYear: cardForm.value.expYear,
        isDefault: cardForm.value.setDefault
      };

      if (newCard.isDefault) {
        paymentMethods.value.forEach(m => m.isDefault = false);
      } else if (paymentMethods.value.length === 0) {
        newCard.isDefault = true;
      }

      paymentMethods.value.push(newCard);
    }

    isSaving.value = false;
    closeCardModal();
  }, 1500);
};

const confirmDeletePaymentMethod = (id) => {
  cardToDeleteId.value = id;
  showDeleteConfirmation.value = true;
};

const deletePaymentMethod = () => {
  if (!cardToDeleteId.value) return;

  isDeleting.value = true;

  setTimeout(() => {
    const index = paymentMethods.value.findIndex(m => m.id === cardToDeleteId.value);

    if (index !== -1) {
      const wasDefault = paymentMethods.value[index].isDefault;

      paymentMethods.value.splice(index, 1);

      if (wasDefault && paymentMethods.value.length > 0) {
        paymentMethods.value[0].isDefault = true;
      }
    }

    isDeleting.value = false;
    showDeleteConfirmation.value = false;
    cardToDeleteId.value = null;
  }, 1000);
};

const setDefaultPaymentMethod = (id) => {
  const index = paymentMethods.value.findIndex(m => m.id === id);

  if (index !== -1) {
    paymentMethods.value.forEach(m => m.isDefault = false);

    paymentMethods.value[index].isDefault = true;
  }
};

onMounted(() => {
  loadPaymentMethods();
  loadPaymentHistory();
});
</script>