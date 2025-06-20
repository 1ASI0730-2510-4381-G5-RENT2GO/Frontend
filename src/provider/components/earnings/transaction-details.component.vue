<template>
  <div class="space-y-4">
    <div class="flex items-center justify-center mb-6">
      <div :class="getStatusBgClass(transaction.status)" class="w-16 h-16 rounded-full flex items-center justify-center">
        <i :class="getTypeIcon(transaction.type)" class="text-2xl"></i>
      </div>
    </div>

    <div class="text-center mb-4">
      <div class="text-2xl font-bold" :class="{'text-green-600 dark:text-green-400': transaction.type === 'ingreso', 'text-red-600 dark:text-red-400': transaction.type === 'retiro'}">
        {{ transaction.type === 'ingreso' ? '+' : '-' }} {{ formatCurrency(transaction.amount) }}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatDate(transaction.date) }}
      </div>
    </div>

    <div class="border-t border-b border-gray-200 dark:border-gray-700 py-4 space-y-3">
      <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">ID de transacción</span>
        <span class="font-medium">{{ transaction.id }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Tipo</span>
        <span class="font-medium capitalize">{{ transaction.type }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Estado</span>
        <span :class="getStatusClass(transaction.status)" class="px-2 py-0.5 text-xs rounded-full">
          {{ getStatusLabel(transaction.status) }}
        </span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Concepto</span>
        <span class="font-medium">{{ transaction.description }}</span>
      </div>

      <div v-if="transaction.reservationId" class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Reserva</span>
        <a href="#" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Ver reserva
        </a>
      </div>

      <div v-if="transaction.vehicleId" class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">Vehículo</span>
        <a href="#" class="text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Ver vehículo
        </a>
      </div>
    </div>

    <div v-if="transaction.paymentMethod" class="pt-2">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detalles de pago</h3>
      <div class="bg-gray-50 dark:bg-gray-750 p-3 rounded-xl">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-gray-500 dark:text-gray-400">Método</span>
          <span class="font-medium capitalize">
            {{ formatPaymentMethod(transaction.paymentMethod) }}
          </span>
        </div>
        <div v-if="transaction.accountDetails" class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">Cuenta</span>
          <span class="font-medium">
            {{ maskAccountDetails(transaction.accountDetails) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-4">
      <button
          @click="$emit('close')"
          class="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount || 0)
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    processing: 'En proceso',
    completed: 'Completado',
    failed: 'Fallido',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function getStatusBgClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

function getTypeIcon(type) {
  return type === 'ingreso' ? 'pi pi-arrow-down' : 'pi pi-arrow-up'
}

function formatPaymentMethod(method) {
  const methods = {
    bank_transfer: 'Transferencia bancaria',
    paypal: 'PayPal',
    credit_card: 'Tarjeta de crédito'
  }
  return methods[method] || method
}

function maskAccountDetails(details) {
  if (!details) return ''

  if (details.accountNumber) {
    const accountNum = details.accountNumber
    if (accountNum.length > 4) {
      return '•••• ' + accountNum.slice(-4)
    }
    return accountNum
  }

  if (details.email) {
    const email = details.email
    const atIndex = email.indexOf('@')
    if (atIndex > 2) {
      const username = email.substring(0, atIndex)
      const domain = email.substring(atIndex)
      return username.substring(0, 2) + '•••' + domain
    }
    return email
  }

  return 'Información no disponible'
}
</script>

