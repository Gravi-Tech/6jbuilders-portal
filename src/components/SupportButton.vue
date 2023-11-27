<template>
    <div class="text-center mt-6">
        <v-dialog v-model="showModal" max-width="600">
            <template v-slot:activator="{ on }">
                <v-btn color="blue-lighten-1 mb-6" size="large" @click="openBookingModal" v-bind="on">{{ buttonText }}</v-btn>
            </template>
            <v-card>
                <BookingForm :preSelectedService="preSelectedService" @close="closeBookingModal" />
            </v-card>
        </v-dialog>
    </div>
</template>
  
<script>
import BookingForm from '../components/Book.vue';

export default {
    props: {
        preSelectedService: String,
    },
    components: {
        BookingForm,
    },
    data() {
        return {
            showModal: false,
        };
    },
    computed: {
        buttonText() {
            return this.preSelectedService ? `Book a ${this.preSelectedService}` : 'Book Now';
        },
    },
    methods: {
        openBookingModal() {
            this.showModal = true;
        },
        closeBookingModal() {
            this.showModal = false;
        },
    },
};
</script>