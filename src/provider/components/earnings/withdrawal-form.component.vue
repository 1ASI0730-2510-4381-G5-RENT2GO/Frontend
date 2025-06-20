<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div>
      <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Cantidad a retirar
      </label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
          <i class="pi pi-money-bill"></i>
        </span>
        <input
            id="amount"
            v-model.number="amount"
            type="number"
            min="50"
            :max="availableBalance"
            step="0.01"
            class="block w-full pl-10 pr-12 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
        />
        <div class="absolute inset-y-0 right-0 flex items-center">
          <button
              type="button"
              @click="amount = availableBalance"
              class="h-full px-3 text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400"
          >
            Máx.
          </button>
        </div>
      </div>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Mínimo S/50. Disponible: {{ formatCurrency(availableBalance) }}
      </p>
    </div>

    <div>
      <label for="paymentMethod" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Método de pago
      </label>
      <select
          id="paymentMethod"
          v-model="paymentMethod"
          class="block w-full py-2.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
      >
        <option value="bank_transfer">Transferencia bancaria</option>
        <option value="paypal">PayPal</option>
      </select>
    </div>

    <div v-if="paymentMethod === 'bank_transfer'">
      <label for="accountNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Número de cuenta bancaria
      </label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
          <i class="pi pi-credit-card"></i>
        </span>
        <input
            id="accountNumber"
            v-model="accountNumber"
            type="text"
            placeholder="BCP 191-1234567-0-99"
            class="block w-full pl-10 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
        />
      </div>
    </div>

    <div v-else-if="paymentMethod === 'paypal'">
      <label for="paypalEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Correo electrónico de PayPal
      </label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
          <i class="pi pi-envelope"></i>
        </span>
        <input
            id="paypalEmail"
            v-model="paypalEmail"
            type="email"
            placeholder="tu@email.com"
            class="block w-full pl-10 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
        />
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm">
      <i class="pi pi-info-circle mr-2"></i>
      <span>Los retiros pueden tardar hasta 3 días hábiles en procesarse. No se cobra ninguna comisión por retiros superiores a S/100.</span>
    </div>

    <div class="flex justify-end space-x-3 pt-2">
      <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Cancelar
      </button>
      <button
          type="submit"
          :disabled="!isFormValid || amount <= 0 || amount > availableBalance"
          class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Solicitar retiro
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  availableBalance: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const amount = ref(50)
const paymentMethod = ref('bank_transfer')
const accountNumber = ref('')
const paypalEmail = ref('')

const isFormValid = computed(() => {
  if (amount.value <= 0 || amount.value > props.availableBalance) {
    return false
  }

  if (paymentMethod.value === 'bank_transfer') {
    return accountNumber.value.trim() !== ''
  } else if (paymentMethod.value === 'paypal') {
    return paypalEmail.value.trim() !== '' && validateEmail(paypalEmail.value)
  }

  return false
})

function handleSubmit() {
  if (!isFormValid.value) return

  const withdrawalData = {
    amount: amount.value,
    paymentMethod: paymentMethod.value,
    accountDetails: paymentMethod.value === 'bank_transfer'
        ? { accountNumber: accountNumber.value }
        : { email: paypalEmail.value }
  }

  emit('submit', withdrawalData)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount || 0)
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}
</script>
