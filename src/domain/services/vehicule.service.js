import axios from 'axios';

//const API_URL = 'http://localhost:3001/vehicles';
const API_URL = 'https://rent2go-cars.free.beeceptor.com/vehicules';

export const getVehicles = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const addVehicle = async (vehicle) => {
    const { data } = await axios.post(API_URL, vehicle);
    return data;
};