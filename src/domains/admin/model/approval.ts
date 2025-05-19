export interface Approval {
    id: string
    tipo: 'auto' | 'proveedor'
    entidadId: string
    nombreEntidad: string
    estado: 'pendiente' | 'aprobado' | 'rechazado'
    fechaSolicitud: string
}