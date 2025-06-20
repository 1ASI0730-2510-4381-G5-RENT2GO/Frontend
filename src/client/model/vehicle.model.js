/**
 * Modelo que representa un vehículo disponible para alquiler
 */
export class Vehicle {
    /**
     * @param {string} id - Identificador único del vehículo
     * @param {string} brand - Marca del vehículo
     * @param {string} model - Modelo del vehículo
     * @param {number} year - Año de fabricación
     * @param {string} licensePlate - Placa del vehículo
     * @param {string} type - Tipo de vehículo (sedan, SUV, etc.)
     * @param {number} capacity - Capacidad de pasajeros
     * @param {string} transmission - Tipo de transmisión (manual, automática)
     * @param {boolean} airConditioner - Disponibilidad de aire acondicionado
     * @param {string} fuel - Tipo de combustible
     * @param {string} color - Color del vehículo
     * @param {number} price - Precio por día
     * @param {string} location - Ubicación del vehículo
     * @param {Array<string>} images - URLs de imágenes del vehículo
     * @param {boolean} available - Estado de disponibilidad
     * @param {string} ownerId - ID del propietario (proveedor)
     * @param {string} ownerName - Nombre del propietario (proveedor)
     * @param {Object} features - Características adicionales
     */
    constructor({
        id,
        brand,
        model,
        year,
        licensePlate,
        type,
        capacity,
        transmission,
        airConditioner,
        fuel,
        color,
        price,
        location,
        images,
        available,
        ownerId,
        ownerName,
        features
    }) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.licensePlate = licensePlate;
        this.type = type;
        this.capacity = capacity;
        this.transmission = transmission;
        this.airConditioner = airConditioner;
        this.fuel = fuel;
        this.color = color;
        this.price = price;
        this.location = location;
        this.images = images || [];
        this.available = available ?? true;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.features = features || {};
    }

    /**
     * Obtiene el nombre completo del vehículo (marca + modelo + año)
     * @returns {string}
     */
    get fullName() {
        return `${this.brand} ${this.model} ${this.year}`;
    }

    /**
     * Obtiene la primera imagen del vehículo o una imagen por defecto
     * @returns {string}
     */
    get mainImage() {
        return this.images?.[0] || '/img/default-car.jpg';
    }
}
