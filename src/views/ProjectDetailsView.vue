<template>
    <Header />
    <div class="parallax-container">
        <v-parallax :src="project.bg_project_img" height="350">
            <div class="parallax-overlay"></div>
            <div class="parallax-content">
                <p>Let Us Build and Repair your Home</p>
            </div>
        </v-parallax>
    </div>
    <v-container>
        <v-row class="mt-4">
            <v-col cols="12" md="6">
                <!-- <div class="d-flex align-center mb-2">
                    <v-rating :model-value="project.rating" color="amber" density="compact" half-increments readonly
                        size="small"></v-rating>
                    <div class="text-grey ms-2">{{ project.rating }} ({{ project.reviews }})</div>
                </div> -->
                <h2 class="text-h5 mb-2">{{ project.title }}</h2>
                <h4 class="text-h6 mb-2">{{ project.location }}</h4>
                <div class="text-subtitle-1">Date Finished: {{ project.date_completed }}</div>
                <div class="d-flex mt-4">
                    <v-btn color="teal-accent-4" @click="goBack">Back to Projects</v-btn>
                    <!-- <v-btn class="ml-6" color="blue" @click="showRatingModal = true">Rate Project</v-btn> -->
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="description-content">
                    <div>
                        <p v-for="(paragraph, index) in project.description" :key="index">{{ paragraph }}</p>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-4">
            <v-col cols="12">
                <h3 class="text-h5 text-center m-4">Project Images</h3>
                <div class="d-flex flex-wrap justify-center">
                    <div v-for="(image, index) in project.project_imgs" :key="index" class="project-image">
                        <v-img :src="image" cover height="200" @click="openImageDialog(index)"></v-img>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
    <Footer />

    <v-dialog v-model="showImageDialog" max-width="600">
        <v-img :src="project.project_imgs[imageIndex]" cover height="600"></v-img>
    </v-dialog>
    <!-- <v-dialog v-model="showRatingModal" max-width="500">
        <v-card class="rate-dialog">
            <v-card-title>Rate Project</v-card-title>
            <v-card-subtitle>{{ project.title }}</v-card-subtitle>
            <v-card-text>
                <v-rating v-model="userRating" color="amber" size="large" dense half-increments></v-rating>
            </v-card-text>
            <v-card-actions>
                <v-btn text @click="showRatingModal = false">Cancel</v-btn>
                <v-btn color="success" @click="submitRating">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog> -->
</template>
  
<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { projects } from '../dataUtils/projectData.js';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            project: null,
            // showRatingModal: false,
            userRating: 0,
            showImageDialog: false,
            imageIndex: 0,
        };
    },
    created() {
        const projectId = this.$route.params.id;
        this.project = this.fetchProjectDetails(projectId);
    },
    methods: {
        fetchProjectDetails(projectId) {
            return projects.find(project => project.id === String(projectId));
        },
        goBack() {
            this.$router.go(-1);
        },
        // submitRating() {
        //     this.updateProjectRating();
        //     this.showRatingModal = false;
        // },
        // updateProjectRating() {
        //     const newRating = this.calculateNewRating();
        //     this.project.rating = parseFloat(newRating.toFixed(1));
        //     this.project.reviews++;
        // },
        // calculateNewRating() {
        //     const totalRating = this.project.rating * this.project.reviews;
        //     const newTotalRating = totalRating + this.userRating;
        //     const newReviews = this.project.reviews + 1;
        //     return newTotalRating / newReviews;
        // },
        openImageDialog(index) {
            this.imageIndex = index;
            this.showImageDialog = true;
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

.rate-dialog {
    padding: 20px;
}

.description-content {
    font-size: 16px;
    line-height: 1.6;
}

.project-image {
    position: relative;
    width: calc(33.333% - 20px);
    margin: 10px;
    margin-bottom: 20px;
}

.image-overlay {
    position: relative;
    overflow: hidden;
}

.image-overlay:hover .zoom-icon {
    opacity: 1;
}

.v-img {
    transition: transform 0.3s;
}

.zoom-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 24px;
    padding: 10px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
}
</style>