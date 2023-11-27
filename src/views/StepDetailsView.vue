<template>
    <Header />
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="step-details-title">{{ selectedStep.title }}</h1>
                <div class="step-details-description">
                    <p v-for="(paragraph, index) in selectedStep.description" :key="index">{{ paragraph }}</p>
                </div>
                <v-btn prepend-icon="mdi-arrow-left" color="teal-accent-4" class="mt-4" @click="goBack">Back to
                    Service</v-btn>
            </v-col>
        </v-row>
    </v-container>
    <Footer />
</template>

<script>
import { steps } from '../dataUtils/processData.js';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            selectedStep: null,
        };
    },
    created() {
        const stepId = this.$route.params.stepId;
        this.selectedStep = this.steps.find(step => step.id === Number(stepId));
    },
    computed: {
        steps: () => steps,
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>

<style scoped>
.step-details-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 20px;
}

.step-details-header {
    display: flex;
    align-items: center;
}

.back-icon {
    font-size: 24px;
    color: blue;
    cursor: pointer;
    margin-right: 10px;
}

.go-back-text {
    font-size: 16px;
    color: blue;
    cursor: pointer;
    margin: 0;
}

.step-details-description {
    font-size: 16px;
    margin-bottom: 20px;
}
</style>