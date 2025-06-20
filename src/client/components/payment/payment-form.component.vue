<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{{ $t('client.payment.form.title') }}</h2>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{{ $t('client.payment.form.method') }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
            v-for="method in paymentMethods"
            :key="method.id"
            @click="selectedMethod = method.id"
            :class="[
            'border rounded-xl p-3 cursor-pointer transition-colors',
            selectedMethod === method.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          <div class="flex items-center">
            <i :class="[method.icon, 'text-lg mr-2', method.iconColor]"></i>
            <span class="font-medium text-gray-800 dark:text-gray-200">{{ $t(method.translationKey) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedMethod === 'credit_card'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.payment.form.holder_name') }}
        </label>
        <input
            type="text"
            v-model="creditCard.holderName"
            :placeholder="$t('client.payment.form.holder_placeholder')"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('client.payment.form.card_number') }}
        </label>
        <div class="relative">
          <input
              type="text"
              v-model="creditCard.number"
              :placeholder="$t('client.payment.form.card_placeholder')"
              maxlength="19"
              @input="formatCardNumber"
              class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <i :class="[
              cardType ? cardTypeIcons[cardType] : 'pi pi-credit-card',
              'text-gray-400'
            ]"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $t('client.payment.form.expiry_date') }}
          </label>
          <input
              type="text"
              v-model="creditCard.expiry"
              :placeholder="$t('client.payment.form.expiry_placeholder')"
              maxlength="5"
              @input="formatExpiryDate"
              class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $t('client.payment.form.cvv') }}
          </label>
          <div class="relative">
            <input
                type="text"
                v-model="creditCard.cvv"
                :placeholder="$t('client.payment.form.cvv_placeholder')"
                maxlength="4"
                class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
            >
            <button
                type="button"
                @click="showCvvInfo = !showCvvInfo"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i class="pi pi-question-circle text-gray-400"></i>
            </button>

            <div
                v-if="showCvvInfo"
                class="absolute right-0 mt-1 z-10 bg-white dark:bg-gray-700 shadow-lg rounded-xl p-3 w-64 text-sm"
            >
              <p class="text-gray-600 dark:text-gray-300">
                {{ $t('client.payment.form.cvv_info') }}
              </p>
              <div class="mt-2 flex justify-center">
                <img src="@/assets/img/cvv-example.png" alt="CVV example" class="h-10">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center mt-2">
        <input
            type="checkbox"
            id="save-card"
            v-model="creditCard.saveForFuture"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="save-card" class="ml-2 block text-sm text-gray-600 dark:text-gray-400">
          {{ $t('client.payment.form.save_card') }}
        </label>
      </div>
    </div>

    <div v-else-if="selectedMethod === 'paypal'" class="text-center py-6">
      <img src="@/assets/img/paypal-logo.png" alt="PayPal" class="h-12 mx-auto mb-4">
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        {{ $t('client.payment.form.paypal_redirect') }}
      </p>
      <button
          @click="payWithPaypal"
          class="w-full sm:w-auto px-6 py-2 bg-[#0070ba] hover:bg-[#003087] text-white font-medium rounded-xl transition-colors"
      >
        {{ $t('client.payment.form.pay_with_paypal') }}
      </button>
    </div>

    <div v-else-if="selectedMethod === 'bank_transfer'" class="space-y-4">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
        <h3 class="font-medium text-blue-700 dark:text-blue-300 mb-2">{{ $t('client.payment.form.bank_instructions') }}</h3>
        <p class="text-sm text-blue-600 dark:text-blue-400">
          {{ $t('client.payment.form.bank_info') }}
        </p>
        <ul class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li><span class="font-medium">Banco:</span> Banco Nacional</li>
          <li><span class="font-medium">Titular:</span> Rent-a-Car S.L.</li>
          <li><span class="font-medium">IBAN:</span> ES12 3456 7890 1234 5678 9012</li>
          <li><span class="font-medium">Concepto:</span> {{ reservationId || 'Tu nombre completo' }}</li>
        </ul>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tu nombre completo
        </label>
        <input
            type="text"
            v-model="bankTransfer.name"
            placeholder="Nombre completo"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email para recibir confirmación
        </label>
        <input
            type="email"
            v-model="bankTransfer.email"
            placeholder="tu@email.com"
            class="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
        >
      </div>
    </div>

    <div class="mt-8">
      <button
          @click="processPayment"
          :disabled="isSubmitting"
          class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
      >
        <i v-if="isSubmitting" class="pi pi-spin pi-spinner mr-2"></i>
        <span>{{ paymentButtonText }}</span>
      </button>
    </div>

    <div class="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      <i class="pi pi-lock mr-2"></i>
      <span>Pago seguro y cifrado con SSL</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  reservationId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['payment-complete', 'payment-error']);

const selectedMethod = ref('credit_card');
const isSubmitting = ref(false);
const showCvvInfo = ref(false);
const cardType = ref('');

const creditCard = ref({
  holderName: '',
  number: '',
  expiry: '',
  cvv: '',
  saveForFuture: false
});

const bankTransfer = ref({
  name: '',
  email: ''
});

const paymentMethods = [
  {
    id: 'credit_card',
    translationKey: 'client.payment.form.methods.credit_card',
    icon: 'pi pi-credit-card',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'paypal',
    translationKey: 'client.payment.form.methods.paypal',
    icon: 'pi pi-paypal',
    iconColor: 'text-blue-500 dark:text-blue-300'
  },
  {
    id: 'bank_transfer',
    translationKey: 'client.payment.form.methods.bank_transfer',
    icon: 'pi pi-wallet',
    iconColor: 'text-green-600 dark:text-green-400'
  }
];

const cardTypeIcons = {
  visa: 'pi pi-credit-card text-blue-600',
  mastercard: 'pi pi-credit-card text-red-600',
  amex: 'pi pi-credit-card text-purple-600',
  discover: 'pi pi-credit-card text-orange-600',
  default: 'pi pi-credit-card'
};

const paymentButtonText = computed(() => {
  switch (selectedMethod.value) {
    case 'credit_card':
      return `Pagar ${formatAmount(props.amount)}`;
    case 'paypal':
      return `Continuar a PayPal`;
    case 'bank_transfer':
      return `Confirmar reserva`;
    default:
      return `Pagar`;
  }
});

const formatAmount = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: props.currency
  }).format(amount);
};

const formatCardNumber = () => {
  let value = creditCard.value.number.replace(/\D/g, '');

  if (/^4/.test(value)) {
    cardType.value = 'visa';
  } else if (/^5[1-5]/.test(value)) {
    cardType.value = 'mastercard';
  } else if (/^3[47]/.test(value)) {
    cardType.value = 'amex';
  } else if (/^(6011|65|64[4-9])/.test(value)) {
    cardType.value = 'discover';
  } else {
    cardType.value = '';
  }

  if (value) {
    value = value.match(/.{1,4}/g).join(' ');
  }

  creditCard.value.number = value;
};

const formatExpiryDate = () => {
  let value = creditCard.value.expiry.replace(/\D/g, '');

  if (value.length > 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }

  creditCard.value.expiry = value;
};

const payWithPaypal = () => {
  isSubmitting.value = true;

  setTimeout(() => {
    window.open('https://www.paypal.com', '_blank');
    isSubmitting.value = false;
  }, 1000);
};

const processPayment = () => {
  isSubmitting.value = true;

  let valid = true;
  let paymentData = {};

  if (selectedMethod.value === 'credit_card') {
    if (!creditCard.value.holderName ||
        !creditCard.value.number ||
        !creditCard.value.expiry ||
        !creditCard.value.cvv) {
      valid = false;
    }

    paymentData = {
      method: 'credit_card',
      data: { ...creditCard.value }
    };
  } else if (selectedMethod.value === 'bank_transfer') {
    if (!bankTransfer.value.name || !bankTransfer.value.email) {
      valid = false;
    }

    paymentData = {
      method: 'bank_transfer',
      data: { ...bankTransfer.value }
    };
  } else if (selectedMethod.value === 'paypal') {
    paymentData = {
      method: 'paypal'
    };
  }

  if (!valid) {
    isSubmitting.value = false;
    emit('payment-error', 'Por favor completa todos los campos requeridos');
    return;
  }

  setTimeout(() => {
    isSubmitting.value = false;

    emit('payment-complete', {
      success: true,
      transactionId: 'TRX-' + Math.floor(Math.random() * 1000000),
      method: selectedMethod.value,
      amount: props.amount,
      date: new Date().toISOString()
    });

  }, 2000);
};
</script>


