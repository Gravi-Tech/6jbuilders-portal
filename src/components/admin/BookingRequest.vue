<template>
  <div class="booking_request">
    <header class="header">
      <h1 class="booking_request-title">Request</h1>
    </header>
    <v-card class="new-booking-card">
      <div class="sub-header">
        <div class="filter-container">
          <v-autocomplete chips v-model="selectedFilter" label="Filter By Service" :items="serviceTypes" variant="solo"
            class="filter-select"></v-autocomplete>
        </div>
        <div class="refresh-container">
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon class="refresh-icon" @click="refreshPage" color="blue" v-bind="props">
                mdi-refresh
              </v-icon>
            </template>
            <span>Refresh</span>
          </v-tooltip>
        </div>
      </div>

      <div class="search-request">
        <div class="request">
          <v-text-field v-model="requestId" density="compact" append-inner-icon="mdi-magnify"
            @click:append-inner="searchRequest(requestId)" label="Search request by ID" flat variant="solo-filled" single-line
            hide-details></v-text-field>
          <span v-if="task404" style="font-style: italic; color: red">Task not found.</span>
        </div>
        <div class="text-center mt-6">
          <v-dialog v-model="showModal" max-width="700">
            <template v-slot:activator="{ on }">
              <div class="add-request">
                <v-btn color="success" prepend-icon="mdi-plus" @click="handleManualRequest" v-bind="on">MANUAL
                  BOOKING</v-btn>
              </div>
            </template>
            <v-card>
              <BookingForm />
            </v-card>
          </v-dialog>
        </div>
      </div>

      <v-card-text class="table-container">
        <table class="table">
          <thead style="font-size: 12px">
            <tr>
              <th v-for="column in tableColumns" :key="column.key">{{ column.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTableData.length === 0">
              <td :colspan="tableColumns.length">No Request available.</td>
            </tr>
            <tr v-for="row in sortedTableData" :key="row.id">
              <td v-for="column in tableColumns" :key="column.key" :class="{
                hoverable: row[column.key] && row[column.key].length > 8,
                'table-text': true
              }" :data-tooltip="row[column.key] && row[column.key].length > 8 ? row[column.key] : ''">
                <template v-if="column.key === 'id'">
                  <a @click="openBookingDetails(row.id)" style="color: blue">{{
                    shortenId(row.id)
                  }}</a>
                </template>
                <template v-else-if="column.key === 'status'">
                  <v-chip size="small" :color="getStatusChipColor(row[column.key])" text-color="white">{{ row[column.key]
                  }}</v-chip>
                </template>
                <template v-else>
                  {{ row[column.key] ? shortenText(row[column.key], column.maxLength) : '-' }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="row-filter">
          <label for="row-filter" class="row-filter__label">Row Filter:</label>
          <select id="row-filter" class="row-filter__select" v-model="selectedRowFilter" @change="applyRowFilter"
            :disabled="selectedFilter === 'All Service'">
            <option v-for="rowFilterOption in rowFilterOptions" :key="rowFilterOption.value"
              :value="rowFilterOption.value">
              {{ rowFilterOption.label }}
            </option>
          </select>
        </div>
      </v-card-text>
    </v-card>
    <transition name="slide">
      <div v-if="selectedBookingId || hasIdParam" class="booking-details-panel">
        <div class="booking-details-close" @click="closeBookingDetails">
          <v-icon>mdi-close</v-icon>
        </div>

        <div class="booking-details-content">
          <div class="request-details">
            <div class="details">
              <div class="header-details">
                <div>
                  <v-breadcrumbs>
                    <v-icon size="large" color="blue-lighten-1" icon="mdi-label"></v-icon>
                    <a href="/6jbuilders/admin/request" style="text-decoration: none; color: black">
                      <v-breadcrumbs-item>
                        <h4>Booking Request</h4>
                      </v-breadcrumbs-item>
                    </a>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>Details</h4>
                    </v-breadcrumbs-item>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>{{ booking.id }}</h4>
                    </v-breadcrumbs-item>
                  </v-breadcrumbs>
                </div>
                <div class="actions">
                  <v-btn class="edit-btn" prepend-icon="mdi-pencil" color="#FFC107" variant="tonal"
                    @click="editBooking">Edit Details</v-btn>
                  <v-btn prepend-icon="mdi-close-circle" color="#FF0000" variant="tonal" @click="rejectBooking">Reject
                    Booking</v-btn>
                  <v-btn prepend-icon="mdi-check-circle" color="#00C853" variant="outlined" @click="acceptBooking">Accept
                    Booking</v-btn>
                </div>
              </div>
              <v-card variant="text">
                <v-card-text>
                  <v-container>
                    <v-row v-if="booking.isVisited === false" class="inspect-place">
                      <div>
                        <v-alert class="task-notification-header" type="info" color="#2196F3" theme="dark"
                          icon="mdi-information" title="Location Not Yet Visited"
                          text="The booking location has not been inspected by the management. Please inspect the location before accepting the service."
                          variant="tonal" prominent border></v-alert>
                      </div>
                      <div>
                        <v-btn class="task-inspect-btn" prepend-icon="mdi-map-marker" variant="tonal" size="small"
                          @click="updateIsVisited()">inspect place</v-btn>
                      </div>
                    </v-row>
                    <div class="btn-mode">
                      <v-chip variant="outlined">{{ mode }}</v-chip>
                    </div>
                    <v-row justify="center">
                      <div class="group-details">
                        <div class="workers">
                          <v-select prepend-inner-icon="mdi-account-multiple" label="Assign Constuction Worker*"
                            density="comfortable" multiple chips variant="solo" :items="workers" :item-props="itemProps"
                            :disabled="isBookingRejected()" v-model="selectedWorkers" required></v-select>
                        </div>
                        <div class="detail">
                          <v-text-field label="Schedule Inspection Date*" append-inner-icon="mdi-calendar"
                            density="comfortable" variant="solo" v-model="selectedDate" :readonly="!editingEnabled"
                            @click:append-inner="showDatePicker = true" :disabled="isBookingRejected()"
                            :value="formattedDate"></v-text-field>
                        </div>
                        <div class="detail">
                          <v-select prepend-inner-icon="mdi-clock-outline" label="Select Time Range" density="comfortable"
                            variant="solo" v-model="selectedTimeRange" :disabled="isBookingRejected()"
                            :readonly="!editingEnabled" :items="[
                              '08:00 AM - 10:00 AM',
                              '10:00 AM - 12:00 PM',
                              '12:00 PM - 02:00 PM',
                              '02:00 PM - 04:00 PM',
                              '04:00 PM - 06:00 PM'
                            ]"></v-select>
                        </div>
                      </div>
                    </v-row>
                    <v-dialog v-model="showDatePicker">
                      <v-row justify="end">
                        <v-date-picker v-model="selectedDate" show-adjacent-months></v-date-picker>
                      </v-row>
                    </v-dialog>
                  </v-container>
                </v-card-text>
              </v-card>
              <div class="group-details">
                <div class="detail">
                  <p>Booking ID:</p>
                  <v-text-field variant="outlined" density="compact" :value="booking.id" :disabled="isBookingRejected()"
                    readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Data Subject Type:</p>
                  <v-select variant="outlined" density="compact" v-model="booking.type" :value="booking.type"
                    :items="dataSubjectTypes" :disabled="isBookingRejected()" :readonly="!editingEnabled"></v-select>
                </div>
                <div class="detail">
                  <p>Fullname:</p>
                  <v-text-field variant="outlined" density="compact" v-model="booking.fullName" :value="booking.fullName"
                    :disabled="isBookingRejected()" :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Book Status:</p>
                  <v-select variant="outlined" density="compact" :value="booking.status" :disabled="isBookingRejected()"
                    readonly :class="{
                      'status-pending': booking.status === 'Pending',
                      'status-rejected': booking.status === 'Rejected'
                    }">
                    ></v-select>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Email:</p>
                  <v-text-field variant="outlined" density="compact" v-model="booking.email" :value="booking.email"
                    :disabled="isBookingRejected()" :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Requested Service:</p>
                  <v-select variant="outlined" density="compact" v-model="booking.service" :value="booking.service"
                    :items="serviceTypes" :disabled="isBookingRejected()" :readonly="!editingEnabled"></v-select>
                </div>
                <div class="detail">
                  <p>Location:</p>
                  <v-text-field variant="outlined" density="compact" v-model="booking.location" :value="booking.location"
                    :disabled="isBookingRejected()" :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Mobile Number:</p>
                  <v-text-field variant="outlined" density="compact" v-model="booking.mobileNumber"
                    :value="booking.mobileNumber" :disabled="isBookingRejected()"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Scheduled Date:</p>
                  <v-text-field variant="outlined" density="compact" :value="booking.scheduleDate"
                    :disabled="isBookingRejected()" readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Created On:</p>
                  <v-text-field variant="outlined" density="compact" :value="booking.createdDate"
                    :disabled="isBookingRejected()" readonly></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="note">
                  <p>Note:</p>
                  <v-textarea variant="outlined" density="compact" v-model="booking.note" :value="booking.note"
                    :disabled="isBookingRejected()" :readonly="!editingEnabled"></v-textarea>
                </div>
              </div>
              <v-card variant="text">
                <v-container>
                  <v-card-text>
                    <div v-if="editingEnabled" class="edit-actions">
                      <v-row justify="end">
                        <div class="form-actions-btn">
                          <v-btn density="compact" prepend-icon="mdi-close" variant="tonal" size="large"
                            color="red-lighten-1" @click="cancelEdit">Cancel</v-btn>
                          <v-btn density="compact" prepend-icon="mdi-content-save" variant="tonal" size="large"
                            color="blue-lighten-1" @click="saveEdit">Save</v-btn>
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-container>
              </v-card>
            </div>
          </div>
        </div>

        <v-alert class="popup-message" v-if="showPopup" variant="tonal" :type="popupType" :title="popupTitle"
          :value="true" dismissible @input="hidePopupMessage">
          {{ popupMessage }}
          <template v-if="isBookingRejected() && acceptBookingClicked">
            <div class="actions">
              <v-btn color="red" variant="tonal" @click="cancelAction">No</v-btn>
              <v-btn color="green" variant="outlined" @click="confirmAction">Yes</v-btn>
            </div>
          </template>
        </v-alert>
      </div>
    </transition>
  </div>
</template>

<script>
import { requestData, workersData } from '../../dataUtils/tableData'
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { dataSubjectTypes } from '../../dataUtils/dataSubjectType'
import { serviceTypes } from '../../dataUtils/serviceType'
import BookingForm from '../Book.vue';

export default {
  components: {
    VDatePicker,
    BookingForm
  },
  data() {
    return {
      dataSubjectTypes: dataSubjectTypes,
      serviceTypes: serviceTypes,
      editingEnabled: false,
      showDatePicker: false,
      selectedDate: null,
      selectedTimeRange: '02:00 PM - 04:00 PM',
      workers: workersData,
      selectedWorkers: null,
      bookingRequests: [],
      originalBooking: {},
      selectedFilter: 'All Service',
      selectedRowFilter: 'all',
      alertTimeout: null,
      tableColumns: [
        { key: 'id', label: 'ID', maxLength: 8 },
        { key: 'type', label: 'Data Subject', maxLength: 11 },
        { key: 'fullName', label: 'Full Name', maxLength: 11 },
        { key: 'mobileNumber', label: 'Mobile Number', maxLength: 11 },
        { key: 'email', label: 'Email', maxLength: 11 },
        { key: 'service', label: 'Service', maxLength: 11 },
        { key: 'location', label: 'Location', maxLength: 20 },
        { key: 'createdDate', label: 'Created On', maxLength: null },
        { key: 'scheduleDate', label: 'Schedule Date', maxLength: null },
        { key: 'status', label: 'Status', maxLength: null }
      ],
      selectedBookingId: null,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      isVisited: false,
      showModal: false
    }
  },
  computed: {
    mode() {
      return this.editingEnabled ? 'Editing Mode' : 'View Mode'
    },
    sortedTableData() {
      return this.filteredTableData.sort((a, b) => {
        return new Date(a.scheduleDate) - new Date(b.scheduleDate)
      })
    },
    formattedDate() {
      if (this.selectedDate) {
        const date = new Date(this.selectedDate)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        return date.toLocaleDateString(undefined, options)
      }
      return null
    },
    filteredTableData() {
      if (this.selectedFilter === 'All Service') {
        return this.bookingRequests
      }

      const searchText = this.selectedFilter.toLowerCase()

      let filteredData = this.bookingRequests.filter((row) => {
        const rowData = row.service.toLowerCase()
        return rowData.includes(searchText)
      })

      const selectedRowFilter = this.selectedRowFilter

      if (['5', '10', '20', '50', 'all'].includes(selectedRowFilter)) {
        const numEnd =
          selectedRowFilter === 'all' ? filteredData.length : parseInt(selectedRowFilter)
        filteredData = filteredData.slice(0, Math.min(numEnd, filteredData.length))
      }

      return filteredData
    },
    rowFilterOptions() {
      return [
        { label: 'All Rows', value: 'all' },
        { label: '5', value: '5' },
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' }
      ]
    },
    booking: {
      get() {
        let bookingId = null
        const urlSearchParams = new URLSearchParams(window.location.search)

        if (urlSearchParams.has('id')) {
          bookingId = urlSearchParams.get('id')
        } else if (this.selectedBookingId) {
          bookingId = this.selectedBookingId
        }

        if (bookingId) {
          return this.getBookingById(bookingId)
        } else {
          return null
        }
      },
      set(value) { }
    },
    hasIdParam() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      return urlSearchParams.has('id')
    }
  },
  mounted() {
    const today = new Date()
    today.setDate(today.getDate())

    this.selectedDate = today.toISOString().substr(0, 10)

    this.checkURLForBookingId()
  },
  methods: {
    refreshPage() {
      location.reload()
    },
    shortenText(text, maxLength) {
      if (maxLength && text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      } else {
        return text
      }
    },
    shortenId(id) {
      return id.substring(0, 8)
    },
    checkURLForBookingId() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const urlId = urlSearchParams.get('id')

      if (urlId && urlId !== this.selectedBookingId) {
        const panelElement = document.querySelector('.booking-details-panel')
        panelElement.classList.remove('slide-leave')
        panelElement.classList.remove('slide-leave-to')
        panelElement.classList.remove('slide-leave-active')

        this.closeBookingDetails()
        this.openBookingDetails(urlId)
      }
    },

    openBookingDetails(id) {
      this.selectedBookingId = id
      this.booking = this.getBookingById(this.selectedBookingId)
      this.updateBookingDetails(this.selectedBookingId)
    },

    closeBookingDetails() {
      this.selectedBookingId = null
      this.updateBookingDetails(null)

      const panelElement = document.querySelector('.booking-details-panel')
      panelElement.classList.add('slide-leave')
      panelElement.classList.add('slide-leave-to')
      panelElement.classList.add('slide-leave-active')

      // this.refreshPage()
    },

    updateBookingDetails(id) {
      this.selectedBookingId = id

      const urlSearchParams = new URLSearchParams(window.location.search)
      if (id) {
        urlSearchParams.set('id', id)
      } else {
        urlSearchParams.delete('id')
      }

      const newUrl = `${window.location.origin}${window.location.pathname
        }?${urlSearchParams.toString()}`
      history.pushState(null, null, newUrl)
    },
    getBookingById(id) {
      return this.bookingRequests.find((booking) => booking.id === id)
    },
    isBookingRejected() {
      return this.booking.status === 'Rejected'
    },
    applyRowFilter() {
      this.showAlert = true
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.showAlert = false
      }, 3000)
    },
    rejectBooking() {
      const successMessage =
        'The booking has been successfully rejected. Thank you for notifying us.'

      if (this.booking.status !== 'Accepted' && this.booking.status !== 'Rejected') {
        const confirmMessage = 'Would you like to reject this booking?'
        if (confirm(confirmMessage)) {
          const reason = prompt('Please provide a reason for rejecting the booking:')
          if (reason) {
            this.booking.status = 'Rejected'
            this.booking.rejectionReason = reason
            this.showPopupMessage('success', 'Rejected', successMessage)
            setTimeout(() => {
              this.closeBookingDetails()
            }, 3000)
          } else {
            // TODO: Handle case when reason is not provided
          }
        }
      } else {
        const errorMessage =
          'Sorry, but we are unable to process your request to reject this booking. Please try again later or contact customer support for assistance.'
        this.showPopupMessage('error', 'Error', errorMessage)
      }
    },
    acceptBooking() {
      this.acceptBookingClicked = true
      if (this.booking.status !== 'Rejected' && this.booking.status !== 'Pending') {
        this.showPopupMessage(
          'error',
          'Unable to Accept',
          'This booking has already been accepted. You cannot accept it again.'
        )
        return
      }

      if (this.isBookingRejected()) {
        const confirmMessage =
          'The booking request is currently in a rejected status. Would you like to update the status to pending?'
        this.showConfirmationPopup('Confirmation', confirmMessage, () => {
          const reason = prompt('Please provide a reason for updating the status to pending:')
          if (reason) {
            this.booking.status = 'Pending'
            this.booking.rejectionReason = reason
            const successMessage =
              'The booking has been successfully accepted and the status has been updated to pending.'
            this.showPopupMessage('success', 'Updated', successMessage)
          } else {
            //TODO: Handle case when reason is not provided
          }
        })
      } else {
        // TODO:Perform the accept booking action

        if (!this.booking.isVisited) {
          this.showPopupMessage(
            'error',
            'Unable to Accept',
            'This booking request has not been visited yet. Please visit the location before accepting.'
          )
          return
        }

        if (this.selectedWorkers === null) {
          this.showPopupMessage(
            'error',
            'Unable to Accept',
            'Please select at least one construction worker before accepting the booking.'
          )
          return
        }

        if (this.selectedDate === null) {
          this.showPopupMessage(
            'error',
            'Unable to Accept',
            'Please select a schedule inspection date before accepting the booking.'
          )
          return
        }

        const successMessage = 'The booking has been successfully accepted.'
        this.showPopupMessage('success', 'Accepted', successMessage)
        this.booking.status = 'Accepted'
        this.acceptBookingClicked = false
      }
    },
    editBooking() {
      if (this.isBookingRejected()) {
        this.showPopupMessage(
          'error',
          'Editing Not Allowed',
          'Editing is not allowed for rejected bookings.'
        )
      } else {
        this.editingEnabled = true
        this.originalBooking = { ...this.booking }
      }
    },
    cancelEdit() {
      Object.assign(this.booking, {
        type: this.originalBooking.type,
        fullName: this.originalBooking.fullName,
        email: this.originalBooking.email,
        service: this.originalBooking.service,
        location: this.originalBooking.location,
        mobileNumber: this.originalBooking.mobileNumber,
        zipCode: this.originalBooking.zipCode
      })

      this.editingEnabled = false
    },
    saveEdit() {
      const invalidFields = this.getInvalidFields()
      const isFieldsEdited = this.areFieldsEdited()

      if (invalidFields.length > 0) {
        const errorMessage = `Please fill in the following fields: ${invalidFields.join(', ')}`
        this.showPopupMessage('error', 'Validation Error', errorMessage)
        return
      }

      if (isFieldsEdited) {
        Object.assign(this.originalBooking, {
          type: this.booking.type,
          fullName: this.booking.fullName,
          email: this.booking.email,
          service: this.booking.service,
          location: this.booking.location,
          mobileNumber: this.booking.mobileNumber
        })

        const successMessage = 'Changes saved successfully.'
        this.showPopupMessage('success', 'Saved', successMessage)
      } else {
        const noChangesMessage = 'No changes were made.'
        this.showPopupMessage('info', 'Oops', noChangesMessage)
      }

      this.editingEnabled = false
    },
    areFieldsEdited() {
      const editableFields = ['type', 'fullName', 'email', 'service', 'location', 'mobileNumber']

      for (const field of editableFields) {
        const fieldValue = this.booking[field]
        const originalFieldValue = this.originalBooking[field]

        if (fieldValue !== originalFieldValue) {
          return true
        }
      }

      return false
    },
    getInvalidFields() {
      const invalidFields = []
      if (!this.booking.type) {
        invalidFields.push('Type')
      }
      if (!this.booking.fullName) {
        invalidFields.push('Full Name')
      }
      if (!this.booking.service) {
        invalidFields.push('Service')
      }
      if (!this.booking.location) {
        invalidFields.push('Location')
      }
      if (!this.booking.mobileNumber) {
        invalidFields.push('Mobile Number')
      }

      return invalidFields
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

    showConfirmationPopup(title, message, callback) {
      this.popupType = 'info'
      this.popupTitle = title
      this.popupMessage = message
      this.showPopup = true

      this.confirmationCallback = callback
    },

    confirmAction() {
      if (typeof this.confirmationCallback === 'function') {
        this.confirmationCallback()
      }
      this.hidePopupMessage()
      this.acceptBookingClicked = false
    },

    cancelAction() {
      this.hidePopupMessage()
      this.acceptBookingClicked = false
    },
    hidePopupMessage() {
      this.showPopup = false
      this.popupType = ''
      this.popupTitle = ''
      this.popupMessage = ''
    },
    getStatusChipColor(status) {
      switch (status) {
        case 'Pending':
          return 'orange'
        case 'Approved':
          return 'green'
        case 'Rejected':
          return 'red'
        default:
          return 'gray'
      }
    },
    itemProps(item) {
      return {
        title: item.name,
        subtitle: item.position
      }
    },
    searchRequest(id) {
      const request = this.getBookingById(id)
      if (request) {
        this.request = request
        this.updateBookingDetails(id)
        this.selectedWorkers = this.getInitialSelectedWorkers(id)
      } else {
        this.resetRequest()
      }
    },
    resetRequest() {
      this.request = null
      this.selectedWorkers = []
      this.request404 = true
    },
    updateIsVisited(id) {
      const booking = this.getBookingById(id)
      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString('en-US')
      const formattedTime = currentDate.toLocaleTimeString('en-US')
      const location = this.booking.location

      const updateIsVisited = `Location Visit Update: Date: ${formattedDate}, Time: ${formattedTime}, Location: ${location}. Thank you for visiting the location and updating the status. The visit has been recorded successfully.`

      this.showPopupMessage('success', 'Visit Update', updateIsVisited)
      this.booking.isVisited = true
    },
    handleManualRequest() {
      this.showModal = true
    },
    handleManualRequestClose() {
      this.showModal = false
    }
  },
  destroyed() {
    clearTimeout(this.alertTimeout)
  },
  watch: {
    selectedFilter(newVal) {
      if (newVal === 'All Service') {
        this.selectedRowFilter = 'all'
      }
    }
  },
  created() {
    this.bookingRequests = requestData
    if (this.hasIdParam) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const id = urlSearchParams.get('id')
      this.openBookingDetails(id)
    }
  }
}
</script>

<style scoped>
.booking_request {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  background-color: #007bff;
  padding: 10px;
}

.booking_request-title {
  color: #ffffff;
  margin: 0;
}

.new-booking-card {
  margin-top: 20px;
  flex-grow: 1;
}

.filter-container,
.refresh-container {
  padding: 20px;
}

.filter-select {
  width: 300px;
}

.table-container {
  padding: 10px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  font-weight: bold;
}

.row-filter {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.row-filter__label {
  margin-right: 10px;
}

.row-filter__select {
  width: 200px;
}

.hoverable {
  position: relative;
  cursor: pointer;
}

.hoverable:hover::before {
  content: attr(data-tooltip);
  position: absolute;
  top: -30px;
  left: 0;
  background-color: #4f4f4f;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  white-space: wrap;
}

.alert {
  margin-top: 10px;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.8s ease-in-out;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-enter-to {
  transform: translateX(0);
}

.slide-leave {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(100%);
}

.booking-details-panel {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  width: 95%;
  background-color: white;
  z-index: 999;
  overflow-y: auto;
}

.booking-details-panel::-webkit-scrollbar {
  display: none;
}

.booking-details-content {
  margin: 10px;
}

.reuest-details {
  padding: 20px;
}

.detail {
  width: 300px;
  padding: 10px;
}

.note {
  width: 86%;
}

.detail p,
.note p {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.group-details {
  display: flex;
  justify-content: center;
  align-items: center;
}

.actions {
  text-align: end;
}

.actions .v-btn {
  margin-right: 30px;
  width: 180px;
}

.booking-details-close {
  text-align: end;
  margin: 10px;
}

.status-pending {
  color: orange;
}

.status-rejected {
  color: red;
}

.status-accepted {
  color: green;
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

.refresh-icon {
  cursor: pointer;
  font-size: 34px;
  margin-right: 20px;
}

.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workers {
  width: 600px;
}

.header-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-actions-btn .v-btn {
  margin: 5px;
}

.table-text {
  font-size: 12px;
}

.btn-mode {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 30px;
}

.search-request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.search-request .request {
  width: 500px;
}

.inspect-place {
  display: block;
}

.task-notification-header,
.task-inspect-btn {
  margin-bottom: 15px;
}
</style>
