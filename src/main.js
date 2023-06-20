import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

import '@mdi/font/css/materialdesignicons.css' /** mdi font */
import { vuetify } from './plugins/vuetify' /** import vuetify */

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify) /** add vuetify */

app.mount('#app')
