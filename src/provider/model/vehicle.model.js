/**
 * Modelo que representa un vehículo publicado por un proveedor
 */
export class Vehicle {
    constructor(data = {}) {
        this.id = data.id || null
        this.providerId = data.providerId || null
        this.brand = data.brand || ''
        this.model = data.model || ''
        this.year = data.year || new Date().getFullYear()
        this.type = data.type || '' // sedan, suv, pickup, etc.
        this.description = data.description || ''
        this.dailyRate = data.dailyRate || 0
        this.location = data.location || ''
        this.status = data.status || 'available' // available, rented, maintenance, inactive
        this.images = data.images || []
        this.features = data.features || []
        this.specifications = data.specifications || {
            doors: 4,
            seats: 5,
            transmission: 'manual',
            fuelType: 'gasoline',
            airConditioner: true
        }
        this.createdAt = data.createdAt || new Date()
        this.updatedAt = data.updatedAt || new Date()
    }

    /**
     * Verifica si el vehículo está disponible para alquilar
     * @returns {boolean}
     */
    isAvailable() {
        return this.status === 'available'
    }

    /**
     * Calcula el precio para un rango de fechas
     * @param {Date} startDate - Fecha de inicio
     * @param {Date} endDate - Fecha de fin
     * @returns {number} - Precio total
     */
    calculatePriceForPeriod(startDate, endDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        return days * this.dailyRate
    }
}

export default Vehicle