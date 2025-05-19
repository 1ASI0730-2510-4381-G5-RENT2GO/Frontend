<template>
  <main>
    <StatsWidget v-if="stats" :stats="stats" />
  </main>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStats } from '../services/statsService'
import StatsWidget from '../components/StatsWidget.component.vue'

const { stats, loadStats } = useStats()

onMounted(() => {
  loadStats()
})
</script>