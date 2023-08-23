<template>
    <div class="booking-form">
        <v-card class="form-card">
            <v-card-title class="form-title">Book a Service</v-card-title>
            <v-form @submit.prevent="submitForm">
                <v-select v-model="dataSubjectType" :items="dataSubjectTypes" label="Data Subject Type"
                    variant="outlined"></v-select>
                <v-text-field :rules="[rules.required]" v-model="fullName" label="Full Name" variant="outlined"
                    placeholder="Juan Dela Cruz"></v-text-field>
                <v-text-field :rules="[rules.required]" v-model="contactNumber" label="Contact Number" variant="outlined"
                    placeholder="09123456789"></v-text-field>
               
                <v-text-field :rules="[rules.email]" v-model="email" label="Email" variant="outlined"
                    placeholder="juan.delacruz@gmail.com"></v-text-field>
                <v-text-field :rules="[rules.required]" v-model="siteLocation" label="Site Location" variant="outlined"
                    placeholder="Street/Barangay/Municipality/City/Province"></v-text-field>

                <v-text-field :rules="[rules.required]" v-model="zipCode" label="ZIP Code" variant="outlined"
                    placeholder="6000"></v-text-field>
                <div>
                    <v-row>
                        <v-col cols="auto">
                            <v-btn variant="text" size="x-small" color="success">Add Additional Service</v-btn>
                        </v-col>
                    </v-row>
                    <v-select v-model="serviceType" :items="serviceTypes" label="Type of Service" variant="outlined"
                        :readonly="isReadOnlyService" multiple chips deletable-chips>
                    </v-select>
                    <v-row v-if="isReadOnlyService">
                        <v-col cols="12">
                            <v-alert closable outlined color="grey" icon="mdi-information-outline" elevation="2"
                                text="Service Type is read-only due to the pre-selected service. You can add an additional service."></v-alert>
                        </v-col>
                    </v-row>
                </div>
                <v-text-field :rules="[rules.required]" v-model="scheduleDate" type="date" label="Schedule Date" variant="outlined"></v-text-field>
                <v-file-input :rules="[rules.required]" v-model="attachment" label="Attachment" variant="outlined"></v-file-input>
                <v-textarea v-model="note" label="Note"></v-textarea>
                <div class="text-justify">Before submitting your form, please make sure to review and agree to our company's terms and conditions. By checking the box, you acknowledge that you have read and understood our policies regarding our construction services. Thank you for choosing 6JBuilders Construction and Home Repair Services.</div>
                <v-checkbox v-model="agreeToTerms" color="blue" :rules="[rules.required] "
                  label="I agree to the Terms of Condition and Privacy Policy." ></v-checkbox>
                <v-btn type="submit" color="blue" size="large" width="650px">Submit</v-btn>
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
            serviceType: [this.preSelectedService || "Home Repair Services"],
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
        }
    }
};
</script>
  
<style scoped>
.booking-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem;
}

.form-card {
    max-width: 700px;
    width: 100%;
    padding: 36px;
    /* box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); */
    
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
  