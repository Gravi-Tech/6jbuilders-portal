<template>
  <v-content>
    <Header />
    <About />
    <Footer />
  </v-content>
</template>

<script scoped>
import Header from '../components/Header.vue';
import About from '../components/About.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    About,
    Footer
  },
  data() {
    return {

    };
  },
};
</script>