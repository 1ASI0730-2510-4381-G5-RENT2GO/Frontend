<template>
  <div>
    <table class="min-w-full rounded-xl overflow-hidden shadow bg-white">
      <thead>
      <tr class="bg-primary-50 text-primary-800">
        <th class="px-4 py-2">Reserva</th>
        <th>Usuario</th>
        <th>Proveedor</th>
        <th>Auto</th>
        <th>Fecha</th>
        <th>Total</th>
        <th>Comisión</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="c in comisiones" :key="c.id" class="hover:bg-primary-50/50 transition">
        <td class="px-4 py-2">{{ c.reserva }}</td>
        <td>{{ c.cliente }}</td>
        <td class="text-primary-800">{{ c.proveedor }}</td>
        <td class="text-primary-800">{{ c.auto }}</td>
        <td class="text-primary-800">{{ c.fecha }}</td>
        <td class="font-semibold text-green-700">${{ c.total }}</td>
        <td class="font-semibold text-pink-700">${{ c.comision }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({ comisiones: { type: Array, required: true } })
</script>