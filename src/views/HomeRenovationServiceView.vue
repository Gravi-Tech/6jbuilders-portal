<template>
    <v-content>
        <Header />
        <HomeReno />
        <ProcessSection :steps="renovationSteps" />
        <SupportButton :preSelectedService="pageTitle" />
        <Footer />
    </v-content>
</template>
  
<script scoped>
import Header from '../components/Header.vue';
import HomeReno from '../components/HomeReno.vue';
import ProcessSection from '../components/ProcessSection.vue';
import SupportButton from '../components/SupportButton.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        HomeReno,
        ProcessSection,
        SupportButton,
        Footer,
    },
    data() {
        return {
            renovationSteps: [
                'Initial Consultation',
                'Design Planning',
                'Construction Phase',
                'Final Inspection',
            ],
            pageTitle: 'Home Renovation',
        };
    },
};
</script>
  