<template>
  <Header />
  <section class="about-section">
    <h2>{{ pageTitle }} Service</h2>
    <p>
      Elevate your living space with our expert drywall installation services. From flawless wall surfaces to seamless
      room transformations, we are committed to delivering exceptional results that exceed your expectations. Our
      skilled team of professionals collaborates closely to bring your vision to life, ensuring precision and
      craftsmanship at every step.
    </p>
    <p>
      With a keen eye for detail and a focus on quality, we specialize in creating smooth and even wall surfaces that
      provide the perfect canvas for your home decor. Whether you're seeking to enhance the aesthetics of your interiors
      or improve the structural integrity of your spaces, our drywall installation services are tailored to meet your
      unique needs.
    </p>
    <p>
      Our experienced craftsmen bring years of expertise to the construction phase, meticulously installing drywall to
      create uniform and visually pleasing results. We work diligently to ensure that every joint, seam, and corner is
      seamlessly integrated, providing a flawless backdrop that enhances the beauty of your home.
    </p>
    <p>
      The final inspection is a testament to our commitment to excellence. Our professionals conduct a thorough
      evaluation, scrutinizing every aspect of the installation to ensure flawless finishes and impeccable workmanship.
      Your satisfaction is our priority, and we take pride in delivering drywall installations that stand out for their
      quality and long-lasting appeal.
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
          id: 9,
          title: 'Initial Consultation',
          description: 'Personalized consultation to understand your vision and needs.',
          image: 'https://pittsburghadditions.com/wp-content/uploads/2021/06/initial-consultation-01.jpg',
        },
        {
          id: 10,
          title: 'Design Planning',
          description: 'Transform ideas into a well-defined design plan with detailed drawings.',
          image: 'https://th.bing.com/th/id/R.002de52cc1eece5d729feb122fa4919c?rik=skiIm9z59c%2fQ8A&riu=http%3a%2f%2fdemo.djmimi.net%2fthemes%2findustry%2fwp-content%2fuploads%2f2016%2f02%2fconstruction-2.jpg&ehk=Nt%2bhyEd8sCxcg40UguXe4x6HOvcdxCMTXcPbFBKzK0U%3d&risl=&pid=ImgRaw&r=0',
        },
        {
          id: 11,
          title: 'Construction Phase',
          description: 'Skilled craftsmen bring your design to reality with precision.',
          image: 'https://orbitaleye.nl/wp-content/uploads/2021/02/stage-construction-site-e1612260703632.jpg',
        },
        {
          id: 12,
          title: 'Final Inspection',
          description: 'Thorough inspection to ensure flawless finishes and functionality.',
          image: 'https://thefrisky.com/wp-content/uploads/2019/09/AdobeStock_219685148.jpeg',
        },
      ],
      pageTitle: 'Drywall Installation',
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
