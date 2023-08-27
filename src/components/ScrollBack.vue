<template>
    <div v-show="showButton" class="support-button">
        <v-col cols="auto">
<<<<<<< HEAD
            <v-btn size="large" color="#FBC02D" @click="scrollToTop">
=======
            <v-btn icon="$vuetify" size="large" color="teal-accent-4" @click="scrollToTop">
>>>>>>> 34442c56cd2f9cb0c082ef3898fd64d22c8828e1
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