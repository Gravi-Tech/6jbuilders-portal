<template>
  <div class="booking-form">
    <v-card variant="text" class="form-card">
      <v-card-title class="form-title">Book a Service</v-card-title>
      <v-select
        v-model="dataSubjectType"
        :items="dataSubjectTypes"
        label="Data Subject Type *"
        variant="outlined"
      ></v-select>
      <v-text-field
        :rules="[rules.required]"
        v-model="fullName"
        label="Full Name *"
        placeholder="Juan Dela Cruz"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :rules="[rules.required]"
        v-model="contactNumber"
        label="Contact Number *"
        placeholder="09123456789"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :rules="[rules.email]"
        v-model="email"
        label="Email *"
        variant="outlined"
        placeholder="juan.delacruz@gmail.com"
      ></v-text-field>
      <v-text-field
        :rules="[rules.required]"
        v-model="siteLocation"
        label="Site Location *"
        placeholder="Street/Barangay/Municipality/City/Province"
        variant="outlined"
      ></v-text-field>
      <div>
        <v-select
          v-model="serviceType"
          :items="serviceTypes"
          label="Type of Service *"
          variant="outlined"
          :readonly="isReadOnlyService"
          chips
          deletable-chips
        >
        </v-select>
        <v-row v-if="isReadOnlyService">
          <v-col cols="12">
            <v-alert
              closable
              outlined
              color="grey"
              icon="mdi-information-outline"
              elevation="2"
              text="Service Type is read-only due to the pre-selected service. You can add an additional service."
            ></v-alert>
          </v-col>
        </v-row>
      </div>
      <v-text-field
        v-model="scheduleDate"
        label="Schedule Date *"
        append-inner-icon="mdi-calendar"
        variant="outlined"
        @click:append-inner="showDatePicker = true"
        :value="formattedDate"
      ></v-text-field>
      <v-dialog v-model="showDatePicker">
        <v-row justify="end">
          <v-date-picker v-model="scheduleDate" show-adjacent-months></v-date-picker>
        </v-row>
      </v-dialog>
      <v-select
        prepend-inner-icon="mdi-clock-outline"
        label="Select Time Range"
        density="comfortable"
        variant="solo"
        v-model="selectedTimeRange"
        :items="[
          '08:00 AM - 10:00 AM',
          '10:00 AM - 12:00 PM',
          '12:00 PM - 02:00 PM',
          '02:00 PM - 04:00 PM',
          '04:00 PM - 06:00 PM'
        ]"
      ></v-select>
      <v-textarea v-model="note" label="Note"></v-textarea>
      <v-btn type="submit" color="blue" size="large" @click="validateForm">Submit</v-btn>
    </v-card>
  </div>
  <v-dialog v-model="showConfirmationModal" max-width="500px">
    <v-card>
      <v-card-title>Confirm Booking</v-card-title>
      <v-card-text>
        <p>Are you sure you want to submit this booking?</p>
        <p><strong>Data Subject Type:</strong> {{ dataSubjectType }}</p>
        <p><strong>Service:</strong> {{ serviceType }}</p>
        <p><strong>Schedule Date:</strong> {{ scheduleDate }}</p>
        <p><strong>Time:</strong> {{ selectedTimeRange }}</p>
        <p><strong>Full Name:</strong> {{ fullName }}</p>
        <p><strong>Contact Number:</strong> {{ contactNumber }}</p>
        <p><strong>Site Location:</strong> {{ siteLocation }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
      </v-card-text>
      <v-card-actions class="actions">
        <v-btn color="primary" @click="submitForm">Yes</v-btn>
        <v-btn color="error" @click="cancelForm">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { serviceTypes } from '@/dataUtils/serviceType'
import { dataSubjectTypes } from '@/dataUtils/dataSubjectType'
import { addBooking } from '@/apirequests/bookings'
export default {
  name: 'BookingForm',
  props: {
    preSelectedService: String
  },
  computed: {
    isReadOnlyService() {
      return this.preSelectedService === this.serviceType
    }
  },
  components: {
    VDatePicker
  },
  data() {
    return {
      serviceTypes: serviceTypes,
      showDatePicker: false,
      scheduleDate: null,
      showPopup: false,
      agreement: false,
      dataSubjectTypes: dataSubjectTypes,
      dataSubjectType: 'Private Individual',
      selectedTimeRange: '02:00 PM - 04:00 PM',
      showConfirmationModal: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      fullName: null,
      contactNumber: null,
      siteLocation: null,
      email: null,
      serviceType: this.preSelectedService || 'Home Repair Services',
      note: null,
      rules: {
        email: (v) => !!(v || '').match(/@/) || 'Please enter a valid email',
        required: (v) => !!v || 'This field is required'
      }
    }
  },
  computed: {
    formattedDate() {
      if (this.scheduleDate) {
        const date = new Date(this.scheduleDate)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        return date.toLocaleDateString(undefined, options)
      }
      return null
    }
  },
  mounted() {
    const today = new Date()
    today.setDate(today.getDate())

    this.scheduleDate = today.toISOString().substr(0, 10)
  },
  methods: {
    validateForm() {
      if (
        !this.fullName ||
        !this.contactNumber ||
        !this.siteLocation ||
        !this.email ||
        !this.scheduleDate
      ) {
        alert('Please fill in all required fields.')
        return
      }

      this.showConfirmationModal = true
    },
    async submitForm() {
      try {
        const data = {
          type: this.dataSubjectType,
          fullName: this.fullName,
          mobileNumber: this.contactNumber,
          email: this.email,
          location: this.siteLocation,
          service: this.serviceType,
          scheduleDate: this.scheduleDate,
          note: this.note
        }

        await addBooking(data)

        const successMessage = 'The booking has been successfully booked.'
        this.showPopupMessage('success', 'Success', successMessage)

        this.showConfirmationModal = false

        this.fullName = ''
        this.contactNumber = ''
        this.email = ''
        this.siteLocation = ''
        this.note = ''
      } catch (error) {
        this.showPopupMessage('error', 'Error', 'Something went wrong')
        console.error(error)
      }
    },
    showConfirmation() {
      this.showConfirmationModal = true
    },
    cancelForm() {
      this.showConfirmationModal = false
    },
    showPopupMessage(type, title, message) {
      this.popupType = type
      this.popupTitle = title
      this.popupMessage = message
      this.showPopup = true

      setTimeout(() => {
        this.hidePopupMessage()
      }, 4000)
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

.booking-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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

.actions {
  display: flex;
}

.actions .v-btn {
  width: 200px;
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
