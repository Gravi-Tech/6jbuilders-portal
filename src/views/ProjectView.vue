<template>
    <Header />
    <Projects />>
    <Footer />
</template>
  
<script>
import Header from '../components/Header.vue';
import Projects from '../components/Project.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Projects,
        Footer
    },
};
</script>