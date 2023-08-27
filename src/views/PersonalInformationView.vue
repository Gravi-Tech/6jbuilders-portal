<template>
    <Header />
    <v-container>
        <v-card style="padding: 20px; width: 600px;" variant="text">
            <v-row class="profile-section">
                <v-col>
                    <v-avatar size="200" class="mb-3 position-relative">
                        <v-img :src="user.avatar" cover></v-img>
                    </v-avatar>
                    <v-icon v-if="editMode" color="blue" class="edit-avatar-icon"
                        @click="openFileInput">mdi-pencil-box-outline</v-icon>
                    <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="handleFileChange" />
                    <div class="user-details">
                        <h2 class="mb-3">{{ userName }}</h2>
                        <template v-if="!editMode">
                            <p>Email: <span style="color: grey;">{{ user.email }}</span></p>
                            <p>Mobile: {{ user.phone }}</p>
                            <p>Address: {{ user.address }}</p>
                            <p>Company: {{ user.company }}</p>
                        </template>
                        <template v-if="editMode">
                            <v-form @submit.prevent>
                                <v-text-field variant="outlined" v-model="user.firstname" label="Fistname"
                                    :rules="[requiredRule]"></v-text-field>
                                <v-text-field variant="outlined" v-model="user.middlename"
                                    label="Middlename"></v-text-field>
                                <v-text-field variant="outlined" v-model="user.lastname" label="Lastname"
                                    :rules="[requiredRule]"></v-text-field>
                                <v-text-field variant="outlined" v-model="user.email" label="Email" type="email"></v-text-field>
                                <v-text-field variant="outlined" v-model="user.phone" label="Mobile"
                                    :rules="[requiredRule, numberRule]"></v-text-field>
                                <v-text-field variant="outlined" v-model="user.address" label="Address"
                                    :rules="[requiredRule]"></v-text-field>
                                <v-text-field variant="outlined" v-model="user.company" label="Company"></v-text-field>
                            </v-form>
                        </template>
                        <v-btn v-if="!editMode" variant="outlined" style="margin-top: 10px; width: 100%;" color="blue"
                            @click="toggleEditMode">
                            Edit Profile
                        </v-btn>
                        <v-btn v-if="editMode" :elevation="0" style="margin-top: 10px; width: 100%;" color="blue"
                            @click="saveProfile">
                            Save
                        </v-btn>
                        <v-btn v-if="editMode" style="margin-top: 10px; width: 100%;" color="red" variant="outlined"
                            @click="cancelEdit">
                            Cancel
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card>

        <v-card class="tabs-section" variant="outlined">
            <v-tabs v-model="tab" color="blue-lighten-1" grow>
                <v-tab value="transaction-history">Transaction History</v-tab>
                <v-tab value="booking-request">Booking Request</v-tab>
            </v-tabs>
            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="transaction-history">
                        <div class="scrollable-container">
                            <v-card v-for="transaction in transactions" :key="transaction.id" class="transaction-card">
                                <div class="left">
                                    <v-card-title>{{ transaction.title }}</v-card-title>
                                    <v-card-text>{{ transaction.description }}</v-card-text>
                                    <v-card-actions>
                                        <v-btn text color="white" @click="viewTransactionDetails(transaction.id)">View Details</v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="right">
                                    <div class="transaction-info">
                                        <p>Date Completed: {{ transaction.dateCompleted }}</p>
                                        <p>Status: {{ transaction.status }}</p>
                                    </div>
                                    <v-rating :model-value="transaction.ratings" color="amber" density="compact"
                                        half-increments readonly size="large"></v-rating>
                                </div>
                            </v-card>
                        </div>
                    </v-window-item>

                    <v-window-item value="booking-request">
                        <div class="scrollable-container">
                            <v-card v-for="booking in bookings" :key="booking.id" class="booking-card">
                                <div class="left">
                                    <v-card-title>{{ booking.title }}</v-card-title>
                                    <v-card-text>{{ booking.description }}</v-card-text>
                                    <v-card-actions>
                                        <v-btn variant="text" color="white" @click="viewBookingDetails(booking.id)">View Details</v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="right">
                                    <div class="booking-info">
                                        <p>Date Created: {{ booking.createdDate }}</p>
                                        <p>Status: {{ booking.status }}</p>
                                    </div>
                                </div>
                            </v-card>
                        </div>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-container>
    <Footer />
    <v-snackbar v-model="snackbarVisible" :color="error" :timeout="4000">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { user } from '@/utils/userData';
import { transactions } from '@/utils/transactionHistoryData';
import { bookings } from '@/utils/bookingRequestData';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            user: user[0],
            transactions: transactions,
            bookings: bookings,
            tab: null,
            editMode: false,
            requiredRule: v => !!v || 'This field must not be empty',
            numberRule: v => /^\d+$/.test(v) || 'Invalid number',
            snackbarVisible: false,
        };
    },
    computed: {
        userName() {
            return `${this.user.firstname} ${this.user.middlename} ${this.user.lastname}`;
        }
    },
    methods: {
        toggleEditMode() {
            this.editMode = !this.editMode;
        },
        saveProfile() {
            if (!this.user.firstname || !this.user.lastname || !this.user.email || !this.user.phone || !this.user.address) {
                this.snackbarMessage = 'Please fill in all required fields.';
                this.snackbarVisible = true;
                return;
            }
            this.editMode = false;
        },
        cancelEdit() {
            this.user = { ...user[0] };
            this.editMode = false;
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.user.avatar = reader.result;
                };
                reader.readAsDataURL(file);
            }
        },
        viewTransactionDetails(id) {
            this.$router.push({ name: 'transaction-detail', params: { id: id } });
        },
        viewBookingDetails(id) {
            this.$router.push({ name: 'booking-detail', params: { id: id } });
        }
    }
};
</script>

<style scoped>

.scrollable-container {
    max-height: 330px;
    overflow-y: auto;
}

.edit-avatar-icon {
    cursor: pointer;
    position: relative;
    bottom: -70px;
    right: 50px;
}

.profile-section {
    display: flex;
    justify-content: space-between;
}

.user-details {
    width: 65%;
}

.tabs-section {
    margin-top: 20px;
    margin-bottom: 40px;
    padding: 0 0 0 20px;
}

.transaction-card,
.booking-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background-color: #60bdff;
} 
</style>
