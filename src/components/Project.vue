<template>
    <v-parallax :src="parallaxBackground" height="300">
        <v-row class="fill-height ma-0 text-white">
            <v-col cols="12" class="text-center white--text align-self-center">
                <h1 class="text-h4 font-weight-thin mb-4"> OUR PROJECTS</h1>
            </v-col>
        </v-row>
    </v-parallax>
    <v-container>
        <v-row>
            <v-col v-for="(project, index) in filteredProjects" :key="index" class="d-flex child-flex" cols="4">
                <v-card class="mx-auto my-4" max-width="374">
                    <div class="project">
                        <div class="details">
                            <v-img cover :src="project.bg_project_img" :width="400" :height="200"></v-img>

                            <v-card-title>{{ project.title }}</v-card-title>
                            <v-card-subtitle>
                                <v-icon icon="mdi-map-marker" size="small"></v-icon>
                                <span class="ml-1">{{ project.location }}</span>
                                <div class="my-1 ml-1 text-subtitle-1">{{ project.date_completed }}</div>
                            </v-card-subtitle>

                            <v-card-text>
                                <div>
                                    {{
                                        Array.isArray(project.description)
                                        ? project.description.join(' ').slice(0, 180) + (project.description.join(' ').length >
                                            100 ? '...' : '')
                                        : project.description
                                    }}
                                </div>
                            </v-card-text>
                        </div>
                        <div class="d-flex justify-end">
                            <v-card-actions>
                                <v-btn color="teal-accent-4" variant="tonal" @click="navigateToProject(project.id)">
                                    Read More
                                </v-btn>
                            </v-card-actions>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { projects } from '../dataUtils/projectData.js';

export default {
    data() {
        return {
            projects: projects,
            selectedService: 'All',
            parallaxBackground: '/src/assets/images/6jbuilders-bg.jpg',
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

<style scoped>
.project {
    display: block;
    align-items: center;
}

.project .details {
    max-height: 500px;
    height: 450px;
}
</style>