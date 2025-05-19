// Reemplaza este mock por axios.get('TU_ENDPOINT/commissions')
export async function fetchCommissions() {
    return [
        {
            id: 'c-001',
            proveedor: 'Alice',
            porcentaje: 10,       // %
            montoBruto: 1500,     // importe original
            montoComision: 150,   // calculado
            fecha: '2024-04-15',
            estado: 'pendiente'   // pendiente | pagada
        },
        {
            id: 'c-002',
            proveedor: 'Bob',
            porcentaje: 12,
            montoBruto: 2000,
            montoComision: 240,
            fecha: '2024-04-20',
            estado: 'pagada'
        },
        {
            id: 'c-003',
            proveedor: 'Carlos',
            porcentaje: 8,
            montoBruto: 800,
            montoComision: 64,
            fecha: '2024-05-01',
            estado: 'pendiente'
        }
    ]
}