<template>
    <section class="feedback-section">
        <v-container>
            <h3 class="feedback-title">What Our Clients Say</h3>
            <v-carousel cycle hide-delimiter-background height="300" interval="8000" show-arrows-on-hover
                class="feedback-carousel">
                <v-carousel-item v-for="(feedback, index) in feedbacks" :key="index" class="feedback-slide">
                    <v-card elevation="6" class="feedback-card">
                        <v-avatar class="feedback-avatar" size="120">
                            <v-img :src="feedback.image" cover class="circle"></v-img>
                        </v-avatar>
                        <v-card-title class="feedback-name">{{ feedback.name }}</v-card-title>
                        <v-card-subtitle class="feedback-job">{{ feedback.job }}</v-card-subtitle>
                        <v-card-text class="feedback-text">{{ feedback.feedback }}</v-card-text>
                    </v-card>
                </v-carousel-item>
            </v-carousel>
        </v-container>
    </section>
</template>
  
<script>
export default {
    data() {
        return {
            feedbacks: [
                {
                    name: 'John Doe',
                    job: 'Homeowner',
                    feedback:
                        'I am absolutely thrilled with the exceptional work done by the 6 J Builders team. They turned my dream home into a reality with their impeccable craftsmanship and attention to detail. I couldn\'t be happier!',
                    image:
                        'https://www.angioscreen.com/Portals/_default/Skins/Doris/images/employer1_lg.jpg',
                },
                {
                    name: 'Jack Smith',
                    job: 'Interior Designer',
                    feedback:
                        'Working with 6 J Builders has been an absolute delight. Their creativity and design expertise brought my vision to life in ways I never imagined. Every corner of the space reflects their commitment to excellence.',
                    image:
                        'https://www.naahq.org/sites/default/files/images/articles/employee.jpg',
                },
            ],
        };
    },
};
</script>
  
<style scoped>
.feedback-section {
    padding: 2rem;
    background-color: #f9f9f9;
    text-align: center;
}

.feedback-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.feedback-carousel {
    max-width: 800px;
    margin: 0 auto;
}

.feedback-slide {
    display: flex;
    justify-content: center;
    align-items: center;
}

.feedback-card {
    padding: 1rem;
    text-align: center;
    margin: 0 auto;
    border-radius: 10px;
    transition: transform 0.5s ease-in-out;
}

.feedback-card:hover {
    transform: scale(1.05);
}

.feedback-avatar {
    margin: 0 auto 1rem;
}

.feedback-name {
    font-size: 22px;
    font-weight: bold;
}

.feedback-job {
    font-size: 16px;
    color: #888;
}

.feedback-text {
    font-size: 14px;
}
</style>
