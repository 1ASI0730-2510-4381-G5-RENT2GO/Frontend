<template>
  <div>
    <StatsWidget v-if="stats" :stats="stats"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStats } from '../services/statsService'
import StatsWidget from '../components/StatsWidget.component.vue'

const { stats, loadStats } = useStats()
onMounted(loadStats)
</script>