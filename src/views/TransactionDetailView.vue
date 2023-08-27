<template>
    <div>
        <Header />
        <v-container>
            <h1 class="text-center header">TRANSACTION DETAILS</h1>
            <v-card v-if="transaction" class="transaction-card">
                <div class="d-flex">
                    <v-card-title class="title">{{ transaction.title }}</v-card-title>
                    <v-chip class="mt-4" size="x-small" variant="outlined"
                        :color="transaction.status === 'COMPLETED' ? 'success' : 'error'">{{ transaction.status }}</v-chip>
                </div>
                <v-card-subtitle>#{{ transaction.id }}</v-card-subtitle>
                <v-card-text class="description">{{ transaction.description }}</v-card-text>
                <v-divider></v-divider>
                <div class="info-container">
                    <div class="info-section">
                        <v-card-text class="info-label">Location:</v-card-text>
                        <v-card-text class="info-value">{{ transaction.location }}</v-card-text>
                    </div>
                    <div class="info-section">
                        <v-card-text class="info-label">Building Owner:</v-card-text>
                        <v-card-text class="info-value">{{ transaction.buildingOwner }}</v-card-text>
                    </div>
                    <div class="info-section">
                        <v-card-text class="info-label">Owner Number:</v-card-text>
                        <v-card-text class="info-value">{{ transaction.ownerNumber }}</v-card-text>
                    </div>
                    <div class="info-section">
                        <v-card-text class="info-label">Expenses:</v-card-text>
                        <v-card-text class="info-value">₱{{ transaction.expenses }}</v-card-text>
                    </div>
                </div>
                <v-divider></v-divider>
                <v-card-text class="info-label">Images:</v-card-text>
                <div class="images-container">
                    <div v-for="(image, index) in transaction.images" :key="index" class="image">
                        <img :src="image" cover alt="Transaction Image" />
                    </div>
                </div>
                <v-divider></v-divider>
                <v-card-text class="info-label">Workers:</v-card-text>
                <v-chip-group>
                    <v-chip v-for="worker in transaction.workers" :key="worker.id" class="worker">
                        {{ worker.fullname }} ({{ worker.nickname }})
                    </v-chip>
                </v-chip-group>
                <v-divider></v-divider>
                <v-card-text class="info-label">Materials:</v-card-text>
                <v-chip-group>
                    <v-chip v-for="material in transaction.materials" :key="material.id" class="material">
                        {{ material.title }} - Cost: {{ material.cost }}, Quantity: {{ material.quantity }}
                    </v-chip>
                </v-chip-group>
                <v-divider></v-divider>
                <v-card-text class="info-label">Service Types:</v-card-text>
                <v-chip-group>
                    <v-chip v-for="serviceType in transaction.serviceTypes" :key="serviceType.id" class="service-type">
                        {{ serviceType.title }}
                    </v-chip>
                </v-chip-group>
                <v-divider></v-divider>
                <div class="bottom-section">
                    <v-rating :model-value="transaction.ratings" color="amber" density="compact" half-increments readonly
                        size="large" class="ratings"></v-rating>
                    <div class="dates">
                        <p class="date">Date Started: {{ transaction.dateStarted }}</p>
                        <p class="date">Is Extended: {{ transaction.isExtended }}</p>
                        <p class="date">Created Date: {{ transaction.createdDate }}</p>
                        <p class="date">Date Completed: {{ transaction.dateCompleted }}</p>
                    </div>
                </div>
            </v-card>
        </v-container>
        <Footer />
    </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { transactions } from '../utils/transactionHistoryData.js';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            transaction: null
        };
    },
    created() {
        const transactionId = this.$route.params.id;
        this.transaction = this.fetchTransactionDetails(transactionId);
    },
    methods: {
        fetchTransactionDetails(transactionId) {
            return transactions.find(transaction => transaction.id === Number(transactionId));
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
