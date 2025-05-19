import { ref } from 'vue'
import { fetchUsers } from '../api/usersApi'

const users = ref([])
const loading = ref(false)

export async function loadUsers() {
    loading.value = true
    users.value = await fetchUsers()
    loading.value = false
}

export function useUsers() {
    return { users, loading, loadUsers }
}