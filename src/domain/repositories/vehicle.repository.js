import { fetchVehicles, addVehicle } from '../services/vehicule.service.js';
import Vehicle from '../model/vehicule.model.js';

export async function getAllVehicles() {
    const rawData = await fetchVehicles();
    return rawData.map((v) => new Vehicle(v));
}

export async function createVehicle(data) {
    return await addVehicle(data);
}
