<template>
    <div class="booking-form">
        <v-card variant="text" class="form-card">
            <v-card-title class="form-title">Book a Service</v-card-title>
            <v-form @submit.prevent="submitForm">
                <v-select v-model="dataSubjectType" :items="dataSubjectTypes" label="Data Subject Type"
                    variant="outlined"></v-select>
                <v-text-field :rules="[rules.required]" v-model="fullName" label="Full Name" placeholder="Juan Dela Cruz"
                    variant="outlined"></v-text-field>
                <v-text-field :rules="[rules.required]" v-model="contactNumber" label="Contact Number"
                    placeholder="09123456789" variant="outlined"></v-text-field>
                <v-text-field :rules="[rules.email]" v-model="email" label="Email" variant="outlined"
                    placeholder="juan.delacruz@gmail.com"></v-text-field>
                <v-text-field :rules="[rules.required]" v-model="siteLocation" label="Site Location"
                    placeholder="Street/Barangay/Municipality/City/Province" variant="outlined"></v-text-field>
                <v-text-field :rules="[rules.required]" v-model="zipCode" label="ZIP Code" placeholder="6000"
                    variant="outlined"></v-text-field>
                <div>
                    <v-select v-model="serviceType" :items="serviceTypes" label="Type of Service" variant="outlined"
                        :readonly="isReadOnlyService" chips deletable-chips>
                    </v-select>
                    <v-row v-if="isReadOnlyService">
                        <v-col cols="12">
                            <v-alert closable outlined color="grey" icon="mdi-information-outline" elevation="2"
                                text="Service Type is read-only due to the pre-selected service. You can add an additional service."></v-alert>
                        </v-col>
                    </v-row>
                </div>
                <v-file-input v-model="attachment" label="Attachment" variant="outlined"></v-file-input>
                <v-text-field v-model="scheduleDate" label="Schedule Date" type="date" variant="outlined"></v-text-field>
                <v-textarea v-model="note" label="Note"></v-textarea>
                <v-checkbox v-model="agreement" :rules="[rules.required]" color="blue">
                    <template v-slot:label>
                        I agree to the&nbsp;
                        <router-link :to="getLinkRoute('Terms of Condition')">Terms of Condition</router-link>
                        &nbsp;and&nbsp;
                        <router-link :to="getLinkRoute('Privacy Policy')">Privacy Policy</router-link> </template>
                </v-checkbox>
                <v-btn type="submit" color="blue" size="large">Submit</v-btn>
            </v-form>
        </v-card>
    </div>
</template>
  
<script>

export default {
    name: "BookingForm",
    props: {
        preSelectedService: String,
    },
    computed: {
        isReadOnlyService() {
            return this.preSelectedService === this.serviceType;
        },
    },
    data() {
        return {
            agreement: false,
            dataSubjectTypes: ['Commercial', 'Contractor', 'Architect', 'Engineer'],
            dataSubjectType: "Private Individual",
            fullName: null,
            contactNumber: null,
            siteLocation: null,
            zipCode: null,
            email: null,
            serviceTypes: [
                'Cabinets',
                'Drywall Installation',
                'Electrical',
                'Glass and Aluminum Installation',
                'Home Renovation',
                'Interior Design',
                'Plumbing',
                'Roofing',
                'Tile Installation',
                'Welding',
            ],
            serviceType: this.preSelectedService || "Home Repair Services",
            attachment: null,
            scheduleDate: new Date().toISOString().substr(0, 10),
            note: null,
            agreeToTerms: false,
            rules: {
                email: v => !!(v || '').match(/@/) || 'Please enter a valid email',
                required: v => !!v || 'This field is required',
            },
        };
    },

    methods: {
        submitForm() {
            // Handle form submission
        },
        getLinkRoute(link) {
            if (link === 'Terms of Condition' || link === 'Privacy Policy') {
                const routeName = link === 'Terms of Condition' ? 'terms-of-service' : 'privacy-policy';
                return { name: 'legal', params: { page: routeName } };
            } else {
                const legalRoute = link.toLowerCase().replace(/\s+/g, '-');
                return { name: legalRoute };
            }
        },
    }
};
</script>
  
<style scoped>
a {
    color: blue;
}

.booking-form {
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-card {
    max-width: 700px;
    width: 100%;
    padding: 36px;
}

.form-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
}

.v-select,
.v-text-field,
.v-date-picker,
.v-textarea,
.v-checkbox,
.v-btn {
    margin-top: 16px;
    width: 100%;
}

.v-file-input {
    margin-top: 16px;
}

.v-btn {
    text-transform: none;
}

.v-checkbox label {
    font-size: 14px;
    line-height: 1.5;
}

.v-checkbox .v-label {
    margin-left: 8px;
}

.v-date-picker {
    width: 100%;
}
</style>
  