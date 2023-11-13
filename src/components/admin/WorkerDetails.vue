<template>
  <div class="booking_request">
    <header class="header">
      <h1 class="booking_request-title">Request</h1>
    </header>
    <v-card class="new-booking-card">
      <div class="sub-header">
        <div class="filter-container">
          <v-autocomplete chips v-model="selectedFilter" label="Filter By Position" :items="positionTypes" variant="solo"
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
        <div class="text-center mt-6">
          <v-dialog v-model="showModal" max-width="700">
            <template v-slot:activator="{ on }">
              <div class="add-request">
                <v-btn color="success" prepend-icon="mdi-plus" @click="handleManualWorker" v-bind="on">add worker</v-btn>
              </div>
            </template>
            <v-card>
              <v-card-title>Worker Details</v-card-title>
              <v-card-text>
                <v-select v-model="position" label="Select Position" :items="positionTypes" variant="solo"
                  density="compact">
                </v-select>
                <div class="group-details">

                  <div class="detail">
                    <p>Fullname *:</p>
                    <v-text-field v-model="name" variant="outlined" density="compact"></v-text-field>
                  </div>
                  <div class="detail">
                    <p>Contact Number *:</p>
                    <v-text-field v-model="contact" variant="outlined" density="compact"></v-text-field>
                  </div>
                </div>
                <div class="group-details">
                  <div class="detail">
                    <p>Address *:</p>
                    <v-text-field v-model="address" variant="outlined" density="compact"></v-text-field>
                  </div>
                  <div class="detail">
                    <p>Experience *:</p>
                    <v-text-field v-model="experience" variant="outlined" density="compact"></v-text-field>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions class="actions">
                <v-btn variant="tonal" color="red" @click="handleCancelWorker">Cancel</v-btn>
                <v-btn variant="tonal" color="blue" @click="handleAddWorker">Add</v-btn>
              </v-card-actions>
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
              <td :colspan="tableColumns.length">No Worker available.</td>
            </tr>
            <tr v-for="row in sortedTableData" :key="row.id">
              <td v-for="column in tableColumns" :key="column.key" :class="{
                hoverable: row[column.key] && row[column.key].length > 8,
                'table-text': true
              }" :data-tooltip="row[column.key] && row[column.key].length > 8 ? row[column.key] : ''">
                <template v-if="column.key === 'id'">
                  <a @click="openWorkerDetail(row.id)" style="color: blue">{{
                    shortenId(row.id)
                  }}</a>
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
            :disabled="selectedFilter === 'All'">
            <option v-for="rowFilterOption in rowFilterOptions" :key="rowFilterOption.value"
              :value="rowFilterOption.value">
              {{ rowFilterOption.label }}
            </option>
          </select>
        </div>
      </v-card-text>
    </v-card>
    <transition name="slide">
      <div v-if="selectedWorkerId || hasIdParam" class="worker-details-panel">
        <div class="worker-details-close" @click="closeBookingDetails">
          <v-icon>mdi-close</v-icon>
        </div>

        <div class="worker-details-content">
          <div class="worker-details">
            <div class="details">
              <div class="header-details">
                <div>
                  <v-breadcrumbs>
                    <v-icon size="large" color="blue-lighten-1" icon="mdi-label"></v-icon>
                    <a href="/6jbuilders/admin/workers" style="text-decoration: none; color: black">
                      <v-breadcrumbs-item>
                        <h4>Worker</h4>
                      </v-breadcrumbs-item>
                    </a>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>Details</h4>
                    </v-breadcrumbs-item>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>{{ worker.id }}</h4>
                    </v-breadcrumbs-item>
                  </v-breadcrumbs>
                </div>
                <div class="actions">
                  <v-btn class="edit-btn" prepend-icon="mdi-pencil" color="#FFC107" variant="tonal"
                    @click="editWorker">Edit Details</v-btn>
                  <v-btn prepend-icon="mdi-close-circle" color="#FF0000" variant="tonal" @click="deleteWorker">Delete
                    Worker</v-btn>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Task ID:</p>
                  <v-text-field variant="outlined" density="compact" :value="worker.id" readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Fullname:</p>
                  <v-text-field variant="outlined" density="compact" v-model="worker.name" :value="worker.name"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Position:</p>
                  <v-select :items="positionTypes" variant="outlined" density="compact" v-model="worker.position"
                    :value="worker.position" :readonly="!editingEnabled"></v-select>
                </div>
                <div class="detail">
                  <p>Contact:</p>
                  <v-text-field variant="outlined" density="compact" v-model="worker.contact" :value="worker.contact"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
              </div>

              <div class="group-details">
                <div class="detail">
                  <p>Address:</p>
                  <v-text-field variant="outlined" density="compact" v-model="worker.address" :value="worker.address"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Experience (mos):</p>
                  <v-text-field variant="outlined" density="compact" v-model="worker.experience"
                    :value="worker.experience" :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Created On:</p>
                  <v-text-field variant="outlined" density="compact" v-model="worker.date_created"
                    :value="worker.date_created" :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Updated On:</p>
                  <v-text-field variant="outlined" density="compact" v-model="worker.date_updated"
                    :value="worker.date_updated" :readonly="!editingEnabled"></v-text-field>
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
        </v-alert>
      </div>
    </transition>
  </div>
</template>

<script>
import { workersData } from '../../dataUtils/tableData'
import { dataSubjectTypes } from '../../dataUtils/dataSubjectType'
import { positionTypes } from '../../dataUtils/positionType'

export default {
  data() {
    return {
      dataSubjectTypes: dataSubjectTypes,
      positionTypes: positionTypes,
      editingEnabled: false,
      selectedWorkers: null,
      workerRequest: [],
      originalBooking: {},
      selectedFilter: 'All',
      selectedRowFilter: 'all',
      alertTimeout: null,
      tableColumns: [
        { key: 'id', label: 'ID', maxLength: 8 },
        { key: 'name', label: 'Fullname', maxLength: 11 },
        { key: 'position', label: 'Position', maxLength: 11 },
        { key: 'contact', label: 'Contact', maxLength: 11 },
        { key: 'address', label: 'Address', maxLength: 11 },
        { key: 'experience', label: 'Experience (mos)', maxLength: 11 },
        { key: 'date_created', label: 'Created On', maxLength: null },
        { key: 'date_updated', label: 'Updated On', maxLength: null },
      ],
      selectedWorkerId: null,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
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
    filteredTableData() {
      if (this.selectedFilter === 'All') {
        return this.workerRequest
      }

      const searchText = this.selectedFilter.toLowerCase()

      let filteredData = this.workerRequest.filter((row) => {
        const rowData = row.position.toLowerCase()
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
    worker: {
      get() {
        let workerId = null
        const urlSearchParams = new URLSearchParams(window.location.search)

        if (urlSearchParams.has('id')) {
          workerId = urlSearchParams.get('id')
        } else if (this.selectedWorkerId) {
          workerId = this.selectedWorkerId
        }

        if (workerId) {
          return this.getWorkerById(workerId)
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

    this.checkURLForWorkerId()
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
    checkURLForWorkerId() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const urlId = urlSearchParams.get('id')

      if (urlId && urlId !== this.selectedWorkerId) {
        const panelElement = document.querySelector('.booking-details-panel')
        panelElement.classList.remove('slide-leave')
        panelElement.classList.remove('slide-leave-to')
        panelElement.classList.remove('slide-leave-active')

        this.closeBookingDetails()
        this.openWorkerDetail(urlId)
      }
    },
    openWorkerDetail(id) {
      this.selectedWorkerId = id
      this.worker = this.getWorkerById(this.selectedWorkerId)
      this.updateWorkerDetails(this.selectedWorkerId)
    },

    closeBookingDetails() {
      this.selectedWorkerId = null
      this.updateWorkerDetails(null)

      const panelElement = document.querySelector('.booking-details-panel')
      panelElement.classList.add('slide-leave')
      panelElement.classList.add('slide-leave-to')
      panelElement.classList.add('slide-leave-active')

      // this.refreshPage()
    },

    updateWorkerDetails(id) {
      this.selectedWorkerId = id

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
    getWorkerById(id) {
      return this.workerRequest.find((worker) => worker.id === id)
    },
    applyRowFilter() {
      this.showAlert = true
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.showAlert = false
      }, 3000)
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
    },
    itemProps(item) {
      return {
        title: item.title,
      }
    },
    handleManualWorker() {
      this.showModal = true
    },
    handleManualWorkerClose() {
      this.showModal = false
    },
    handleAddWorker() { },
    handleCancelWorker() {
      this.showModal = false
    },
    editWorker() {
      this.editingEnabled = true
    },
    deleteWorker() { 
      // TODO: ****************
    },
    cancelEdit() {
      this.editingEnabled = false
    },
    saveEdit() {
      this.editingEnabled = false
    }
  },
  destroyed() {
    clearTimeout(this.alertTimeout)
  },
  watch: {
    selectedFilter(newVal) {
      if (newVal === 'All') {
        this.selectedRowFilter = 'all'
      }
    }
  },
  created() {
    this.workerRequest = workersData
    if (this.hasIdParam) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const id = urlSearchParams.get('id')
      this.openWorkerDetail(id)
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

.worker-details-panel {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  width: 95%;
  background-color: white;
  z-index: 999;
  overflow-y: auto;
}

.worker-details-panel::-webkit-scrollbar {
  display: none;
}

.worker-details-content {
  margin: 10px;
}

.worker-details {
  padding: 20px;
}

.detail {
  width: 300px;
  padding: 10px;
}

.detail p {
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

.worker-details-close {
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
