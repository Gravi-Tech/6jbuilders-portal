<template>
  <v-app id="inspire">
    <v-app-bar color="blue darken-2" app height="120" class="header-padding">
      <v-container>
        <v-row class="d-flex justify-center align-center">
          <v-col cols="auto">
            <v-row class="d-flex align-center">
              <v-icon class="app-icon large-icon">mdi-phone</v-icon>
              <v-col cols="auto">
                <strong>Phone:</strong>
                <p class="small-text">+6394 000 3243</p>
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
              <v-icon class="app-icon large-icon">mdi-clock</v-icon>
              <v-col cols="auto">
                <strong>Opening Hours:</strong>
                <p class="small-text">Mon - Sat: 7:00 am - 7:00 pm</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-center align-center">
          <v-col cols="auto">
            <v-row class="d-flex justify-center align-center">
              <v-img src="../src/assets/logo.png" max-height="80"></v-img>
              <v-col cols="auto">
                <v-btn><router-link to="/">Home</router-link></v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn><router-link to="/about">About</router-link></v-btn>
              </v-col>
              <v-col cols="auto">
                <!-- TOTO: DROPDOWN IS NOT WORKING -->
                <v-menu offset-y bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn variant="text" v-on="on">Services</v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(service, index) in services" :key="index" @click="navigateToService(service)">
                      <v-list-item-title>{{ service.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
              <v-col cols="auto">
                <v-btn><router-link to="/contact">Contact</router-link></v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn><router-link to="/login">Login</router-link></v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-row class="d-flex justify-end align-center">
            <v-col cols="auto">
              <v-row class="d-flex justify-center align-center">
                <v-btn variant="evelated" elevation="8" size="large"><router-link to="/bookNow">BOOK NOW</router-link></v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-row>

      </v-container>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
const services = [
  { title: "Home Renovation" },
  { title: "Interior Design" },
  { title: "Plumbing" },
  { title: "Electrical" },
  { title: "Drywall Installation" },
  { title: "Tile Installation" },
  { title: "Glass and Aluminum Installation" },
  { title: "Welding" },
  { title: "Roofing" },
  { title: "Cabinets" },
  { title: "Home Repair Services" }
];

const navigateToService = (service) => {
  router.push(`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`);
}

</script>

<style>
strong {
  font-size: 14px;
}

.router-link {
  color: white;
  text-decoration: none;
}

.header-padding {
  padding-top: 10px;
  padding-bottom: 10px;
}

.app-icon.large-icon {
  font-size: 28px;
}

.small-text {
  font-size: 10px;
}

@media screen and (max-width: 600px) {
  .app-icon.large-icon {
    font-size: 22px;
  }

  .small-text {
    font-size: 8px;
  }
}
</style>