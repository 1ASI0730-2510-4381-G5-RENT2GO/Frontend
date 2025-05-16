<template>
  <section class="car-gallery" role="region" aria-label="Car Gallery">
    <header class="gallery-header">
      <button class="btn-secondary" @click="goHome">
        {{ $t('buttons.backToMenu') }}
      </button>
      <button
          class="btn-primary"
          @click="fetchCars"
          :disabled="loading"
          aria-busy="true"
      >
        {{ $t('gallery.refreshCars') }}
      </button>
    </header>

    <div v-if="loading" class="loading" role="status">
      {{ $t('gallery.loading') }}...
    </div>
    <div v-else-if="cars.length === 0" class="empty" role="alert">
      {{ $t('gallery.noCars') }}
    </div>
    <div v-else class="car-list">
      <div
          v-for="car in cars"
          :key="car.id"
          class="car-card"
          role="article"
          :aria-label="car.model"
      >
        <img :src="car.image" :alt="car.model" class="car-image" />
        <h3>{{ car.model }}</h3>
        <p>{{ car.description || '' }}</p>
        <p>{{ $t('gallery.price') }}: ${{ car.price }}</p>
        <button class="btn-primary" @click="reserveCar(car)">
          {{ $t('gallery.reserve') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const cars = ref([]);
const loading = ref(false);

const fetchCars = async () => {
  loading.value = true;
  try {
    //const response = await fetch('http://localhost:3001/vehicles'); //local json-server --watch server/db.json --port 3001
    const response = await fetch('https://rent2go-cars.free.beeceptor.com/vehicules');
    const data = await response.json();
    console.log('Api Response:', data); //


    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const reservedVehicleIds = reservations.map(r => r.vehicleId);

    //cars.value = data.filter(car => !reservedVehicleIds.includes(car.id)); // Local
    cars.value = (data.vehicles || []).filter(car => !reservedVehicleIds.includes(car.id)); // Beeceptor
  } catch (error) {
    console.error('Error fetching cars:', error);
    cars.value = [];
  } finally {
    loading.value = false;
  }
};

const goHome = () => {
  router.push('/');
};

const reserveCar = (car) => {
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

  if (reservations.find(r => r.vehicleId === car.id)) {
    alert(t('gallery.alreadyReserved'));
    return;
  }

  reservations.push({
    id: Date.now(),
    vehicleId: car.id,
    model: car.model,
    image: car.image,
    price: car.price,
  });

  localStorage.setItem('reservations', JSON.stringify(reservations));
  alert(t('gallery.reservationSuccess'));

  cars.value = cars.value.filter(c => c.id !== car.id);
};

onMounted(fetchCars);
</script>

<style scoped>
.car-gallery {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
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

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.car-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.car-card {
  background: var(--bg-color, #fff);
  color: var(--text-color, #333);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.car-card:hover {
  transform: translateY(-4px);
}

.car-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
}

.loading,
.empty {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-color, #555);
  padding: 2rem;
}
</style>
