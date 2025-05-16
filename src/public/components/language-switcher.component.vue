<template>
  <div class="language-switcher">
    <label for="lang-select" class="visually-hidden">
      {{ $t('navbar.language') }}
    </label>
    <select
        id="lang-select"
        v-model="$i18n.locale"
        aria-label="Select Language"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  </div>
</template>

<script setup></script>


<style scoped>
.language-switcher {
  color: #000;
}
.visually-hidden {
  position: absolute;
  left: -9999px;
}
select {
  padding: 0.3rem;
  border-radius: 4px;
  border: none;
}
</style>
