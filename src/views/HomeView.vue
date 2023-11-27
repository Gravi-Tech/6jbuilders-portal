<template>
  <main>
    <Header />
    <div class="banner d-flex w-100 h-100">
      <div class="d-flex w-50 pa-2">
        <div class="captivated d-block">
          <p class="tag ml-10 mt-12">
            We <span class=" build accent-color">BUILD</span> and
            <span id="repair" class="accent-color">REPAIR</span> your Home
          </p>
          <p class="tag2 ml-10">
            Providing construction and repair services,<br />with excellent quality works, timely
            delivery, and cost-efficient solutions.
          </p>
        </div>
      </div>
      <div id="image" class="d-flex w-50">
        <v-img
          id="background"
          class="rounded-ts-pill"
          src="../src/assets/images/6jbuilders-bg.jpg"
          width="50%"
        ></v-img>
      </div>
    </div>
    <section class="section justify-center align-center" style="background-color: #e9e9e9">
      <v-col cols="auto" class="d-flex">
        <div class="heading pa-3">
          Looking for a quality and affordable constructor for your home?
        </div>
        <div class="btn pa-1">
          <v-btn variant="flat" color="blue" class="mr-4">Get a Quote</v-btn>
        </div>
        <div class="btn pa-1">
          <v-btn variant="outlined" color="blue">Check Our Projects</v-btn>
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
.tag {
  font-family: 'Calistoga', cursive;
  font-size: 3rem;
}

.heading {
  color: #9e9e9e;
  font-weight: 700;
  font-style: italic;
  margin-right: auto;
}
.accent-color {
  color: #039be5;
}

p {
  align-items: center;
}

.banner {
  background-image: linear-gradient(#fbc02d, #ffff, #039be5);
  border-radius: 95% 0% 0% 0%;
}

/*for */

@media only screen and (max-width: 768px) {
}

@media only screen and (min-width: 365px) and (max-width: 425px) {

  main {
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .heading {
    font-weight: 700;
    font-size: 10px;
    font-style: italic;
  }
  .tag {
    font-size: 7px;
    margin-top: 0px;
    margin-left: 0px;
  }
  .tag2 {
    font-size: 5px;
    margin-top: 0px;
    margin-left: 0px;
  }
  .captivated {
    margin-top: 0px;
    margin-left: 0px;
  }
  .section{
    grid-row: auto;
  }
}


@media only screen and (max-width: 320px) {
  main {
    width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .heading {
    font-weight: 700;
    font-size: 10px;
    font-style: italic;
  }
  .tag {
    font-size: 5px;
    margin-top: 0px;
    margin-left: 0px;
  }
  .tag2 {
    font-size: 5px;
    margin-top: 0px;
    margin-left: 0px;
  }
  .section{
    grid-row: auto;
  }
}
</style>
