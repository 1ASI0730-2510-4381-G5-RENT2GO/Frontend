<template>
  <section class="not-found" role="alert" aria-label="Page not found message">
    <h1>404</h1>
    <h2>{{ $t('notFound.title') }}</h2>
    <p>{{ $t('notFound.description') }}</p>
    <RouterLink to="/" class="home-link">
      {{ $t('notFound.goHome') }}
    </RouterLink>
  </section>
</template>

<script setup></script>

<style scoped>
.not-found {
  text-align: center;
  padding: 3rem 1rem;
  font-family: 'Poppins', sans-serif;
}
.not-found h1 {
  font-size: 6rem;
  margin-bottom: 0.5rem;
  color: #006aff;
}
.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.not-found p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #006aff;
  background-color: transparent;
  border: 2px solid #006aff;
  border-radius: 12px;
  transition: background 0.3s, color 0.3s;
  text-decoration: none;
}

.home-link:hover {
  background-color: #006aff;
  color: white;
}
</style>

