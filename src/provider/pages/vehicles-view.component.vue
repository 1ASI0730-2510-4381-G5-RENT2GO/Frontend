<!-- src/domains/provider/pages/VehiclesView.vue -->
<template>
  <div>
    <VehicleTableComponent
        ref="vehicleTable"
        @add-vehicle="navigateToAddVehicle"
        @edit-vehicle="navigateToEditVehicle"
        @view-vehicle="openVehicleDetailModal"
        @deactivate-vehicle="deactivateVehicle"
        @activate-vehicle="activateVehicle"
        @maintenance-vehicle="setVehicleMaintenance"
    />

    <!-- Modal de detalles del vehículo -->
    <VehicleDetailModalComponent
        v-model="showDetailModal"
        :vehicle-id="selectedVehicleId"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import VehicleTableComponent from '../components/vehicles/vehicle-table.component.vue'
import VehicleDetailModalComponent from '../components/vehicles/vehicle-detail-modal.component.vue'
import vehicleService from '../services/vehicle.service.js'

const router = useRouter()
const toast = useToast()
const vehicleTable = ref(null)
const showDetailModal = ref(false)
const selectedVehicleId = ref(null)

function navigateToAddVehicle() {
  router.push('/provider/vehicles/add')
}

function navigateToEditVehicle(vehicleId) {
  router.push(`/provider/vehicles/edit/${vehicleId}`)
}

function openVehicleDetailModal(vehicleId) {
  selectedVehicleId.value = vehicleId
  showDetailModal.value = true
}

// Función para desactivar un vehículo
async function deactivateVehicle(id) {
  try {
    await vehicleService.deactivateVehicle(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo desactivado correctamente', life: 3000 })
    // Recargar la tabla usando la referencia directa al componente
    if (vehicleTable.value) {
      await vehicleTable.value.loadVehicles()
    }
  } catch (error) {
    console.error('Error al desactivar el vehículo:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo desactivar el vehículo', life: 3000 })
  }
}

// Función para activar un vehículo
async function activateVehicle(id) {
  try {
    await vehicleService.activateVehicle(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo activado correctamente', life: 3000 })
    // Recargar la tabla usando la referencia directa al componente
    if (vehicleTable.value) {
      await vehicleTable.value.loadVehicles()
    }
  } catch (error) {
    console.error('Error al activar el vehículo:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo activar el vehículo', life: 3000 })
  }
}

// Función para poner un vehículo en mantenimiento
async function setVehicleMaintenance(id) {
  try {
    await vehicleService.setVehicleMaintenance(id)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo marcado en mantenimiento', life: 3000 })
    // Recargar la tabla usando la referencia directa al componente
    if (vehicleTable.value) {
      await vehicleTable.value.loadVehicles()
    }
  } catch (error) {
    console.error('Error al marcar el vehículo en mantenimiento:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo marcar el vehículo en mantenimiento', life: 3000 })
  }
}
</script>

