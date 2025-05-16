<template>
  <div class="footer-content" aria-label="Footer content section">
    <p>&copy; 2025 FleetRental. {{ $t('footer.rights') }}</p>
    <ul class="footer-links" role="navigation" aria-label="Footer navigation links">
      <li><a href="#" aria-label="Privacy Policy">{{ $t('footer.privacy') }}</a></li>
      <li><a href="#" aria-label="Terms of Service">{{ $t('footer.terms') }}</a></li>
      <li><a href="#" aria-label="Contact">{{ $t('footer.contact') }}</a></li>
    </ul>
  </div>
</template>

<script setup></script>

<style scoped>
.footer-content {
  padding: 2rem 1rem;
  text-align: center;
  background-color: #1f1f1f;
  color: white;
  font-family: 'Poppins', sans-serif;
  border-top: 2px solid #006aff;
}

.footer-content p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}


.footer-links a {
  text-decoration: none;
  color: #006aff;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.3s ease;
}

.footer-links a:hover {
  color: white;
  transform: translateY(-2px);
}

.footer-links a:focus {
  outline: 2px solid #006aff;
  outline-offset: 2px;
}
</style>

