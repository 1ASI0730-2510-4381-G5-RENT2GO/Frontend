/**
 * Modelo que representa un cliente en el sistema
 */
export class Client {
    /**
     * @param {string} id - Identificador único del cliente
     * @param {string} name - Nombre completo del cliente
     * @param {string} email - Correo electrónico del cliente
     * @param {string} phone - Número de teléfono del cliente
     * @param {string} dni - Documento de identidad del cliente
     * @param {Date} createdAt - Fecha de creación del registro
     */
    constructor({
        id,
        name,
        email,
        phone,
        dni,
        createdAt
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dni = dni;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
    }
}

