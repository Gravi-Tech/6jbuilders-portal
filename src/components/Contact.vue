<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
    <br />
    <div class="d-flex">
      <div class="w-100 mt-4">
        <v-card class="location-card">
          <v-card-title class="mb-4">Information</v-card-title>
          <v-card-text class="d-flex align-center">
            <v-icon class="info-icon" color="blue">mdi-phone</v-icon>
            <span class="info-label mr-2">Phone:</span> 0926 123 7672
          </v-card-text>
          <v-card-text class="d-flex align-center">
            <v-icon class="info-icon" color="blue">mdi-map-marker</v-icon>
            <span class="info-label mr-2">Address:</span>Deca Homes Prime Mandaue, Mandaue City, Cebu
          </v-card-text>
          <v-card-text class="d-flex align-center">
            <v-icon class="info-icon" color="blue">mdi-clock</v-icon>
            <span class="info-label mr-2">Business Hours:</span> Mon - Sat: 7:00 am - 7:00 pm
          </v-card-text>
        </v-card>
        <v-card class="location-card mt-6">
          <v-card-title class="mb-4">Company Location</v-card-title>
          <div class="mt-6">
            <iframe
              width="100%"
              height="300"
              frameborder="0"
              style="border: 0"
              :src="googleMapsUrl"
              allowfullscreen
            ></iframe>
          </div>
        </v-card>
      </div>
      <div class="w-100 ml-6">
        <v-card class="my-4 freq">
          <v-card-title class="mb-4">Frequently Asked Questions</v-card-title>
          <v-expansion-panels variant="popout" class="my-2">
            <v-expansion-panel>
              <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                Can I avail your service by walk-in?
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                Yes, we accept walk-ins at our office. You can visit our office directly to avail
                our services.
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                How do I start the construction service?
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                To start the construction service, you need to book a service through our website or
                contact our customer service team. After you have booked the service, our team will
                give you a call to confirm your booking. Once the booking is confirmed, we will
                schedule an inspection of the site location.
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <v-card class="feedback">
          <v-card-title class="mb-4">Feedback</v-card-title>

          <v-text-field v-model="name" label="Full Name *" outlined></v-text-field>
          <v-text-field v-model="job" label="Job Title *" outlined></v-text-field>
          <v-textarea v-model="message" label="Message *" outlined></v-textarea>

          <br />
          <v-btn style="width: 100%" color="blue" @click="handleSubmit">Submit Feedback</v-btn>
        </v-card>
      </div>
    </div>
  </div>
  <v-alert
    class="popup-message"
    v-if="showPopup"
    variant="tonal"
    :type="popupType"
    :title="popupTitle"
    :value="true"
    dismissible
    @input="hidePopupMessage"
  >
    {{ popupMessage }}
  </v-alert>
</template>

<script>
import { addFeedback } from '@/apirequests/feedback'
export default {
  name: 'ContactPage',
  data() {
    return {
      name: null,
      job: null,
      message: null,
      popupType: '',
      popupTitle: '',
      showPopup: false,
      popupMessage: '',
      isLoading: false,
      googleMapsUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d555.786611001712!2d123.95427073981037!3d10.361362255427773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999398655fc7f%3A0xd0a6e6555b966cf7!2sMc%20Anden%20Construction%20Services!5e0!3m2!1sen!2sph!4v1702867082464!5m2!1sen!2sph'
    }
  },
  methods: {
    async handleSubmit() {
      try {
        if (!this.name || !this.job || !this.message) {
          const failMessage = 'Please fill the required fields'
          this.showPopupMessage('error', 'Fail to submit', failMessage)
          return
        }
        const data = {
          fullName: this.name,
          job_description: this.job,
          message: this.message
        }
        await addFeedback(data)
        const successMessage = `Thank you for your feedback. We greatly appreciate your valuable input and the opportunity to serve you. Your feedback will help us improve our services and deliver even better results in the future. If you have any further questions or concerns, please don't hesitate to reach out. We look forward to continuing to meet your construction needs with professionalism and excellence.`
        this.showPopupMessage('success', 'Sent Successfully', successMessage)

        this.name = null
        this.job = null
        this.message = null
      } catch (error) {
        console.log(error)
      }
    },
    showPopupMessage(type, title, message) {
      this.popupType = type
      this.popupTitle = title
      this.popupMessage = message
      this.showPopup = true

      setTimeout(() => {
        this.hidePopupMessage()
      }, 8000)
    },
    hidePopupMessage() {
      this.showPopup = false
      this.popupType = ''
      this.popupTitle = ''
      this.popupMessage = ''
    }
  }
}
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

.feedback,
.freq,
.location-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
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

.popup-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
