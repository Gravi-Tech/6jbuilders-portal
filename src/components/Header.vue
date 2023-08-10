<template>
    <v-app-bar color="#E0E0E0" app height="150" class="pb-1 pt-1">
        <v-container>
            <v-row class="d-flex justify-center align-center">
                <v-col cols="auto">
                    <v-row class="d-flex align-center">
                        <v-icon class="app-icon large-icon">mdi-phone</v-icon>
                        <v-col cols="auto">
                            <strong>Phone:</strong>
                            <p class="small-text">+6394 000 3243</p>
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
                <v-col>
                    <v-row class="d-flex align-center">
                        <SearchBar />
                    </v-row>
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
                                    <v-list-item v-for="(service, index) in services" :key="index" :value="index">
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
                <v-row btn class="d-flex justify-end align-center">
                    <v-col cols="auto">
                        <v-row class="d-flex justify-center align-center bg-black">
                            <v-btn variant="evelated" elevation="8" size="large" @click="navTo('book')">Book Now</v-btn>
                        </v-row>
                    </v-col>
                </v-row>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';
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
    router.push(`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`);
}

const navLinks = [
    { route: 'home', title: 'Home' },
    { route: 'about-us', title: 'About' },
    { route: 'services', title: 'Services' },
    { route: 'contact', title: 'Contact' },
    { route: 'login', title: 'Login' },
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
    },
    data: () => ({
        activeRoute: null,
    }),
    created() {
        this.activeRoute = this.$route.name;

        this.$watch('$route', (to, from) => {
            this.activeRoute = to.name;
        });
    },
}
</script>

<style>
strong {
    font-size: 14px;
}

.app-icon.large-icon {
    font-size: 28px;
}

.small-text {
    font-size: 10px;
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