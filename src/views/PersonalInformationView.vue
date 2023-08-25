<template>
    <Header />
    <v-container>
        <div class="d-flex">
            <v-card style="padding: 20px; width: 600px;" variant="text">
                <v-row v-for="(user, i) in user" :key="i">
                    <v-col>
                        <v-avatar size="200" class="mb-3">
                            <v-img :src="user.avatar" cover class="circle"></v-img>
                        </v-avatar>

                        <h2>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</h2>
                        <p>Email: {{ user.email }}</p>
                        <p>Mobile: {{ user.phone }}</p>
                        <p>Address: {{ user.address }}</p>
                        <p>Company: {{ user.company }}</p>
                        <v-btn style="width: 100%; margin-top: 30px;" color="blue" variant="outlined"
                            @click="editProfile">Edit Profile</v-btn>
                    </v-col>
                </v-row>
            </v-card>
            <v-container>
                <v-tabs v-model="tab" color="blue-lighten-1">
                    <v-tab value="transaction-history">Transaction History</v-tab>
                    <v-tab value="booking-request">Booking Request</v-tab>
                </v-tabs>
                <v-card-text>
                    <v-window v-model="tab">
                        <v-window-item value="transaction-history">
                            transaction-history content
                            <!-- use card for each transaction -->
                        </v-window-item>
                        <v-window-item value="booking-request">
                            booking-request content
                            <!-- use card for each transaction -->
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-container>
        </div>
    </v-container>
    <Footer />
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

import { user } from '@/utils/userData';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            user: user,
            tab: null,
        };
    },
    methods: {
        editProfile() {

        }
    }
};
</script>
