import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import Vuelidate from 'vuelidate'
import router from './router'
import './assets/main.css'

import '@mdi/font/css/materialdesignicons.css'
import { vuetify } from './plugins/vuetify'

const app = createApp(App)

app.use(Vuelidate);
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
