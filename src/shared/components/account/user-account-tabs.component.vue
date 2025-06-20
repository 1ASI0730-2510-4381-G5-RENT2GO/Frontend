<template>
  <div class="mb-6 overflow-x-auto">
    <div class="flex border-b border-gray-200 dark:border-gray-700 min-w-max">
      <button
          @click="$emit('change-tab', 'profile')"
          :class="['px-5 py-3 font-medium transition-colors duration-200 flex items-center rounded-t-xl',
                  activeTab === 'profile'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800']"
      >
        <div class="w-8 h-8 flex items-center justify-center rounded-full mr-2"
             :class="activeTab === 'profile' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'">
          <i class="pi pi-user"></i>
        </div>
        <span>Información Personal</span>
      </button>

      <button
          @click="$emit('change-tab', 'security')"
          :class="['px-5 py-3 font-medium transition-colors duration-200 flex items-center rounded-t-xl',
                  activeTab === 'security'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800']"
      >
        <div class="w-8 h-8 flex items-center justify-center rounded-full mr-2"
             :class="activeTab === 'security' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'">
          <i class="pi pi-lock"></i>
        </div>
        <span>Seguridad</span>
      </button>

      <button
          @click="$emit('change-tab', 'preferences')"
          :class="['px-5 py-3 font-medium transition-colors duration-200 flex items-center rounded-t-xl',
                  activeTab === 'preferences'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800']"
      >
        <div class="w-8 h-8 flex items-center justify-center rounded-full mr-2"
             :class="activeTab === 'preferences' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'">
          <i class="pi pi-cog"></i>
        </div>
        <span>Preferencias</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  }
});

defineEmits(['change-tab']);
</script>