<template>
  <div v-if="reservation" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ t('client.home.next_reservation') }}</h2>
      <router-link to="/client/reservations" class="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
        {{ t('client.home.view_all') }}
      </router-link>
    </div>

    <div class="flex flex-col md:flex-row border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <div class="w-full md:w-1/3 bg-gray-100 dark:bg-gray-700 p-4 flex items-center justify-center">
        <i :class="getCarIcon(reservation.car)" class="text-5xl"></i>
      </div>
      <div class="w-full md:w-2/3 p-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-bold text-gray-800 dark:text-gray-200">{{ reservation.car.brand }} {{ reservation.car.model }}</h3>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <i class="pi pi-map-marker mr-1"></i>
              <span>{{ reservation.location }}</span>
            </div>
          </div>
          <div class="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs py-1 px-2 rounded">
            {{ getRentalStatus(reservation.status) }}
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center">
            <i class="pi pi-calendar mr-1"></i>
            <span>{{ t('client.home.pickup') }}: {{ formatDate(reservation.pickupDate) }}</span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-calendar-times mr-1"></i>
            <span>{{ t('client.home.return') }}: {{ formatDate(reservation.returnDate) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <span class="font-bold text-gray-800 dark:text-gray-200">
            {{ t('client.home.total') }}: {{ formatPrice(reservation.totalPrice) }}
          </span>
          <router-link
              :to="`/client/reservations/${reservation.id}`"
              class="bg-primary-600 hover:bg-primary-700 text-white py-1.5 px-4 rounded-xl text-sm font-medium"
          >
            {{ t('client.home.view_details') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  reservation: {
    type: Object,
    required: true
  }
});

const getCarIcon = (car) => {
  const brandColors = {
    'Tesla': 'text-green-500',
    'BMW': 'text-blue-500',
    'Mercedes-Benz': 'text-gray-500',
    'Audi': 'text-red-500'
  };

  const categoryIcons = {
    'sedan': 'pi pi-car',
    'hatchback': 'pi pi-car',
    'suv': 'pi pi-truck',
    'electric': 'pi pi-bolt'
  };

  const category = car.category || (car.brand === 'Tesla' ? 'electric' : 'sedan');
  const icon = categoryIcons[category] || 'pi pi-car';
  const color = brandColors[car.brand] || 'text-gray-500';

  return `${icon} ${color}`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const getRentalStatus = (status) => {
  return status ? t(`client.rental_status.${status}`) : '';
};
</script>

