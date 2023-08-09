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
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
export default {
    name: 'LegalPage',
    components: {
        Header,
        Footer
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
            if (page === 'terms-of-service') {
                this.pageTitle = 'Terms of Service';
                this.pageContent = 'Content for Terms of Service...';
            } else if (page === 'privacy-policy') {
                this.pageTitle = 'Privacy Policy';
                this.pageContent = 'Content for Privacy Policy...';
            }
        },
    },
};
</script>
  