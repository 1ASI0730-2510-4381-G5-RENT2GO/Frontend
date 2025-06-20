<template>
  <!-- ✅ AGREGAR TOAST GLOBAL -->
  <Toast position="top-right" />

  <!-- Tu router-view existente -->
  <router-view />
</template>

<script setup>

import { onMounted } from 'vue'
import { useAuthStore } from '@/auth/stores/authStore'

const authStore = useAuthStore()

onMounted(() => {

  authStore.initialize()
})
</script>
