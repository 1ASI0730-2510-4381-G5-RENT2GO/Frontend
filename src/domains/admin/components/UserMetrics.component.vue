<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <div class="p-4 bg-white rounded-xl shadow text-center">
      <div class="text-2xl text-gray-700 font-bold">{{ total }}</div>
      <div class="text-primary-500">Usuarios totales</div>
    </div>
    <div class="p-4 bg-white rounded-xl shadow text-center">
      <div class="text-2xl text-gray-700 font-bold">{{ activos }}</div>
      <div class="text-primary-500">Activos</div>
    </div>
    <div class="p-4 bg-white rounded-xl shadow text-center">
      <div class="text-2xl text-gray-700 font-bold">{{ bloqueados }}</div>
      <div class="text-primary-500">Bloqueados</div>
    </div>
    <div class="p-4 bg-white rounded-xl shadow text-center">
      <div class="text-2xl text-gray-700 font-bold">{{ admins }}</div>
      <div class="text-primary-500">Admins</div>
    </div>
  </div>
</template>

<script setup>
defineProps(['total', 'activos', 'bloqueados', 'admins'])
</script>