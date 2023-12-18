<template>
  <v-app-bar app height="80">
    <section>
      <v-row class="d-flex justify-center align-center" style="padding: 20px">
        <v-col cols="auto">
          <v-row class="d-flex justify-center align-center">
            <a to="/home">
              <v-img src="/images/logo.png" max-height="80" alt="Logo"></v-img>
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
            <v-btn size="large" @click="navTo('book-now')">Book Now</v-btn>
          </v-row>
        </v-col>
        <v-col cols="auto" class="ml-4">
          <v-row class="d-flex justify-center align-center bg-blue-lighten-1">
            <v-btn size="large" @click="navTo('login')">Login</v-btn>
          </v-row>
        </v-col>
        <div class="text-center acc">
          <template v-if="userId">
            <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon variant="text" size="x-large" color="primary" v-bind="props"
                  >mdi-account</v-icon
                >
              </template>

              <v-card min-width="100">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" variant="text" @click="handleLogout">Logout</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </template>
        </div>
      </v-row>
    </section>
  </v-app-bar>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUser } from '@/apirequests/users'
import { serviceTypes } from '../dataUtils/serviceType'

export default {
  setup() {
    const router = useRouter()
    const activeRoute = ref(router.currentRoute.value.name)
    const services = serviceTypes.map(({ id, title }) => ({
      id,
      title
    }))

    const navigateToService = (service) => {
      router.push(`/6jbuilders/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`)
    }

    const navLinks = [
      { route: 'home', title: 'Home' },
      { route: 'about-us', title: 'About Us' },
      { route: 'services', title: 'Services' },
      { route: 'projects', title: 'Projects' },
      { route: 'contact-us', title: 'Contact Us' }
    ]

    const user = ref({
      first_name: '',
      middle_name: '',
      last_name: '',
      mobile_number: ''
    })

    const userId = computed(() => {
      return sessionStorage.getItem('userId')
    })

    watch(userId, (newValue) => {
      if (!newValue) {
        user.value = {
          first_name: '',
          middle_name: '',
          last_name: '',
          mobile_number: ''
        }
      }
    })

    watch(
      () => router.currentRoute.value.name,
      (newValue) => {
        activeRoute.value = newValue
      }
    )

    onMounted(async () => {
      const userId = sessionStorage.getItem('userId')
      if (userId) {
        try {
          const response = await getUser(userId)
          user.value = response.data
        } catch (error) {
          console.error(error)
        }
      }
    })

    const navTo = (to) => {
      router.push({ name: to })
    }

    const handleLogout = () => {
      sessionStorage.removeItem('userId')
      location.reload()
    }

    return {
      menu: ref(false),
      activeRoute,
      services,
      navigateToService,
      navLinks,
      user,
      userId,
      navTo,
      handleLogout
    }
  }
}
</script>

<style>
strong {
  font-size: 14px;
}

.app-icon.large-icon {
  font-size: 28px;
}

.small-text {
  font-size: 14px;
}

.acc {
  margin-left: 50px;
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
