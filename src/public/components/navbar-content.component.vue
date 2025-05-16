<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="navbar-brand">
      <a href="/" aria-label="FleetRental Home">
        <img
            src="../../assets/images/favicon.svg"
            alt="Rent2Go Logo"
            class="logo"
        />
      </a>
    </div>

    <div class="navbar-actions">
      <LanguageSwitcher />

      <button class="profile-button" aria-label="User profile">
        <img
            src="../../assets/images/user-profile-icon.svg"
            alt="User profile"
            class="profile-icon"
        />
      </button>

      <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle theme">
        {{ theme === 'dark' ? '☀️' : '🌙' }}
      </button>
    </div>
  </nav>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import LanguageSwitcher from './language-switcher.component.vue';

const theme = ref('light');

function toggleTheme() {
  const next = theme.value === 'light' ? 'dark' : 'light';
  theme.value = next;
  localStorage.setItem('theme', next);
  document.body.classList.toggle('dark-theme', next === 'dark');
}

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'light';
  theme.value = saved;
  document.body.classList.toggle('dark-theme', saved === 'dark');
});
</script>

<style scoped>

body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease;
}

.navbar-brand .logo {
  height: 40px;
  max-width: 160px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.navbar-brand .logo:hover {
  transform: scale(1.05);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.profile-button:hover {
  transform: scale(1.1);
}

.profile-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  transition: transform 0.2s;
}

.theme-toggle:hover {
  transform: scale(1.2);
}

body {
  background-color: #f0f0f0;
  color: #333;
}

body.dark-theme {
  background-color: #121212;
  color: #fff;
}
</style>
