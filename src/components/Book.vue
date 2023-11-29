<template>
  <div class="booking-form">
    <v-card variant="text" class="form-card">
      <v-card-title class="form-title">Book a Service</v-card-title>
      <v-select
        v-model="type"
        :items="types"
        label="Data Subject Type *"
        variant="outlined"
      ></v-select>
      <v-text-field
        :rules="[rules.required]"
        v-model="first_name"
        label="Firstname *"
        placeholder="Juan"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="middle_name"
        label="Middlename (Optional)"
        placeholder="Dela"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :rules="[rules.required]"
        v-model="last_name"
        label="Lastname *"
        placeholder="Cruz"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :rules="[rules.required]"
        v-model="contact_number"
        label="Contact Number *"
        placeholder="09999999999"
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
        v-model="location"
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
        v-model="schedule_date"
        label="Schedule Date *"
        append-inner-icon="mdi-calendar"
        variant="outlined"
        @click:append-inner="showDatePicker = true"
        :value="formattedDate"
      ></v-text-field>
      <v-dialog v-model="showDatePicker">
        <v-row justify="end">
          <v-date-picker v-model="schedule_date" show-adjacent-months></v-date-picker>
        </v-row>
      </v-dialog>
      <v-textarea v-model="note" label="Note"></v-textarea>
      <v-btn type="submit" color="blue" size="large" @click="validateForm">Submit</v-btn>
      <v-btn type="submit" color="blue" size="large" variant="outlined" @click="cancelBooking"
        >Cancel</v-btn
      >
    </v-card>
  </div>
  <v-dialog v-model="showConfirmationModal" max-width="500px">
    <v-card>
      <v-card-title>Confirm Booking</v-card-title>
      <v-card-text>
        <p>Are you sure you want to submit this booking?</p>
        <p><strong>Data Subject Type:</strong> {{ type }}</p>
        <p><strong>Service:</strong> {{ serviceType }}</p>
        <p><strong>Schedule Date:</strong> {{ formatDate(schedule_date) }}</p>
        <p><strong>Full Name:</strong> {{ first_name }} {{ middle_name }} {{ last_name }}</p>
        <p><strong>Contact Number:</strong> {{ contact_number }}</p>
        <p><strong>Site Location:</strong> {{ location }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
        <p><strong>Note:</strong> {{ note }}</p>
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
import { getAllTypes } from '@/apirequests/data_type';
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
      schedule_date: null,
      showPopup: false,
      types: [],
      type: 'Individual Customers',
      showConfirmationModal: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      first_name: null,
      middle_name: null,
      last_name: null,
      contact_number: null,
      location: null,
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
      if (this.schedule_date) {
        const date = new Date(this.schedule_date)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        return date.toLocaleDateString(undefined, options)
      }
      return null
    }
  },
  created() {
    this.fetchDataTypes()
  },
  mounted() {
    const today = new Date()
    today.setDate(today.getDate())

    this.schedule_date = today.toISOString().substr(0, 10)
  },
  methods: {
    async fetchDataTypes() {
      try {
        this.loading = true
        const response = await getAllTypes()
        this.types = response.data.map((type) => type.title)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      if (date) {
        const formattedDate = new Date(date).toLocaleDateString('en', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        })
        return formattedDate.replace(/\//g, '/')
      }
      return '-'
    },
    validateForm() {
      if (
        !this.first_name ||
        !this.last_name ||
        !this.contact_number ||
        !this.location ||
        !this.email
      ) {
        alert('Please fill in all required fields.')
        return
      }

      this.showConfirmationModal = true
    },
    async submitForm() {
      try {
        const data = {
          type: this.type,
          first_name: this.first_name,
          middle_name: this.middle_name,
          last_name: this.last_name,
          mobile_number: this.contact_number,
          email: this.email,
          location: this.location,
          service: this.serviceType,
          schedule_date: this.schedule_date,
          note: this.note
        }

        const res = await addBooking(data)
        const successMessage =
          'The booking has been successfully booked. You will receive a call within 24 hours.'
        this.showPopupMessage('success', 'Success', successMessage)

        this.showConfirmationModal = false

        this.first_name = null
        this.middle_name = null
        this.last_name = null
        this.contact_number = null
        this.email = null
        this.location = null
        this.note = null
        this.type = 'Individual Customers'
      } catch (error) {
        this.showPopupMessage('error', 'Error', 'Something went wrong')
        console.error(error)
      }
    },
    cancelBooking() {
      this.first_name = null
      this.middle_name = null
      this.last_name = null
      this.contact_number = null
      this.email = null
      this.location = null
      this.note = null
      this.dataSubjectType = 'Private Individual'
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
      }, 6000)
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
