<template>
  <div class="flex items-center gap-2">
    <button
        v-for="lang in langs"
        :key="lang.value"
        @click="setLang(lang.value)"
        :class="[
        'px-3 py-1 rounded-full border font-medium transition-all duration-200 text-xs focus:outline-none',
        $i18n.locale === lang.value
          ? 'bg-primary-50 border-primary text-primary font-bold shadow'
          : 'bg-white border-primary-100 text-primary-400 hover:bg-primary-50 hover:border-primary hover:text-primary'
      ]"
        :aria-pressed="$i18n.locale === lang.value"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script>
export default {
  computed: {
    langs() {
      return [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ]
    }
  },
  methods: {
    setLang(lang) {
      this.$i18n.locale = lang;
    }
  }
}
</script>