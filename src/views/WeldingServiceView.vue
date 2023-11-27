<template>
    <Header />
    <section class="about-section">
        <h2>{{ pageTitle }} Service</h2>
        <p>
            Transform your living space with our expert home renovation services.
            From modern kitchen remodels to luxurious bathroom upgrades, we are
            dedicated to delivering stunning results that exceed your expectations.
            Our experienced team of designers and craftsmen work collaboratively to
            bring your vision to life.
        </p>
    </section>
    <ProcessSection :steps="renovationSteps" :pageTitle="pageTitle" />
    <Testimonial />
    <SupportButton :preSelectedService="pageTitle" />
    <Footer />
</template>
  
<script scoped>
import Header from '../components/Header.vue';
import ProcessSection from '../components/ProcessSection.vue';
import Testimonial from '../components/Testimonial.vue';
import SupportButton from '../components/SupportButton.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        ProcessSection,
        Testimonial,
        SupportButton,
        Footer,
    },
    data() {
        return {
            renovationSteps: [
                {
                    id: 1,
                    title: 'Initial Consultation',
                    description: 'Personalized consultation to understand your vision and needs.',
                    image: 'https://pittsburghadditions.com/wp-content/uploads/2021/06/initial-consultation-01.jpg',
                },
                {
                    id: 2,
                    title: 'Design Planning',
                    description: 'Transform ideas into a well-defined design plan with detailed drawings.',
                    image: 'https://th.bing.com/th/id/R.002de52cc1eece5d729feb122fa4919c?rik=skiIm9z59c%2fQ8A&riu=http%3a%2f%2fdemo.djmimi.net%2fthemes%2findustry%2fwp-content%2fuploads%2f2016%2f02%2fconstruction-2.jpg&ehk=Nt%2bhyEd8sCxcg40UguXe4x6HOvcdxCMTXcPbFBKzK0U%3d&risl=&pid=ImgRaw&r=0',
                },
                {
                    id: 3,
                    title: 'Construction Phase',
                    description: 'Skilled craftsmen bring your design to reality with precision.',
                    image: 'https://orbitaleye.nl/wp-content/uploads/2021/02/stage-construction-site-e1612260703632.jpg',
                },
                {
                    id: 4,
                    title: 'Final Inspection',
                    description: 'Thorough inspection to ensure flawless finishes and functionality.',
                    image: 'https://thefrisky.com/wp-content/uploads/2019/09/AdobeStock_219685148.jpeg',
                },
            ],
            pageTitle: 'Welding',
        };
    },
};
</script>
  
<style scoped>
.about-section {
    padding: 2rem;
    background-color: #f3f3f3;
}

.about-section h2 {
    font-size: 24px;
    font-weight: 700;
}
</style>