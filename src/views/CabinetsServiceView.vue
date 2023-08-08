<template>
    <Header />
    <section class="about-section">
        <h2>{{ pageTitle }}</h2>
        <p>
            Enhance the functionality and aesthetics of your living spaces with our top-tier cabinets service. We
            specialize in crafting custom cabinetry solutions that seamlessly integrate with your home's design and
            layout. From modern kitchen overhauls to stylish bathroom upgrades, our cabinets are meticulously designed
            and expertly crafted to meet your specific needs.
        </p>
        <p>
            Experience the transformation of your living spaces with our cabinets service. Elevate your home's storage
            and aesthetics with custom-designed cabinetry that reflects your style and enhances your daily living.
        </p>
    </section>
    <ProcessSection :steps="cabinetsSteps" :pageTitle="pageTitle" />
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
            cabinetsSteps: [
                {
                    id: 5,
                    title: 'Initial Consultation',
                    description: 'Our initial consultation is a pivotal step in the cabinets service.',
                    image: 'https://pittsburghadditions.com/wp-content/uploads/2021/06/initial-consultation-01.jpg',
                },
                {
                    id: 6,
                    title: 'Design Planning',
                    description: 'Design planning is where functionality meets aesthetics in the cabinets service.',
                    image: 'https://th.bing.com/th/id/R.002de52cc1eece5d729feb122fa4919c?rik=skiIm9z59c%2fQ8A&riu=http%3a%2f%2fdemo.djmimi.net%2fthemes%2findustry%2fwp-content%2fuploads%2f2016%2f02%2fconstruction-2.jpg&ehk=Nt%2bhyEd8sCxcg40UguXe4x6HOvcdxCMTXcPbFBKzK0U%3d&risl=&pid=ImgRaw&r=0',
                },
                {
                    id: 7,
                    title: 'Craftsmanship',
                    description: 'Craftsmanship is the hallmark of our cabinets service.',
                    image: 'https://orbitaleye.nl/wp-content/uploads/2021/02/stage-construction-site-e1612260703632.jpg',
                },
                {
                    id: 8,
                    title: 'Installation and Final Touches',
                    description: 'The installation phase is the culmination of our cabinets service.',
                    image: 'https://thefrisky.com/wp-content/uploads/2019/09/AdobeStock_219685148.jpeg',
                },
            ],
            pageTitle: 'Cabinets Service',
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
