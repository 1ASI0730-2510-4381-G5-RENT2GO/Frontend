<!-- src/domains/provider/pages/VehiclesView.vue -->
<template>
  <div>
    <VehicleTableComponent
        @add-vehicle="navigateToAddVehicle"
        @edit-vehicle="navigateToEditVehicle"
        @view-vehicle="navigateToViewVehicle"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import VehicleTableComponent from '../components/vehicles/vehicle-table.component.vue'

const router = useRouter()

function navigateToAddVehicle() {
  router.push('/provider/vehicles/add')
}

function navigateToEditVehicle(vehicleId) {
  router.push(`/provider/vehicles/edit/${vehicleId}`)
}

function navigateToViewVehicle(vehicleId) {
  router.push(`/provider/vehicles/${vehicleId}`)
}
</script>