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

const props = defineProps({
  vehicleId: { type: String, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const vehicle = ref(new Vehicle())
const loading = ref(false)
const error = ref(null)

const editMode = computed(() => !!props.vehicleId)

onMounted(async () => {
  if (editMode.value) {
    loading.value = true
    try {
      const data = await vehicleService.getVehicleById(props.vehicleId)
      vehicle.value = new Vehicle(data)
    } catch (err) {
      error.value = 'Error al cargar los datos del vehículo'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  loading.value = true
  error.value = null

  try {
    let result
    if (editMode.value) {
      result = await vehicleService.updateVehicle(props.vehicleId, vehicle.value)
    } else {
      result = await vehicleService.createVehicle(vehicle.value)
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
</script>

<style scoped>

input:focus, select:focus, textarea:focus {
  @apply transform scale-[1.01] transition-transform;
}


button:hover {
  @apply transform scale-[1.02] transition-transform;
}
</style>
