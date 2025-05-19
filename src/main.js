import './assets/main.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import I18n from "@/i18n.js";
import router from "@/router/index.js";
const app = createApp(App)
const pinia = createPinia()

app.use(I18n)
app.use(pinia)
app.use(router)
app.mount('#app')