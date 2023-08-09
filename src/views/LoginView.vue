<template>
    <Header />
    <UserPortal />
    <Footer />
</template>
  
<script scoped>
import Header from '../components/Header.vue';
import UserPortal from '../components/UserPortal.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        UserPortal,
        Footer
    },
};
</script>