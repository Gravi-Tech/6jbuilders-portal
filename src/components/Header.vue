<template>
    <v-app-bar color="blue darken-2" app height="150" class="pb-1 pt-1">

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
                        <v-card-text>
                            <v-text-field :loading="loading" density="compact" variant="underlined" label="Search here..."
                                append-inner-icon="mdi-magnify" single-line hide-details
                                @click:append-inner="onClick"></v-text-field>
                        </v-card-text>
                    </v-row>
                </v-col>
            </v-row>

            <v-row class="d-flex justify-center align-center">
                <v-col cols="auto">
                    <v-row class="d-flex justify-center align-center">
                        <v-img src="../assets/img/logo.png" max-height="80"></v-img>
                        <v-col cols="auto" v-for="(link, i) in navLinks" :key="i">
                            <v-menu v-if="link.route === 'services'" open-on-hover>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="white" v-bind="props">
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
                            <v-btn v-else :color="activeRoute === link.route ? 'black' : 'white'" variant="text"
                                @click="navTo(link.route)">{{ link.title }}</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
                <v-row class="d-flex justify-end align-center">
                    <v-col cols="auto">
                        <v-row class="d-flex justify-center align-center">
                            <v-btn variant="elevated" elevation="8" color="teal-accent-4" size="large"
                                @click="navTo('book')">Book Now</v-btn>
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
export default {
    data: () => ({
        loaded: false,
        loading: false,
        activeRoute: null,
    }),
    created() {
        this.activeRoute = this.$route.name;

        this.$watch('$route', (to, from) => {
            this.activeRoute = to.name;
        });
    },
    methods: {
        onClick() {
            this.loading = true

            setTimeout(() => {
                this.loading = false
                this.loaded = true
            }, 2000)
        },
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