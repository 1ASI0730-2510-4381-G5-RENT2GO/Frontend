<template>
  <div class="min-h-screen flex bg-white dark:bg-surface-dark transition-colors duration-300 overflow-x-hidden">
    <SidebarNavigationComponent
        :role="$route.meta.role"
        @logout="logout"
        :is-visible="sidebarVisible"
        @toggle-sidebar="toggleSidebar"
    />

    <div class="flex-1 flex flex-col min-w-0">
      <HeaderBarComponent
          @toggle-sidebar="toggleSidebar"
          @logout="logout"
          :sidebar-visible="sidebarVisible"
          :user="auth.user"
      />

      <main class="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-auto max-w-full">
        <div class="animate-fade-in">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/auth/stores/authStore.js'
import SidebarNavigationComponent from '@/shared/components/navigation/sidebar-navigation.component.vue'
import HeaderBarComponent from '@/shared/components/navigation/header-bar.component.vue'
import { useTheme } from '@/shared/utils/useTheme'

useTheme()
const router = useRouter()
const auth = useAuthStore()
const sidebarVisible = ref(true)
const currentUser = computed(() => auth.user)

onMounted(() => {
  auth.initialize()
})

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

