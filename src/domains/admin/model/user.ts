export interface User {
    id: string
    nombre: string
    email: string
    rol: 'client' | 'provider' | 'admin'
    estado: 'activo' | 'pendiente' | 'suspendido'
    fechaRegistro: string
}