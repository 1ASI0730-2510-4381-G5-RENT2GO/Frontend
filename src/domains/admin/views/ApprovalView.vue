<template>
  <div class="p-6 space-y-8">
    <ApprovalList
        :vehiculos="vehiculos"
        @aprobar="aprobarVehiculo"
        @rechazar="rechazarVehiculo"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ApprovalList from '../components/ApprovalList.component.vue'
import {fetchPendingApprovals} from "@/domains/admin/api/approvalsApi.js";

const vehiculos = ref([])

onMounted(async () => {
  vehiculos.value = await fetchPendingApprovals()
})

const aprobarVehiculo = async (id) => {
  // await aprobarVehiculoApi(id)
  // Refrescar lista
}

const rechazarVehiculo = async (id) => {
  // await rechazarVehiculoApi(id)
  // Refrescar lista
}
</script>