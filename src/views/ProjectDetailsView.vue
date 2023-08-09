<template>
    <Header />
    <v-img cover height="300" :src="project.image"></v-img>
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
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            project: null,
            projectNotFound: false,
        };
    },
    created() {
        const projectId = this.$route.params.id;
        this.project = this.fetchProjectDetails(projectId);
    },
    methods: {
        fetchProjectDetails(projectId) {
            const projects = [
                {
                    id: 1,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project1.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 2,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project2.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 3,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project3.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 4,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project4.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 5,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project5.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 6,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project6.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 7,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project7.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 8,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project8.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
                {
                    id: 9,
                    title: 'Custom Cabinets',
                    location: 'Mandaue, Cebu City, Cebu',
                    image: '../src/assets/images/project9.jpeg',
                    rating: 4.5,
                    reviews: 413,
                    date: '08/09/2023',
                    description: [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo.',
                        'Velit laoreet id donec ultrices tincidunt arcu non sodales neque. Magna etiam tempor orci eu lobortis elementum nibh tellus. Ac placerat vestibulum lectus mauris ultrices. Duis at consectetur lorem donec. Nisl purus in mollis nunc sed. Amet mauris commodo quis imperdiet massa.',
                        'Tortor consequat id porta nibh venenatis cras sed felis eget. Libero enim sed faucibus turpis. Lorem mollis aliquam ut porttitor leo a diam sollicitudin. Est ultricies integer quis auctor elit. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. At quis risus sed vulputate odio ut enim blandit. Turpis tincidunt id aliquet risus feugiat.'],
                },
            ];
            return projects.find(project => project.id === Number(projectId));
        },
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>
  
<style scoped>
.description-content {
    font-size: 16px;
    line-height: 1.6;
}
</style>
  