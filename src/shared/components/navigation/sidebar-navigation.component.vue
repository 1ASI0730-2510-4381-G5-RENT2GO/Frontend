<template>
  <div>
    <transition name="fade">
      <div
          v-if="isVisible && isMobile"
          class="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-20"
          @click="toggleSidebar"
      />
    </transition>

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

        <div
            class="p-6 pb-4 flex flex-col items-center
                 border-b border-white/10 dark:border-white/15"
        >
          <img
              src="@/assets/logo.svg"
              alt="Logo"
              class="h-14 mb-3 filter drop-shadow-lg animate-pulse-subtle"
          />
          <span class="font-extrabold text-2xl tracking-wide">Rent2Go</span>
          <span class="text-sm opacity-70 mt-1 capitalize font-medium">{{ role }}</span>
        </div>

        <nav class="mt-6 flex-1 px-3 overflow-y-auto">
          <ul class="space-y-2">
            <li
                v-for="(item, index) in menu"
                :key="item.to"
                class="menu-item"
                :style="{animationDelay: `calc(${index + 1} * 0.05s)`}"
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
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  role: { type: String, default: 'guest' },
  isVisible: { type: Boolean, default: true }
})
const emit = defineEmits(['toggle-sidebar'])

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

const menusByRole = {
  admin: [
    { label: t('navigation.dashboard'), to: '/admin/dashboard', icon: 'pi-home' },
    { label: t('navigation.vehicles'), to: '/admin/vehicles',  icon: 'pi-car' },
    { label: t('navigation.reservations'), to: '/admin/reservations', icon: 'pi-calendar' },
    { label: t('navigation.users'), to: '/admin/users', icon: 'pi-users' },
    { label: t('navigation.commissions'), to: '/admin/commissions', icon: 'pi-money-bill' }
  ],
  client: [
    { label: t('navigation.home'), to: '/client/home', icon: 'pi-home' },
    { label: t('navigation.search'), to: '/client/search', icon: 'pi-search' },
    { label: t('navigation.my_reservations'), to: '/client/reservations', icon: 'pi-calendar' },
    { label: t('navigation.payment_methods'), to: '/client/payment-methods', icon: 'pi-credit-card' },
  ],
  provider: [
    { label: t('navigation.dashboard'), to: '/provider/dashboard', icon: 'pi-home' },
    { label: t('navigation.my_vehicles'), to: '/provider/vehicles', icon: 'pi-car' },
    { label: t('navigation.reservations'), to: '/provider/reservations', icon: 'pi-calendar' },
    { label: t('navigation.earnings'), to: '/provider/earnings', icon: 'pi-money-bill' }
  ],
  guest: []
}
const menu = computed(() => menusByRole[props.role] ?? [])

function handleLinkClick() {
  if (isMobile.value) closeSidebar()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

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

.menu-item {
  animation: fadeInSlide 0.5s ease forwards;
  opacity: 0;
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

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.8; }
}
.animate-pulse-subtle {
  animation: pulse-subtle 3s infinite;
}

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
:global(html.dark) ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}
:global(html.dark) ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>

