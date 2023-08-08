<template>
  <v-content>
    <Header />
    <Contact />
    <Footer />
  </v-content>
</template>

<script scoped>
import Header from '../components/Header.vue';
import Contact from '../components/Contact.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    Contact,
    Footer
  },
  data() {
    return {

    };
  },
};
</script>