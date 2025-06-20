<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {{ $t('client.reviews.rate_experience') }}
        </h3>
        <button @click="closeModal" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="p-6">
        <div class="flex mb-6">
          <img
              :src="vehicle.imageUrl || '/img/car-placeholder.jpg'"
              :alt="vehicle.model"
              class="w-24 h-16 rounded-xl object-cover mr-4"
          >
          <div>
            <h4 class="font-medium text-gray-800 dark:text-gray-200">
              {{ vehicle.brand }} {{ vehicle.model }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(reservation.pickupDate) }} - {{ formatDate(reservation.returnDate) }}
            </p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('client.reviews.overall_rating') }}
          </label>
          <div class="flex items-center">
            <button
                v-for="n in 5"
                :key="n"
                @click="rating = n"
                type="button"
                class="focus:outline-none"
            >
              <i :class="[
                rating >= n ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-500',
                'text-2xl mr-1'
              ]"></i>
            </button>
            <span class="ml-2 text-gray-600 dark:text-gray-400 text-sm">
              {{ rating || 0 }}/5
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('client.reviews.categories.cleanliness') }}
            </label>
            <div class="flex">
              <button
                  v-for="n in 5"
                  :key="n"
                  @click="categoryRatings.cleanliness = n"
                  type="button"
                  class="focus:outline-none"
              >
                <i :class="[
                  categoryRatings.cleanliness >= n ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-500',
                  'text-lg mr-0.5'
                ]"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('client.reviews.categories.comfort') }}
            </label>
            <div class="flex">
              <button
                  v-for="n in 5"
                  :key="n"
                  @click="categoryRatings.comfort = n"
                  type="button"
                  class="focus:outline-none"
              >
                <i :class="[
                  categoryRatings.comfort >= n ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-500',
                  'text-lg mr-0.5'
                ]"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('client.reviews.categories.performance') }}
            </label>
            <div class="flex">
              <button
                  v-for="n in 5"
                  :key="n"
                  @click="categoryRatings.performance = n"
                  type="button"
                  class="focus:outline-none"
              >
                <i :class="[
                  categoryRatings.performance >= n ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-500',
                  'text-lg mr-0.5'
                ]"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('client.reviews.categories.value') }}
            </label>
            <div class="flex">
              <button
                  v-for="n in 5"
                  :key="n"
                  @click="categoryRatings.value = n"
                  type="button"
                  class="focus:outline-none"
              >
                <i :class="[
                  categoryRatings.value >= n ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300 dark:text-gray-500',
                  'text-lg mr-0.5'
                ]"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('client.reviews.your_opinion') }}
          </label>
          <textarea
              v-model="comment"
              rows="4"
              :placeholder="$t('client.reviews.comment_placeholder')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ commentCharsRemaining }} {{ $t('client.reviews.chars_remaining') }}
          </p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('client.reviews.add_photos') }}
          </label>
          <div class="flex flex-wrap gap-2">
            <div
                v-for="(image, index) in images"
                :key="index"
                class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative"
            >
              <img :src="image" class="w-full h-full object-cover">
              <button
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <label
                v-if="images.length < 3"
                class="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <i class="pi pi-camera text-gray-400 mb-1"></i>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('client.reviews.add') }}</span>
              <input
                  type="file"
                  @change="addImage"
                  accept="image/*"
                  class="hidden"
              >
            </label>
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('client.reviews.photo_limit') }}
          </p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('client.reviews.would_recommend') }}
          </label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input
                  type="radio"
                  v-model="wouldRecommend"
                  :value="true"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              >
              <span class="ml-2 text-gray-700 dark:text-gray-300">{{ $t('common.yes') }}</span>
            </label>
            <label class="inline-flex items-center">
              <input
                  type="radio"
                  v-model="wouldRecommend"
                  :value="false"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              >
              <span class="ml-2 text-gray-700 dark:text-gray-300">{{ $t('common.no') }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-xl text-sm font-medium transition-colors mr-3"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
            @click="submitReview"
            :disabled="!isValidReview"
            :class="[
              'px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium transition-colors',
              isValidReview ? 'hover:bg-primary-700' : 'opacity-50 cursor-not-allowed'
            ]"
        >
          {{ $t('client.reviews.submit_review') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: Object,
    default: () => ({})
  },
  vehicle: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'submit']);

const rating = ref(0);
const comment = ref('');
const images = ref([]);
const recommend = ref(null);
const isSubmitting = ref(false);

const categoryRatings = ref({
  cleanliness: 0,
  comfort: 0,
  performance: 0,
  value: 0
});

const MAX_COMMENT_LENGTH = 500;
const commentCharsRemaining = computed(() => {
  return MAX_COMMENT_LENGTH - comment.value.length;
});

const isValid = computed(() => {
  return rating.value > 0 && comment.value.trim().length > 0 && recommend.value !== null;
});

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const addImage = (event) => {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const closeModal = () => {
  emit('close');
};

const submitReview = () => {
  if (!isValid.value) return;

  isSubmitting.value = true;

  const reviewData = {
    reservationId: props.reservation.id,
    vehicleId: props.vehicle.id,
    rating: rating.value,
    comment: comment.value,
    categoryRatings: categoryRatings.value,
    recommend: recommend.value,
    images: images.value,
    date: new Date().toISOString()
  };

  setTimeout(() => {
    isSubmitting.value = false;
    emit('submit', reviewData);
    closeModal();
  }, 1000);
};
</script>

