<template>
  <div class="flex items-center gap-2">
    <button
        v-for="lang in langs"
        :key="lang.value"
        @click="setLang(lang.value)"
        :class="[
        'px-3 py-1 rounded-full border font-medium transition-all duration-200 text-xs focus:outline-none',
        $i18n.locale === lang.value
          ? 'bg-primary-50 border-primary text-primary font-bold shadow dark:bg-primary-600 dark:text-white dark:border-primary-400'
          : 'bg-white border-primary-100 text-primary-400 hover:bg-primary-50 hover:border-primary hover:text-primary dark:bg-transparent dark:text-primary-300 dark:border-border-dark dark:hover:bg-surface-mutedDark'
      ]"
        :aria-pressed="$i18n.locale === lang.value"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const langs = [
  { label: 'EN', value: 'en' },
  { label: 'ES', value: 'es' }
]

function setLang(lang) {
  i18n.locale.value = lang
  localStorage.setItem('locale', lang)
}

onMounted(() => {
  const storedLocale = localStorage.getItem('locale')
  if (storedLocale) {
    i18n.locale.value = storedLocale
  }
})
</script>