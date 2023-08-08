<template>
    <v-content>
        <Header />
        <Portal />
        <Footer />
    </v-content>
</template>
  
<script scoped>
import Header from '../components/Header.vue';
import Portal from '../components/Portal.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Portal,
        Footer
    },
    data() {
        return {

        };
    },
};
</script>