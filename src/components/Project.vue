<template>
    <v-container>
        <section class="mb-3" align="center">
            <h1> PROJECTS</h1>
        </section>
        <v-row>
            <v-col v-for="(project, index) in filteredProjects" :key="index" class="d-flex child-flex" cols="4">
                <v-card class="mx-auto my-4" max-width="374">
                    <v-img cover :src="project.image" :width="400" :height="200"></v-img>
                    <v-card-item>
                        <v-card-title>{{ project.title }}</v-card-title>
                        <v-card-subtitle>
                            <span class="me-1">{{ project.location }}</span>
                            <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
                        </v-card-subtitle>
                    </v-card-item>

                    <v-card-text>
                        <v-row align="center" class="mx-0">
                            <v-rating :model-value="project.rating" color="amber" density="compact" half-increments readonly
                                size="small"></v-rating>

                            <div class="text-grey ms-4">{{ project.rating }} ({{ project.reviews }})</div>
                        </v-row>

                        <div class="my-4 text-subtitle-1">{{ project.date }}</div>
                        <div>{{ Array.isArray(project.description) ? project.description.join(' ').split('.')[0] + '...' :
                            project.description }}</div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="teal-accent-4" variant="text" @click="navigateToProject(project.id)">
                            Read More
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { projects } from '../utils/projectData.js';

export default {
    data() {
        return {
            projects: projects,
            selectedService: 'All',
        };
    },
    computed: {
        filteredProjects() {
            if (this.selectedService === 'All') {
                return this.projects;
            } else {
                return this.projects.filter(project => project.service === this.selectedService);
            }
        },
    },
    methods: {
        navigateToProject(id) {
            this.$router.push({ name: 'project-details', params: { id: id } });
        },
    },
};
</script>