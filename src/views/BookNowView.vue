<template>
  <Header />
  <BookNow />
  <Footer />
</template>

<script scoped>
import Header from '../components/Header.vue';
import BookNow from '../components/Book.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    BookNow,
    Footer
  },
  data() {
    return {

    };
  },
};
</script>