<template>
    <Header />
    <v-container>
        <h1 class="text-center header">Booking Details</h1>
        <v-card v-if="booking" class="booking-card">
            <div class="d-flex">
                <v-card-title class="title">{{ booking.title }}</v-card-title>
                <v-chip class="mt-4" size="x-small" variant="outlined">{{ booking.status }}</v-chip>
            </div>
            <v-card-subtitle>#{{ booking.id }}</v-card-subtitle>
            <v-card-text class="description">{{ booking.description }}</v-card-text>
            <v-divider></v-divider>
            <div class="info-container">
                <div class="info-section">
                    <v-card-text class="info-label">Location:</v-card-text>
                    <v-card-text class="info-value">{{ booking.location }}</v-card-text>
                </div>
                <div class="info-section">
                    <v-card-text class="info-label">Building Owner:</v-card-text>
                    <v-card-text class="info-value">{{ booking.buildingOwner }}</v-card-text>
                </div>
                <div class="info-section">
                    <v-card-text class="info-label">Owner Number:</v-card-text>
                    <v-card-text class="info-value">{{ booking.ownerNumber }}</v-card-text>
                </div>
            </div>
            <v-divider></v-divider>
            <v-card-text class="info-label">Service Types:</v-card-text>
            <v-chip-group>
                <v-chip v-for="serviceType in booking.serviceTypes" :key="serviceType.id" class="service-type">
                    {{ serviceType.title }}
                </v-chip>
            </v-chip-group>
            <v-divider></v-divider>
            <div class="bottom-section">
                <div class="dates">
                    <p class="date">Date Started: {{ booking.createdDate }}</p>
                </div>
            </div>
            <div class="feedbacks-section">
                    <p class="feeback">Comment: {{ booking.feedbacks }}</p>
                </div>
        </v-card>
    </v-container>
    <Footer />
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { bookings } from '@/utils/bookingRequestData';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            booking: null
        };
    },
    created() {
        const bookingId = this.$route.params.id;
        this.booking = this.fetchbookingDetails(bookingId);
    },
    methods: {
        fetchbookingDetails(bookingId) {
            return bookings.find(booking => booking.id === Number(bookingId));
        },
    }
}
</script>

<style scoped>
.header {
    font-size: 24px;
    margin-bottom: 20px;
}

.transaction-card {
    margin: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.title {
    font-size: 20px;
    font-weight: 600;
}

.description {
    margin-top: 10px;
}

.info-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.info-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.info-label {
    font-weight: 500;
    color: #555;
}

.info-value {
    margin-top: 5px;
}

.images-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 15px;
}

.image {
    width: calc(20% - 10px);
    margin: 0 0 30px 10px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.images-container img {
    width: 100%;
    height: 100%;
}

.workers-list,
.materials-list,
.service-types-list {
    list-style: none;
    margin-left: 15px;
}

.worker,
.material,
.service-type {
    margin-bottom: 5px;
}

.bottom-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.ratings {
    font-size: 20px;
}

.dates {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: #777;
}

.date {
    margin-top: 5px;
}
</style>

