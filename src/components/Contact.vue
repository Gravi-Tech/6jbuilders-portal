<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
    <br />
    <v-row>
      <!-- <v-col cols="12" md="6">
        <v-card class="contact-card">
          <v-card-title class="mb-4">Get in Touch</v-card-title>
          <v-form @submit.prevent="submitForm">
            <v-text-field v-model="name" :rules="[rules.required]" label="Name" outlined clearable></v-text-field>
            <v-text-field :rules="[rules.email]" v-model="email" label="Email" outlined clearable></v-text-field>
            <v-textarea v-model="message" :rules="[rules.required]" label="Message" outlined clearable></v-textarea>
            <v-checkbox v-model="agreement" :rules="[rules.required]" color="blue">
              <template v-slot:label>
                I agree to the&nbsp;
                <router-link :to="getLinkRoute('Terms of Condition')">Terms of Condition</router-link>
                &nbsp;and&nbsp;
                <router-link :to="getLinkRoute('Privacy Policy')">Privacy Policy</router-link> </template>
            </v-checkbox>
            <br />
            <v-btn type="submit" style="width: 100%;" color="blue">Submit</v-btn>
          </v-form>
        </v-card>
      </v-col> -->
      <v-col cols="12" md="12">
        <v-card class="location-card">
          <v-card-title class="mb-4">Information</v-card-title>
          <v-card-text class="d-flex align-center">
            <v-icon class="info-icon" color="blue">mdi-phone</v-icon>
            <span class=" info-label mr-2">Phone:</span> 0926 123 7672
          </v-card-text>
          <v-card-text class="d-flex align-center">
            <v-icon class="info-icon" color="blue">mdi-map-marker</v-icon>
            <span class=" info-label mr-2">Address:</span> Canduman, Mandaue Cebu City
          </v-card-text>
          <v-card-text class="d-flex align-center">
            <v-icon class="info-icon" color="blue">mdi-clock</v-icon>
            <span class=" info-label mr-2">Opening Hours:</span> Mon - Sat: 7:00 am - 7:00 pm
          </v-card-text>
        </v-card>
        <v-card class="location-card mt-6">
          <v-card-title class="mb-4">Company Location</v-card-title>
          <div class="mt-6">
            <iframe width="100%" height="300" frameborder="0" style="border:0" :src="googleMapsUrl"
              allowfullscreen></iframe>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ContactPage",
  data() {
    return {
      agreement: false,
      name: undefined,
      message: undefined,
      email: undefined,
      isValid: false,
      isLoading: false,
      rules: {
        email: v => !!(v || '').match(/@/) || 'Please enter a valid email',
        required: v => !!v || 'This field is required',
      },
      terms: false,
      googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15698.725616841883!2d123.92299172379796!3d10.36733884297122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9987ef8581561%3A0xa27893ca941b1d92!2sCanduman%2C%20Cebu!5e0!3m2!1sen!2sph!4v1691392221087!5m2!1sen!2sph",
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
  },
};
</script>

<style scoped>
a {
  color: blue;
}

.contact-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.contact-card,
.location-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-card .v-card__title,
.location-card .v-card__title {
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.info-icon {
  margin-right: 8px;
  font-size: 24px;
}

.info-label {
  font-weight: bold;
  margin-left: 4px;
}

.book-service-btn {
  margin-top: 16px;
}
</style>