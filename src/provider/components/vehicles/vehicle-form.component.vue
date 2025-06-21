<template>
  <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
      {{ editMode ? 'Editar vehículo' : 'Publicar nuevo vehículo' }}
    </h2>

    <p class="mb-6 text-gray-600 dark:text-gray-400">
      Añade un nuevo vehículo a tu flota para que los clientes puedan reservarlo
    </p>

    <form @submit.prevent="handleSubmit" class="text-gray-800 dark:text-white  space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="form-group">
          <label for="brand" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Marca</label>
          <input
              id="brand"
              v-model="vehicle.brand"
              type="text"
              class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                   border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                   focus:border-primary-500 transition-colors"
              required
          />
        </div>

        <div class="form-group">
          <label for="model" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Modelo</label>
          <input
              id="model"
              v-model="vehicle.model"
              type="text"
              class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                   border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                   focus:border-primary-500 transition-colors"
              required
          />
        </div>

        <div class="form-group">
          <label for="year" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Año</label>
          <input
              id="year"
              v-model="vehicle.year"
              type="number"
              class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                   border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                   focus:border-primary-500 transition-colors"
              required
          />
        </div>

        <div class="form-group">
          <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo</label>
          <select
              id="type"
              v-model="vehicle.type"
              class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                   border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                   focus:border-primary-500 transition-colors"
              required
          >
            <option value="sedan">Sedán</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="pickup">Pickup</option>
            <option value="van">Van/Minivan</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="dailyRate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tarifa diaria (S/)</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
            <i class="pi pi-money-bill"></i>
          </span>
          <input
              id="dailyRate"
              v-model="vehicle.dailyRate"
              type="number"
              min="0"
              step="0.01"
              class="w-full p-2.5 pl-9 border rounded-xl bg-white dark:bg-gray-700
                   border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                   focus:border-primary-500 transition-colors"
              required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Descripción</label>
        <textarea
            id="description"
            v-model="vehicle.description"
            rows="3"
            class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                focus:border-primary-500 transition-colors"
            required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ubicación</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
            <i class="pi pi-map-marker"></i>
          </span>
          <input
              id="location"
              v-model="vehicle.location"
              type="text"
              class="w-full p-2.5 pl-9 border rounded-xl bg-white dark:bg-gray-700
                   border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                   focus:border-primary-500 transition-colors"
              required
          />
        </div>
      </div>

      <!-- Sección de carga de imágenes -->
      <div class="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          <i class="pi pi-images mr-2 text-primary-500"></i>Imágenes del vehículo
        </h3>

        <!-- Instrucciones y botón para subir -->
        <div class="mb-4">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Añade fotos de tu vehículo (máximo 5). Las imágenes de buena calidad aumentan las posibilidades de reserva.
          </p>

          <div
            class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl
                   border-gray-300 dark:border-gray-600 cursor-pointer bg-gray-50 dark:bg-gray-700/30
                   hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            @dragover.prevent="dragover = true"
            @dragleave.prevent="dragover = false"
            @drop.prevent="handleDrop"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700': dragover }"
          >
            <label class="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <i class="pi pi-cloud-upload text-2xl text-gray-500 dark:text-gray-400 mb-2"></i>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Haz clic para subir</span> o arrastra y suelta
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG o JPEG (máx. 5MB cada una)
                </p>
              </div>
              <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg"
                  class="hidden"
                  @change="handleImageUpload"
              />
            </label>
          </div>
        </div>

        <!-- Previsualizaciones de imágenes -->
        <div v-if="imageFiles.length > 0 || vehicle.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          <!-- Imágenes nuevas (archivos locales) -->
          <div
              v-for="(file, index) in imageFiles"
              :key="'file-' + index"
              class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-40"
          >
            <img
                :src="previewUrls[index]"
                class="w-full h-full object-cover"
                alt="Vista previa de imagen"
            />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                  type="button"
                  @click="removeImage(index)"
                  class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Imágenes existentes (de la base de datos) -->
          <div
              v-for="(imageUrl, index) in vehicle.images"
              :key="'db-' + index"
              class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-40"
          >
            <img
                :src="imageUrl"
                class="w-full h-full object-cover"
                alt="Imagen del vehículo"
            />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                  type="button"
                  @click="removeExistingImage(index)"
                  class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay imágenes -->
        <div v-if="imageFiles.length === 0 && vehicle.images.length === 0" class="text-center py-4">
          <p class="text-gray-500 dark:text-gray-400">
            No hay imágenes seleccionadas. Las imágenes son importantes para atraer clientes.
          </p>
        </div>
      </div>

      <div class="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          <i class="pi pi-cog mr-2 text-primary-500"></i>Especificaciones
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="form-group">
            <label for="doors" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Puertas</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <i class="pi pi-lock"></i>
              </span>
              <input
                  id="doors"
                  v-model="vehicle.specifications.doors"
                  type="number"
                  min="1"
                  class="w-full p-2.5 pl-9 border rounded-xl bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                       focus:border-primary-500 transition-colors"
                  required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="seats" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Asientos</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <i class="pi pi-user"></i>
              </span>
              <input
                  id="seats"
                  v-model="vehicle.specifications.seats"
                  type="number"
                  min="1"
                  class="w-full p-2.5 pl-9 border rounded-xl bg-white dark:bg-gray-700
                       border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                       focus:border-primary-500 transition-colors"
                  required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="transmission" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transmisión</label>
            <select
                id="transmission"
                v-model="vehicle.specifications.transmission"
                class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                     border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                     focus:border-primary-500 transition-colors"
                required
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automática</option>
            </select>
          </div>

          <div class="form-group">
            <label for="fuelType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Combustible</label>
            <select
                id="fuelType"
                v-model="vehicle.specifications.fuelType"
                class="w-full p-2.5 border rounded-xl bg-white dark:bg-gray-700
                     border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500
                     focus:border-primary-500 transition-colors"
                required
            >
              <option value="gasoline">Gasolina</option>
              <option value="diesel">Diésel</option>
              <option value="electric">Eléctrico</option>
              <option value="hybrid">Híbrido</option>
            </select>
          </div>

          <div class="form-group flex items-center bg-white dark:bg-gray-700 p-2.5 rounded-xl border border-gray-300 dark:border-gray-600">
            <input
                id="airConditioner"
                v-model="vehicle.specifications.airConditioner"
                type="checkbox"
                class="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label for="airConditioner" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Aire acondicionado
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-5">
        <button
            type="button"
            @click="$emit('cancel')"
            class="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200
                 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors
                 shadow-sm flex items-center gap-2"
        >
          <i class="pi pi-times"></i> Cancelar
        </button>
        <button
            type="submit"
            class="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700
                 transition-colors shadow-sm flex items-center gap-2"
        >
          <i class="pi" :class="editMode ? 'pi-save' : 'pi-plus'"></i>
          {{ editMode ? 'Guardar cambios' : 'Publicar vehículo' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import vehicleService from '../../services/vehicle.service.js'
import { Vehicle } from '../../model/vehicle.model.js'
import { createApiService } from '../../../shared/services/api.service.js'

const providerAPI = createApiService('provider');

const props = defineProps({
  vehicleId: { type: String, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const vehicle = ref(new Vehicle())
const loading = ref(false)
const error = ref(null)

const imageFiles = ref([])
const previewUrls = ref([])
const dragover = ref(false)

const editMode = computed(() => !!props.vehicleId)

onMounted(async () => {
  if (editMode.value) {
    loading.value = true
    try {
      // Obtener datos básicos del vehículo
      const data = await vehicleService.getVehicleById(props.vehicleId)
      vehicle.value = new Vehicle(data)
      
      console.log("Datos del vehículo cargados:", JSON.stringify(data, null, 2));
      
      // Ahora, obtener específicamente las imágenes del vehículo
      try {
        const imgResponse = await providerAPI.get(`/vehicles/${props.vehicleId}/images`);
        console.log("Respuesta específica de imágenes:", JSON.stringify(imgResponse.data, null, 2));
        
        // Si la respuesta contiene un array de imágenes, procesarlo y usarlo
        if (imgResponse.data) {
          const processedImages = processVehicleImages(imgResponse.data);
          console.log("Imágenes procesadas del endpoint específico:", processedImages);
          
          if (processedImages && processedImages.length > 0) {
            vehicle.value.images = processedImages;
          }
        }
      } catch (imgError) {
        console.warn("No se pudieron obtener imágenes específicas:", imgError);
        // Si falla, intentamos usar las imágenes incluidas en los datos del vehículo
        console.log("Intentando usar imágenes del objeto vehículo:", vehicle.value.images);
        
        // Intentar acceder a diferentes propiedades donde podrían estar las imágenes
        let rawImages = data.images || data.Images || [];
        
        // Si encontramos imágenes, procesarlas
        if (rawImages && (Array.isArray(rawImages) || typeof rawImages === 'object')) {
          const processedImages = processVehicleImages(rawImages);
          console.log("Imágenes procesadas del objeto vehículo:", processedImages);
          
          if (processedImages && processedImages.length > 0) {
            vehicle.value.images = processedImages;
          }
        }
      }
      
      // Log final para verificar las imágenes cargadas
      console.log("Imágenes finales cargadas para el vehículo:", vehicle.value.images);
    } catch (err) {
      error.value = 'Error al cargar los datos del vehículo'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
})

// Funciones para procesar imágenes
function processVehicleImages(images) {
  if (!images) return [];
  
  // Caso 1: Si es un array normal, procesamos cada elemento
  if (Array.isArray(images)) {
    return images.map(image => getImageUrl(image));
  }
  
  // Caso 2: Si tiene la propiedad $values (formato específico del backend)
  if (images.$values && Array.isArray(images.$values)) {
    return images.$values.map(image => getImageUrl(image));
  }
  
  // Caso 3: Si es un objeto con una única imagen
  if (typeof images === 'object' && !Array.isArray(images)) {
    const singleImage = getImageUrl(images);
    return singleImage ? [singleImage] : [];
  }
  
  // Si no coincide con ninguno de los casos anteriores, devolvemos array vacío
  console.warn('Formato de imágenes no reconocido:', images);
  return [];
}

// Función para obtener la URL completa de la imagen
function getImageUrl(image) {
  // Si es null o undefined, devolver string vacío
  if (!image) return '';
  
  // Caso 1: Si la imagen es una cadena directamente
  if (typeof image === 'string') {
    return formatImageUrl(image);
  }
  
  // Caso 2: Si la imagen es un objeto con propiedades específicas
  if (typeof image === 'object') {
    // Buscar propiedades comunes que podrían contener la URL
    const possibleProps = ['url', 'path', 'imageUrl', 'imagePath', 'filePath'];
    for (const prop of possibleProps) {
      if (image[prop] && typeof image[prop] === 'string') {
        return formatImageUrl(image[prop]);
      }
    }
    
    // Caso especial: Si tiene $values, usar el primer valor
    if (image.$values && Array.isArray(image.$values) && image.$values.length > 0) {
      return getImageUrl(image.$values[0]);
    }
  }
  
  console.warn('No se pudo extraer URL de imagen:', image);
  return '';
}

// Función auxiliar para formatear URLs
function formatImageUrl(path) {
  // Si es null o undefined, devolver string vacío
  if (!path) return '';
  
  // Si ya es una URL completa, devolverla directamente
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Construir URL completa usando la base de tu aplicación backend
  const baseUrl = 'http://localhost:5239'; // Ajusta esto a tu URL real
  
  // Limpiar path para evitar problemas de doble barra
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Construir y devolver la URL completa
  const fullUrl = `${baseUrl}${cleanPath}`;
  console.log(`URL formateada: ${fullUrl} (de ${path})`);
  return fullUrl;
}

async function handleSubmit() {
  loading.value = true
  error.value = null

  try {
    let result
    // Convertir el objeto a formato compatible con la API antes de enviarlo
    const vehicleData = vehicle.value.toApiFormat()
    
    if (editMode.value) {
      result = await vehicleService.updateVehicle(props.vehicleId, vehicleData)
    } else {
      result = await vehicleService.registerVehicle(vehicleData)
    }
    
    // Si hay imágenes nuevas para subir
    if (imageFiles.value.length > 0) {
      try {
        // Usar el ID del vehículo recién creado o actualizado
        const vehicleId = editMode.value ? props.vehicleId : result.id
        console.log(`Subiendo ${imageFiles.value.length} imágenes para el vehículo ${vehicleId}`)
        
        // Subir las imágenes
        const uploadResult = await vehicleService.uploadVehicleImages(vehicleId, imageFiles.value)
        console.log('Imágenes subidas correctamente:', uploadResult)
        
        // Actualizar el resultado con las imágenes
        if (uploadResult && uploadResult.images) {
          result.images = uploadResult.images
        } else if (uploadResult && uploadResult.Images) {
          // El backend puede devolver Images (con I mayúscula)
          result.images = uploadResult.Images
        }
        
        // Actualizar el vehículo con las nuevas imágenes para que se muestren inmediatamente
        vehicle.value.images = result.images || []
        
        // Limpiar las imágenes locales ya que se han subido
        imageFiles.value = []
        previewUrls.value = []
      } catch (uploadError) {
        console.error('Error al subir imágenes:', uploadError)
        // No interrumpimos el flujo principal si falla la subida de imágenes
      }
    }
    
    emit('submit', result)
  } catch (err) {
    error.value = editMode.value
        ? 'Error al actualizar el vehículo'
        : 'Error al crear el vehículo'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleImageUpload(event) {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (imageFiles.value.length < 5) {
      imageFiles.value.push(file)
      const reader = new FileReader()
      reader.onload = e => previewUrls.value.push(e.target.result)
      reader.readAsDataURL(file)
    }
  })
}

function handleDrop(event) {
  const files = Array.from(event.dataTransfer.files)
  files.forEach(file => {
    if (imageFiles.value.length < 5) {
      imageFiles.value.push(file)
      const reader = new FileReader()
      reader.onload = e => previewUrls.value.push(e.target.result)
      reader.readAsDataURL(file)
    }
  })
}

function removeImage(index) {
  imageFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

function removeExistingImage(index) {
  vehicle.value.images.splice(index, 1)
}
</script>

<style scoped>

input:focus, select:focus, textarea:focus {
  @apply transform scale-[1.01] transition-transform;
}


button:hover {
  @apply transform scale-[1.02] transition-transform;
}
</style>
