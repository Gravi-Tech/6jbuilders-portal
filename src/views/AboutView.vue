<template>
  <Header />
  <About />
  <Team />
  <Testimonial />
  <Footer />
</template>

<script>
import Header from '../components/Header.vue';
import About from '../components/About.vue';
import Team from '../components/Team.vue';
import Testimonial from '../components/Testimonial.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    About,
    Team,
    Testimonial,
    Footer
  },
};
</script>