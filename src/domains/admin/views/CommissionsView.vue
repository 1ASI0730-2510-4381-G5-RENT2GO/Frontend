<template>
  <div class="p-6 space-y-8">
    <CommissionsTable :comisiones="comisiones" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CommissionsTable from '../components/CommissionsTable.component.vue'
import { fetchCommissions } from '../api/commissionsApi.js'

const comisiones = ref([])

onMounted(async () => {
  comisiones.value = await fetchCommissions()
})
</script>