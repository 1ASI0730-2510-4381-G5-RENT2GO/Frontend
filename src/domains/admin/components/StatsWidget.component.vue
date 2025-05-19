<template>
  <div class="bg-gradient-to-tr from-primary-50 to-primary-100 p-6 rounded-xl shadow flex flex-wrap gap-5 justify-between">
    <div class="flex flex-col items-center justify-center flex-1 min-w-[140px]">
      <div class="text-3xl font-extrabold text-primary">{{ stats.totalUsuarios }}</div>
      <span class="text-gray-500 text-sm flex items-center mt-1"><i class="pi pi-users mr-1"/>Usuarios</span>
    </div>
    <div class="flex flex-col items-center justify-center flex-1 min-w-[140px]">
      <div class="text-3xl font-extrabold text-cyan-700">{{ stats.totalProveedores }}</div>
      <span class="text-gray-500 text-sm flex items-center mt-1"><i class="pi pi-star mr-1"/>Proveedores</span>
    </div>
    <div class="flex flex-col items-center justify-center flex-1 min-w-[140px]">
      <div class="text-3xl font-extrabold text-green-700">{{ stats.totalAutos }}</div>
      <span class="text-gray-500 text-sm flex items-center mt-1"><i class="pi pi-car mr-1"/>Autos</span>
    </div>
    <div class="flex flex-col items-center justify-center flex-1 min-w-[140px]">
      <div class="text-3xl font-extrabold text-orange-700">{{ stats.totalReservas }}</div>
      <span class="text-gray-500 text-sm flex items-center mt-1"><i class="pi pi-calendar mr-1"/>Reservas</span>
    </div>
    <div class="flex flex-col items-center justify-center flex-1 min-w-[140px]">
      <div class="text-2xl font-bold text-purple-800">${{ stats.ingresosTotales ?? 0 }}</div>
      <span class="text-purple-500 text-sm flex items-center mt-1"><i class="pi pi-dollar mr-1"/>Ingresos</span>
    </div>
    <div class="flex flex-col items-center justify-center flex-1 min-w-[140px]">
      <div class="text-2xl font-bold text-pink-800">${{ stats.comisiones ?? 0 }}</div>
      <span class="text-pink-500 text-sm flex items-center mt-1"><i class="pi pi-percentage mr-1"/>Comisiones</span>
    </div>
  </div>
</template>

<script setup>
const { stats } = defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>