<template>
  <header
      class="sticky top-0 z-10 flex h-16 items-center gap-4
           border-b border-primary-100 bg-white px-4 shadow-blue-sm md:px-6
           dark:bg-gray-900 dark:border-gray-700 transition-colors duration-300"
  >
    <div class="flex items-center gap-2">
      <button
          @click="$emit('toggle-sidebar')"
          class="flex items-center justify-center h-9 w-9 rounded-full
               text-primary hover:bg-primary-50
               dark:text-white dark:hover:bg-gray-800
               transition-colors duration-200"
          :aria-label="$t('navigation.toggle_sidebar')"
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
          <strong>{{ $route.meta.title ? $t($route.meta.title) : $t('navigation.section') }}</strong>
        </h1>
      </a>
    </div>

    <div class="flex-1"></div>
    <div class="flex items-center">
      <div class="relative" ref="dropdown">
        <button
            @click="toggleDropdown"
            class="flex items-center justify-center h-10 w-10 rounded-full
                 border-2 border-primary-100 hover:border-primary
                 dark:border-gray-600 dark:hover:border-primary-400
                 hover:shadow-blue-md overflow-hidden
                 transition-all duration-200"
            :aria-label="$t('navigation.user_profile')"
        >
          <template v-if="currentUser && (currentUser.profilePicture || currentUser.avatar)">
            <img
                :src="currentUser.profilePicture ? getImageUrl(currentUser.profilePicture) : currentUser.avatar"
                :alt="currentUser.name || $t('navigation.user')"
                class="h-full w-full object-cover"
            />
          </template>
          <template v-else>
            <div class="h-full w-full flex items-center justify-center bg-primary-100 dark:bg-gray-700">
              <i class="pi pi-user text-primary-600 dark:text-primary-300"></i>
            </div>
          </template>
        </button>

        <transition name="dropdown-fade">
          <div
              v-if="isDropdownOpen"
              class="absolute top-full right-0 mt-2 w-56 rounded-xl border
                   border-primary-100 bg-white shadow-blue-lg overflow-hidden
                   dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="p-4">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
                {{ currentUser?.name || currentUser?.firstName || currentUser?.userName || $t('navigation.example_user') }}
              </p>
              <p class="text-xs text-primary-400 dark:text-gray-400">
                {{ currentUser?.email || 'usuario@ejemplo.com' }}
              </p>
              <p v-if="currentUser?.role" class="mt-1 text-xs px-2 py-1 rounded bg-primary-50 dark:bg-gray-700 text-primary-500 dark:text-primary-300 inline-block">
                {{ $t(`roles.${currentUser.role}`) || currentUser.role }}
              </p>
            </div>

            <div class="h-px bg-primary-100 dark:bg-gray-700"></div>

            <div class="px-4 py-2">
              <span class="block text-xs text-primary-400 dark:text-gray-400 mb-1"
              >{{ $t('navigation.language') }}</span
              >
              <LanguageSwitcher />
            </div>

            <div class="px-4 py-2">
              <span class="block text-xs text-primary-400 dark:text-gray-400 mb-1">{{ $t('navigation.theme') }}</span>
              <ThemeSwitcher />
            </div>

            <div class="h-px bg-primary-100 dark:bg-gray-700"></div>

            <ul class="py-2">
              <li>
                <button
                    @click="navigateToProfile"
                    class="flex items-center px-4 py-2 text-sm w-full text-left
                         text-gray-700 hover:bg-primary-50
                         dark:text-gray-200 dark:hover:bg-gray-700
                         transition-colors duration-200"
                >
                  <i class="pi pi-user mr-2 text-primary dark:text-primary-300"></i>
                  <span>{{ $t('navigation.my_account') }}</span>
                </button>
              </li>
            </ul>

            <div class="h-px bg-primary-100 dark:bg-gray-700"></div>

            <button
                @click="handleLogout"
                class="flex items-center w-full text-left px-4 py-3 text-sm
                     text-red-500 hover:bg-red-50
                     dark:hover:bg-red-600/20 dark:text-red-400
                     transition-colors duration-200"
            >
              <i class="pi pi-sign-out mr-2"></i>
              <span>{{ $t('navigation.logout') }}</span>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/auth/stores/authStore'
import { usersService } from '@/shared/services/usersService'
import LanguageSwitcher from '@/public/components/language-switcher.component.vue'
import ThemeSwitcher from '@/public/components/theme-switcher.component.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5239'
const FILE_BASE_URL = API_BASE.replace(/\/api$/, '')

function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${FILE_BASE_URL}${normalized}`
}

const props = defineProps({
  sidebarVisible: { type: Boolean, default: true },
  user: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['toggle-sidebar', 'logout'])
const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => {
  if (props.user && Object.keys(props.user).length > 0) {
    return props.user
  }
  return authStore.user
})

const isLoading = ref(false)

const isDropdownOpen = ref(false)
const dropdown = ref(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown(e) {
  if (dropdown.value && !dropdown.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

function navigateToProfile() {
  isDropdownOpen.value = false

  const currentPath = router.currentRoute.value.path

  if (currentPath.startsWith('/client')) {
    router.push({ name: 'ClientAccount' })
  } else if (currentPath.startsWith('/provider')) {
    router.push({ name: 'ProviderAccount' })
  } else {
    router.push({ name: 'Login' })
  }
}

function handleLogout() {
  authStore.logout();
  router.push({ name: 'Login' });
}

async function loadUserData() {
  // Solo cargar datos si no hay usuario en el store
  if (!authStore.user && authStore.isAuthenticated) {
    isLoading.value = true
    try {
      const userData = await usersService.getCurrentUser()
      if (userData) {
        authStore.user = userData
      }
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error)
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)

  loadUserData()

  if (authStore.isAuthenticated && !authStore.user) {
    authStore.refreshUserInfo()
  }
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

