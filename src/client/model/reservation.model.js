/**
 * Modelo que representa una reserva de vehículo
 */
export class Reservation {
    /**
     * @param {string} id - Identificador único de la reserva
     * @param {string} vehicleId - ID del vehículo reservado
     * @param {string} clientId - ID del cliente que realizó la reserva
     * @param {string} providerId - ID del proveedor del vehículo
     * @param {string} vehicleBrand - Marca del vehículo
     * @param {string} vehicleModel - Modelo del vehículo
     * @param {string} vehicleImage - URL de la imagen principal del vehículo
     * @param {string} pickupDate - Fecha de recogida
     * @param {string} returnDate - Fecha de devolución
     * @param {string} pickupLocation - Lugar de recogida
     * @param {string} returnLocation - Lugar de devolución
     * @param {number} totalDays - Total de días de reserva
     * @param {number} pricePerDay - Precio por día
     * @param {number} totalAmount - Monto total de la reserva
     * @param {string} paymentStatus - Estado del pago
     * @param {string} reservationStatus - Estado de la reserva
     * @param {string} createdAt - Fecha de creación de la reserva
     * @param {Object} extras - Servicios adicionales contratados
     */
    constructor({
        id,
        vehicleId,
        clientId,
        providerId,
        vehicleBrand,
        vehicleModel,
        vehicleImage,
        pickupDate,
        returnDate,
        pickupLocation,
        returnLocation,
        totalDays,
        pricePerDay,
        totalAmount,
        paymentMethod,
        paymentStatus,
        reservationStatus,
        createdAt,
        extras
    }) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.clientId = clientId;
        this.providerId = providerId;
        this.vehicleBrand = vehicleBrand;
        this.vehicleModel = vehicleModel;
        this.vehicleImage = vehicleImage;
        this.pickupDate = pickupDate ? new Date(pickupDate) : null;
        this.returnDate = returnDate ? new Date(returnDate) : null;
        this.pickupLocation = pickupLocation;
        this.returnLocation = returnLocation || pickupLocation;
        this.totalDays = totalDays || this.calculateDays();
        this.pricePerDay = pricePerDay || 0;
        this.totalAmount = totalAmount || this.calculateTotal();
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus || 'pending';
        this.reservationStatus = reservationStatus || 'pending';
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.extras = extras || {};
    }

    /**
     * Calcula el número de días entre la fecha de recogida y devolución
     * @returns {number}
     */
    calculateDays() {
        if (!this.pickupDate || !this.returnDate) return 0;
        const diffTime = this.returnDate.getTime() - this.pickupDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calcula el importe total de la reserva
     * @returns {number}
     */
    calculateTotal() {
        const daysAmount = this.pricePerDay * (this.totalDays || this.calculateDays());
        const extrasAmount = Object.values(this.extras || {}).reduce((sum, extra) =>
            sum + (extra.price || 0), 0);
        return daysAmount + extrasAmount;
    }

    /**
     * Verifica si la reserva puede ser cancelada
     * @returns {boolean}
     */
    canCancel() {
        return ['pending', 'confirmed'].includes(this.reservationStatus);
    }

    /**
     * Verifica si la reserva está activa (confirmada y no completada)
     * @returns {boolean}
     */
    isActive() {
        return this.reservationStatus === 'confirmed' &&
               new Date() <= this.returnDate;
    }

    /**
     * Formatea la fecha de recogida
     * @returns {string}
     */
    formattedPickupDate() {
        return this.pickupDate?.toLocaleDateString() || 'N/A';
    }

    /**
     * Formatea la fecha de devolución
     * @returns {string}
     */
    formattedReturnDate() {
        return this.returnDate?.toLocaleDateString() || 'N/A';
    }
}
