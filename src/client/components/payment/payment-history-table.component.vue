<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {{ $t('client.payment.history.title') }}
      </h2>
      <span v-if="paymentHistory.length > 0" class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('client.payment.history.transactions', { count: paymentHistory.length }) }}
      </span>
    </div>

    <div v-if="loadingPayments" class="py-12 flex justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400"></div>
    </div>

    <div v-else-if="paymentHistory.length > 0" class="w-full overflow-x-auto rounded-xl custom-scrollbar">
      <table class="min-w-max w-full border-collapse">
        <thead>
        <tr class="bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-b border-gray-200 dark:border-gray-700">
          <th class="px-4 py-3 text-left font-medium">{{ $t('client.payment.history.date') }}</th>
          <th class="px-4 py-3 text-left font-medium">{{ $t('client.payment.history.description') }}</th>
          <th class="px-4 py-3 text-left font-medium">{{ $t('client.payment.history.method') }}</th>
          <th class="px-4 py-3 text-right font-medium">{{ $t('client.payment.history.amount') }}</th>
          <th class="px-4 py-3 text-center font-medium">{{ $t('client.payment.history.status') }}</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
        <tr
            v-for="payment in paymentHistory"
            :key="payment.id"
            class="hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors"
        >
          <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
            {{ formatDate(payment.createdAt || payment.paymentDate || payment.date) }}
          </td>
          <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
            <div>
              <div class="font-medium">
                {{ getPaymentDescription(payment) }}
              </div>
              <div v-if="payment.transactionId" class="text-xs text-gray-500 dark:text-gray-400">
                ID: {{ payment.transactionId }}
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
            <div class="flex items-center">
              <i :class="getCardIcon(payment.paymentMethodType || payment.method)" class="mr-2 text-lg"></i>
              <span class="font-medium">
                •••• {{ payment.cardNumberLast4 || payment.last4 || '****' }}
              </span>
            </div>
          </td>
          <td class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
            {{ formatPrice(payment.amount) }}
          </td>
          <td class="px-4 py-3 text-center">
              <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                  :class="getStatusClass(payment.status)"
              >
                <i :class="getStatusIcon(payment.status)" class="mr-1"></i>
                {{ getStatusText(payment.status) }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="py-12 text-center">
      <div class="flex flex-col items-center space-y-3">
        <i class="pi pi-credit-card text-gray-300 dark:text-gray-600 text-5xl"></i>
        <p class="text-gray-500 dark:text-gray-400 text-lg">{{ $t('client.payment.history.empty.title') }}</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm max-w-md">
          {{ $t('client.payment.history.empty.description') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  paymentHistory: {
    type: Array,
    default: () => []
  },
  loadingPayments: {
    type: Boolean,
    default: false
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatPrice = (price) => {
  if (!price) return 'S/ 0.00';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const getPaymentDescription = (payment) => {
  // Usar la información de la reserva si está disponible
  if (payment.vehicleBrand && payment.vehicleModel) {
    return `Alquiler ${payment.vehicleBrand} ${payment.vehicleModel}`;
  }
  
  // Usar la descripción si está disponible
  if (payment.description) {
    return payment.description;
  }
  
  // Usar las notas del pago
  if (payment.notes && !payment.notes.includes('Pago procesado')) {
    return payment.notes;
  }
  
  // Descripción por defecto
  return 'Pago de reserva de vehículo';
};

const getCardIcon = (method) => {
  const icons = {
    'visa': 'pi pi-credit-card text-blue-600 dark:text-blue-400',
    'mastercard': 'pi pi-credit-card text-red-600 dark:text-red-400',
    'amex': 'pi pi-credit-card text-indigo-600 dark:text-indigo-400',
    'paypal': 'pi pi-paypal text-blue-600 dark:text-blue-400',
    'bank': 'pi pi-wallet text-green-600 dark:text-green-400',
    'bank_account': 'pi pi-wallet text-green-600 dark:text-green-400',
    'credit_card': 'pi pi-credit-card text-blue-600 dark:text-blue-400',
    'cash': 'pi pi-money-bill text-green-600 dark:text-green-400'
  };

  return icons[method] || 'pi pi-credit-card text-gray-600 dark:text-gray-400';
};

const getStatusClass = (status) => {
  const classes = {
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'refunded': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'succeeded': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
  };

  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

const getStatusText = (status) => {
  const statusLabels = {
    'completed': 'Completado',
    'pending': 'Pendiente', 
    'failed': 'Fallido',
    'refunded': 'Reembolsado',
    'succeeded': 'Completado'
  };
  
  return statusLabels[status] || t('client.payment.history.status_labels.unknown');
};

const getStatusIcon = (status) => {
  const icons = {
    'completed': 'pi pi-check-circle',
    'pending': 'pi pi-clock',
    'failed': 'pi pi-times-circle',
    'refunded': 'pi pi-replay',
    'succeeded': 'pi pi-check-circle'
  };

  return icons[status] || 'pi pi-question-circle';
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #8d99ad transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #8d99ad;
  border-radius: 9999px;
}

@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    --scrollbar-thumb: #8d99ad;
  }
}
</style>
