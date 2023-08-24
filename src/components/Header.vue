<template>
    <v-app-bar app :height="appBarHeight" :class="appBarClass">
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
            </v-row>

            <v-row class="d-flex justify-center align-center" style="padding: 10px;">
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
                <v-col cols="auto">
                    <v-btn size="large" color="blue" icon="mdi-account" @click.stop="drawer = !drawer"></v-btn>
                </v-col>
            </v-row>
        </section>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary location="right">
        <v-list-item lines="two" prepend-avatar="/src/assets/images/user-default.png" title="Software Developer"
            subtitle="D'Lio Kaiko"></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-account" title="Personal Infromation" value="personal-information"></v-list-item>
            <v-list-item prepend-icon="mdi-book-plus" title="Booking Request" value="request"></v-list-item>
            <v-list-item prepend-icon="mdi-history" title="Transaction History" value="history"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

const appBarHeight = ref(170);
const router = useRouter();
const activeRoute = ref(null);
const drawer = ref(null);
const isShrunk = ref(false);

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
};

const navLinks = [
    { route: 'home', title: 'Home' },
    { route: 'about-us', title: 'About' },
    { route: 'services', title: 'Services' },
    { route: 'projects', title: 'Projects' },
    { route: 'contact', title: 'Contact' },
];

const onScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
        isShrunk.value = true;
        appBarHeight.value = 80;
    } else {
        isShrunk.value = false;
        appBarHeight.value = 170;
    }
};

onMounted(() => {
    window.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
});

watch('$route', (to, from) => {
    activeRoute.value = to.name;
});

const navTo = (to) => {
    router.push({ name: to });
};
</script>

<style>
.shrink-header {
    padding: 10px;
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