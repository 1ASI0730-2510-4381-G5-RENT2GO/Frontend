<template>
  <header
      class="sticky top-0 z-10 flex h-16 items-center gap-4
           border-b border-primary-100 bg-white px-4 shadow-blue-sm md:px-6
           dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300"
  >
    <!-- Sección izquierda -->
    <div class="flex items-center gap-2">
      <button
          @click="$emit('toggle-sidebar')"
          class="flex items-center justify-center h-9 w-9 rounded-full
               text-primary hover:bg-primary-50
               dark:text-white dark:hover:bg-gray-800
               transition-colors duration-200"
          aria-label="Toggle sidebar"
      >
        <i
            class="pi pi-bars"
            style="text-shadow: 0 0 1px currentColor, 1px 1px 1px #0002; line-height: 0;"
        ></i>
      </button>

      <a
          href="#"
          class="flex items-center gap-2 font-semibold text-primary dark:text-white"
      >
        <h1 class="text-lg">
          <strong>{{ $route.meta.title || 'Sección' }}</strong>
        </h1>
      </a>
    </div>

    <!-- Buscador -->
    <div class="flex-1">
      <form>
        <div class="relative">
          <i
              class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2
                   text-primary-400 dark:text-gray-400"
              style="font-size: 0.875rem"
          ></i>

          <input
              type="search"
              placeholder="Buscar..."
              class="w-full appearance-none
              bg-primary-50 pl-9 pr-4 py-2 rounded-full border
              border-primary-100 focus:border-primary
              focus:ring focus:ring-primary-100 focus:ring-opacity-50
              text-gray-800 placeholder-gray-500
              dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
              dark:border-gray-700 dark:focus:border-primary-400 dark:focus:ring-primary-900
              transition-all duration-200 md:w-2/3 lg:w-1/3"
          />
        </div>
      </form>
    </div>

    <!-- Sección derecha -->
    <div class="flex items-center gap-4">
      <!-- Notificaciones -->
      <button
          class="relative flex items-center justify-center h-10 w-10 rounded-full
               text-primary hover:bg-primary-50
               dark:text-white dark:hover:bg-gray-800
               transition-colors duration-200"
      >
        <i
            class="pi pi-bell"
            style="font-size: 1.15rem; text-shadow: 0 0 1px currentColor, 1px 1px 1px #0002; line-height: 0;"
        ></i>
        <span
            class="absolute top-0 right-0 flex h-5 w-5 items-center justify-center
                 rounded-full bg-red-500 text-[10px] text-white"
        >3</span
        >
      </button>

      <!-- Perfil de usuario -->
      <div class="relative" ref="dropdown">
        <button
            @click="toggleDropdown"
            class="flex items-center justify-center h-10 w-10 rounded-full
                 border-2 border-primary-100 hover:border-primary
                 dark:border-gray-600 dark:hover:border-primary-400
                 hover:shadow-blue-md overflow-hidden
                 transition-all duration-200"
        >
          <img
              src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="User"
              class="h-full w-full object-cover"
          />
        </button>

        <!-- Dropdown -->
        <transition name="dropdown-fade">
          <div
              v-if="isDropdownOpen"
              class="absolute top-full right-0 mt-2 w-56 rounded-xl border
                   border-primary-100 bg-white shadow-blue-lg overflow-hidden
                   dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="p-4">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                Usuario Ejemplo
              </p>
              <p class="text-xs text-primary-400 dark:text-gray-400">
                usuario@ejemplo.com
              </p>
            </div>

            <div class="h-px bg-primary-100 dark:bg-gray-700"></div>

            <!-- Idioma -->
            <div class="px-4 py-2">
              <span class="block text-xs text-primary-400 dark:text-gray-400 mb-1"
              >Idioma</span
              >
              <LanguageSwitcher />
            </div>

            <!-- Tema -->
            <div class="px-4 py-2">
              <span class="block text-xs text-primary-400 dark:text-gray-400 mb-1"
              >Tema</span
              >
              <ThemeSwitcher />
            </div>

            <div class="h-px bg-primary-100 dark:bg-gray-700"></div>

            <!-- Links -->
            <ul class="py-2">
              <li>
                <a
                    href="#"
                    class="flex items-center px-4 py-2 text-sm
                         text-gray-700 hover:bg-primary-50
                         dark:text-gray-200 dark:hover:bg-gray-700
                         transition-colors duration-200"
                >
                  <i class="pi pi-user mr-2 text-primary dark:text-primary-300"></i>
                  <span>Mi Perfil</span>
                </a>
              </li>
              <li>
                <a
                    href="#"
                    class="flex items-center px-4 py-2 text-sm
                         text-gray-700 hover:bg-primary-50
                         dark:text-gray-200 dark:hover:bg-gray-700
                         transition-colors duration-200"
                >
                  <i class="pi pi-cog mr-2 text-primary dark:text-primary-300"></i>
                  <span>Configuración</span>
                </a>
              </li>
            </ul>

            <div class="h-px bg-primary-100 dark:bg-gray-700"></div>

            <!-- Logout -->
            <a
                href="#"
                @click.prevent="$emit('logout')"
                class="flex items-center px-4 py-3 text-sm
                     text-red-500 hover:bg-red-50
                     dark:hover:bg-red-600/20 dark:text-red-400
                     transition-colors duration-200"
            >
              <i class="pi pi-sign-out mr-2"></i>
              <span>Cerrar sesión</span>
            </a>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LanguageSwitcher from '@/public/components/language-switcher.component.vue'
import ThemeSwitcher from '@/public/components/theme-switcher.component.vue'

defineProps({
  sidebarVisible: { type: Boolean, default: true }
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

/* Dropdown ------------------------------------------------------------- */
const isDropdownOpen = ref(false)
const dropdown       = ref(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown(e) {
  if (dropdown.value && !dropdown.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>