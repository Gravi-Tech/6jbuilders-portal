<template>
  <Header />
  <Contact />
  <Footer />
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
};
</script>