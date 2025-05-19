import { ref } from 'vue'
import { fetchAdminStats } from '../api/statsApi'

const stats = ref(null)
const loading = ref(false)

export async function loadStats() {
    loading.value = true
    stats.value = await fetchAdminStats()
    loading.value = false
}

export function useStats() {
    return { stats, loading, loadStats }
}