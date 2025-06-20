/**
 * Modelo que representa a un proveedor de vehículos en Rent2Go
 */
export class Provider {
    constructor(data = {}) {
        this.id = data.id || null
        this.userId = data.userId || null
        this.businessName = data.businessName || ''
        this.taxId = data.taxId || ''
        this.email = data.email || ''
        this.phone = data.phone || ''
        this.address = data.address || ''
        this.city = data.city || ''
        this.postalCode = data.postalCode || ''
        this.country = data.country || ''
        this.balance = data.balance || 0
        this.totalEarnings = data.totalEarnings || 0
        this.pendingPayments = data.pendingPayments || 0
        this.status = data.status || 'pending' // pending, active, suspended
        this.bankAccount = data.bankAccount || ''
        this.createdAt = data.createdAt || new Date()
        this.updatedAt = data.updatedAt || new Date()
    }

    /**
     * Verifica si el proveedor está activo
     * @returns {boolean}
     */
    isActive() {
        return this.status === 'active'
    }

    /**
     * Verifica si el proveedor puede retirar ganancias
     * @param {number} amount - Cantidad a retirar
     * @returns {boolean}
     */
    canWithdraw(amount) {
        return this.isActive() && amount > 0 && amount <= this.balance
    }
}

export default Provider