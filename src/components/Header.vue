<template>
    <v-app-bar app height="160" :class="appBarClass">
        <section>
            <v-row v-if="!isShrunk" class="d-flex justify-center align-center mt-1">
                <v-col cols="auto">
                    <v-row class="d-flex align-center">
                        <v-icon class="app-icon large-icon">mdi-phone</v-icon>
                        <v-col cols="auto">
                            <strong>Phone:</strong>
                            <p class="small-text">0926 123 7672</p>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="auto">
                    <v-row class="d-flex align-center">
                        <v-icon class="app-icon large-icon">mdi-map-marker</v-icon>
                        <v-col cols="auto">
                            <strong>Address:</strong>
                            <p class="small-text">Canduman, Mandaue Cebu City</p>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="auto">
                    <v-row class="d-flex align-center">
                        <v-icon class="app-icon large-icon">mdi-calendar-clock</v-icon>
                        <v-col cols="auto">
                            <strong>Opening Hours:</strong>
                            <p class="small-text">Mon - Sat: 7:00 am - 7:00 pm</p>
                        </v-col>
                    </v-row>
                </v-col>
                <!-- <v-col>
                    <v-row class="d-flex align-center">
                        <SearchBar />
                    </v-row>
                </v-col> -->
                <v-col cols="auto">
                    <Notification />
                </v-col>
                <v-col cols="auto">
                    <Profile />
                </v-col>
            </v-row>

            <v-row class="d-flex justify-center align-center">
                <v-col cols="auto">
                    <v-row class="d-flex justify-center align-center">
                        <a to="/home">
                            <v-img src="/src/assets/logo.png" max-height="80" alt="Logo"></v-img>
                        </a>
                        <v-col cols="auto" v-for="(link, i) in navLinks" :key="i">
                            <v-menu v-if="link.route === 'services'" open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="black" v-bind="props">
                                        Services
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item v-for="(service, index) in services" :key="index" :value="index"
                                        class="dense">
                                        <v-list-item-title @click="navigateToService(service)">{{ service.title
                                        }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            <v-btn v-else :color="activeRoute === link.route ? '#039BE5' : 'black'" variant="text"
                                @click="navTo(link.route)">{{ link.title }}</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="auto" class="mr-4">
                    <v-row class="d-flex justify-center align-center bg-blue-lighten-1">
                        <v-btn size="large" @click="navTo('login')">Login</v-btn>
                    </v-row>
                </v-col>
                <v-col cols="auto">
                    <v-row class="d-flex justify-center align-center bg-blue-lighten-1">
                        <v-btn size="large" @click="navTo('book')">Book Now</v-btn>
                    </v-row>
                </v-col>
            </v-row>
        </section>
    </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Profile from './Profile.vue';
import Notification from './Notification.vue';
const router = useRouter()

const services = [
    { title: 'Cabinets' },
    { title: 'Drywall Installation' },
    { title: 'Electrical' },
    { title: 'Glass and Aluminum Installation' },
    { title: 'Home Renovation' },
    { title: 'Home Repair Services' },
    { title: 'Interior Design' },
    { title: 'Plumbing' },
    { title: 'Roofing' },
    { title: 'Tile Installation' },
    { title: 'Welding' }
];

const navigateToService = (service) => {
    router.push(`/6jbuilders/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`);
}

const navLinks = [
    { route: 'home', title: 'Home' },
    { route: 'about-us', title: 'About' },
    { route: 'services', title: 'Services' },
    { route: 'projects', title: 'Projects' },
    { route: 'contact', title: 'Contact' },
]
const navTo = (to) => {
    router.push({ name: to });
}
</script>

<script>
import SearchBar from './SearchBar.vue';

export default {
    components: {
        SearchBar,
        Profile,
        Notification,
    },
    data: () => ({
        activeRoute: null,
        isShrunk: false,
    }),
    mounted() {
        window.addEventListener('scroll', this.onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    },
    created() {
        this.activeRoute = this.$route.name;

        this.$watch('$route', (to, from) => {
            this.activeRoute = to.name;
        });
    },
    methods: {
        onScroll() {
            const scrollPosition = window.scrollY;
            this.isShrunk = scrollPosition > 50;
        },
    },
    computed: {
        appBarClass() {
            return {
                'shrink-header': this.isShrunk,
            };
        },
    },
};
</script>

<style>
.shrink-header {
    padding: 10px;
    height: 80px;
    transition: height 0.4s ease-in-out;
    overflow: hidden;
}

strong {
    font-size: 14px;
}

.app-icon.large-icon {
    font-size: 28px;
}

.small-text {
    font-size: 14px;
}

@media screen and (max-width: 600px) {
    .app-icon.large-icon {
        font-size: 22px;
    }

    .small-text {
        font-size: 8px;
    }
}
</style>