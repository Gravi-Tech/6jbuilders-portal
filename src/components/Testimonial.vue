<template>
  <section class="feedback-section">
    <v-container>
      <h1 class="text-center mb-6">Testimonials</h1>
      <v-carousel
        cycle
        hide-delimiter-background
        height="500"
        interval="5000"
        show-arrows-on-hover
        class="feedback-carousel"
      >
        <v-carousel-item v-for="(feedback, index) in feedbacks" :key="index" class="feedback-slide">
          <v-card variant="text" class="feedback-card">
            <v-avatar class="feedback-avatar" size="120">
              <v-img src="/images/user-default.png" cover class="circle"></v-img>
            </v-avatar>
            <v-card-title class="feedback-name">{{ feedback.fullName }}</v-card-title>
            <v-card-subtitle class="feedback-job">{{ feedback.job_description }}</v-card-subtitle>
            <v-card-text class="feedback-text">{{ feedback.message }}</v-card-text>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-container>
  </section>
</template>

<script>
import { getAllPublicFeedbacks } from '@/apirequests/feedback'

export default {
  data() {
    return {
      feedbacks: []
    }
  },
  async created() {
    await this.fetchFeedbacks()
  },
  methods: {
    async fetchFeedbacks() {
      try {
        const response = await getAllPublicFeedbacks()
        const feedback = response.data
        this.feedbacks = feedback.filter((feedback) => feedback.isPosted === true)
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error)
      }
    }
  }
}
</script>

<style scoped>
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
  flex: 1; 
  min-width: 200px;
  max-width: 100%;
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
  white-space: pre-wrap;
}
</style>
