<template>
    <section class="process-title">
        <h2>{{ pageTitle }} Process</h2>
    </section>
    <section class="process-section">
        <v-container>
            <v-row class="d-flex justify-center">
                <v-col cols="12" md="3" v-for="(step, index) in steps" :key="index">
                    <v-card class="process-card" elevation="2">
                        <v-img :src="step.image" :width="400" :height="200" cover></v-img>
                        <v-card-title class="process-card-title">{{ step.title }}</v-card-title>
                        <v-card-text class="process-card-text">{{ step.description }}</v-card-text>
                        <v-card-actions>
                            <v-btn text color="teal-accent-4" @click="navigateToDetails(step)">Learn More</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>
  
<script>
export default {
    props: {
        steps: Array,
        pageTitle: String,
    },
    methods: {
        navigateToDetails(step) {
            this.$router.push({ name: 'StepDetails', params: { stepId: step.id } });
        },
    },
};
</script>
  
<style scoped>
.process-title {
    padding: .1rem 0 0 2rem;
    background-color: #E9E9E9;
}

.process-title h2 {
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    color: #9E9E9E;
}

.process-section {
    padding: 2rem;
}

.process-card {
    margin-bottom: 1.5rem;
    width: 100%;
}

.process-card-title {
    font-size: 16px;
    font-weight: bold;
}

.process-card-text {
    font-size: 12px;
}

.process-card v-card-actions {
    justify-content: flex-end;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.05);
}

.process-card v-card-actions v-btn {
    font-size: 14px;
}
</style>
  