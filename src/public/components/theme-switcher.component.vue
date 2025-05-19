<template>
  <div class="flex items-center space-x-2">
    <!-- Botón modo claro -->
    <button
        @click="setTheme('light')"
        :class="[base, isLight ? active : inactive]"
        aria-label="Modo claro"
    >
      <i class="pi pi-sun" />
    </button>

    <!-- Botón modo oscuro -->
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

/* Estado reactivo para el tema */
const theme = ref('light')

/* Detectar y aplicar el tema al montar */
onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored) {
    theme.value = stored
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
  }
  applyTheme(theme.value)
})

/* Cambiar tema */
function setTheme(selected) {
  theme.value = selected
  localStorage.setItem('theme', selected)
  applyTheme(selected)
}

/* Añadir o quitar la clase .dark en <html> */
function applyTheme(mode) {
  const html = document.documentElement
  mode === 'dark' ? html.classList.add('dark')
      : html.classList.remove('dark')
}

/* Computados */
const isDark  = computed(() => theme.value === 'dark')
const isLight = computed(() => theme.value === 'light')

/* Clases Tailwind ------------------------------------------------------ */
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