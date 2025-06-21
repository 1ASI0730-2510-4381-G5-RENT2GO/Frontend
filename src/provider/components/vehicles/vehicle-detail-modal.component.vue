<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    @click.self="$emit('update:modelValue', false)"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <div v-if="loading" class="p-8 text-center">
        <i class="pi pi-spin pi-spinner text-3xl text-primary-500 mb-2"></i>
        <p class="text-gray-600 dark:text-gray-300">Cargando información del vehículo...</p>
      </div>

      <div v-else-if="!vehicle" class="p-8 text-center">
        <i class="pi pi-exclamation-triangle text-3xl text-yellow-500 mb-2"></i>
        <p class="text-gray-600 dark:text-gray-300">No se pudo cargar la información del vehículo.</p>
      </div>

      <div v-else class="flex flex-col">
        <!-- Cabecera con imagen de portada -->
        <div class="relative h-64 bg-gray-200 dark:bg-gray-700">
          <img
            v-if="vehicle.images && vehicle.images.length > 0"
            :src="vehicle.images[0]"
            class="w-full h-full object-cover"
            alt="Imagen principal del vehículo"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <i class="pi pi-car text-5xl"></i>
          </div>

          <!-- Botón de cerrar -->
          <button
            @click="$emit('update:modelValue', false)"
            class="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <i class="pi pi-times text-gray-800 dark:text-gray-200"></i>
          </button>

          <!-- Badge de estado -->
          <div class="absolute bottom-4 left-4">
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
              :class="{
                'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-300': vehicle.status === 'available',
                'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-300': vehicle.status === 'rented',
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-300': vehicle.status === 'maintenance',
                'bg-gray-100 text-gray-700 dark:bg-gray-900/70 dark:text-gray-300': vehicle.status === 'inactive'
              }"
            >
              <i
                class="mr-1"
                :class="{
                  'pi pi-check-circle': vehicle.status === 'available',
                  'pi pi-car': vehicle.status === 'rented',
                  'pi pi-wrench': vehicle.status === 'maintenance',
                  'pi pi-ban': vehicle.status === 'inactive'
                }"
              ></i>
              {{ getStatusLabel(vehicle.status) }}
            </span>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {{ vehicle.brand }} {{ vehicle.model }}
              </h2>
              <p class="text-gray-600 dark:text-gray-400">{{ vehicle.year }} • {{ getTypeLabel(vehicle.type) }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-primary-600 dark:text-primary-400">
                S/ {{ vehicle.dailyRate.toFixed(2) }} <span class="text-sm font-normal">/ día</span>
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Publicado: {{ formatDate(vehicle.createdAt) }}
              </p>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Descripción</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ vehicle.description }}</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Ubicación</h3>
            <div class="flex items-center text-gray-600 dark:text-gray-400">
              <i class="pi pi-map-marker mr-2 text-primary-500"></i>
              <span>{{ vehicle.location }}</span>
            </div>
          </div>

          <!-- Especificaciones -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Especificaciones</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex items-center">
                <i class="pi pi-lock text-primary-500 mr-2"></i>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Puertas</p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ vehicle.specifications.doors }}</p>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex items-center">
                <i class="pi pi-users text-primary-500 mr-2"></i>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Asientos</p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ vehicle.specifications.seats }}</p>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex items-center">
                <i class="pi pi-cog text-primary-500 mr-2"></i>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Transmisión</p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">
                    {{ vehicle.specifications.transmission === 'automatic' ? 'Automática' : 'Manual' }}
                  </p>
                </div>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex items-center">
                <i class="pi pi-tachometer text-primary-500 mr-2"></i>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Combustible</p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">{{ getFuelTypeLabel(vehicle.specifications.fuelType) }}</p>
                </div>
              </div>

              <div v-if="vehicle.specifications.airConditioner" class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex items-center">
                <i class="pi pi-cloud text-primary-500 mr-2"></i>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Aire acondicionado</p>
                  <p class="font-medium text-gray-800 dark:text-gray-200">Sí</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Galería de imágenes -->
          <div v-if="vehicle.images && vehicle.images.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Galería
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                v-for="(image, index) in vehicle.images"
                :key="index"
                class="relative aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                @click="selectedImageIndex = index"
              >
                <img :src="image" class="w-full h-full object-cover" :alt="`Imagen ${index + 1} del vehículo`" />
                <div class="absolute bottom-1 right-1 bg-black/50 text-white px-1.5 py-0.5 text-xs rounded-md">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>
          <!-- Mensaje si no hay imágenes -->
          <div v-else class="mb-6 p-4 bg-gray-100 dark:bg-gray-700/30 rounded-xl text-center">
            <i class="pi pi-images text-gray-400 dark:text-gray-500 text-2xl mb-2"></i>
            <p class="text-gray-600 dark:text-gray-400">No hay imágenes disponibles para este vehículo.</p>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="$emit('update:modelValue', false)"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
            <button
              @click="handleEdit"
              class="px-4 py-2 text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors flex items-center"
            >
              <i class="pi pi-pencil mr-1.5"></i> Editar vehículo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Visor de imágenes a pantalla completa -->
  <div
    v-if="selectedImageIndex !== null && vehicle && vehicle.images"
    class="fixed inset-0 z-[60] bg-black flex items-center justify-center"
    @click.self="selectedImageIndex = null"
  >
    <button
      @click="selectedImageIndex = null"
      class="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
    >
      <i class="pi pi-times text-white text-xl"></i>
    </button>

    <button
      v-if="selectedImageIndex > 0"
      @click="selectedImageIndex--"
      class="absolute left-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
    >
      <i class="pi pi-chevron-left text-white text-xl"></i>
    </button>

    <button
      v-if="selectedImageIndex < vehicle.images.length - 1"
      @click="selectedImageIndex++"
      class="absolute right-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
    >
      <i class="pi pi-chevron-right text-white text-xl"></i>
    </button>

    <img
      :src="vehicle.images[selectedImageIndex]"
      class="max-w-full max-h-full object-contain"
      alt="Imagen del vehículo a pantalla completa"
    />

    <div class="absolute bottom-4 left-0 right-0 flex justify-center">
      <div class="bg-black/50 px-4 py-2 rounded-full text-white text-sm">
        {{ selectedImageIndex + 1 }} / {{ vehicle.images.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import vehicleService from '../../services/vehicle.service'
import { createApiService } from '../../../shared/services/api.service'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  vehicleId: { type: String, default: null }
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const vehicle = ref(null)
const loading = ref(false)
const selectedImageIndex = ref(null)

watch(() => props.vehicleId, async (newId) => {
  if (newId && props.modelValue) {
    await loadVehicle(newId)
  }
}, { immediate: true })

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.vehicleId) {
    await loadVehicle(props.vehicleId)
  }
})

// Función para procesar las imágenes y obtener URLs completas
function processVehicleImages(images) {
  if (!images) return [];
  
  // Caso 1: Si es un array normal, procesamos cada elemento
  if (Array.isArray(images)) {
    console.log("Procesando array de imágenes:", images);
    return images.map(image => getImageUrl(image));
  }
  
  // Caso 2: Si tiene la propiedad $values (formato específico del backend)
  if (images.$values && Array.isArray(images.$values)) {
    console.log("Procesando imágenes con $values:", images.$values);
    return images.$values.map(image => getImageUrl(image));
  }
  
  // Caso 3: Si es un objeto con una única imagen
  if (typeof images === 'object' && !Array.isArray(images)) {
    console.log("Procesando objeto de imagen único:", images);
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

async function loadVehicle(id) {
  loading.value = true
  try {
    // Obtener datos básicos del vehículo
    vehicle.value = await vehicleService.getVehicleById(id)
    console.log("Datos iniciales del vehículo:", JSON.stringify(vehicle.value, null, 2));
    
    // Obtener específicamente las imágenes del vehículo desde el endpoint especializado
    try {
      // Crear una instancia de API para hacer solicitudes al backend
      const providerAPI = createApiService('provider');
      const imgResponse = await providerAPI.get(`/vehicles/${id}/images`);
      console.log("Respuesta del endpoint específico de imágenes:", JSON.stringify(imgResponse.data, null, 2));
      
      // Si la respuesta contiene datos de imágenes, procesarlos
      if (imgResponse.data) {
        const processedImages = processVehicleImages(imgResponse.data);
        console.log("Imágenes procesadas del endpoint específico:", processedImages);
        
        if (processedImages && processedImages.length > 0) {
          // Usar las imágenes del endpoint específico
          vehicle.value.images = processedImages;
        }
      }
    } catch (imgError) {
      console.warn("Error al obtener imágenes específicas:", imgError);
      console.log("Usando imágenes incluidas en los datos del vehículo...");
      
      // Si hay un error al obtener las imágenes específicas, intentamos con las incluidas en el vehículo
      if (vehicle.value) {
        // Intentar acceder a diferentes propiedades donde podrían estar las imágenes
        let rawImages = vehicle.value.images || vehicle.value.Images || [];
        
        // Procesar las imágenes encontradas
        if (rawImages && (Array.isArray(rawImages) || typeof rawImages === 'object')) {
          const processedImages = processVehicleImages(rawImages);
          console.log("Imágenes procesadas del objeto vehículo:", processedImages);
          
          if (processedImages && processedImages.length > 0) {
            vehicle.value.images = processedImages;
          } else {
            vehicle.value.images = [];
          }
        } else {
          vehicle.value.images = [];
        }
      }
    }
    
    console.log("Imágenes finales cargadas para visualización:", vehicle.value.images);
  } catch (error) {
    console.error('Error al cargar el vehículo:', error)
    vehicle.value = null
  } finally {
    loading.value = false
  }
}

function handleEdit() {
  emit('update:modelValue', false)
  router.push(`/provider/vehicles/edit/${props.vehicleId}`)
}

function getStatusLabel(status) {
  const statusMap = {
    'available': 'Disponible',
    'rented': 'Alquilado',
    'maintenance': 'En mantenimiento',
    'inactive': 'Inactivo'
  }
  return statusMap[status] || status
}

function getTypeLabel(type) {
  const typeMap = {
    'sedan': 'Sedán',
    'suv': 'SUV',
    'hatchback': 'Hatchback',
    'pickup': 'Pickup',
    'van': 'Van/Minivan'
  }
  return typeMap[type] || type
}

function getFuelTypeLabel(fuelType) {
  const fuelTypeMap = {
    'gasoline': 'Gasolina',
    'diesel': 'Diésel',
    'electric': 'Eléctrico',
    'hybrid': 'Híbrido'
  }
  return fuelTypeMap[fuelType] || fuelType
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function refreshImages() {
  if (props.vehicleId) {
    loadVehicle(props.vehicleId);
  }
}
</script>
