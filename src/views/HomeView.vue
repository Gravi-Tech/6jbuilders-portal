<template>
  <main>
    <Header />
    <div id="banner" class="d-flex w-100 h-100">
      <div class="d-flex w-50 pa-2">
        <div id="captivated" class="d-block">
          <p id="tag" class="ml-10 mt-12">
            We <span id="build" class="accent-color">BUILD</span> and
            <span id="repair" class="accent-color">REPAIR</span> your Home
          </p>
          <p class="ml-10">
            Providing construction and repair services,<br />with excellent quality works, timely
            delivery, and cost-efficient solutions.
          </p>
        </div>
      </div>
      <div class="d-flex w-50">
        <v-img id="background" class="rounded-ts-pill" src="../src/assets/images/6jbuilders-bg.jpg" width="50%"></v-img>
      </div>
    </div>
    <section class="justify-center align-center" style="background-color: #E9E9E9;">
      <v-col cols="auto" class="d-flex">
        <div id="heading" class="pa-3" >
          Looking for a quality and affordable constructor for your home?
        </div>
        <div class="pa-1">
          <v-btn size="large" variant="flat" color="blue" class="mr-4">Get a Quote</v-btn>
        </div>
        <div class="pa-1">
          <v-btn size="large" variant="outlined" color="blue">Check Our Projects</v-btn>
        </div>
      </v-col>
    </section>
    <Footer />
  </main>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style>
#tag {
  font-family: 'Calistoga', cursive;
  font-size: 3rem;
}

#heading{
  color: #9E9E9E;
  font-weight: 700;
  font-style: italic;
  margin-right: auto;
}
.accent-color {
  color: #039BE5;
}

p {
  align-items: center;
}

#banner {
  background-image: linear-gradient(#FBC02D, #FFFF, #039BE5);
  border-radius: 95% 0% 0% 0%;
}
</style>
