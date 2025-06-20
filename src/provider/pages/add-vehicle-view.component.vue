<template>
  <div>

    <VehicleFormComponent
        @submit="handleFormSubmit"
        @cancel="navigateBack"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import VehicleFormComponent from '../components/vehicles/vehicle-form.component.vue'

const router = useRouter()

function handleFormSubmit(vehicle) {
  alert('Vehículo publicado correctamente')
  router.push('/provider/vehicles')
}

function navigateBack() {
  router.push('/provider/vehicles')
}
</script>