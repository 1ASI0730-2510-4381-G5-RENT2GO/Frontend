<template>
  <section aria-label="Home main section">
    <h1>{{ $t('home.welcome') }}</h1>
    <p>{{ $t('home.subtitle') }}</p>

    <div class="nav-cards" role="navigation" aria-label="Main options">
      <RouterLink to="/gallery" class="card" aria-label="Go to Vehicle Gallery">
        <div class="card-content">
          <img src="https://cdn.jsdelivr.net/npm/heroicons@1.0.6/outline/photograph.svg" alt="Gallery" class="card-icon" />
          <h2>{{ $t('menu.gallery') }}</h2>
          <p>{{ $t('home.galleryDesc') }}</p>
        </div>
      </RouterLink>
      <RouterLink to="/rentals" class="card" aria-label="Go to My Rentals">
        <div class="card-content">
          <img src="https://img.icons8.com/ios/452/wallet.png" alt="Rentals" class="card-icon" />
          <h2>{{ $t('menu.rentals') }}</h2>
          <p>{{ $t('home.rentalsDesc') }}</p>
        </div>
      </RouterLink>
      <RouterLink to="/add-vehicle" class="card" aria-label="Go to Add Vehicle">
        <div class="card-content">
          <img src="https://cdn.jsdelivr.net/npm/heroicons@1.0.6/outline/plus-circle.svg" alt="Add Vehicle" class="card-icon" />
          <h2>{{ $t('menu.add') }}</h2>
          <p>{{ $t('home.addDesc') }}</p>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
section {
  text-align: center;
  padding: 2rem;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.card {
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card:hover {
  background-color: #006aff;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.2);
}


h2 {
  margin: 0.5rem 0;
  font-size: 1.5rem;
}

p {
  font-size: 1rem;
  color: #555;
}

.card a {
  color: inherit;
  text-decoration: none;
}
</style>
