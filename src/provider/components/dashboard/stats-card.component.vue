<template>
  <div class="card-stats p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center border-l-4 overflow-hidden relative"
       :class="`border-${color}-500`">
    <div class="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-50"
         :class="`bg-${color}-100 dark:bg-${color}-900/30`"></div>
    <i :class="`pi ${icon} text-${color}-500 dark:text-${color}-400 text-3xl mb-2`"></i>
    <div class="text-3xl font-bold text-gray-800 dark:text-white mb-1">{{ mainValue }}</div>
    <div class="font-medium uppercase text-sm tracking-wide"
         :class="`text-${color}-600 dark:text-${color}-400`">{{ title }}</div>
    <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
      <span v-if="secondaryValue" :class="`font-medium text-${secondaryColor}-500 dark:text-${secondaryColor}-400 mr-1`">
        {{ secondaryValue }}
      </span>
      <span>{{ secondaryLabel }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  mainValue: {
    type: [String, Number],
    required: true
  },
  secondaryValue: {
    type: [String, Number],
    default: null
  },
  secondaryLabel: {
    type: String,
    default: ''
  },
  secondaryColor: {
    type: String,
    default: 'green'
  }
})
</script>

<style scoped>
.card-stats {
  transition: all 0.3s ease;
}

.card-stats:hover {
  transform: translateY(-5px);
}

@media (prefers-color-scheme: dark) {
  .card-stats {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .card-stats:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
  }
}
</style>