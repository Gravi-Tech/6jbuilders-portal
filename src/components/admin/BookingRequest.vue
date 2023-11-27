<template>
  <div class="request_request">
    <v-tabs v-model="tab" color="primary">
      <v-tab value="request">
        <v-icon start> mdi-table-eye </v-icon>
        request
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="request">
        <div class="loading-container" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
            :size="44"
            :width="4"
          ></v-progress-circular>
        </div>
        <v-card v-else flat class="new-request-card">
          <v-card-text class="table-container">
            <div class="sub__headers">
              <div class="items-per-page">
                <label class="items-per-page__label" for="itemsPerPage">Items per page:</label>
                <div class="items-per-page__select">
                  <select
                    v-model="itemsPerPage"
                    @change="handleItemsPerPageChange"
                    id="itemsPerPage"
                  >
                    <option v-for="option in options" :key="option" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="search">
                <v-text-field
                  class="mr-4"
                  v-model="search"
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  label="Search to filter table"
                  single-line
                  flat
                  hide-details
                  variant="solo-filled"
                ></v-text-field>
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
            <div class="text-end mb-6 mr-8">
              <v-dialog v-model="manualBooking" max-width="900">
                <template v-slot:activator="{ on }">
                  <div class="add-request">
                    <v-btn
                      color="primary"
                      prepend-icon="mdi-plus"
                      @click="manualBooking = true"
                      v-bind="on"
                      >MANUAL BOOKING</v-btn
                    >
                  </div>
                </template>
                <v-card>
                  <BookingForm />
                </v-card>
              </v-dialog>
            </div>
            <table class="table">
              <thead style="font-size: 12px">
                <tr>
                  <th v-for="column in tableColumns" :key="column.key">{{ column.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="displayedRequest.length === 0">
                  <td :colspan="tableColumns.length">No Booking available.</td>
                </tr>
                <tr v-for="row in displayedRequest" :key="row.id">
                  <td
                    v-for="column in tableColumns"
                    :key="column.key"
                    :class="{
                      hoverable: row[column.key] && row[column.key].length > 8,
                      'table-text': true
                    }"
                    :data-tooltip="
                      row[column.key] && row[column.key].length > 8 ? row[column.key] : ''
                    "
                  >
                    <template v-if="column.key === '_id'">
                      <a @click="openBookingDetails(row._id)" style="color: blue">{{
                        shortenId(row._id)
                      }}</a>
                    </template>
                    <template v-else-if="column.key === 'status'">
                      <v-chip
                        size="small"
                        :color="getStatusChipColor(row[column.key])"
                        text-color="white"
                        >{{ row[column.key] }}</v-chip
                      >
                    </template>
                    <template v-else-if="isDateColumn(column.key)">
                      {{ formatDate(row[column.key]) }}
                    </template>
                    <template v-else>
                      {{ row[column.key] ? shortenText(row[column.key], column.maxLength) : '-' }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange"
              class="mt-4"
            ></v-pagination>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <transition name="slide">
      <div v-if="selectedBookingId || hasIdParam" class="task-details-panel">
        <div class="task-details-close" @click="closeBookingDetails">
          <v-icon>mdi-close</v-icon>
        </div>

        <div class="task-details-content">
          <div class="task-details">
            <div class="details">
              <div class="header-details">
                <div>
                  <v-breadcrumbs>
                    <v-breadcrumbs-item>
                      <h4>Booking Details</h4>
                    </v-breadcrumbs-item>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>{{ booking._id }}</h4>
                    </v-breadcrumbs-item>
                  </v-breadcrumbs>
                </div>
                <div class="actions">
                  <v-btn
                    class="edit-btn"
                    prepend-icon="mdi-pencil"
                    color="#FFC107"
                    variant="tonal"
                    @click="editBooking"
                    >Update booking</v-btn
                  >
                  <v-btn
                    prepend-icon="mdi-close-circle"
                    color="#FF0000"
                    variant="tonal"
                    @click="previewRejectBooking"
                  >
                    reject booking
                  </v-btn>
                  <v-btn
                    prepend-icon="mdi-check-circle"
                    color="#00C853"
                    variant="outlined"
                    @click="handleAcceptBooking()"
                    >accept booking</v-btn
                  >
                </div>
              </div>
              <v-card variant="text">
                <v-card-text>
                  <v-container>
                    <div class="file-view">
                      <div>
                        <v-btn variant="text" color="primary" @click="previewBooking">
                          <v-icon size="x-large" class="mr-2"> mdi-eye </v-icon>
                          Preview Details
                        </v-btn>
                      </div>
                      <v-chip variant="outlined">
                        <v-icon class="mr-2">{{
                          editingEnabled ? 'mdi-pencil-outline' : 'mdi-eye-outline'
                        }}</v-icon>
                        {{ editingEnabled ? 'Editing Mode' : 'View Mode' }}
                      </v-chip>
                    </div>

                    <v-dialog v-model="previewDetails" max-width="800" max-height="100%">
                      <v-card>
                        <v-container>
                          <v-card-title>{{ dialogTitle }}</v-card-title>
                          <v-card-title><h2>Booking Details</h2></v-card-title>
                          <v-card-subtitle>Booking ID: {{ this.booking._id }}</v-card-subtitle>
                          <v-card-text class="previewed__value">
                            <h2 v-if="booking.isCompleted">
                              Project Cost: <v-icon size="x-small">mdi-currency-php</v-icon
                              ><b>{{ this.booking.total_amount }}</b>
                            </h2>
                            <p>
                              Requested Service: <b>{{ this.booking.service }}</b>
                            </p>
                            <p>
                              Data Subject Type: <b>{{ this.booking.type }}</b>
                            </p>
                            <p>
                              Firstname: <b>{{ this.booking.first_name }}</b>
                            </p>
                            <p>
                              Middlename: <b>{{ this.booking.middle_name }}</b>
                            </p>
                            <p>
                              Lastname: <b>{{ this.booking.last_name }}</b>
                            </p>
                            <p>
                              Email: <b>{{ this.booking.email }}</b>
                            </p>
                            <p>
                              Booking Status: <b>{{ this.booking.status }}</b>
                            </p>
                            <p>
                              Mobile Number: <b>{{ this.booking.mobile_number }}</b>
                            </p>
                            <p>
                              Location: <b>{{ this.booking.location }}</b>
                            </p>
                            <p>
                              Scheduled Inspection Date:
                              <b>{{ formatDate(this.inspection_date) }}</b>
                            </p>
                            <p>
                              Time Range: <b>{{ this.selectedTimeRange }}</b>
                            </p>
                            <p>
                              Date Requested: <b>{{ formatDate(this.booking.date_created) }}</b>
                            </p>
                            <p>
                              Date Schedule: <b>{{ formatDate(this.booking.schedule_date) }}</b>
                            </p>
                            <div v-if="this.booking.isRejected">
                              <p>
                                Date Rejected: <b>{{ formatDate(this.booking.date_rejected) }}</b>
                              </p>
                            </div>
                            <p>
                              Date Updated: <b>{{ formatDate(this.booking.date_updated) }}</b>
                            </p>
                            <p class="mt-4">
                              Note: <b>{{ this.booking.note }}</b>
                            </p>
                            <v-alert
                              v-if="showAcceptButton"
                              class="mt-4"
                              type="info"
                              color="#2196F3"
                              theme="dark"
                              icon="mdi-information"
                              text="Please be advised that this booking will be automatically transferred to the task section for further processing. This process is an integral part of our streamlined workflow, designed to ensure efficient handling of all bookings. As a result, the booking will be removed from the booking section."
                              variant="tonal"
                              prominent
                            ></v-alert>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn v-if="showRejectButton" color="red" @click="handleRejectBooking"
                              >Reject Booking</v-btn
                            >
                            <v-btn v-if="showAcceptButton" color="green" @click="acceptBooking"
                              >Accept Booking</v-btn
                            >
                            <v-btn
                              v-if="showRejectButton || showAcceptButton || closePreviewBtn"
                              color="primary"
                              @click="handleClosePreview"
                              >Close</v-btn
                            >
                          </v-card-actions>
                        </v-container>
                      </v-card>
                    </v-dialog>
                    <v-alert
                      class="mb-6"
                      v-if="this.booking.isRejected"
                      type="info"
                      color="#2196F3"
                      theme="dark"
                      icon="mdi-information"
                      title="Read-Only Fields"
                      text="Inspection date, and inspection time cannot be modified as the booking has been rejected. To make changes, update the status to 'Pending'."
                      variant="tonal"
                      prominent
                      border="top"
                    ></v-alert>
                    <v-row justify="end">
                      <div class="group-details">
                        <div class="d-flex">
                          <div class="detail">
                            <v-text-field
                              v-model="inspection_date"
                              label="Set Inspection Date *"
                              append-inner-icon="mdi-calendar"
                              density="comfortable"
                              variant="solo"
                              @click:append-inner="showDatePicker = !this.booking.isRejected"
                              :readonly="this.booking.isRejected"
                              :value="formattedDate"
                            ></v-text-field>
                            <v-dialog v-model="showDatePicker">
                              <v-row justify="end">
                                <v-date-picker
                                  v-model="inspection_date"
                                  show-adjacent-months
                                ></v-date-picker>
                              </v-row>
                            </v-dialog>
                          </div>
                          <div class="detail">
                            <v-select
                              prepend-inner-icon="mdi-clock-outline"
                              label="Set Inspection Time *"
                              density="comfortable"
                              variant="solo"
                              v-model="selectedTimeRange"
                              :readonly="this.booking.isRejected"
                              :items="[
                                '08:00 AM - 10:00 AM',
                                '10:00 AM - 12:00 PM',
                                '12:00 PM - 2:00 PM',
                                '2:00 PM - 4:00 PM',
                                '4:00 PM - 6:00 PM'
                              ]"
                            ></v-select>
                          </div>
                        </div>
                      </div>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
              <div class="group-details">
                <div class="detail">
                  <p>Booking ID:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="this.booking._id"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Firstname:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="booking.first_name"
                    v-model="booking.first_name"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Middlename:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="booking.middle_name"
                    v-model="booking.middle_name"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Lastname:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="booking.last_name"
                    v-model="booking.last_name"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Data ubject Type:</p>
                  <v-select
                    variant="outlined"
                    density="compact"
                    v-model="booking.type"
                    :value="booking.type"
                    :items="dataSubjectType"
                    :readonly="!editingEnabled"
                  ></v-select>
                </div>
                <div class="detail">
                  <p>Email:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="booking.email"
                    :value="booking.email"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Requested Service:</p>
                  <v-select
                    variant="outlined"
                    density="compact"
                    :items="services"
                    v-model="booking.service"
                    :value="booking.service"
                    :loading="loading"
                    :readonly="!editingEnabled"
                  ></v-select>
                </div>
                <div class="detail">
                  <p>Book Status:</p>
                  <v-select
                    variant="outlined"
                    density="compact"
                    :items="statusOptions"
                    :readonly="!editingEnabled"
                    v-model="booking.status"
                    :value="booking.status"
                    :class="{
                      'status-pending': booking.status === 'Pending',
                      'status-rejected': booking.status === 'Rejected'
                    }"
                  >
                  </v-select>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Created On:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(booking.date_created)"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Schedule Date:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(booking.schedule_date)"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Site Location:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="booking.location"
                    :value="booking.location"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Mobile Number:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="booking.mobile_number"
                    :value="booking.mobile_number"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div v-if="this.booking.isRejected" class="detail">
                  <p>Date Rejected:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(booking.date_rejected)"
                    readonly
                  ></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="note">
                  <p>Note:</p>
                  <v-textarea
                    variant="outlined"
                    density="compact"
                    v-model="booking.note"
                    :value="booking.note"
                    :readonly="!editingEnabled"
                  ></v-textarea>
                </div>
              </div>
              <v-card variant="text">
                <v-container>
                  <v-card-text>
                    <div v-if="editingEnabled" class="edit-actions">
                      <v-row justify="end">
                        <div class="form-actions-btn">
                          <v-btn
                            density="compact"
                            prepend-icon="mdi-close"
                            variant="tonal"
                            size="large"
                            color="red-lighten-1"
                            @click="cancelEdit"
                            >Cancel</v-btn
                          >
                          <v-btn
                            density="compact"
                            prepend-icon="mdi-content-save"
                            variant="tonal"
                            size="large"
                            color="blue-lighten-1"
                            @click="saveEdit"
                            >Save</v-btn
                          >
                        </div>
                      </v-row>
                    </div>
                  </v-card-text>
                </v-container>
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
        <v-alert
          class="popup-message"
          v-model="handleNotVisited"
          density="compact"
          type="warning"
          title="Task Not Visited"
          closable
          text="The task has not been visited yet. Are you sure you want to cancel it? If you continue, the task will be marked as visited."
        >
          <div class="button-container">
            <v-btn class="d-block mt-2" size="small" variant="outlined" @click="handleCancelTask">
              Continue
            </v-btn>
          </div>
        </v-alert>
      </div>
    </transition>
  </div>
</template>

<script>
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { getAllServices } from '../../apirequests/service'
import BookingForm from '../Book.vue'

import {
  getAllBooking,
  rejectBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  checkBookingStatus
} from '../../apirequests/bookings'
import { addTask } from '../../apirequests/task'
import { dataSubjectTypes } from '@/dataUtils/dataSubjectType'

export default {
  components: {
    VDatePicker,
    BookingForm
  },
  data() {
    return {
      tab: 'request',
      search: '',
      services: [],
      reasons: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      bookingRequest: [],
      selectedBookingId: null,
      showCompleteTaskDialog: false,
      loading: false,
      isLoading: true,
      total_amount: '',
      editingEnabled: false,
      showDatePicker: false,
      inspection_date: null,
      taskId: null,
      alertTimeout: null,
      dataSubjectType: dataSubjectTypes,
      tableColumns: [
        { key: '_id', label: 'ID', maxLength: 8 },
        { key: 'type', label: 'Subject Type', maxLength: 8 },
        { key: 'first_name', label: 'Firstname', maxLength: 8 },
        { key: 'middle_name', label: 'Midlename', maxLength: 8 },
        { key: 'last_name', label: 'Lastename', maxLength: 8 },
        { key: 'mobile_number', label: 'Mobile Number', maxLength: 8 },
        { key: 'service', label: 'Service', maxLength: 8 },
        { key: 'location', label: 'Location', maxLength: 20 },
        { key: 'date_created', label: 'Created On', maxLength: null },
        { key: 'schedule_date', label: 'Schedule Date', maxLength: null },
        { key: 'status', label: 'Status', maxLength: null }
      ],
      statusOptions: ['Pending'],
      selectedTimeRange: null,
      cancelFormManuallyClosed: false,
      addMaterials: false,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      task404: false,
      addCompleteForm: false,
      errorAmount: false,
      previewDetails: false,
      handleNotVisited: false,
      showToolTip: false,
      previewReason: false,
      selectedReason: {
        reason: '',
        description: ''
      },
      manualBooking: false
    }
  },
  computed: {
    formattedDate() {
      if (this.inspection_date) {
        const date = new Date(this.inspection_date)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        return date.toLocaleDateString('en-US', options)
      }
      return null
    },
    filteredRequest() {
      const searchTerm = this.search.toLowerCase().trim()
      const today = new Date()

      const sortedBooking = this.bookingRequest.sort((a, b) => {
        const dateA = new Date(a.schedule_date)
        const dateB = new Date(b.schedule_date)

        const isPendingA = a.status.toLowerCase() === 'pending'
        const isPendingB = b.status.toLowerCase() === 'pending'

        if (isPendingA && !isPendingB) return -1
        if (!isPendingA && isPendingB) return 1

        if (isPendingA && isPendingB) {
          const timeDiffA = Math.abs(dateA - today)
          const timeDiffB = Math.abs(dateB - today)

          if (timeDiffA < timeDiffB) return -1
          if (timeDiffA > timeDiffB) return 1

          const durationA = dateA.getTime() - today.getTime()
          const durationB = dateB.getTime() - today.getTime()

          if (durationA > durationB) return -1
          if (durationA < durationB) return 1
        }

        const statusOrder = { Pending: 1, Rejected: 2 }
        const statusA = a.status
        const statusB = b.status

        if (statusOrder[statusA] < statusOrder[statusB]) return -1
        if (statusOrder[statusA] > statusOrder[statusB]) return 1

        return 0
      })

      return sortedBooking.filter((booking) => {
        return (
          booking.first_name.toLowerCase().includes(searchTerm) ||
          booking.mobile_number.toLowerCase().includes(searchTerm) ||
          booking.service.toLowerCase().includes(searchTerm) ||
          booking.status.toLowerCase().includes(searchTerm) ||
          booking.location.toLowerCase().includes(searchTerm) ||
          booking._id.toLowerCase().includes(searchTerm) ||
          booking.type.toLowerCase().includes(searchTerm) ||
          booking.last_name.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedRequest() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredRequest.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredRequest.length / this.itemsPerPage)
    },
    booking: {
      get() {
        let bookingId = null
        const urlSearchParams = new URLSearchParams(window.location.search)

        if (urlSearchParams.has('_id')) {
          bookingId = urlSearchParams.get('_id')
        } else if (this.selectedBookingId) {
          bookingId = this.selectedBookingId
        }

        if (bookingId) {
          return this.getBookingById(bookingId)
        } else {
          return null
        }
      },
      set(value) {}
    },
    hasIdParam() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      return urlSearchParams.has('_id')
    }
  },
  mounted() {
    this.checkURLForBookingId()
  },
  created() {
    this.fetchServices()
    this.getAllBookings()
    this.getBookingById()
    if (this.hasIdParam) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const id = urlSearchParams.get('_id')
      this.openBookingDetails(id)
    } else {
      this.selectedWorkers = []
    }
  },
  methods: {
    refreshPage() {
      this.getAllBookings
    },
    async fetchServices() {
      try {
        this.loading = true
        const response = await getAllServices()
        this.services = response.data.map((service) => service.title)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async getAllBookings() {
      try {
        this.isLoading = true
        const response = await getAllBooking()
        this.bookingRequest = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async handleRejectBooking() {
      try {
        const bookingId = this.selectedBookingId
        await rejectBooking(bookingId)
        this.previewDetails = false
        const successMessage = 'Booking rejected successfully'
        this.showPopupMessage('success', 'Success', successMessage)
        this.getAllBookings()
      } catch (error) {
        this.showPopupMessage('error', 'Update Failed', 'An error occurred')
      }
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleItemsPerPageChange() {
      this.currentPage = 1
    },
    shortenText(text, maxLength) {
      if (text && maxLength && text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      } else {
        return text
      }
    },
    shortenId(_id) {
      return _id.substring(0, 8)
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
    isDateColumn(key) {
      return ['date_created', 'schedule_date', 'date_completed'].includes(key)
    },
    openBookingDetails(_id) {
      if (this.selectedBookingId === _id) {
        return
      }

      this.selectedBookingId = _id
      this.task = this.getBookingById(this.selectedBookingId)
      this.updateBookingDetails(this.selectedBookingId)
    },
    checkURLForBookingId() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const urlId = urlSearchParams.get('id')

      if (urlId && urlId !== this.selectedBookingId) {
        this.openBookingDetails(urlId)
      }
    },
    closeBookingDetails() {
      this.selectedBookingId = null
      this.updateBookingDetails(null)

      this.editingEnabled = false

      const panelElement = document.querySelector('.task-details-panel')
      panelElement.classList.add('slide-leave')
      panelElement.classList.add('slide-leave-to')
      panelElement.classList.add('slide-leave-active')
    },
    updateBookingDetails(id) {
      const url = new URL(window.location.href)
      const params = url.searchParams

      this.selectedBookingId = id
      id ? params.set('id', id) : params.delete('id')

      const watchParams = [
        { prop: 'previewDetails', param: 'preview-request-details' },
        { prop: 'previewReason', param: 'preview-cancelled-reason' },
        { prop: 'editingEnabled', param: 'editing-request' }
      ]

      watchParams.forEach(({ prop, param }) => {
        this.$watch(prop, (newValue) => {
          newValue ? params.set(param, 'true') : params.delete(param)
          history.pushState(null, null, url.toString())
        })
      })

      history.pushState(null, null, url.toString())
    },
    getBookingById(_id) {
      return this.bookingRequest.find((booking) => booking._id === _id)
    },
    editBooking() {
      this.editingEnabled = true
    },
    cancelEdit() {
      if (this.editingEnabled) {
        this.getAllBookings()
        this.editingEnabled = false
      }
    },
    async saveEdit() {
      if (
        this.booking.first_name.trim() === '' ||
        this.booking.last_name.trim() === '' ||
        this.booking.email.trim() === '' ||
        this.booking.service.trim() === '' ||
        this.booking.location.trim() === '' ||
        this.booking.type.trim() === '' ||
        this.booking.mobile_number.trim() === ''
      ) {
        const errorMessage = 'Please fill in all the required fields.'
        this.showPopupMessage('error', 'Update Failed', errorMessage)
        return
      }

      try {
        const bookingId = this.selectedBookingId
        const updatedData = {
          first_name: this.booking.first_name,
          middle_name: this.booking.middle_name,
          last_name: this.booking.last_name,
          email: this.booking.email,
          service: this.booking.service,
          location: this.booking.location,
          type: this.booking.type,
          status: this.booking.status,
          mobile_number: this.booking.mobile_number,
          note: this.booking.note,
          date_updated: new Date()
        }

        const statusResponse = await checkBookingStatus(bookingId)

        switch (statusResponse.data) {
          case 'Rejected':
            updatedData.isRejected = false
            updatedData.date_rejected = null
            break
        }

        await updateBooking(bookingId, updatedData)

        const successMessage = 'Booking updated successfully.'
        this.showPopupMessage('success', 'Update Successful', successMessage)

        this.editingEnabled = false
        this.getAllBookings()
      } catch (error) {
        console.error(error)
        const errorMessage = 'Failed to update the booking. Please try again.'
        this.showPopupMessage('error', 'Update Failed', errorMessage)
      }
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
      this.acceptTaskClicked = false
    },
    cancelAction() {
      this.hidePopupMessage()
      this.acceptTaskClicked = false
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
        case 'Rejected':
          return 'red'
        default:
          return 'gray'
      }
    },
    itemProps(item) {
      return {
        title: item.fullName,
        subtitle: item.position
      }
    },
    previewBooking() {
      this.setPreviewDialog('Preview', false, false, true)
      this.updateBookingDetails(this.selectedBookingId)
    },
    async previewRejectBooking() {
      try {
        const res = await checkBookingStatus(this.selectedBookingId)
        const status = res.data
        if (status === 'Rejected') {
          this.showPopupMessage(
            'error',
            'Booking Rejected',
            'We apologize for the inconvenience, but this booking has already been rejected. Please review the details and consider alternative options if needed.'
          )
          return
        }

        this.setPreviewDialog('Preview to Reject', true, false, true)
        this.updateBookingDetails(this.selectedBookingId)
      } catch (error) {}
    },
    async handleAcceptBooking() {
      try {
        const res = await checkBookingStatus(this.selectedBookingId)
        const status = res.data
        if (status === 'Rejected') {
          this.showPopupMessage(
            'error',
            'Booking Rejected',
            'The booking has been rejected. Please update the status to "Pending" before accepting the request.'
          )
          return
        }

        if (this.inspection_date && this.selectedTimeRange) {
          this.setPreviewDialog('Review Before Accepting', false, true, true)
        } else {
          this.showPopupMessage(
            'error',
            'Missing Information',
            'Please select an inspection date and time range.'
          )
          this.previewDetails = false
        }
      } catch (error) {
        this.showPopupMessage(
          'error',
          'Something went wrong',
          'An error occurred while processing the request. Please try again later.'
        )
      }
    },
    async acceptBooking() {
      try {
        const fullNameParts = [
          this.booking.first_name,
          this.booking.middle_name,
          this.booking.last_name
        ]
        const fullName = fullNameParts.filter((name) => name && name.trim().length > 0).join(' ')

        const toTaskCollection = {
          type: this.booking.type,
          fullName: fullName,
          email: this.booking.email,
          service: this.booking.service,
          location: this.booking.location,
          mobileNumber: this.booking.mobile_number,
          note: this.booking.note,
          schedule_date: this.booking.schedule_date,
          inspection_time_range: this.selectedTimeRange,
          inspection_date: this.inspection_date
        }

        await addTask(toTaskCollection)
        this.previewDetails = false
        const bookingId = this.selectedBookingId
        await deleteBooking(bookingId)

        this.showPopupMessage(
          'success',
          'Booking Accepted',
          'The booking has been successfully added to tasks and removed from the bookings list.'
        )

        setTimeout(() => {
          this.closeBookingDetails()
        }, 3000)
      } catch (error) {
        console.error(error)
        this.showPopupMessage(
          'error',
          'Error',
          'An error occurred while processing the booking. Please try again later.'
        )
      }
    },
    handleClosePreview() {
      this.setPreviewDialog('Booking Details', false, false)
      this.updateBookingDetails(this.selectedBookingId)
      this.previewDetails = false
    },
    setPreviewDialog(title, showRejectButton, showAcceptButton, closePreviewBtn) {
      this.dialogTitle = title
      this.showRejectButton = showRejectButton
      this.showAcceptButton = showAcceptButton
      this.closePreviewBtn = closePreviewBtn
      this.previewDetails = true
    }
  }
}
</script>

<style scoped>
.request_request {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  background-color: #007bff;
  padding: 10px;
}

.request_request-title {
  color: #ffffff;
  margin: 0;
}

.new-request-card {
  margin-top: 20px;
  flex-grow: 1;
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

.task-details-panel {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  width: 97%;
  background-color: white;
  z-index: 999;
  overflow-y: auto;
}

.task-details-panel::-webkit-scrollbar {
  display: none;
}

.task-details-content {
  margin: 10px;
}

.task-details {
  padding: 20px;
}

.detail {
  width: 300px;
  padding: 10px;
}

.reasonError {
  font-size: 10px;
  color: red;
}

.note {
  max-width: 100%;
  width: 1185px;
}

.detail p,
.note p,
.cost p,
.material-list p {
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

.task-details-close {
  text-align: end;
  margin: 10px;
}

.status-pending {
  color: orange;
}

.status-rejected {
  color: red;
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

.inspect-place {
  display: block;
}

.task-notification-header,
.task-inspect-btn {
  margin-bottom: 15px;
}

.table-text {
  font-size: 12px;
}

.file-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.sub__headers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
}

.search {
  display: flex;
  align-items: center;
  max-width: 400px;
  width: 100%;
}
.items-per-page {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.items-per-page__label {
  font-size: 10px;
  margin-right: 0.5rem;
  font-weight: 500;
}

.items-per-page__select select {
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.table tr:hover {
  background-color: #f5f5ff;
}
.summary {
  display: flex;
  justify-content: start;
  align-items: center;
}

.summary .summary-details {
  max-width: 400px;
  width: 300px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.previewed__value p {
  margin-top: 5px;
}
</style>
