<template>
  <div>
    <!-- BACKDROP (móvil) -->
    <transition name="fade">
      <div
          v-if="isVisible && isMobile"
          class="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-20"
          @click="toggleSidebar"
      />
    </transition>

    <!-- SIDEBAR -->
    <transition name="slide">
      <aside
          v-show="isVisible"
          class="fixed top-0 left-0 h-full w-72
               bg-gradient-to-b from-primary-600 to-primary-500
               dark:from-gray-900 dark:to-gray-800
               text-white flex flex-col shadow-blue-xl z-20
               transition-all duration-300 ease-in-out
               lg:static lg:translate-x-0 rounded-none"
          :class="[
          isMobile
            ? (isVisible ? 'translate-x-0' : '-translate-x-full')
            : 'hidden lg:flex'
        ]"
      >
        <!-- BOTÓN CIERRE (sólo móvil) -->
        <button
            v-if="isMobile && isVisible"
            @click="closeSidebar"
            class="absolute top-3 right-3 z-30 p-2 rounded-full
                 text-white hover:bg-white/10 dark:hover:bg-white/5
                 transition-transform duration-200 hover:scale-110 lg:hidden"
            aria-label="Cerrar menú"
        >
          <i class="pi pi-times text-xl leading-none" />
        </button>

        <!-- LOGO / MARCA -->
        <div
            class="p-6 pb-4 flex flex-col items-center
                 border-b border-white/10 dark:border-white/15"
        >
          <img
              src="@/assets/logo.svg"
              alt="Logo"
              class="h-14 mb-3 filter drop-shadow-lg animate-pulse-subtle"
          />
          <span class="font-extrabold text-2xl tracking-wide">Mi Empresa</span>
          <span class="text-sm opacity-70 mt-1 capitalize font-medium">{{ role }}</span>
        </div>

        <!-- NAVEGACIÓN -->
        <nav class="mt-6 flex-1 px-3 overflow-y-auto">
          <ul class="space-y-2">
            <li
                v-for="(item, index) in menu"
                :key="item.to"
                class="menu-item"
                :style="`--index: ${index + 1}`"
            >
              <RouterLink
                  :to="item.to"
                  class="flex items-center gap-3 py-3 px-5 rounded-xl font-medium
                       transition-all duration-200 group
                       hover:bg-white/20 dark:hover:bg-white/10
                       hover:shadow-blue-inner"
                  :class="{
                  'bg-white/20 dark:bg-white/10 shadow-blue-inner font-semibold':
                    $route.path === item.to
                }"
                  @click="handleLinkClick"
              >
                <i
                    :class="`pi ${item.icon} text-lg group-hover:scale-110
                             transition-transform duration-200`"
                    :style="`transition-delay: ${index * 50}ms`"
                />
                <span class="transition-all duration-200">{{ item.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- LOGOUT -->
        <div class="mt-auto px-6 pb-6">
          <button
              @click="logout"
              class="w-full flex items-center gap-3 py-3 px-5 bg-white/15
                   hover:bg-white/25 dark:bg-white/10 dark:hover:bg-white/20
                   rounded-xl font-bold text-white text-left
                   transition-all duration-200 hover:shadow-blue-inner
                   hover:scale-[1.02]"
          >
            <i class="pi pi-sign-out text-lg transition-transform group-hover:scale-110" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

/* Props y eventos ---------------------------------------------------- */
const props = defineProps({
  role: { type: String, default: 'guest' },
  isVisible: { type: Boolean, default: true }
})
const emit = defineEmits(['logout', 'toggle-sidebar'])

/* Visibilidad / responsive ------------------------------------------ */
const isMobile = ref(false)

function toggleSidebar() {
  emit('toggle-sidebar')
}
function closeSidebar() {
  emit('toggle-sidebar', false)
}
function checkScreen() {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

/* Menú por rol ------------------------------------------------------- */
const menusByRole = {
  admin: [
    { label: 'Dashboard',  to: '/admin/dashboard', icon: 'pi-home' },
    { label: 'Vehículos',  to: '/admin/vehicles',  icon: 'pi-car' },
    { label: 'Usuarios',   to: '/admin/users',     icon: 'pi-users' },
    { label: 'Comisiones', to: '/admin/commissions', icon: 'pi-money-bill' },
    { label: 'Ajustes',    to: '/admin/settings',  icon: 'pi-cog' }
  ],
  client: [
    { label: 'Dashboard',  to: '/client/dashboard', icon: 'pi-home' },
    { label: 'Mis pedidos',to: '/client/orders',    icon: 'pi-shopping-cart' },
    { label: 'Cuenta',     to: '/client/settings',  icon: 'pi-user-edit' }
  ],
  provider: [
    { label: 'Dashboard',  to: '/provider/dashboard', icon: 'pi-home' },
    { label: 'Servicios',  to: '/provider/services',  icon: 'pi-briefcase' },
    { label: 'Cuenta',     to: '/provider/settings',  icon: 'pi-user-cog' }
  ],
  guest: []
}
const menu = computed(() => menusByRole[props.role] ?? [])

/* Acciones ----------------------------------------------------------- */
function logout() {
  emit('logout')
  if (isMobile.value) closeSidebar()
}
function handleLinkClick() {
  if (isMobile.value) closeSidebar()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

/* Transiciones globales */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Animación para items del menú */
.menu-item {
  animation: fadeInSlide 0.5s ease forwards;
  opacity: 0;
  animation-delay: calc(var(--index) * 0.05s);
}
@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animación logo sutil */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.8; }
}
.animate-pulse-subtle {
  animation: pulse-subtle 3s infinite;
}

/* Scrollbar personalizadas (modo claro/oscuro) */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
/* Ajuste para modo oscuro – un poco menos luminoso */
:global(html.dark) ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}
:global(html.dark) ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>