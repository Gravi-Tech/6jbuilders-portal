<template>
  <v-app-bar app :height="appBarHeight">
    <section>
      <v-row v-if="!isShrunk" class="d-flex justify-center align-center mt-1">
        <v-col cols="auto">
          <v-row class="d-flex align-center">
            <v-icon class="app-icon large-icon">mdi-phone</v-icon>
            <v-col cols="auto">
              <strong>Phone:</strong>
              <p class="small-text">0926 123 7672</p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-row class="d-flex align-center">
            <v-icon class="app-icon large-icon">mdi-map-marker</v-icon>
            <v-col cols="auto">
              <strong>Address:</strong>
              <p class="small-text">Canduman, Mandaue Cebu City</p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-row class="d-flex align-center">
            <v-icon class="app-icon large-icon">mdi-calendar-clock</v-icon>
            <v-col cols="auto">
              <strong>Opening Hours:</strong>
              <p class="small-text">Mon - Sat: 7:00 am - 7:00 pm</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center align-center" style="padding: 10px">
        <v-col cols="auto">
          <v-row class="d-flex justify-center align-center">
            <a to="/home">
              <v-img src="/src/assets/logo.png" max-height="80" alt="Logo"></v-img>
            </a>
            <v-col cols="auto" v-for="(link, i) in navLinks" :key="i">
              <v-menu v-if="link.route === 'services'" open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn color="black" v-bind="props"> Services </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(service, index) in services"
                    :key="index"
                    :value="index"
                    class="dense"
                  >
                    <v-list-item-title @click="navigateToService(service)">{{
                      service.title
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                v-else
                :color="activeRoute === link.route ? '#039BE5' : 'black'"
                variant="text"
                @click="navTo(link.route)"
                >{{ link.title }}</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="auto">
          <v-row class="d-flex justify-center align-center bg-blue-lighten-1">
            <v-btn size="large" @click="navTo('book')">Book Now</v-btn>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-4">
          <v-row class="d-flex justify-center align-center bg-blue-lighten-1">
            <v-btn size="large" @click="navTo('login')">Admin Login</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </section>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'

import { serviceTypes } from '../dataUtils/serviceType'

const appBarHeight = ref(170)
const router = useRouter()
const activeRoute = ref(router.currentRoute.value.name)
const isShrunk = ref(false)

const services = serviceTypes.map(({ id, title }) => ({
  id,
  title
}))

const navigateToService = (service) => {
  router.push(`/6jbuilders/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`)
}

const navLinks = [
  { route: 'home', title: 'Home' },
  { route: 'about-us', title: 'About' },
  { route: 'services', title: 'Services' },
  { route: 'projects', title: 'Projects' },
  { route: 'contact', title: 'Contact' }
]

const onScroll = () => {
  const scrollPosition = window.scrollY
  if (scrollPosition > 50) {
    isShrunk.value = true
    appBarHeight.value = 60
  } else {
    isShrunk.value = false
    appBarHeight.value = 160
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(
  () => router.currentRoute.value.name,
  (newValue) => {
    activeRoute.value = newValue
  }
)

const navTo = (to) => {
  router.push({ name: to })
}
</script>

<style>
.shrink-header {
  padding: 10px;
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}

strong {
  font-size: 14px;
}

.app-icon.large-icon {
  font-size: 28px;
}

.small-text {
  font-size: 14px;
}

/*for laptopS*/

@media only screen and (max-width: 1440px) {
}

@media only screen and (max-width: 1024px) {
}

/*FOR TABLETS*/
@media only screen and (max-width: 768px) {
}
@media only screen and (max-width: 425px) {
}

/*small devices*/

@media only screen and (max-width: 375px) {
  .app-icon.large-icon {
    font-size: 20px;
  }

  .small-text {
    font-size: 8px;
  }
}

@media screen and (max-width: 320px) {
  .app-icon.large-icon {
    font-size: 20px;
  }

  .small-text {
    font-size: 8px;
  }
}
</style>
