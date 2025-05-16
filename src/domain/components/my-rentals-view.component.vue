<template>
  <section class="rentals-section" role="region" aria-label="My Rentals">
    <header class="rentals-header">
      <h2>📃 {{ $t('myRentals.title') }}</h2>
      <div class="rentals-actions">
        <button class="btn-secondary" @click="goBack">
          {{ $t('buttons.backToMenu') }}
        </button>
      </div>
    </header>

    <div v-if="rentals.length === 0" class="no-rentals" role="alert">
      {{ $t('myRentals.noRentals') }}
    </div>

    <div v-else class="rentals-list">
      <div
          v-for="rental in rentals"
          :key="rental.id"
          class="rental-card"
          role="article"
          :aria-label="`${rental.model}`"
      >
        <img
            :src="rental.image"
            :alt="rental.model"
            class="rental-image"
        />
        <div class="rental-details">
          <h3>{{ rental.model }}</h3>
          <p>{{ $t('myRentals.price') }}: ${{ rental.price }}</p>
          <button class="btn-secondary" @click="releaseRental(rental.vehicleId)">
            {{ $t('myRentals.release') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const rentals = ref([]);

const goBack = () => {
  router.push('/');
};

const loadRentals = () => {
  const storedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  rentals.value = storedReservations;
};

const releaseRental = (vehicleId) => {
  let storedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  storedReservations = storedReservations.filter(r => r.vehicleId !== vehicleId);
  localStorage.setItem('reservations', JSON.stringify(storedReservations));
  rentals.value = storedReservations;
  alert(t('myRentals.releaseSuccess'));
};

onMounted(loadRentals);
</script>


<style scoped>
.rentals-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.rentals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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

.rentals-list {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.rental-card {
  background-color: var(--bg-color, #fff);
  color: var(--text-color, #333);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 1rem;
  transition: transform 0.3s ease;
}

.rental-card:hover {
  transform: translateY(-4px);
}

.rental-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
}

.rental-details {
  padding-top: 1rem;
}

.no-rentals {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-color, #555);
  padding: 2rem;
}
</style>
