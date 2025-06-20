<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCardComponent
          title="Vehículos"
          icon="pi-car"
          color="blue"
          :mainValue="stats.totalVehicles"
          :secondaryValue="stats.availableVehicles"
          secondaryLabel="disponibles actualmente"
          secondaryColor="green"
      />

      <StatsCardComponent
          title="Reservas activas"
          icon="pi-calendar"
          color="green"
          :mainValue="stats.activeReservations"
          :secondaryValue="stats.pendingReservations"
          secondaryLabel="pendientes de confirmar"
          secondaryColor="blue"
      />

      <StatsCardComponent
          title="Ganancias"
          icon="pi-money-bill"
          color="purple"
          :mainValue="formatCurrency(stats.earnings)"
          secondaryLabel="Acumulado este mes"
      />
    </div>

    <RecentReservationsComponent
        :reservations="recentReservations"
        :loading="loading"
    />

    <FleetPerformanceComponent
        :topVehicles="topVehicles"
        :loading="loading"
    />

    <QuickActionsComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import vehicleService from '../services/vehicle.service.js'
import reservationService from '../services/reservation.service.js'
import StatsCardComponent from '../components/dashboard/stats-card.component.vue'
import RecentReservationsComponent from '../components/dashboard/recent-reservations.component.vue'
import FleetPerformanceComponent from '../components/dashboard/fleet-performance.component.vue'
import QuickActionsComponent from '../components/dashboard/quick-actions.component.vue'

const stats = ref({
  totalVehicles: 0,
  availableVehicles: 0,
  activeReservations: 0,
  pendingReservations: 0,
  earnings: 0
})
const recentReservations = ref([])
const loading = ref(true)
const topVehicles = ref([])

async function loadDashboardData() {
  loading.value = true
  try {
    const vehicles = await vehicleService.getVehicles()
    stats.value.totalVehicles = vehicles.length
    stats.value.availableVehicles = vehicles.filter(v => v.status === 'available').length

    const reservations = await reservationService.getReservations()
    recentReservations.value = reservations.slice(0, 5) // últimas 5 reservas

    stats.value.activeReservations = reservations.filter(r =>
        ['confirmed', 'in_progress'].includes(r.status)
    ).length

    stats.value.pendingReservations = reservations.filter(r =>
        r.status === 'pending'
    ).length

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    stats.value.earnings = reservations
        .filter(r => {
          const reservationDate = new Date(r.startDate)
          return reservationDate.getMonth() === thisMonth &&
              reservationDate.getFullYear() === thisYear &&
              ['completed', 'in_progress', 'confirmed'].includes(r.status)
        })
        .reduce((sum, reservation) => sum + reservation.totalAmount, 0)

    topVehicles.value = vehicles
        .map(vehicle => {
          const vehicleReservations = reservations.filter(r => r.vehicle.id === vehicle.id)
          return {
            ...vehicle,
            reservationsCount: vehicleReservations.length,
            earnings: vehicleReservations.reduce((sum, r) => sum + r.totalAmount, 0)
          }
        })
        .sort((a, b) => b.earnings - a.earnings)
        .slice(0, 3)

  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  } finally {
    loading.value = false
  }
}

function formatCurrency(amount) {
  return ' S/ ' + amount.toFixed(2)
}

onMounted(loadDashboardData)
</script>