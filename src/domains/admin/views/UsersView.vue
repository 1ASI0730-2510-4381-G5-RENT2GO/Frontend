<template>
  <!-- Contenedor principal -->
  <div
      class="p-6 space-y-8 bg-white text-gray-800
           dark:bg-gray-900 dark:text-gray-100"
  >
    <!-- MÉTRICAS -->
    <UserMetrics
        :total="usuarios.length"
        :activos="usuarios.filter(u => u.activo).length"
        :bloqueados="usuarios.filter(u => !u.activo).length"
        :admins="usuarios.filter(u => u.rol === 'admin').length"
    />

    <!-- FILTROS AVANZADOS Y ORDENACIÓN -->
    <div class="flex flex-col md:flex-row md:items-end gap-3 mb-6">
      <!-- Búsqueda global -->
      <div class="flex-1">
        <label class="block mb-1 text-sm font-semibold">Buscar</label>
        <input
            v-model="search"
            type="text"
            placeholder="Nombre o email..."
            class="p-inputtext p-component w-full rounded-xl p-2
                 bg-primary-50 border border-primary-100 placeholder-primary-400
                 focus:border-primary focus:ring focus:ring-primary-100/60
                 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                 dark:placeholder-gray-400 dark:focus:border-primary-400
                 dark:focus:ring-primary-900/60"
        />
      </div>

      <!-- Filtro por rol -->
      <div>
        <label class="block mb-1 text-sm font-semibold">Rol</label>
        <select
            v-model="rolFiltro"
            class="p-inputtext p-component rounded-xl p-2
                 bg-primary-50 border border-primary-100
                 focus:border-primary focus:ring-primary-100/60
                 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                 dark:focus:border-primary-400 dark:focus:ring-primary-900/60"
        >
          <option value="">Todos</option>
          <option value="admin">Admin</option>
          <option value="user">Usuario</option>
        </select>
      </div>

      <!-- Filtro por estado -->
      <div>
        <label class="block mb-1 text-sm font-semibold">Estado</label>
        <select
            v-model="estadoFiltro"
            class="p-inputtext p-component rounded-xl p-2
                 bg-primary-50 border border-primary-100
                 focus:border-primary focus:ring-primary-100/60
                 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                 dark:focus:border-primary-400 dark:focus:ring-primary-900/60"
        >
          <option value="">Todos</option>
          <option :value="true">Activo</option>
          <option :value="false">Bloqueado</option>
        </select>
      </div>

      <!-- Ordenación -->
      <div>
        <label class="block mb-1 text-sm font-semibold">Ordenar por</label>
        <select
            v-model="orden"
            class="p-inputtext p-component rounded-xl p-2
                 bg-primary-50 border border-primary-100
                 focus:border-primary focus:ring-primary-100/60
                 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
                 dark:focus:border-primary-400 dark:focus:ring-primary-900/60"
        >
          <option value="nombre-asc">Nombre (A-Z)</option>
          <option value="nombre-desc">Nombre (Z-A)</option>
          <option value="email-asc">Email (A-Z)</option>
          <option value="email-desc">Email (Z-A)</option>
          <option value="fecha-asc">Registro (más antiguo)</option>
          <option value="fecha-desc">Registro (más reciente)</option>
        </select>
      </div>
    </div>

    <!-- TABLA DE USUARIOS -->
    <UserTable
        :usuarios="usuariosFiltradosPaginados"
        @bloquear="bloquearUsuario"
        @desbloquear="desbloquearUsuario"
        class="rounded-xl border border-primary-100 bg-white shadow-blue-sm
             dark:bg-gray-800 dark:border-gray-700"
    />

    <!-- PAGINACIÓN -->
    <div
        class="flex justify-end items-center space-x-2 mt-4"
        v-if="totalPaginas > 1"
    >
      <button
          class="p-button bg-primary text-white hover:bg-primary-600
               disabled:opacity-50
               dark:bg-primary-500 dark:hover:bg-primary-400"
          @click="paginaActual--"
          :disabled="paginaActual === 1"
      >
        Anterior
      </button>

      <span class="text-sm">
        Página {{ paginaActual }} de {{ totalPaginas }}
      </span>

      <button
          class="p-button bg-primary text-white hover:bg-primary-600
               disabled:opacity-50
               dark:bg-primary-500 dark:hover:bg-primary-400"
          @click="paginaActual++"
          :disabled="paginaActual === totalPaginas"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import UserTable from '../components/UserTable.component.vue'
import UserMetrics from '../components/UserMetrics.component.vue'
import { fetchUsers } from '../api/usersApi.js'

const usuarios = ref([])
const search = ref('')
const rolFiltro = ref('')
const estadoFiltro = ref('')
const orden = ref('nombre-asc')
const paginaActual = ref(1)
const porPagina = 10

onMounted(async () => {
  usuarios.value = await fetchUsers()
})

// FILTRO AVANZADO
const usuariosFiltrados = computed(() => {
  let arr = [...usuarios.value]

  // Búsqueda global
  if (search.value) {
    arr = arr.filter(u =>
        u.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
        u.email.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  // Filtra por rol
  if (rolFiltro.value) {
    arr = arr.filter(u => u.rol === rolFiltro.value)
  }
  // Filtra por estado
  if (estadoFiltro.value !== '') {
    arr = arr.filter(u => u.activo === (estadoFiltro.value === 'true' || estadoFiltro.value === true))
  }

  // Ordenación
  switch (orden.value) {
    case 'nombre-asc':
      arr.sort((a, b) => a.nombre.localeCompare(b.nombre))
      break;
    case 'nombre-desc':
      arr.sort((a, b) => b.nombre.localeCompare(a.nombre))
      break;
    case 'email-asc':
      arr.sort((a, b) => a.email.localeCompare(b.email))
      break;
    case 'email-desc':
      arr.sort((a, b) => b.email.localeCompare(a.email))
      break;
    case 'fecha-asc':
      arr.sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro))
      break;
    case 'fecha-desc':
      arr.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
      break;
  }

  return arr
})

const totalPaginas = computed(() => {
  return Math.ceil(usuariosFiltrados.value.length / porPagina)
})

const usuariosFiltradosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * porPagina
  return usuariosFiltrados.value.slice(inicio, inicio + porPagina)
})

// Resetea a página 1 con cualquier filtro/ordenación
watch([search, rolFiltro, estadoFiltro, orden], () => {
  paginaActual.value = 1
})

const bloquearUsuario = async (id) => {
  // await bloquearUsuarioApi(id)
  // usuarios.value = await fetchUsers()
}

const desbloquearUsuario = async (id) => {
  // await desbloquearUsuarioApi(id)
  // usuarios.value = await fetchUsers()
}
</script>