<template>
  <div class="flex items-center space-x-2">
    <button
        @click="setTheme('light')"
        :class="[base, isLight ? active : inactive]"
        aria-label="Modo claro"
    >
      <i class="pi pi-sun" />
    </button>

    <button
        @click="setTheme('dark')"
        :class="[base, isDark ? active : inactive]"
        aria-label="Modo oscuro"
    >
      <i class="pi pi-moon" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const theme = ref('light')

onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored) {
    theme.value = stored
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
  }
  applyTheme(theme.value)
})

function setTheme(selected) {
  theme.value = selected
  localStorage.setItem('theme', selected)
  applyTheme(selected)
}

function applyTheme(mode) {
  const html = document.documentElement
  mode === 'dark' ? html.classList.add('dark')
      : html.classList.remove('dark')
}

const isDark  = computed(() => theme.value === 'dark')
const isLight = computed(() => theme.value === 'light')

const base =
    'flex items-center justify-center h-9 w-9 rounded-full border ' +
    'transition-colors duration-200 focus:outline-none'

const active =
    'bg-primary-100 text-primary border-primary shadow ' +
    'dark:bg-primary-600 dark:text-white dark:border-primary-400'

const inactive =
    'bg-transparent text-primary-400 border-primary-100 ' +
    'hover:bg-primary-50 hover:text-primary ' +
    'dark:bg-transparent dark:text-primary-300 dark:border-border-dark ' +
    'dark:hover:bg-surface-mutedDark'
</script>