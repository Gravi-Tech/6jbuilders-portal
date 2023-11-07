<template>
    <v-parallax
        src="https://th.bing.com/th/id/R.6e0e4ba1f49ada5e668d1898e3312871?rik=4CUrTSwBruaA7g&riu=http%3a%2f%2fassets.skyfilabs.com%2fimages%2fconstruction-project-management.png&ehk=4Gj8x%2fOafUdiL1PRUZTTxXtBYCdPpEcf5eOe89nd2fo%3d&risl=&pid=ImgRaw&r=0"
        height="300">
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
                            <v-img cover :src="project.image" :width="400" :height="200"></v-img>

                            <v-card-title>{{ project.title }}</v-card-title>
                            <v-card-subtitle>
                                <v-icon icon="mdi-map-marker" size="small"></v-icon>
                                <span class="ml-1">{{ project.location }}</span>
                                <div class="my-1 ml-1 text-subtitle-1">{{ project.date }}</div>
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