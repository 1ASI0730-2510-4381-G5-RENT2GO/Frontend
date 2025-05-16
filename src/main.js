import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes/index.js'
import { i18n } from './i18n'

import './assets/themes.css';


createApp(App).use(router).use(i18n).mount('#app')
