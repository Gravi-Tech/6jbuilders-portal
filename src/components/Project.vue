<template>
    <v-container>
        <section class="mb-3" align="center">
            <h1> PROJECTS</h1>
        </section>
        <v-row>
            <v-col v-for="(project, index) in projects" :key="index" class="d-flex child-flex" cols="4">
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

                        <div>{{ project.description }}</div>
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

export default {
    data() {
        return {
            projects: [
                {
                    id: 1,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project1.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 2,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project2.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 3,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project3.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 4,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project4.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 5,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project5.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 6,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project6.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 7,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project7.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 8,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project8.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
                {
                    id: 9,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project9.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: 'lorem ipsum.',
                },
            ],
        };
    },
    methods: {
        navigateToProject(id) {
            this.$router.push({ name: 'project-details', params: { id: id } });
        }
    },
};
</script>