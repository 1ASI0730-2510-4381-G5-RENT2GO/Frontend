<template>
  <div>
    <VehicleFormComponent
        :vehicle-id="vehicleId"
        @submit="handleFormSubmit"
        @cancel="navigateBack"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VehicleFormComponent from '../components/vehicles/vehicle-form.component.vue'

const router = useRouter()
const route = useRoute()
const vehicleId = ref(route.params.id)

function handleFormSubmit() {
  alert('Vehículo actualizado correctamente')
  router.push('/provider/vehicles')
}

function navigateBack() {
  router.push('/provider/vehicles')
}
</script>
