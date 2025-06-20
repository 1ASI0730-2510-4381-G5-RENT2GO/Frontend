import './assets/main.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// ✅ AGREGAR PRIMEVUE
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

import App from './App.vue'

import I18n from "@/i18n.js";
import router from "@/router/index.js";
import { useAuthStore } from "@/auth/stores/authStore.js";

const app = createApp(App)
const pinia = createPinia()

app.use(I18n)
app.use(pinia)

// Inicializar estado de autenticación desde localStorage y servidor
const authStore = useAuthStore()
authStore.initialize()

app.use(router)

// ✅ CONFIGURAR PRIMEVUE
app.use(PrimeVue)
app.use(ToastService)

// ✅ REGISTRAR COMPONENTE TOAST
app.component('Toast', Toast)

app.mount('#app')

