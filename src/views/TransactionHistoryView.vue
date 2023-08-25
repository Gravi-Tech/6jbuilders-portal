<template>
    <Header />
    <v-main style="height: 100vh;">
        <v-container>
            <h1>transaction-history</h1>
        </v-container>
    </v-main>
    <Footer />
</template>
  
<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Footer
    },
};
</script>