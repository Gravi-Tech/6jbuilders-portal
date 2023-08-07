<template>
  <div class="booking-form">
    <v-card class="form-card">
      <v-card-title class="form-title">Book a Service</v-card-title>
      <v-form @submit.prevent="submitForm">
        <v-select v-model="dataSubjectType" :items="dataSubjectTypes" label="Data Subject Type"
          variant="outlined"></v-select>

        <div class="d-flex">
          <v-col cols="8">
            <v-text-field :rules="[rules.required]" v-model="fullName" label="Full Name" placeholder="Juan Dela Cruz"
              variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field :rules="[rules.required]" v-model="contactNumber" label="Contact Number"
              placeholder="09123456789" variant="outlined"></v-text-field>
          </v-col>
        </div>
        <v-text-field :rules="[rules.email]" v-model="email" label="Email" variant="outlined"
          placeholder="juan.delacruz@gmail.com"></v-text-field>
        <div class="d-flex">
          <v-col cols="8"><v-text-field :rules="[rules.required]" v-model="siteLocation" label="Site Location"
              placeholder="Street/Barangay/Municipality/City/Province" variant="outlined"></v-text-field></v-col>
          <v-col cols="4"><v-text-field :rules="[rules.required]" v-model="zipCode" label="ZIP Code" placeholder="6000"
              variant="outlined"></v-text-field></v-col>
        </div>
        <v-select :rules="[rules.required]" v-model="serviceType" :items="serviceTypes" label="Type of Service"
          variant="outlined"></v-select>
        <div class="d-flex">
          <v-col cols="6">
            <v-file-input v-model="attachment" label="Attachment" variant="outlined"></v-file-input>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="scheduleDate" label="Schedule Date" type="date" variant="outlined"></v-text-field>
          </v-col>
        </div>
        <!-- date-picker is not working -->
        <!-- <v-date-picker v-model="scheduleDate" label="Schedule Date" outlined></v-date-picker> -->
        <!-- ******************************* -->
        <v-textarea v-model="note" label="Note"></v-textarea>
        <v-checkbox v-model="agreeToTerms" color="blue"
          label="Before submitting your form, please make sure to review and agree to our company's terms and conditions. By checking the box, you acknowledge that you have read and understood our policies regarding our construction services. Thank you for choosing 6JBuilders Construction and Home Repair Services."></v-checkbox>
        <v-btn type="submit" color="blue" size="large" width="100px">Submit</v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>

export default {
  name: "BookingForm",
  data() {
    return {
      dataSubjectTypes: ['Commercial', 'Contractor', 'Architect', 'Engineer'],
      dataSubjectType: "Private Individual",
      fullName: null,
      contactNumber: null,
      siteLocation: null,
      email: null,
      serviceTypes: [
        'Home Renovation',
        'Interior Design',
        'Plumbing',
        'Electrical',
        'Drywall Installation',
        'Tile Installation',
        'Glass and Aluminum Installation',
        'Welding',
        'Roofing',
        'Cabinets',
      ],
      serviceType: "Home Repair Services",
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
}

.form-card {
  max-width: 700px;
  width: 100%;
  padding: 36px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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
