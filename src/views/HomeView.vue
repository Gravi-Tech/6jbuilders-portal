<template>
  <main>
    <Header />
    <div id="banner" class="d-flex w-100 h-100 mt-10">
      <div class="d-flex w-50 pa-2">
        <div id="captivated" class="d-block">
          <p id="tag" class="ml-16 mt-12">
            We <span id="build" class="accent-color">BUILD</span> and<br>
            <span id="repair" class="accent-color ml-16">REPAIR</span> your Home
          </p>
          <p class="ml-16">
            Providing construction and repair services,<br />with excellent quality works, timely
            delivery, and cost-efficient solutions.
          </p>
        </div>
      </div>
      <div class="d-flex w-50">
        <v-img
          id="background"
          class="rounded-ts-pill"
          src="../src/assets/images/6jbuilders-bg.jpg"
          width="50%"
        ></v-img>
      </div>
    </div>
    <section class="justify-center align-center mb-8" style="background-color: #e0e0e0">
      <v-col cols="auto" class="d-flex">
        <div id="heading" class="pa-3">
          Looking for a quality and affordable constructor for your home?
        </div>
        <div class="pa-1">
          <v-btn size="large" color="#FBC02D" class="mr-4">Get a Quote</v-btn>
        </div>
        <div class="pa-1">
          <v-btn size="large" variant="outlined" color="black">Check Our Projects</v-btn>
        </div>
      </v-col>
    </section>

    <!-- <section>
      <h1 id="services" class="text-left mb-6">Our Services</h1>
      <v-carousel
        cycle
        hide-delimiter-background
        height="500"
        interval="8000"
        variant="outlined"
        color="#039be5"
        class="services-carousel"
      >
        <v-carousel-item v-for="(services, index) in services" :key="index" class="services-slide">
          <v-card elevation="6" variant="outlined" color="#039be5" class="mx-auto" max-width="344">
            <v-img :src="services.image" height="250px" cover></v-img>
            <v-card-title class="text-black"> {{ services.title }}</v-card-title>
            <v-card-text class="text-black">
              {{ services.description }}
            </v-card-text>

            <v-btn class="ma-2" color="blue-lighten-1" variant="text"> Explore </v-btn>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </section> -->


    <div class="timeline">

      <div class="ma-8">
        <v-timeline direction="horizontal">
          <v-timeline-item dot-color="#fbc02d" size="small">
            <template v-slot:opposite> Opposite content </template>
            <div>
              <div class="text-h6">Content title</div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </v-timeline-item>

          <v-timeline-item dot-color="#fbc02d" size="small">
            <template v-slot:opposite> Opposite content </template>
            <div>
              <div class="text-h6">Content title</div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </v-timeline-item>

          <v-timeline-item dot-color="#fbc02d" size="small">
            <template v-slot:opposite> Opposite content </template>
            <div>
              <div class="text-h6">Content title</div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </v-timeline-item>

          <v-timeline-item dot-color="#fbc02d" size="small">
            <template v-slot:opposite> Opposite content </template>
            <div>
              <div class="text-h6">Content title</div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>

      <!-- <h1 id="services" class="text-left mb-6">Know Us</h1>
      <v-container class="my-12">
        <v-row class="flex-row">
          <v-col cols="12" sm="4">
            <h2 class="headline text-center mb-6">Mission</h2>
            <p class="text-center">
              Our mission is to provide high-quality construction services that exceed our clients'
              expectations, ensuring their projects are delivered on time and within budget.
            </p>
          </v-col>

          <v-col cols="12" sm="4">
            <h2 class="headline text-center mb-6">Vision</h2>
            <p class="text-center">
              Our vision is to be a leading construction company recognized for innovation,
              excellence, and commitment to building sustainable and remarkable structures.
            </p>
          </v-col>

          <v-col cols="12" sm="4">
            <h2 class="headline text-center mb-6">Our Goals</h2>
            <p class="text-center">
              We aim to establish lasting relationships with our clients based on trust and
              integrity. We strive to continuously improve our processes, invest in our team, and
              contribute positively to the communities we serve.
            </p>
          </v-col>
        </v-row>
      </v-container> -->
    </div>

    <Footer />
  </main>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { services } from '../utils/servicesData'

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      services: services
    }
  }
}
</script>

<style>
#tag {
  font-family: 'Calistoga', cursive;
  font-size: 3rem;
}

#heading {
  color: #616161;
  font-weight: 900;
  font-style: italic;
  margin-right: auto;
}
.accent-color {
  color: #039be5;
}

p {
  align-items: center;
}

#banner {
  background-image: linear-gradient(#fbc02d, #ffff, #039be5);
  border-radius: 95% 0% 0% 0%;
}
#services {
  color: black;
  font-family: 'Calistoga', cursive;
  font-style: italic;
  margin-right: auto;
  font-size: 2rem;
  text-decoration: overline;
  text-decoration-color: #fbc02d;
}
.headline {
  font-family: 'Calistoga', cursive;
  margin-right: auto;
  font-size: 1rem;
}
.timeline{
  margin: 7%;
}
</style>
