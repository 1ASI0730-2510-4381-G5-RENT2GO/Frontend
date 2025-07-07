<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup
      name="toast"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden',
          getToastClasses(toast.type)
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i :class="getToastIcon(toast.type)" class="text-xl"></i>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium" :class="getTextClasses(toast.type)">
                {{ toast.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeToast(toast.id)"
                :class="[
                  'rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  getButtonClasses(toast.type)
                ]"
              >
                <span class="sr-only">Cerrar</span>
                <i class="pi pi-times text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '@/shared/composables/useToast';

const { toasts, removeToast } = useToast();

const getToastClasses = (type) => {
  const classes = {
    success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
  };
  return classes[type] || classes.info;
};

const getToastIcon = (type) => {
  const icons = {
    success: 'pi pi-check-circle text-green-400',
    error: 'pi pi-times-circle text-red-400',
    warning: 'pi pi-exclamation-triangle text-yellow-400',
    info: 'pi pi-info-circle text-blue-400'
  };
  return icons[type] || icons.info;
};

const getTextClasses = (type) => {
  const classes = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200'
  };
  return classes[type] || classes.info;
};

const getButtonClasses = (type) => {
  const classes = {
    success: 'focus:ring-green-500',
    error: 'focus:ring-red-500',
    warning: 'focus:ring-yellow-500',
    info: 'focus:ring-blue-500'
  };
  return classes[type] || classes.info;
};
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
