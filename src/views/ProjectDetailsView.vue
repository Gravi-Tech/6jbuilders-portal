<template>
    <Header />
    <div class="parallax-container">
        <v-parallax :src="project.image" height="350">
            <div class="parallax-overlay"></div>
            <div class="parallax-content">
                <p>Let Us Build and Repair your Home</p>
            </div>
        </v-parallax>
    </div>
    <v-container>
        <v-row class="mt-4">
            <v-col cols="12" md="6">
                <div class="d-flex align-center mb-2">
                    <v-rating :model-value="project.rating" color="amber" density="compact" half-increments readonly
                        size="small"></v-rating>
                    <div class="text-grey ms-2">{{ project.rating }} ({{ project.reviews }})</div>
                </div>
                <h2 class="text-h5 mb-2">{{ project.title }}</h2>
                <h4 class="text-h6 mb-2">{{ project.location }}</h4>
                <div class="text-subtitle-1">{{ project.date }}</div>
                <v-btn color="teal-accent-4" class="mt-4" @click="goBack">Back to Projects</v-btn>
            </v-col>
            <v-col cols="12" md="6">
                <div class="description-content">
                    <div>
                        <p v-for="(paragraph, index) in project.description" :key="index">{{ paragraph }}</p>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
    <Footer />
</template>
  
<script>
import { projects } from '../utils/projectData.js';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            project: null,
        };
    },
    created() {
        const projectId = this.$route.params.id;
        this.project = this.fetchProjectDetails(projectId);
    },
    methods: {
        fetchProjectDetails(projectId) {

            return projects.find(project => project.id === Number(projectId));
        },
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>
  
<style scoped>
.parallax-container {
  position: relative;
}

.parallax-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.parallax-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  font-family: 'Calistoga', cursive;
  font-size: 1.5rem;
}


.description-content {
    font-size: 16px;
    line-height: 1.6;
}
</style>
  