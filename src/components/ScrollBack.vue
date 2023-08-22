<template>
    <div v-show="showButton" class="support-button">
        <v-col cols="auto">
            <v-btn icon="$vuetify" size="large" color="teal-accent-4" @click="scrollToTop">
                <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
        </v-col>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            showButton: false,
        };
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll() {
            this.showButton = window.scrollY > 100;
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        },
    },
};
</script>
  
<style scoped>
.support-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>