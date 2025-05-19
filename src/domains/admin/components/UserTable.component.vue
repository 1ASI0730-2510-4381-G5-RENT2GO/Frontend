<template>
  <!-- Contenedor con overflow, radio y scrollbar personalizado -->
  <div class="w-full overflow-x-auto rounded-xl shadow custom-scrollbar">
    <table class="min-w-max w-full bg-white">
      <thead>
      <tr class="bg-primary-50 text-primary-800">
        <th class="px-4 py-2">Nombre</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Estado</th>
        <th>Registro</th>
        <th class="text-center">Acciones</th>
      </tr>
      </thead>

      <tbody>
      <tr
          v-for="user in usuarios"
          :key="user.id"
          class="hover:bg-primary-50/50 transition"
      >
        <td class="px-4 py-2 font-medium text-primary-800">
          {{ user.nombre }}
        </td>
        <td class="px-4 py-2 font-medium text-primary-800">
          {{ user.email }}
        </td>

        <td>
            <span
                class="inline-flex items-center px-2 py-1 rounded text-xs font-bold"
                :class="{
                'bg-cyan-100 text-cyan-800': user.rol === 'provider',
                'bg-blue-100 text-blue-800': user.rol === 'client',
                'bg-red-100 text-red-800': user.rol === 'admin'
              }"
            >
              <i
                  :class="
                  user.rol === 'provider'
                    ? 'pi pi-star'
                    : user.rol === 'admin'
                    ? 'pi pi-user-edit'
                    : 'pi pi-user'
                "
                  class="mr-1"
              ></i>
              {{ user.rol }}
            </span>
        </td>

        <td>
            <span
                class="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                :class="{
                'bg-green-100 text-green-700': user.estado === 'activo',
                'bg-yellow-100 text-yellow-700': user.estado === 'pendiente',
                'bg-red-100 text-red-700': user.estado === 'suspendido'
              }"
            >
              <i
                  :class="
                  user.estado === 'activo'
                    ? 'pi pi-check-circle'
                    : user.estado === 'pendiente'
                    ? 'pi pi-clock'
                    : 'pi pi-ban'
                "
                  class="mr-1"
              ></i>
              {{ user.estado }}
            </span>
        </td>

        <td class="px-4 py-2 font-medium text-primary-800">
          {{ user.fechaRegistro }}
        </td>

        <td class="text-center">
          <button
              v-if="user.estado !== 'suspendido'"
              class="text-red-600 hover:bg-red-50 p-2 rounded transition"
              @click="$emit('bloquear', user.id)"
          >
            <i class="pi pi-user-minus"></i> Bloquear
          </button>

          <button
              v-else
              class="text-green-600 hover:bg-green-50 p-2 rounded transition"
              @click="$emit('desbloquear', user.id)"
          >
            <i class="pi pi-user-plus"></i> Desbloquear
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  usuarios: { type: Array, required: true }
})
defineEmits(['bloquear', 'desbloquear'])
</script>

<style scoped>
/* Scrollbar horizontal: pista transparente, thumb azul */
.custom-scrollbar {
  scrollbar-width: thin;                 /* Firefox */
  scrollbar-color: #006aff transparent;  /* thumb azul, track transparente */
}

/* WebKit (Chrome, Edge, Safari, Opera) */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px; /* alto de la barra horizontal */
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* pista sin color */
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #006aff; /* azul (Tailwind blue-500) */
  border-radius: 9999px;
}
</style>