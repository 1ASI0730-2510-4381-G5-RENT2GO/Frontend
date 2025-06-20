<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-2">
          <i class="pi pi-user"></i>
        </div>
        Información Personal
      </h2>
      <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
        <i class="pi pi-info-circle mr-1"></i>Los campos obligatorios están marcados con *
      </span>
    </div>

    <div class="mb-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
      <i class="pi pi-exclamation-circle text-blue-500 mr-2"></i>
      Complete su información personal para mejorar su experiencia. Su información está protegida según nuestra política de privacidad.
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Nombre completo <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <i class="pi pi-user"></i>
          </span>
          <input
              type="text"
              v-model="profileData.fullName"
              class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600 transition-all"
              placeholder="Ingrese su nombre completo"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Correo electrónico <span class="text-gray-400 dark:text-gray-500 text-xs">(No editable)</span>
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <i class="pi pi-envelope"></i>
          </span>
          <input
              type="email"
              v-model="profileData.email"
              disabled
              class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 cursor-not-allowed"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Teléfono <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <i class="pi pi-phone"></i>
          </span>
          <input
              type="tel"
              v-model="profileData.phone"
              class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600 transition-all"
              placeholder="+34 612 345 678"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          Dirección
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <i class="pi pi-map-marker"></i>
          </span>
          <input
              type="text"
              v-model="profileData.address"
              class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600 transition-all"
              placeholder="Calle, número, ciudad, código postal"
          />
        </div>
      </div>
    </div>

    <div v-if="user.role === 'client'" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
      <div class="flex items-center mb-4">
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <div class="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
            <i class="pi pi-id-card"></i>
          </div>
          Información de Cliente
        </h3>
        <div class="ml-auto">
          <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
            Cliente verificado
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Documento de identidad <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-id-card"></i>
            </span>
            <input
                type="text"
                v-model="profileData.dni"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="12345678X"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Número de licencia <span class="text-red-500">*</span>
            <span class="text-xs text-gray-500 dark:text-gray-500 ml-1">(Formato: L1234567)</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-id-card"></i>
            </span>
            <input
                type="text"
                v-model="profileData.driverLicense"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="L1234567"
                title="Formato: Letra seguida de 7 dígitos. Ejemplo: L1234567"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Fecha de nacimiento
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-calendar"></i>
            </span>
            <input
                type="date"
                v-model="profileData.birthDate"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Fecha de expedición <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-calendar-plus"></i>
            </span>
            <input
                type="date"
                v-model="profileData.licenseIssueDate"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="user.role === 'provider'" class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
      <div class="flex items-center mb-4">
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <div class="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-2">
            <i class="pi pi-car"></i>
          </div>
          Información de Proveedor
        </h3>
        <div class="ml-auto">
          <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
            Proveedor
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Documento de identidad <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-id-card"></i>
            </span>
            <input
                type="text"
                v-model="profileData.dni"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="12345678X"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Número de licencia <span class="text-red-500">*</span>
            <span class="text-xs text-gray-500 dark:text-gray-500 ml-1">(Formato: L1234567)</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-id-card"></i>
            </span>
            <input
                type="text"
                v-model="profileData.driverLicense"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="L1234567"
                title="Formato: Letra seguida de 7 dígitos. Ejemplo: L1234567"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Nombre de empresa
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-building"></i>
            </span>
            <input
                type="text"
                v-model="profileData.companyName"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Nombre de empresa (opcional)"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Identificación fiscal
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              <i class="pi pi-file"></i>
            </span>
            <input
                type="text"
                v-model="profileData.taxId"
                class="w-full pl-10 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="RUC o identificación fiscal"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex items-center justify-between">
      <button type="button" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        Cancelar
      </button>
      <button 
        type="submit" 
        class="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        @click="$emit('save', profileData)"
      >
        Guardar cambios
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  user: {
    type: Object,
    required: true
  },
  profileData: {
    type: Object,
    required: true
  }
});

defineEmits(['save']);
</script>
