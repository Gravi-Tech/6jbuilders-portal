<template>
    <v-container>
        <SystemHeader />

        <v-form v-model="form" @submit.prevent="submitRequest">
            <v-text-field v-model="adminIdentifier" label="Admin ID or Email" dense outlined required
                :rules="adminIdentifierRules"></v-text-field>

            <v-btn color="primary" type="submit">Submit Request</v-btn>
        </v-form>

        <SystemFooter />

        <v-snackbar v-model="showSnackbar" color="info" top>
            Please check your email or contact the Super Admin for your password reset.
            <v-btn color="white" text @click="showSnackbar = false">Close</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
import SystemHeader from '../components/SystemHeader.vue';
import SystemFooter from '../components/SystemFooter.vue';

export default {
    components: {
        SystemHeader,
        SystemFooter,
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
