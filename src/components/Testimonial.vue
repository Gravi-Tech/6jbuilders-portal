<template>
    <section class="testimonial-section">
        <v-container>
            <h1 class="text-center mb-6">Testimonials</h1>
            <v-carousel cycle hide-delimiter-background height="300" interval="8000" show-arrows-on-hover
                class="testimonial-carousel">
                <v-carousel-item v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-slide">
                    <v-card elevation="6" class="testimonial-card">
                        <v-avatar class="testimonial-avatar" size="120">
                            <v-img :src="testimonial.image" cover class="circle"></v-img>
                        </v-avatar>
                        <v-card-title class="testimonial-name">{{ testimonial.name }}</v-card-title>
                        <v-card-subtitle class="testimonial-job">{{ testimonial.job }}</v-card-subtitle>
                        <v-card-text class="testimonial-text">{{ testimonial.testimonial }}</v-card-text>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </v-container>
    </section>
</template>
  
<script>
import { testimonials } from '../dataUtils/testimonialData';

export default {
    data() {
        return {
            testimonials: testimonials,
        };
    },
};
</script>
  
<style scoped>
.testimonial-carousel {
    max-width: 800px;
    margin: 0 auto;
}
.testimonial-slide {
    display: flex;
    justify-content: center;
    align-items: center;
}

.testimonial-card {
    padding: 1rem;
    text-align: center;
    margin: 0 auto;
    border-radius: 10px;
    transition: transform 0.5s ease-in-out;
}

.testimonial-card:hover {
    transform: scale(1.05);
}

.testimonial-avatar {
    margin: 0 auto 1rem;
}

.testimonial-name {
    font-size: 22px;
    font-weight: bold;
}

.testimonial-job {
    font-size: 16px;
    color: #888;
}

.testimonial-text {
    font-size: 14px;
}
</style>
