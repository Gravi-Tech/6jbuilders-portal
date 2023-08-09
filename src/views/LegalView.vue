<template>
    <Header />
    <v-container>
        <div class="legal-page">
            <h1>{{ pageTitle }}</h1>
            <p>{{ pageContent }}</p>
        </div>
    </v-container>
    <Footer />
</template>
  
<script scoped>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { legalData } from '../utils/legalData.js';

export default {
    name: 'LegalPage',
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            pageTitle: null,
            pageContent: null,
        };
    },
    created() {
        this.loadPageContent();
    },
    methods: {
        loadPageContent() {
            const page = this.$route.params.page;
            if (legalData.hasOwnProperty(page)) {
                this.pageTitle = legalData[page].title;
                this.pageContent = legalData[page].content;
            }
        },
    },
};
</script>
  