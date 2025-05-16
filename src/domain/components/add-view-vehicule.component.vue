<template>
  <section class="add-vehicle-section" role="form" aria-label="Add Vehicle">
    <header class="add-vehicle-header">
      <h2>🚗 {{ $t('addVehicle.title') }}</h2>
    </header>

    <form @submit.prevent="addVehicleHandler" class="vehicle-form">
      <div class="form-group">
        <label for="model">{{ $t('addVehicle.model') }}</label>
        <input
            id="model"
            v-model="model"
            type="text"
            :placeholder="$t('addVehicle.modelPlaceholder')"
            required
        />
      </div>

      <div class="form-group">
        <label for="price">{{ $t('addVehicle.pricePerDay') }}</label>
        <input
            id="price"
            v-model.number="price"
            type="number"
            min="1"
            :placeholder="$t('addVehicle.pricePlaceholder')"
            required
        />
      </div>

      <div class="form-group">
        <label for="category">{{ $t('addVehicle.category') }}</label>
        <select
            id="category"
            v-model="category"
            :placeholder="$t('addVehicle.categoryPlaceholder')"
            required
        >
          <option value="sedan">{{ $t('addVehicle.sedan') }}</option>
          <option value="suv">{{ $t('addVehicle.suv') }}</option>
          <option value="hatchback">{{ $t('addVehicle.hatchback') }}</option>
          <option value="convertible">{{ $t('addVehicle.convertible') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="image">{{ $t('addVehicle.imageUrl') }}</label>
        <input
            id="image"
            v-model="image"
            type="url"
            :placeholder="$t('addVehicle.imagePlaceholder')"
            required
        />
      </div>

      <div class="form-group">
        <label for="features">{{ $t('addVehicle.features') }}</label>
        <textarea
            id="features"
            v-model="features"
            :placeholder="$t('addVehicle.featuresPlaceholder')"
            rows="4"
            required
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">{{ $t('addVehicle.add') }}</button>
        <button type="button" class="btn-secondary" @click="goToGallery">
          {{ $t('buttons.backToGallery') }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { addVehicle } from '../services/vehicule.service.js';

const router = useRouter();
const { t } = useI18n();

const model = ref('');
const price = ref(null);
const category = ref('');
const image = ref('');
const features = ref('');

async function addVehicleHandler() {
  if (model.value && price.value > 0 && image.value && category.value && features.value) {
    const newVehicle = {
      model: model.value,
      price: price.value,
      image: image.value,
      category: category.value,
      features: features.value,
    };

    await addVehicle(newVehicle);
    alert(t('addVehicle.success'));

    router.push('/gallery');
  } else {
    alert(t('addVehicle.error'));
  }
}

function goToGallery() {
  router.push('/gallery');
}
</script>


<style scoped>
.add-vehicle-section {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  color: var(--text-color, #333);
}

.add-vehicle-header {
  margin-bottom: 2rem;
  text-align: center;
}

.vehicle-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

input,
select,
textarea {
  padding: 0.75rem;
  border: 1px solid #006aff;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #0053cc;
  box-shadow: 0 0 0 3px rgba(0, 106, 255, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  transition: background 0.3s, color 0.3s;
  cursor: pointer;
}

.btn-primary {
  background-color: #006aff;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 106, 255, 0.2);
}

.btn-primary:hover:enabled {
  background-color: #0053cc;
}

.btn-secondary {
  background-color: transparent;
  color: #006aff;
  border: 2px solid #006aff;
}

.btn-secondary:hover {
  background-color: #e6f0ff;
}
</style>
