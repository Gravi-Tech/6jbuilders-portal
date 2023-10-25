import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import Vuelidate from 'vuelidate'
import router from './router'
import './assets/main.css'

import '@mdi/font/css/materialdesignicons.css'
// import vue3GoogleLogin from 'vue3-google-login'
import { vuetify } from './plugins/vuetify'

const app = createApp(App)

// app.use(vue3GoogleLogin, {
//     clientId: '94901716497-ig6lujtglv4uqm8tg94e5b7hcu9t13nm.apps.googleusercontent.com',
// })
app.use(Vuelidate);
app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
