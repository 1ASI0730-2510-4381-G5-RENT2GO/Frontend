import { ref } from 'vue'
import { fetchPendingApprovals } from '../api/approvalsApi'

const approvals = ref([])
const loading = ref(false)

export async function loadApprovals() {
    loading.value = true
    approvals.value = await fetchPendingApprovals()
    loading.value = false
}

export function useApprovals() {
    return { approvals, loading, loadApprovals }
}