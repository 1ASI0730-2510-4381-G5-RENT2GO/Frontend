/**
 * Modelo que representa una reserva en el sistema
 */
export class Reservation {
    constructor(data = {}) {
        this.id = data.id || null
        this.providerId = data.providerId || null
        this.clientId = data.clientId || null
        this.vehicleId = data.vehicleId || null
        this.startDate = data.startDate || null
        this.endDate = data.endDate || null
        this.status = data.status || 'pending' // pending, confirmed, in_progress, completed, cancelled
        this.paymentStatus = data.paymentStatus || 'pending' // pending, paid
        this.paymentMethod = data.paymentMethod || null
        this.totalAmount = data.totalAmount || 0
        this.vehiclePrice = data.vehiclePrice || 0
        this.extras = data.extras || []
        this.location = data.location || ''
        this.notes = data.notes || ''
        this.client = data.client || {}
        this.vehicle = data.vehicle || {}
        this.createdAt = data.createdAt || new Date()
        this.updatedAt = data.updatedAt || new Date()
    }

    /**
     * Calcula la duración de la reserva en días
     * @returns {number}
     */
    getDurationInDays() {
        if (!this.startDate || !this.endDate) return 0;

        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = end.getTime() - start.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Verifica si la reserva está activa
     * @returns {boolean}
     */
    isActive() {
        return ['confirmed', 'in_progress'].includes(this.status);
    }

    /**
     * Verifica si la reserva se puede cancelar
     * @returns {boolean}
     */
    canBeCancelled() {
        return ['pending', 'confirmed'].includes(this.status);
    }
}

export default Reservation