<template>
    <Header />
    <v-container>
        <v-form v-model="form" @submit.prevent="submitRequest">
            <v-text-field v-model="adminIdentifier" label="Admin ID or Email" dense variant="outlined" required
                :rules="adminIdentifierRules" placeholer="Enter you admin ID/email">
            </v-text-field>
            <v-btn color="blue-lighten-2" type="submit">Submit Request</v-btn>
            <p></p>
        </v-form>
        <v-snackbar v-model="showSnackbar" color="success" max-width="400" class="mb-5">
            Please check your email or contact the Super Admin for your password reset.
            <v-btn color="white" size="small" text @click="showSnackbar = false">Close</v-btn>
        </v-snackbar>
    </v-container>
    <Footer />
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            form: {},
            adminIdentifier: '',
            showSnackbar: false,
            adminIdentifierRules: [
                (v) => !!v || 'Admin ID or Email is required',
                (v) => isValidEmail(v) || 'Valid email is required',
            ],
        };
    },
    methods: {
        submitRequest() {
            this.showSnackbar = true;
        },
    },
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
</script>

<style scoped>
.v-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.v-text-field {
    margin-bottom: 16px;
}

.v-btn {
    width: 100%;
}
</style>
