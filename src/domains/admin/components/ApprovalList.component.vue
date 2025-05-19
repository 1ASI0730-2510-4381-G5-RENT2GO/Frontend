<template>
  <div>
    <table class="min-w-full rounded-xl shadow bg-white overflow-hidden">
      <thead>
      <tr class="bg-primary-50 text-primary">
        <th class="px-4 py-2">Vehículo</th>
        <th>Proveedor</th>
        <th>Estado</th>
        <th class="text-center">Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="v in vehiculos" :key="v.id" class="hover:bg-primary-50/50 transition">
        <td class="px-4 py-2 font-semibold">{{ v.marca }} {{ v.modelo }}</td>
        <td class="px-4 py-2 font-medium text-primary-800">{{ v.proveedor }}</td>
        <td>
            <span class="px-2 py-1 rounded text-xs font-semibold"
                  :class="{
                    'bg-yellow-100 text-yellow-800': v.estado === 'pendiente',
                    'bg-green-100 text-green-700': v.estado === 'aprobado',
                    'bg-red-100 text-red-700': v.estado === 'rechazado'
                  }"
            ><i :class="{
              'pi pi-clock': v.estado === 'pendiente',
              'pi pi-check-circle': v.estado === 'aprobado',
              'pi pi-times-circle': v.estado === 'rechazado'
            }" class="mr-1"></i> {{ v.estado }}</span>
        </td>
        <td class="text-center">
          <button v-if="v.estado==='pendiente'" @click="$emit('aprobar', v.id)"
                  class="mr-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
            <i class="pi pi-thumbs-up"></i> Aprobar
          </button>
          <button v-if="v.estado==='pendiente'" @click="$emit('rechazar', v.id)"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
            <i class="pi pi-thumbs-down"></i> Rechazar
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
defineProps({ vehiculos: { type: Array, required: true } })
defineEmits(['aprobar', 'rechazar'])
</script>