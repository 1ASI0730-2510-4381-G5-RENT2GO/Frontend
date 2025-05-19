// Reemplaza estos mocks por axios.get('TU_ENDPOINT')
export async function fetchUsers() {
    return [
        {
            id: '1',
            nombre: 'Alice',
            email: 'alice@mail.com',
            rol: 'provider',
            estado: 'activo',
            fechaRegistro: '2023-02-20'
        },
        {
            id: '2',
            nombre: 'Bob',
            email: 'bob@mail.com',
            rol: 'client',
            estado: 'pendiente',
            fechaRegistro: '2024-01-17'
        }
    ]
}