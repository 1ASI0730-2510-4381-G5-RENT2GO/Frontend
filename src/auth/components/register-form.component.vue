<template>
  <form
      @submit.prevent="onSubmit"
      class="max-w-md w-full animate-slide-in shadow-lg px-8 py-10
         bg-white dark:bg-gray-800
         rounded-2xl border border-gray-200 dark:border-gray-700
         transition-all duration-500"
  >
    <div class="flex flex-col items-center justify-center mb-6">
      <img src="@/assets/logo.svg" alt="Logo" class="h-14 mb-3 drop-shadow-md select-none" draggable="false" />
      <h2 class="text-2xl font-extrabold text-gray-800 dark:text-white mb-2 transition-colors">
        {{ getStepTitle() }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm text-center transition-colors">
        {{ getStepSubtitle() }}
      </p>
    </div>

    <div v-if="currentStep === 0" class="space-y-6 animate-fade-in">
      <!-- Métodos OAuth -->
      <div class="space-y-3">
        <h3 class="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          {{ $t('auth.quick_register') }}
        </h3>

        <button
            type="button"
            @click="registerWithSocial('google')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 rounded-xl
              bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600
              text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600
              hover:border-red-300 dark:hover:border-red-500
              shadow-sm hover:shadow-md transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="font-medium">{{ $t('auth.continue_with_google') }}</span>
        </button>

        <button
            type="button"
            @click="registerWithSocial('facebook')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 rounded-xl
              bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600
              text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600
              hover:border-blue-300 dark:hover:border-blue-500
              shadow-sm hover:shadow-md transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span class="font-medium">{{ $t('auth.continue_with_facebook') }}</span>
        </button>

        <button
            type="button"
            @click="registerWithSocial('twitter')"
            :disabled="loading"
            class="w-full flex items-center justify-center px-4 py-3 rounded-xl
              bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600
              text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600
              hover:border-blue-300 dark:hover:border-blue-400
              shadow-sm hover:shadow-md transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          <span class="font-medium">{{ $t('auth.continue_with_twitter') }}</span>
        </button>
      </div>

      <div class="flex items-center my-6">
        <div class="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
        <span class="px-4 text-sm text-gray-400 dark:text-gray-500">{{ $t('auth.or_register_with_email') }}</span>
        <div class="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <button
          type="button"
          @click="currentStep = 1"
          class="w-full px-4 py-3 text-sm font-medium
            bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
            border border-gray-200 dark:border-gray-600 rounded-xl
            hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <i class="pi pi-envelope mr-2"></i>
        {{ $t('auth.register_with_email') }}
      </button>

      <p class="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
        {{ $t('auth.have_account') }}
        <router-link to="/login" class="font-medium text-primary-600 dark:text-primary-400 hover:underline">
          {{ $t('auth.login') }}
        </router-link>
      </p>
    </div>

    <div v-if="currentStep === 'oauth-role'" class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-center mb-6">
        <div class="relative">
          <img
              :src="oauthUserData?.picture || '/default-avatar.png'"
              :alt="oauthUserData?.name"
              class="w-16 h-16 rounded-full border-2 border-primary-200 dark:border-primary-700"
          />
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <i class="pi pi-check text-white text-xs"></i>
          </div>
        </div>
      </div>

      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ $t('auth.welcome_oauth', { name: oauthUserData?.name?.split(' ')[0] || 'Usuario' }) }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ oauthUserData?.email }}
        </p>
      </div>

      <div class="space-y-4">
        <h4 class="text-center text-base font-medium text-gray-700 dark:text-gray-300">
          {{ $t('auth.select_account_type') }}
        </h4>

        <div class="grid grid-cols-1 gap-3">
          <div
              @click="selectRole('client')"
              class="cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center"
              :class="userData.role === 'client'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'"
          >
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
              <i class="pi pi-user text-lg text-primary-500 dark:text-primary-400"></i>
            </div>
            <div class="flex-1">
              <h5 class="font-semibold text-gray-800 dark:text-white">{{ $t('auth.role_client') }}</h5>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('auth.client_description') }}</p>
            </div>
            <div v-if="userData.role === 'client'" class="text-primary-500">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
          </div>

          <div
              @click="selectRole('provider')"
              class="cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex items-center"
              :class="userData.role === 'provider'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'"
          >
            <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4">
              <i class="pi pi-car text-lg text-primary-500 dark:text-primary-400"></i>
            </div>
            <div class="flex-1">
              <h5 class="font-semibold text-gray-800 dark:text-white">{{ $t('auth.role_provider') }}</h5>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('auth.provider_description_person') }}</p>
            </div>
            <div v-if="userData.role === 'provider'" class="text-primary-500">
              <i class="pi pi-check-circle text-xl"></i>
            </div>
          </div>
        </div>

        <p v-if="validationErrors.role && fieldTouched.role" class="mt-2 text-xs text-center text-red-500 dark:text-red-400">
          {{ validationErrors.role }}
        </p>
      </div>

      <div v-if="userData.role" class="space-y-4 animate-fade-in">
        <!-- Campos para Cliente OAuth -->
        <template v-if="userData.role === 'client'">
          <h4 class="text-center font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ $t('auth.complete_client_data') }}
          </h4>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-id-card"></i>
              </div>
              <input
                  v-model="clientData.dni"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.dni && fieldTouched.dni}"
                  :placeholder="$t('auth.dni_placeholder')"
                  @blur="validateField('dni'); fieldTouched.dni = true"
                  required
              />
            </div>
            <p v-if="validationErrors.dni && fieldTouched.dni" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.dni }}
            </p>
          </div>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-phone"></i>
              </div>
              <input
                  v-model="clientData.phone"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.clientPhone && fieldTouched.clientPhone}"
                  :placeholder="$t('auth.phone_placeholder')"
                  @blur="validateField('clientPhone'); fieldTouched.clientPhone = true"
                  required
              />
            </div>
            <p v-if="validationErrors.clientPhone && fieldTouched.clientPhone" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.clientPhone }}
            </p>
          </div>
        </template>

        <template v-if="userData.role === 'provider'">
          <h4 class="text-center font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ $t('auth.complete_provider_data') }}
          </h4>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-id-card"></i>
              </div>
              <input
                  v-model="providerData.dni"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.providerDni && fieldTouched.providerDni}"
                  :placeholder="$t('auth.dni_placeholder')"
                  @blur="validateField('providerDni'); fieldTouched.providerDni = true"
                  required
              />
            </div>
            <p v-if="validationErrors.providerDni && fieldTouched.providerDni" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.providerDni }}
            </p>
          </div>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-phone"></i>
              </div>
              <input
                  v-model="providerData.phone"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.providerPhone && fieldTouched.providerPhone}"
                  :placeholder="$t('auth.phone_placeholder')"
                  @blur="validateField('providerPhone'); fieldTouched.providerPhone = true"
                  required
              />
            </div>
            <p v-if="validationErrors.providerPhone && fieldTouched.providerPhone" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.providerPhone }}
            </p>
          </div>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-credit-card"></i>
              </div>
              <input
                  v-model="providerData.driverLicense"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.driverLicense && fieldTouched.driverLicense}"
                  :placeholder="$t('auth.driver_license_placeholder')"
                  @blur="validateField('driverLicense'); fieldTouched.driverLicense = true"
                  required
              />
            </div>
            <p v-if="validationErrors.driverLicense && fieldTouched.driverLicense" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.driverLicense }}
            </p>
          </div>
        </template>
      </div>

      <button
          type="button"
          @click="completeOAuthRegistration"
          :disabled="loading || !isOAuthStepValid"
          class="w-full mt-6 px-4 py-3 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="!loading" class="flex items-center justify-center">
          <i class="pi pi-check mr-2"></i>
          {{ $t('auth.complete_registration') }}
        </span>
        <span v-else class="flex items-center justify-center">
          <i class="pi pi-spin pi-spinner mr-2"></i>
          {{ $t('auth.loading') }}
        </span>
      </button>
    </div>

    <div v-if="currentStep >= 1 && typeof currentStep === 'number'" class="flex justify-center mb-6">
      <div class="flex items-center">
        <div class="flex items-center justify-center w-8 h-8 rounded-full"
             :class="currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'">
          1
        </div>
        <div class="w-12 h-1" :class="currentStep >= 2 ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'"></div>
        <div class="flex items-center justify-center w-8 h-8 rounded-full"
             :class="currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'">
          2
        </div>
      </div>
    </div>

    <div v-if="currentStep === 1" class="space-y-4 mb-6 animate-fade-in">
      <h3 class="text-center text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {{ $t('auth.select_account_type') }}
      </h3>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div
            @click="selectRole('client')"
            class="cursor-pointer p-4 rounded-xl border transition-all duration-300 flex flex-col items-center"
            :class="userData.role === 'client'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'"
        >
          <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
            <i class="pi pi-user text-xl text-primary-500 dark:text-primary-400"></i>
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-white mb-1 text-center">{{ $t('auth.role_client') }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">{{ $t('auth.client_description') }}</p>
        </div>

        <div
            @click="selectRole('provider')"
            class="cursor-pointer p-4 rounded-xl border transition-all duration-300 flex flex-col items-center"
            :class="userData.role === 'provider'
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'"
        >
          <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
            <i class="pi pi-car text-xl text-primary-500 dark:text-primary-400"></i>
          </div>
          <h4 class="font-semibold text-gray-800 dark:text-white mb-1 text-center">{{ $t('auth.role_provider') }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center">{{ $t('auth.provider_description_person') }}</p>
        </div>
      </div>

      <p v-if="validationErrors.role && fieldTouched.role" class="mt-2 text-xs text-center text-red-500 dark:text-red-400">
        {{ validationErrors.role }}
      </p>

      <div v-if="userData.role" class="space-y-4 animate-fade-in">
        <template v-if="userData.role === 'client'">
          <h4 class="text-center font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ $t('auth.client_details') }}
          </h4>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-id-card"></i>
              </div>
              <input
                  v-model="clientData.dni"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.dni && fieldTouched.dni}"
                  :placeholder="$t('auth.dni_placeholder')"
                  @blur="validateField('dni'); fieldTouched.dni = true"
                  required
              />
            </div>
            <p v-if="validationErrors.dni && fieldTouched.dni" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.dni }}
            </p>
          </div>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-phone"></i>
              </div>
              <input
                  v-model="clientData.phone"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.clientPhone && fieldTouched.clientPhone}"
                  :placeholder="$t('auth.phone_placeholder')"
                  @blur="validateField('clientPhone'); fieldTouched.clientPhone = true"
                  required
              />
            </div>
            <p v-if="validationErrors.clientPhone && fieldTouched.clientPhone" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.clientPhone }}
            </p>
          </div>
        </template>

        <template v-if="userData.role === 'provider'">
          <h4 class="text-center font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ $t('auth.provider_details_person') }}
          </h4>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-id-card"></i>
              </div>
              <input
                  v-model="providerData.dni"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.providerDni && fieldTouched.providerDni}"
                  :placeholder="$t('auth.dni_placeholder')"
                  @blur="validateField('providerDni'); fieldTouched.providerDni = true"
                  required
              />
            </div>
            <p v-if="validationErrors.providerDni && fieldTouched.providerDni" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.providerDni }}
            </p>
          </div>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-phone"></i>
              </div>
              <input
                  v-model="providerData.phone"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.providerPhone && fieldTouched.providerPhone}"
                  :placeholder="$t('auth.phone_placeholder')"
                  @blur="validateField('providerPhone'); fieldTouched.providerPhone = true"
                  required
              />
            </div>
            <p v-if="validationErrors.providerPhone && fieldTouched.providerPhone" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.providerPhone }}
            </p>
          </div>

          <div class="relative">
            <div class="relative">
              <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
                <i class="pi pi-credit-card"></i>
              </div>
              <input
                  v-model="providerData.driverLicense"
                  type="text"
                  class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
            focus:border-primary-500 dark:focus:border-primary-600
            outline-none transition-colors duration-300
            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  :class="{'border-red-500 dark:border-red-400': validationErrors.driverLicense && fieldTouched.driverLicense}"
                  :placeholder="$t('auth.driver_license_placeholder')"
                  @blur="validateField('driverLicense'); fieldTouched.driverLicense = true"
                  required
              />
            </div>
            <p v-if="validationErrors.driverLicense && fieldTouched.driverLicense" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ validationErrors.driverLicense }}
            </p>
          </div>
        </template>
      </div>
    </div>

    <div v-if="currentStep === 2" class="space-y-4 mb-6 animate-fade-in">
      <h3 class="text-center text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {{ $t('auth.account_access_data') }}
      </h3>

      <div class="relative">
        <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
          <i class="pi pi-user"></i>
        </div>
        <input
            v-model="userData.name"
            type="text"
            class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
                focus:border-primary-500 dark:focus:border-primary-600
                outline-none transition-colors duration-300
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :class="{'border-red-500 dark:border-red-400': validationErrors.name && fieldTouched.name}"
            :placeholder="$t('auth.name_placeholder')"
            @blur="validateField('name'); fieldTouched.name = true"
            required
        />
        <p v-if="validationErrors.name && fieldTouched.name" class="mt-1 text-xs text-red-500 dark:text-red-400">
          {{ validationErrors.name }}
        </p>
      </div>

      <div class="relative">
        <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
          <i class="pi pi-envelope"></i>
        </div>
        <input
            v-model="userData.email"
            type="email"
            class="w-full rounded-xl px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
                focus:border-primary-500 dark:focus:border-primary-600
                outline-none transition-colors duration-300
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :class="{'border-red-500 dark:border-red-400': validationErrors.email && fieldTouched.email}"
            :placeholder="$t('auth.email_placeholder')"
            @blur="validateField('email'); fieldTouched.email = true"
            required
        />
        <p v-if="validationErrors.email && fieldTouched.email" class="mt-1 text-xs text-red-500 dark:text-red-400">
          {{ validationErrors.email }}
        </p>
      </div>

      <div class="relative">
        <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
          <i class="pi pi-lock"></i>
        </div>
        <input
            v-model="userData.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded-xl px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
                focus:border-primary-500 dark:focus:border-primary-600
                outline-none transition-colors duration-300
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :class="{'border-red-500 dark:border-red-400': validationErrors.password && fieldTouched.password}"
            :placeholder="$t('auth.password_placeholder')"
            @input="validateField('password'); fieldTouched.password = true"
            required
        />
        <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-[50%] -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </button>
        <p v-if="validationErrors.password && fieldTouched.password" class="mt-1 text-xs text-red-500 dark:text-red-400">
          {{ validationErrors.password }}
        </p>
      </div>

      <div class="relative">
        <div class="absolute left-4 top-[50%] -translate-y-1/2 text-gray-500 dark:text-gray-400 flex items-center justify-center h-5 w-5">
          <i class="pi pi-lock"></i>
        </div>
        <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="w-full rounded-xl px-4 py-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600
                focus:border-primary-500 dark:focus:border-primary-600
                outline-none transition-colors duration-300
                placeholder:text-gray-400 dark:placeholder:text-gray-500"
            :class="{'border-red-500 dark:border-red-400': validationErrors.confirmPassword && fieldTouched.confirmPassword}"
            :placeholder="$t('auth.confirm_password_placeholder')"
            @input="validateField('confirmPassword'); fieldTouched.confirmPassword = true"
            required
        />
        <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-[50%] -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </button>
        <p v-if="validationErrors.confirmPassword && fieldTouched.confirmPassword" class="mt-1 text-xs text-red-500 dark:text-red-400">
          {{ validationErrors.confirmPassword }}
        </p>
      </div>

      <div class="flex items-center mt-6">
        <input
            v-model="acceptTerms"
            id="acceptTerms"
            type="checkbox"
            class="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:border-gray-600"
            :class="{'border-red-500 dark:border-red-400': validationErrors.terms && fieldTouched.terms}"
            @change="validateField('terms'); fieldTouched.terms = true"
            required
        />
        <label for="acceptTerms" class="ml-2 text-sm text-gray-600 dark:text-gray-300">
          {{ $t('auth.accept_terms') }}
        </label>
      </div>
      <p v-if="validationErrors.terms && fieldTouched.terms" class="mt-1 text-xs text-red-500 dark:text-red-400">
        {{ validationErrors.terms }}
      </p>
    </div>

    <div v-if="typeof currentStep === 'number'" class="flex justify-between">
      <button
          type="button"
          @click="prevStep"
          class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          v-if="currentStep > 0"
      >
        {{ currentStep === 1 ? $t('auth.back_to_methods') : $t('auth.prev_step') }}
      </button>
      <div v-else></div>
      <button
          type="button"
          @click="nextStep"
          :disabled="!isStepValid"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          v-if="currentStep === 1"
      >
        {{ $t('auth.next_step') }}
      </button>
    </div>

    <button
        v-if="currentStep === 2"
        type="submit"
        class="w-full mt-6 px-4 py-3 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="loading || !isFormValid"
    >
      <span v-if="!loading" class="flex items-center justify-center">
        {{ $t('auth.register_button') }}
      </span>
      <span v-else class="flex items-center justify-center">
        <i class="pi pi-spin pi-spinner mr-2"></i>
        {{ $t('auth.loading') }}
      </span>
    </button>

    <transition name="fade-slide" mode="out-in">
      <div
          v-if="error"
          key="error"
          class="mt-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 font-medium rounded-xl py-3 px-4 flex items-center"
      >
        <i class="pi pi-exclamation-circle mr-2"></i>
        {{ error }}
      </div>
    </transition>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import { register, registerWithProvider, checkEmailExists } from "../services/auth.service.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const { t } = useI18n();
const toast = useToast();

const currentStep = ref(0); // 0: métodos, 1: rol manual, 2: datos manual, 'oauth-role': rol OAuth
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPassword = ref("");
const acceptTerms = ref(false);
const error = ref("");
const loading = ref(false);

const isOAuthFlow = ref(false);
const oauthUserData = ref(null);

const userData = ref({
  name: "",
  email: "",
  password: "",
  role: ""
});

const clientData = ref({
  dni: "",
  phone: "",
  city: "",
  country: "Perú"
});

const providerData = ref({
  dni: "",
  phone: "",
  driverLicense: "",
  city: "",
  country: "Perú"
});

const fieldTouched = ref({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
  role: false,
  dni: false,
  clientPhone: false,
  providerPhone: false,
  providerDni: false,
  driverLicense: false,
  terms: false
});

const validationErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  dni: '',
  clientPhone: '',
  providerPhone: '',
  providerDni: '',
  driverLicense: '',
  terms: ''
});

const registerWithSocial = async (provider) => {
  try {
    loading.value = true;
    error.value = "";

    const response = await registerWithProvider(provider);

    if (response.needsRoleSelection) {
      oauthUserData.value = response.userData;
      isOAuthFlow.value = true;
      currentStep.value = 'oauth-role';

      userData.value.name = response.userData.name;
      userData.value.email = response.userData.email;
    } else {
      toast.add({
        severity: 'success',
        summary: t('auth.success'),
        detail: t('auth.login_success'),
        life: 3000
      });

      router.push('/dashboard');
    }
  } catch (err) {
    console.error('OAuth Error:', err);
    error.value = err.message || t('auth.oauth_error');
  } finally {
    loading.value = false;
  }
};

const completeOAuthRegistration = async () => {
  try {
    loading.value = true;
    error.value = "";

    if (!isOAuthStepValid.value) {
      error.value = t('auth.complete_required_fields');
      return;
    }

    const registrationData = {
      name: userData.value.name,
      email: userData.value.email,
      role: userData.value.role,
      oauthProvider: oauthUserData.value.provider,
      oauthId: oauthUserData.value.providerId,
      accessToken: oauthUserData.value.accessToken,
      refreshToken: oauthUserData.value.refreshToken,
      profilePicture: oauthUserData.value.picture,

      roleSpecificData: userData.value.role === 'client' ? {
        dni: clientData.value.dni,
        phone: clientData.value.phone,
        city: clientData.value.city,
        country: clientData.value.country
      } : {
        dni: providerData.value.dni,
        phone: providerData.value.phone,
        driverLicense: providerData.value.driverLicense,
        city: providerData.value.city,
        country: providerData.value.country
      }
    };

    const response = await register(registrationData, true); // true = isOAuth

    toast.add({
      severity: 'success',
      summary: t('auth.success'),
      detail: t('auth.registration_success'),
      life: 3000
    });

    router.push('/dashboard');

  } catch (err) {
    console.error('OAuth Registration Error:', err);
    error.value = err.message || t('auth.registration_error');
  } finally {
    loading.value = false;
  }
};

const getStepTitle = () => {
  switch (currentStep.value) {
    case 0:
      return t('auth.how_to_register');
    case 'oauth-role':
      return t('auth.complete_registration');
    case 1:
      return t('auth.register_title');
    case 2:
      return t('auth.account_access_data');
    default:
      return t('auth.register_title');
  }
};

const getStepSubtitle = () => {
  switch (currentStep.value) {
    case 0:
      return t('auth.choose_registration_method');
    case 'oauth-role':
      return t('auth.select_account_type_oauth');
    case 1:
      return t('auth.register_subtitle');
    case 2:
      return t('auth.access_data_subtitle');
    default:
      return t('auth.register_subtitle');
  }
};

const validateField = (field) => {
  switch (field) {
    case 'name':
      if (!userData.value.name) {
        validationErrors.value.name = t('auth.name_required');
      } else if (userData.value.name.length < 3) {
        validationErrors.value.name = t('auth.name_too_short');
      } else {
        validationErrors.value.name = '';
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!userData.value.email) {
        validationErrors.value.email = t('auth.email_required');
      } else if (!emailRegex.test(userData.value.email)) {
        validationErrors.value.email = t('auth.email_invalid');
      } else {
        validationErrors.value.email = '';
      }
      break;

    case 'password':
      if (!userData.value.password) {
        validationErrors.value.password = t('auth.password_required');
      } else if (userData.value.password.length < 8) {
        validationErrors.value.password = t('auth.password_requirement');
      } else {
        validationErrors.value.password = '';
      }
      validateField('confirmPassword');
      break;

    case 'confirmPassword':
      if (userData.value.password && !confirmPassword.value) {
        validationErrors.value.confirmPassword = t('auth.confirm_password_required');
      } else if (userData.value.password !== confirmPassword.value) {
        validationErrors.value.confirmPassword = t('auth.passwords_dont_match');
      } else {
        validationErrors.value.confirmPassword = '';
      }
      break;

    case 'role':
      if (!userData.value.role) {
        validationErrors.value.role = t('auth.role_required');
      } else {
        validationErrors.value.role = '';
      }
      break;

    case 'dni':
      const dniRegex = /^[0-9]{8}$/;
      if (!clientData.value.dni) {
        validationErrors.value.dni = t('auth.dni_required');
      } else if (!dniRegex.test(clientData.value.dni)) {
        validationErrors.value.dni = t('auth.dni_invalid');
      } else {
        validationErrors.value.dni = '';
      }
      break;

    case 'clientPhone':
      const clientPhoneRegex = /^9[0-9]{8}$/;
      if (!clientData.value.phone) {
        validationErrors.value.clientPhone = t('auth.phone_required');
      } else if (!clientPhoneRegex.test(clientData.value.phone)) {
        validationErrors.value.clientPhone = t('auth.phone_invalid');
      } else {
        validationErrors.value.clientPhone = '';
      }
      break;

    case 'providerDni':
      const providerDniRegex = /^[0-9]{8}$/;
      if (!providerData.value.dni) {
        validationErrors.value.providerDni = t('auth.dni_required');
      } else if (!providerDniRegex.test(providerData.value.dni)) {
        validationErrors.value.providerDni = t('auth.dni_invalid');
      } else {
        validationErrors.value.providerDni = '';
      }
      break;

    case 'driverLicense':
      if (!providerData.value.driverLicense) {
        validationErrors.value.driverLicense = t('auth.driver_license_required');
      } else if (providerData.value.driverLicense.length < 8) {
        validationErrors.value.driverLicense = t('auth.driver_license_invalid');
      } else {
        validationErrors.value.driverLicense = '';
      }
      break;

    case 'providerPhone':
      const providerPhoneRegex = /^9[0-9]{8}$/;
      if (!providerData.value.phone) {
        validationErrors.value.providerPhone = t('auth.phone_required');
      } else if (!providerPhoneRegex.test(providerData.value.phone)) {
        validationErrors.value.providerPhone = t('auth.phone_invalid');
      } else {
        validationErrors.value.providerPhone = '';
      }
      break;

    case 'terms':
      if (!acceptTerms.value) {
        validationErrors.value.terms = t('auth.terms_error');
      } else {
        validationErrors.value.terms = '';
      }
      break;
  }
};

// ✅ VALIDACIONES ACTUALIZADAS
const isStepValid = computed(() => {
  if (currentStep.value === 1) {
    if (!userData.value.role) return false;

    if (userData.value.role === 'client') {
      return !validationErrors.value.dni &&
          !validationErrors.value.clientPhone &&
          clientData.value.dni &&
          clientData.value.phone;
    } else if (userData.value.role === 'provider') {
      return !validationErrors.value.providerDni &&
          !validationErrors.value.providerPhone &&
          !validationErrors.value.driverLicense &&
          providerData.value.dni &&
          providerData.value.phone &&
          providerData.value.driverLicense;
    }
  } else if (currentStep.value === 2) {
    return !validationErrors.value.name &&
        !validationErrors.value.email &&
        !validationErrors.value.password &&
        !validationErrors.value.confirmPassword &&
        userData.value.name &&
        userData.value.email &&
        userData.value.password &&
        confirmPassword.value &&
        acceptTerms.value;
  }
  return false;
});

const isOAuthStepValid = computed(() => {
  if (currentStep.value !== 'oauth-role') return false;
  if (!userData.value.role) return false;

  if (userData.value.role === 'client') {
    return !validationErrors.value.dni &&
        !validationErrors.value.clientPhone &&
        clientData.value.dni &&
        clientData.value.phone;
  } else if (userData.value.role === 'provider') {
    return !validationErrors.value.providerDni &&
        !validationErrors.value.providerPhone &&
        !validationErrors.value.driverLicense &&
        providerData.value.dni &&
        providerData.value.phone &&
        providerData.value.driverLicense;
  }
  return false;
});

const isFormValid = computed(() => {
  if (currentStep.value !== 2) return false;

  return !validationErrors.value.name &&
      !validationErrors.value.email &&
      !validationErrors.value.password &&
      !validationErrors.value.confirmPassword &&
      userData.value.name &&
      userData.value.email &&
      userData.value.password &&
      confirmPassword.value &&
      acceptTerms.value;
});

const selectRole = (role) => {
  userData.value.role = role;
  fieldTouched.value.role = true;
  validateField('role');
};

const nextStep = () => {
  validateCurrentStep();
  if (isStepValid.value && currentStep.value < 2) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value === 1) {
    currentStep.value = 0; // Volver a métodos
    resetForm();
  } else if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const resetForm = () => {
  userData.value = { name: "", email: "", password: "", role: "" };
  clientData.value = { dni: "", phone: "", city: "", country: "Perú" };
  providerData.value = { dni: "", phone: "", driverLicense: "", city: "", country: "Perú" };
  confirmPassword.value = "";
  acceptTerms.value = false;
  error.value = "";

  Object.keys(fieldTouched.value).forEach(key => {
    fieldTouched.value[key] = false;
  });
  Object.keys(validationErrors.value).forEach(key => {
    validationErrors.value[key] = '';
  });
};

const validateCurrentStep = () => {
  if (currentStep.value === 1) {
    validateField('role');
    if (userData.value.role === 'client') {
      validateField('dni');
      validateField('clientPhone');
    } else if (userData.value.role === 'provider') {
      validateField('providerDni');
      validateField('providerPhone');
      validateField('driverLicense');
    }
  } else if (currentStep.value === 2) {
    validateField('name');
    validateField('email');
    validateField('password');
    validateField('confirmPassword');
    validateField('terms');
  }
};

const onSubmit = async () => {
  try {
    loading.value = true;
    error.value = "";

    validateCurrentStep();

    if (!isFormValid.value) {
      error.value = t('auth.complete_required_fields');
      return;
    }

    const registrationData = {
      name: userData.value.name,
      email: userData.value.email,
      password: userData.value.password,
      confirmPassword: confirmPassword.value, // Añadir confirmPassword
      role: userData.value.role,
    };

    if (userData.value.role === 'client') {
      registrationData.dni = clientData.value.dni;
      registrationData.phone = clientData.value.phone;
    } else if (userData.value.role === 'provider') {
      registrationData.dni = providerData.value.dni;
      registrationData.phone = providerData.value.phone;
      registrationData.driverLicense = providerData.value.driverLicense;
    }

    const response = await register(registrationData, false); // false = no OAuth

    toast.add({
      severity: 'success',
      summary: t('auth.success'),
      detail: t('auth.registration_success'),
      life: 3000
    });

    router.push({
      name: 'VerifyCode',
      query: { email: encodeURIComponent(userData.value.email) }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    error.value = err.message || t('auth.registration_error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-in {
  animation: slideIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

