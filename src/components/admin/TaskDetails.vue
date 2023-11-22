<template>
  <div class="task_request">
    <header class="header">
      <h1 class="task_request-title">Task</h1>
    </header>
    <v-card class="new-task-card">
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

      <div class="search-task">
        <div class="task">
          <v-text-field v-model="taskId" density="compact" append-inner-icon="mdi-magnify"
            @click:append-inner="searchTask(taskId)" label="Search task by ID" flat variant="solo-filled" single-line
            hide-details></v-text-field>
          <span v-if="task404" style="font-style: italic; color: red">Task not found.</span>
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
                  <a @click="openTaskDetails(row.id)" style="color: blue">{{
                    row.id
                  }}</a>
                </template>
                <template v-else-if="column.key === 'attachment'">
                  <template v-if="row[column.key]">
                    <a :href="row[column.key]" target="_blank">View Attachment</a>
                  </template>
                  <template v-else> No attachment </template>
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
      <div v-if="selectedTaskId || hasIdParam" class="task-details-panel">
        <div class="task-details-close" @click="closeTaskDetails">
          <v-icon>mdi-close</v-icon>
        </div>

        <div class="task-details-content">
          <div class="task-details">
            <div class="details">
              <div class="header-details">
                <div>
                  <v-breadcrumbs>
                    <v-icon size="large" color="blue-lighten-1" icon="mdi-label"></v-icon>
                    <a href="/6jbuilders/admin/task" style="text-decoration: none; color: black">
                      <v-breadcrumbs-item>
                        <h4>Task Request</h4>
                      </v-breadcrumbs-item>
                    </a>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>Details</h4>
                    </v-breadcrumbs-item>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>{{ task.id }}</h4>
                    </v-breadcrumbs-item>
                  </v-breadcrumbs>
                </div>
                <div class="actions">
                  <v-btn class="edit-btn" prepend-icon="mdi-pencil" color="#FFC107" variant="tonal"
                    @click="editTask">Update task</v-btn>
                  <v-btn v-if="task.status !== 'Completed'" prepend-icon="mdi-close-circle" color="#FF0000"
                    variant="tonal" @click="cancelTask">cancel task</v-btn>
                  <v-dialog v-model="showCancellationForm" max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span class="headline">Cancellation Details</span>
                      </v-card-title>
                      <v-card-text>
                        <span v-if="isReasonEmpty" class="reasonError">Reason is required</span>
                        <v-select v-model="selectedCancellationReason" :items="cancellationReasons"
                          :item-props="itemPropsForReason" density="comfortable" variant="solo"
                          label="Cancellation Reason"></v-select>
                        <div class="other-reason"
                          v-if="selectedCancellationReason && selectedCancellationReason.reason === 'Other Reason'">
                          <p style="color: grey; font-size: 14px">Provide a reason:</p>
                          <span v-if="isReasonEmpty" class="reasonError">Reason is required</span>
                          <v-textarea v-model="otherReason" bg-color="grey-lighten-3" color="blue"
                            variant="outlined"></v-textarea>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn size="large" color="secondary" @click="cancelCancellation">Cancel</v-btn>
                        <v-btn size="large" color="primary" @click="submitCancellation">Submit</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn v-if="task.status !== 'Completed'" prepend-icon="mdi-check-circle" color="#00C853"
                    variant="outlined" @click="completeTask">complete task</v-btn>
                </div>
              </div>
              <v-card variant="text">
                <v-card-text>
                  <v-container>
                    <v-row v-if="task.isVisited === false" class="inspect-place">
                      <div>
                        <v-alert class="task-notification-header" type="info" color="#2196F3" theme="dark"
                          icon="mdi-information" title="Location Not Yet Visited"
                          text="The task location has not been inspected by the management. Please inspect the location before starting the service."
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
                          <v-select prepend-inner-icon="mdi-account-multiple" label="Task Assignee" density="comfortable"
                            multiple chips variant="solo" :items="workers" :item-props="itemProps"
                            :value="getInitialSelectedWorkers(task.id)" v-model="selectedWorkers"
                            :readonly="!editingEnabled"></v-select>
                        </div>
                        <div class="detail" v-if="task.status !== 'Completed'">
                          <v-text-field label="Schedule Inspection Date*" append-inner-icon="mdi-calendar"
                            density="comfortable" variant="solo" v-model="task.inspection_date"
                            @click:append-inner="showDatePicker = editingEnabled" :value="formattedDate"></v-text-field>
                        </div>
                        <div class="detail" v-if="task.status !== 'Completed'">
                          <v-select prepend-inner-icon="mdi-clock-outline" label="Inspection Time Range"
                            density="comfortable" variant="solo" v-model="task.inspection_time_range"
                            :value="task.inspection_time_range" :readonly="!editingEnabled" :items="[
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
                        <v-date-picker v-model="inspection_date" show-adjacent-months></v-date-picker>
                      </v-row>
                    </v-dialog>
                  </v-container>
                </v-card-text>
              </v-card>
              <div class="project-summary" v-if="task.status === 'Completed'">
                <v-container>
                  <div class="summary">
                    <div class="summary-details">
                      <div class="cost">
                        <p>Project Cost:</p>
                        <v-text-field variant="text" density="compact" prepend-inner-icon="mdi-currency-php"
                          :value="task.total_amount" readonly></v-text-field>
                      </div>
                    </div>
                  </div>
                </v-container>
              </div>
              <div class="group-details" v-if="addCompleteForm">
                <v-alert color="white" theme="dark" border="top" border-color="blue">
                  <v-card class="h-100 w-100" variant="text">
                    <v-card-title>Complete Task</v-card-title>
                    <v-card-subtitle>Provide Details to Complete</v-card-subtitle>
                    <v-card-text>
                      <div class="detail">
                        <p>Total Project Cost:</p>
                        <v-text-field prepend-inner-icon="mdi-currency-php" variant="outlined" density="compact"
                          placeholder="0.00"></v-text-field>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-alert>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Task ID:</p>
                  <v-text-field variant="outlined" density="compact" :value="task.id" readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Fullname:</p>
                  <v-text-field variant="outlined" density="compact" v-model="task.fullName" :value="task.fullName"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Email:</p>
                  <v-text-field variant="outlined" density="compact" v-model="task.email" :value="task.email"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Book Status:</p>
                  <v-select variant="outlined" density="compact" v-model="task.status" :items="statusOptions"
                    :value="task.status" :readonly="!editingEnabled" :class="{
                      'status-completed': task.status === 'Completed',
                      'status-onGoing': task.status === 'In Progress',
                      'status-cancelled': task.status === 'Cancelled'
                    }">
                  </v-select>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Requested Service:</p>
                  <v-select variant="outlined" density="compact" v-model="task.service" :value="task.service"
                    :items="serviceTypes" :readonly="!editingEnabled"></v-select>
                </div>
                <div class="detail">
                  <p>Location:</p>
                  <v-text-field variant="outlined" density="compact" v-model="task.location" :value="task.location"
                    :readonly="!editingEnabled"></v-text-field>
                </div>
                <div class="detail">
                  <p>Attachment:</p>
                  <v-text-field variant="outlined" density="compact" v-if="task.attachment">
                    <a :href="task.attachment" target="_blank">View Attachment</a>
                  </v-text-field>
                  <v-text-field variant="outlined" density="compact" readonly v-else>No attachment</v-text-field>
                </div>
                <div class="detail">
                  <p>Mobile Number:</p>
                  <v-text-field variant="outlined" density="compact" v-model="task.mobileNumber"
                    :value="task.mobileNumber" :readonly="!editingEnabled"></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Created On:</p>
                  <v-text-field variant="outlined" density="compact" :value="task.date_created" readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Updated On:</p>
                  <v-text-field variant="outlined" density="compact" :value="task.date_updated" readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Started On:</p>
                  <v-text-field variant="outlined" density="compact" :value="task.date_started" readonly></v-text-field>
                </div>
                <div class="detail">
                  <p>Task Completed:</p>
                  <v-text-field variant="outlined" density="compact" :value="task.date_completed" readonly></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="note">
                  <p>Note:</p>
                  <v-textarea variant="outlined" density="compact" v-model="task.note" :value="task.note"
                    :readonly="!editingEnabled"></v-textarea>
                </div>
              </div>
              <v-card variant="text">
                <v-container>
                  <v-card-text>
                    <div v-if="editingEnabled || addCompleteForm" class="edit-actions">
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
          <template v-if="isTaskRejected() && acceptTaskClicked">
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
import { taskData, workersData, cancellationReasons } from '../../dataUtils/tableData'
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { dataSubjectTypes } from '../../dataUtils/dataSubjectType'
import { serviceTypes } from '../../dataUtils/serviceType'

export default {
  components: {
    VDatePicker
  },
  data() {
    return {
      dataSubjectTypes: dataSubjectTypes,
      serviceTypes: serviceTypes,
      editingEnabled: false,
      showDatePicker: false,
      inspection_date: null,
      workers: workersData,
      selectedWorkers: [],
      taskRequest: [],
      originaltask: {},
      selectedFilter: 'All Service',
      selectedRowFilter: 'all',
      alertTimeout: null,
      tableColumns: [
        { key: 'id', label: 'ID', maxLength: 8 },
        { key: 'fullName', label: 'Full Name', maxLength: 8 },
        { key: 'mobileNumber', label: 'Mobile Number', maxLength: 8 },
        { key: 'service', label: 'Service', maxLength: 8 },
        { key: 'location', label: 'Location', maxLength: 20 },
        { key: 'date_created', label: 'Created On', maxLength: null },
        { key: 'date_completed', label: 'Completed On', maxLength: null },
        { key: 'schedule_date', label: 'Schedule Date', maxLength: null },
        { key: 'total_amount', label: 'Total Amount(PHP)', maxLength: 8 },
        { key: 'status', label: 'Status', maxLength: null }
      ],
      statusOptions: ['In Progress'],
      cancelFormManuallyClosed: false,
      addMaterials: false,
      selectedTaskId: null,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      selectedCancellationReason: null,
      cancellationReasons: cancellationReasons,
      showOtherReason: false,
      showCancellationForm: false,
      isReasonEmpty: false,
      cancellationReason: '',
      otherReason: '',
      originalTask: {},
      taskId: null,
      task404: false,
      addCompleteForm: false,
      // addMaterial: false,
      // materialData: materialData,
    }
  },
  computed: {
    mode() {
      return this.editingEnabled ? 'Editing Mode' : 'View Mode'
    },
    // getMaterialUsedString() {
    //   return this.task.material_used
    //     .map((material, index) => {
    //       const { name, unit } = materialData.find((item) => item.id === material.id)
    //       const materialNumber = index + 1
    //       return `${materialNumber}. ${name} - ${material.qty_used} (${unit})`
    //     })
    //     .join('\n')
    // },
    sortedTableData() {
      return this.filteredTableData.sort((a, b) => {
        return new Date(a.scheduleDate) - new Date(b.scheduleDate)
      })
    },
    formattedDate() {
      if (this.task.inspection_date) {
        const date = new Date(this.task.inspection_date)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        return date.toLocaleDateString('en-US', options)
      }
      return null
    },
    filteredTableData() {
      if (this.selectedFilter === 'All Service') {
        return this.taskRequest
      }

      const searchText = this.selectedFilter.toLowerCase()

      let filteredData = this.taskRequest.filter((row) => {
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
    task: {
      get() {
        let taskId = null
        const urlSearchParams = new URLSearchParams(window.location.search)

        if (urlSearchParams.has('id')) {
          taskId = urlSearchParams.get('id')
        } else if (this.selectedTaskId) {
          taskId = this.selectedTaskId
        }

        if (taskId) {
          return this.getTaskById(taskId)
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

    this.inspection_date = today.toISOString().substr(0, 10)

    this.checkURLForTaskId()
  },
  methods: {
    refreshPage() {
      location.reload()
    },
    shortenText(text, maxLength) {
      if (text && maxLength && text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      } else {
        return text
      }
    },
    shortenId(id) {
      return id.substring(0, 8)
    },
    checkURLForTaskId() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const urlId = urlSearchParams.get('id')

      if (urlId && urlId !== this.selectedTaskId) {
        const panelElement = document.querySelector('.task-details-panel')
        panelElement.classList.remove('slide-leave')
        panelElement.classList.remove('slide-leave-to')
        panelElement.classList.remove('slide-leave-active')

        this.closeTaskDetails()
        this.openTaskDetails(urlId)
      }
    },
    openTaskDetails(id) {
      this.selectedTaskId = id
      this.task = this.getTaskById(this.selectedTaskId)
      this.updateTaskDetails(this.selectedTaskId)
      this.selectedWorkers = this.getInitialSelectedWorkers(this.selectedTaskId)
    },
    closeTaskDetails() {
      this.selectedTaskId = null
      this.updateTaskDetails(null)

      const panelElement = document.querySelector('.task-details-panel')
      panelElement.classList.add('slide-leave')
      panelElement.classList.add('slide-leave-to')
      panelElement.classList.add('slide-leave-active')

      // add for now
      // this.refreshPage()
    },

    updateTaskDetails(id) {
      this.selectedTaskId = id

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
    getTaskById(id) {
      return this.taskRequest.find((task) => task.id === id)
    },
    isTaskRejected() {
      return this.task.status === 'Rejected'
    },
    applyRowFilter() {
      this.showAlert = true
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.showAlert = false
      }, 3000)
    },
    cancelTask() {
      if (this.task.status === 'Cancelled') {
        const failedMessage = 'The task has already been cancelled. You cannot cancel it again.'
        this.showPopupMessage('error', 'Failed to Cancel', failedMessage)
        return
      }

      this.showCancellationForm = true
    },
    submitCancellation() {
      if (this.selectedCancellationReason === null || (this.selectedCancellationReason.reason === 'Other Reason' && this.otherReason === '')) {
        console.log("empty");
        this.isReasonEmpty = true;
        return;
      }

      const successMessage = 'Cancellation request has been successfully submitted. Thank you.';
      this.showPopupMessage('success', 'Cancellation Completed', successMessage);

      this.task.status = 'Cancelled';

      this.showCancellationForm = false;
      this.cancellationReason = '';
      this.otherReason = '';
    },
    cancelCancellation() {
      this.showCancellationForm = false
      this.cancellationReason = ''
      this.otherReason = ''
      this.cancelFormManuallyClosed = true;
      this.task.status = this.originalTask.status;
    },
    completeTask() {
      if (this.task.status === 'Cancelled') {
        const failedMessage = 'The task has been cancelled. Update the status to In Progress in order to Complete the task.'
        this.showPopupMessage('error', 'Failed to Complete', failedMessage)
        return
      }
      this.addCompleteForm = true
    },
    cancelComplete() {
      this.addCompleteForm = false;
    },
    editTask() {
      this.editingEnabled = true
      this.originalTask = { ...this.task }
    },
    cancelEdit() {
      if (this.editingEnabled) {
        Object.assign(this.task, {
          fullName: this.originalTask.fullName,
          email: this.originalTask.email,
          service: this.originalTask.service,
          location: this.originalTask.location,
          mobileNumber: this.originalTask.mobileNumber,
          status: this.originalTask.status
        });

        this.editingEnabled = false;
      } else if (this.addCompleteForm) {
        this.addCompleteForm = false;
      }
    },
    saveEdit() {
      const invalidFields = this.getInvalidFields();
      const isFieldsEdited = this.areFieldsEdited();

      if (invalidFields.length > 0) {
        const errorMessage = `Please fill in the following fields: ${invalidFields.join(', ')}`;
        this.showPopupMessage('error', 'Validation Error', errorMessage);
        return;
      }

      if (isFieldsEdited || this.task.status !== this.originalTask.status) {
        Object.assign(this.originalTask, {
          fullName: this.task.fullName,
          email: this.task.email,
          service: this.task.service,
          location: this.task.location,
          mobileNumber: this.task.mobileNumber,
          status: this.task.status
        });

        const successMessage = 'Changes saved successfully.';
        this.showPopupMessage('success', 'Saved', successMessage);
      } else {
        const noChangesMessage = 'No changes were made.';
        this.showPopupMessage('info', 'Info', noChangesMessage);
      }

      this.editingEnabled = false;
    },
    areFieldsEdited() {
      const editableFields = [
        'fullName',
        'email',
        'service',
        'location',
        'mobileNumber',
        'selected_workers',
        'schedule_date',
        'status'
      ]

      for (const field of editableFields) {
        const fieldValue = this.task[field]
        const originalFieldValue = this.originalTask[field]

        if (fieldValue !== originalFieldValue) {
          return true
        }
      }

      return false
    },
    getInvalidFields() {
      const invalidFields = []
      if (!this.task.fullName) {
        invalidFields.push('Full Name')
      }
      if (!this.task.service) {
        invalidFields.push('Service')
      }
      if (!this.task.location) {
        invalidFields.push('Location')
      }
      if (!this.task.mobileNumber) {
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
        case 'In Progress':
          return '#3498db'
        case 'Completed':
          return '#28a745'
        case 'Cancelled':
          return '#f10000'
        default:
          return 'gray'
      }
    },
    getInitialSelectedWorkers(taskId) {
      const task = taskData.find((task) => task.id === taskId)
      const selectedWorkerIds = task.selected_workers.map((worker) => worker.id)
      const selectedWorkers = this.workers.filter((worker) => selectedWorkerIds.includes(worker.id))

      return selectedWorkers
    },
    itemProps(item) {
      return {
        title: item.name,
        subtitle: item.position
      }
    },
    itemPropsForReason(item) {
      return {
        title: item.reason
      }
    },
    searchTask(id) {
      const task = this.getTaskById(id)
      if (task) {
        this.task = task
        this.updateTaskDetails(id)
        this.selectedWorkers = this.getInitialSelectedWorkers(id)
      } else {
        this.resetTask()
      }
    },
    resetTask() {
      this.task = null
      this.selectedWorkers = []
      this.task404 = true
    },
    updateIsVisited(id) {
      const task = this.getTaskById(id)
      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString('en-US')
      const formattedTime = currentDate.toLocaleTimeString('en-US')
      const location = this.task.location

      const updateIsVisited = `Location Visit Update: Date: ${formattedDate}, Time: ${formattedTime}, Location: ${location}. Thank you for visiting the location and updating the status. The visit has been recorded successfully.`

      this.showPopupMessage('success', 'Visit Update', updateIsVisited)
      this.task.isVisited = true
    }
  },
  destroyed() {
    clearTimeout(this.alertTimeout)
  },
  watch: {
    selectedFilter(newVal) {
      if (newVal === 'All Service') {
        this.selectedRowFilter = 'all';
      }
    }
  },
  created() {
    this.taskRequest = taskData

    if (this.hasIdParam) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const id = urlSearchParams.get('id')
      this.openTaskDetails(id)
      this.selectedWorkers = this.getInitialSelectedWorkers(id)
    } else {
      this.selectedWorkers = []
    }
  }
}
</script>

<style scoped>
.task_request {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  background-color: #007bff;
  padding: 10px;
}

.task_request-title {
  color: #ffffff;
  margin: 0;
}

.new-task-card {
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

.task-details-panel {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  width: 95%;
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
  width: 98%;
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

.status-completed {
  color: #28a745;
}

.status-onGoing {
  color: #3498db;
}

.status-cancelled {
  color: #f10000;
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

.btn-mode {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 30px;
}

.search-task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.search-task .task {
  width: 500px;
}

.search-task .filter-status {
  width: 200px;
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-card {
  width: 600px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
