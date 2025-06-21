export class Vehicle {
  constructor(data = {}) {
    this.id = data.id || '';
    this.brand = data.brand || '';
    this.model = data.model || '';
    this.year = data.year || new Date().getFullYear();
    this.type = data.type || 'sedan';
    this.dailyRate = data.dailyRate || 0;
    this.description = data.description || '';
    this.location = data.location || '';
    this.status = data.status || 'available';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    
    // Especificaciones técnicas
    this.specifications = {
      doors: data.doors || data.specifications?.doors || 4,
      seats: data.seats || data.specifications?.seats || 5,
      transmission: data.transmission || data.specifications?.transmission || 'manual',
      fuelType: data.fuelType || data.specifications?.fuelType || 'gasoline',
      airConditioner: data.airConditioner !== undefined 
        ? data.airConditioner 
        : data.specifications?.airConditioner !== undefined 
        ? data.specifications.airConditioner 
        : true
    };
    
    // Arreglo de imágenes
    this.images = data.images || [];
  }
  
  // Método para convertir el objeto a formato compatible con la API
  toApiFormat() {
    return {
      brand: this.brand,
      model: this.model,
      year: this.year,
      type: this.type,
      dailyRate: this.dailyRate,
      description: this.description,
      location: this.location,
      status: this.status,
      doors: this.specifications.doors,
      seats: this.specifications.seats,
      transmission: this.specifications.transmission,
      fuelType: this.specifications.fuelType,
      airConditioner: this.specifications.airConditioner
    };
  }
}

