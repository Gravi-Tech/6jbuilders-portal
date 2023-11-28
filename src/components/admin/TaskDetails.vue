<template>
  <div class="task_request">
    <header class="header">
      <h1 class="dashboard-title">Task</h1>
    </header>
    <div class="loading-container" v-if="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="44"
        :width="4"
      ></v-progress-circular>
    </div>
    <v-card v-else flat class="new-task-card">
      <v-card-text class="table-container">
        <div class="sub__headers">
          <div class="items-per-page">
            <label class="items-per-page__label" for="itemsPerPage">Items per page:</label>
            <div class="items-per-page__select">
              <select v-model="itemsPerPage" @change="handleItemsPerPageChange" id="itemsPerPage">
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
            <v-tooltip v-model="showToolTip" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="text" @click="handleDownloadTask">
                  <v-icon color="primary">mdi-tray-arrow-down</v-icon>
                </v-btn>
                <pdf-embed :src="pdfData" v-if="pdfData"></pdf-embed>
              </template>
              <span>Download Data</span>
            </v-tooltip>
          </div>
        </div>
        <table class="table">
          <thead style="font-size: 12px">
            <tr>
              <th v-for="column in tableColumns" :key="column.key">{{ column.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="displayedTask.length === 0">
              <td :colspan="tableColumns.length">No Task available.</td>
            </tr>
            <tr v-for="row in displayedTask" :key="row.id">
              <td
                v-for="column in tableColumns"
                :key="column.key"
                :class="{
                  hoverable: row[column.key] && row[column.key].length > 8,
                  'table-text': true
                }"
                :data-tooltip="row[column.key] && row[column.key].length > 8 ? row[column.key] : ''"
              >
                <template v-if="column.key === '_id'">
                  <a @click="openTaskDetails(row._id)" style="color: blue">{{ row._id }}</a>
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
                    <v-breadcrumbs-item>
                      <h4>Task Details</h4>
                    </v-breadcrumbs-item>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                    <v-breadcrumbs-item>
                      <h4>{{ task._id }}</h4>
                    </v-breadcrumbs-item>
                  </v-breadcrumbs>
                </div>
                <div class="actions">
                  <v-btn
                    v-if="selectedWorkers.length === 0"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="addAssignee = true"
                    >add assignee</v-btn
                  >
                  <v-dialog v-model="addAssignee" max-width="700">
                    <v-card>
                      <v-container>
                        <v-card-text>
                          <v-select
                            prepend-inner-icon="mdi-account-multiple"
                            label="Select Task Assignees"
                            density="comfortable"
                            multiple
                            chips
                            variant="solo"
                            :items="workers"
                            :item-props="itemProps"
                            :loading="loading"
                            v-model="selectedWorkers"
                          ></v-select>
                          <v-alert
                            class="task-notification-header"
                            type="info"
                            color="#2196F3"
                            theme="dark"
                            icon="mdi-information"
                            text="Please note that the assignment of assignees for this task will remain unchanged. Any existing assignees will continue to be associated with the task. No modifications will be made to the current assignee list."
                            variant="tonal"
                            prominent
                          ></v-alert>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="primary" @click="addAssignees">add</v-btn>
                          <v-btn @click="addAssignee = false">cancel</v-btn>
                        </v-card-actions>
                      </v-container>
                    </v-card>
                  </v-dialog>
                  <v-btn
                    class="edit-btn"
                    prepend-icon="mdi-pencil"
                    color="#FFC107"
                    variant="tonal"
                    @click="editTask"
                    >Update task</v-btn
                  >
                  <v-btn
                    v-if="!(this.task.isCancelled || this.task.isCompleted)"
                    prepend-icon="mdi-close-circle"
                    color="#FF0000"
                    variant="tonal"
                    @click="cancelTask"
                  >
                    cancel task
                  </v-btn>
                  <v-dialog v-model="showCancellationForm" max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span class="headline">Cancellation Details</span>
                      </v-card-title>
                      <v-card-text>
                        <span v-if="isReasonEmpty" class="reasonError">Reason is required</span>
                        <v-select
                          v-model="selectedCancellationReason"
                          :items="reasons"
                          :loading="loading"
                          :item-props="itemPropsForReason"
                          density="comfortable"
                          variant="solo"
                          label="Cancellation Reason"
                          @change="handleCancelReasonChange"
                        ></v-select>
                        <div
                          class="other-reason"
                          v-if="
                            selectedCancellationReason &&
                            selectedCancellationReason.reason === 'Other Reason'
                          "
                        >
                          <p style="color: grey; font-size: 14px">Provide a reason:</p>
                          <span v-if="isReasonEmpty" class="reasonError">Reason is required</span>
                          <v-textarea
                            v-model="otherReason"
                            color="blue"
                            variant="solo-filled"
                            auto-grow
                            rows="2"
                            row-height="20"
                          ></v-textarea>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn size="large" color="primary" @click="submitCancellation"
                          >Submit</v-btn
                        >
                        <v-btn size="large" @click="cancelCancellation">Cancel</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn
                    v-if="this.task.status !== 'Completed'"
                    prepend-icon="mdi-check-circle"
                    color="#00C853"
                    variant="outlined"
                    @click="openCompleteTaskDialog()"
                    >complete task</v-btn
                  >
                  <v-tooltip v-model="deleteTip" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        color="red"
                        v-bind="props"
                        @click="handleDeleteTaskConfirmation = true"
                        >mdi-delete</v-icon
                      >
                    </template>
                    <span>Delete Task</span>
                  </v-tooltip>
                  <v-dialog v-model="showCompleteTaskDialog" max-width="400px">
                    <v-card>
                      <v-card-title>Complete Task</v-card-title>
                      <v-card-subtitle>Provide amount to complete a task</v-card-subtitle>
                      <v-card-text>
                        <div class="detail">
                          <p>Total Project Cost:</p>
                          <span
                            v-if="errorAmount"
                            style="font-size: x-small; color: red; font-style: italic"
                            >please enter amount</span
                          >
                          <v-text-field
                            prepend-inner-icon="mdi-currency-php"
                            variant="outlined"
                            density="compact"
                            v-model.number="total_amount"
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                          ></v-text-field>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="primary" @click="completeTask">Submit</v-btn>
                        <v-btn @click="closeCompleteTaskDialog">Cancel</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </div>
              <v-card variant="text">
                <v-card-text>
                  <v-container>
                    <v-row v-if="task.isVisited === false" class="inspect-place mb-4">
                      <div>
                        <v-alert
                          class="task-notification-header"
                          type="info"
                          color="#2196F3"
                          theme="dark"
                          icon="mdi-information"
                          title="Pending Location Inspection"
                          text="The task location has not been inspected by the management. Please inspect the location before starting the service. Clicking 'Inspect Place' will automatically set the starting date and, if the status is 'Pending', update it to 'In Progress'."
                          variant="tonal"
                          prominent
                          border
                        ></v-alert>
                      </div>
                      <div>
                        <v-btn
                          class="task-inspect-btn"
                          prepend-icon="mdi-map-marker"
                          variant="tonal"
                          size="small"
                          @click="updateIsVisited()"
                          >inspect place</v-btn
                        >
                      </div>
                    </v-row>
                    <div class="file-view">
                      <div>
                        <v-btn variant="text" color="primary" @click="previewTask">
                          <v-icon size="x-large" class="mr-2"> mdi-eye </v-icon>
                          Preview Details
                        </v-btn>
                        <v-btn
                          v-if="this.task.isCancelled"
                          variant="text"
                          color="red"
                          @click="handleViewReason(this.task.reasonId)"
                        >
                          <v-icon size="x-large" class="mr-2"> mdi-book-cancel </v-icon>
                          View Reason
                        </v-btn>
                      </div>
                      <v-dialog v-model="previewReason" max-width="400" max-height="100%">
                        <v-card>
                          <v-container>
                            <v-card-title>{{ selectedReason.reason }}</v-card-title>
                            <v-card-subtitle
                              >Date Cancelled:
                              {{ formatDate(this.task.date_cancelled) }}</v-card-subtitle
                            >
                            <v-card-text>
                              <div class="text mb-2">
                                <p><b>Description:</b></p>
                                <span>{{ selectedReason.description }}</span>
                              </div>
                              <div class="text" v-if="this.task.otherReason">
                                <p><b>Reason:</b></p>
                                <span>{{ this.task.otherReason }}</span>
                              </div>
                            </v-card-text>
                          </v-container>
                        </v-card>
                      </v-dialog>
                      <v-chip variant="outlined">
                        <v-icon class="mr-2">{{
                          editingEnabled ? 'mdi-pencil-outline' : 'mdi-eye-outline'
                        }}</v-icon>
                        {{ editingEnabled ? 'Editing Mode' : 'View Mode' }}
                      </v-chip>
                    </div>
                    <v-dialog v-model="previewDetails" max-width="900" max-height="100%">
                      <v-card>
                        <v-container>
                          <v-card-title>Preview</v-card-title>
                          <v-card-title><h2>Task Details</h2></v-card-title>
                          <v-card-subtitle>Task ID: {{ this.task._id }}</v-card-subtitle>
                          <v-card-text class="previewed__value">
                            <h2 v-if="task.isCompleted">
                              Project Cost: <v-icon size="x-small">mdi-currency-php</v-icon
                              ><b>{{ this.task.total_amount }}</b>
                            </h2>
                            <p>
                              Requested Service: <b>{{ this.task.service }}</b>
                            </p>
                            <p>
                              Data Subject Type: <b>{{ this.task.type }}</b>
                            </p>
                            <p>
                              Fullname: <b>{{ this.task.fullName }}</b>
                            </p>
                            <p>
                              Email: <b>{{ this.task.email }}</b>
                            </p>
                            <p>
                              Task Status: <b>{{ this.task.status }}</b>
                            </p>
                            <div v-if="this.task.isCancelled">
                              <p>
                                Date Cancelled: <b>{{ formatDate(this.task.date_cancelled) }}</b>
                              </p>
                            </div>
                            <p>
                              Mobile Number: <b>{{ this.task.mobileNumber }}</b>
                            </p>
                            <p>
                              Location: <b>{{ this.task.location }}</b>
                            </p>
                            <p>
                              Date Requested: <b>{{ formatDate(this.task.date_created) }}</b>
                            </p>
                            <p>
                              Date Schedule: <b>{{ formatDate(this.task.schedule_date) }}</b>
                            </p>
                            <p>
                              Is Visited: <b>{{ this.task.isVisited }}</b>
                            </p>
                            <p>
                              Inspection Date: <b>{{ formatDate(this.task.inspection_date) }}</b>
                            </p>
                            <p>
                              Inspection Time Range: <b>{{ this.task.inspection_time_range }}</b>
                            </p>
                            <p>
                              Date Started: <b>{{ formatDate(this.task.date_started) }}</b>
                            </p>
                            <div v-if="this.task.isCompleted">
                              <p>
                                Date Completed: <b>{{ formatDate(this.task.date_completed) }}</b>
                              </p>
                            </div>
                            <p>
                              Date Updated: <b>{{ formatDate(this.task.date_updated) }}</b>
                            </p>
                            <p>Selected Workers:</p>
                            <div class="ml-4" v-if="selectedWorkers.length > 0">
                              <ul>
                                <li v-for="worker in selectedWorkers" :key="worker._id">
                                  <b>{{ worker.fullName }}</b> - {{ worker.position }}
                                </li>
                              </ul>
                            </div>
                            <p class="mt-2">
                              Note: <b>{{ this.task.note }}</b>
                            </p>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn color="primary" @click="handleClosePreview">Close</v-btn>
                          </v-card-actions>
                        </v-container>
                      </v-card>
                    </v-dialog>
                    <v-row justify="center">
                      <div class="group-details">
                        <div class="workers">
                          <v-select
                            prepend-inner-icon="mdi-account-multiple"
                            label="Task Assignee"
                            density="comfortable"
                            multiple
                            chips
                            variant="solo"
                            :items="workers"
                            :item-props="itemProps"
                            :loading="loading"
                            readonly
                            v-model="selectedWorkers"
                            v-if="selectedWorkers.length !== 0"
                          ></v-select>
                        </div>
                        <div class="d-flex" v-if="!this.task.isVisited">
                          <div class="detail">
                            <v-text-field
                              label="Schedule Inspection Date"
                              append-inner-icon="mdi-calendar"
                              density="comfortable"
                              variant="solo"
                              :readonly="!editingEnabled"
                              v-model="task.inspection_date"
                              @click:append-inner="showDatePicker = editingEnabled"
                              :value="formattedDate"
                            ></v-text-field>
                          </div>

                          <v-dialog v-model="showDatePicker">
                            <v-row justify="end">
                              <v-date-picker
                                v-model="selectedDate"
                                show-adjacent-months
                                @input="updateInspectionDate"
                              ></v-date-picker>
                            </v-row>
                          </v-dialog>
                          <div class="detail">
                            <v-select
                              prepend-inner-icon="mdi-clock-outline"
                              label="Inspection Time Range"
                              density="comfortable"
                              variant="solo"
                              v-model="task.inspection_time_range"
                              :value="task.inspection_time_range"
                              :readonly="!editingEnabled"
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
              <div class="project-summary" v-if="this.task.isCompleted">
                <v-container>
                  <div class="summary">
                    <div class="summary-details">
                      <div class="cost">
                        <p>Project Cost:</p>
                        <v-text-field
                          text
                          density="compact"
                          prepend-inner-icon="mdi-currency-php"
                          :value="task.total_amount"
                          readonly
                        ></v-text-field>
                      </div>
                    </div>
                  </div>
                </v-container>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Task ID:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="task._id"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Fullname:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="task.fullName"
                    :value="task.fullName"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Email:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="task.email"
                    :value="task.email"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Book Status:</p>
                  <v-select
                    variant="outlined"
                    density="compact"
                    v-model="task.status"
                    :items="statusOptions"
                    :value="task.status"
                    :readonly="!editingEnabled"
                    :class="{
                      'status-completed': task.status === 'Completed',
                      'status-onGoing': task.status === 'In Progress',
                      'status-cancelled': task.status === 'Cancelled',
                      'status-pending': task.status === 'Pending'
                    }"
                  >
                  </v-select>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Requested Service:</p>
                  <v-select
                    variant="outlined"
                    density="compact"
                    v-model="task.service"
                    :value="task.service"
                    :items="services"
                    :loading="loading"
                    :readonly="!editingEnabled"
                  ></v-select>
                </div>
                <div class="detail">
                  <p>Site Location:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="task.location"
                    :value="task.location"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Data ubject Type:</p>
                  <v-select
                    variant="outlined"
                    density="compact"
                    :items="dataSubjectType"
                    v-model="task.type"
                    :value="task.type"
                    :readonly="!editingEnabled"
                  ></v-select>
                </div>
                <div class="detail">
                  <p>Mobile Number:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="task.mobileNumber"
                    :value="task.mobileNumber"
                    :readonly="!editingEnabled"
                  ></v-text-field>
                </div>
              </div>
              <div class="group-details">
                <div class="detail">
                  <p>Created On:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(task.date_created)"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Schedule Date On:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(task.schedule_date)"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Started On:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(task.date_started)"
                    readonly
                  ></v-text-field>
                </div>
                <div class="detail">
                  <p>Task Completed:</p>
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :value="formatDate(task.date_completed)"
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
                    v-model="task.note"
                    :value="task.note"
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
        <v-alert
          class="popup-message"
          v-model="handleDeleteTaskConfirmation"
          density="compact"
          type="warning"
          title="Confirm Task Deletion"
          closable
          text="Deleting this task will permanently remove it from the database. This action cannot be undone. Are you sure you want to proceed?"
        >
          <div class="button-container">
            <v-btn class="d-block mt-2" size="small" variant="outlined" @click="handleDeleteTask">
              Delete
            </v-btn>
            <v-btn
              class="d-block ml-6 mt-2"
              size="small"
              variant="outlined"
              @click="handleDeleteTaskConfirmation = false"
            >
              Cancel
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
import { getAllReason, getReasonById } from '../../apirequests/reason'
import { saveAs } from 'file-saver'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import PdfEmbed from 'vue-pdf-embed'

import {
  getAllTask,
  getTaskById,
  updateTaskIsVisited,
  completeTask,
  updateTask,
  cancelTask,
  checkTaskStatus,
  deleteTask
} from '../../apirequests/task'
import { getAllWorkers } from '../../apirequests/workers'
import {
  getAssigneesByTaskId,
  addAssigneeByTaskId,
  deleteTaskAssigneesById
} from '../../apirequests/assignees'
import { dataSubjectTypes } from '@/dataUtils/dataSubjectType'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default {
  components: {
    VDatePicker,
    PdfEmbed
  },
  data() {
    return {
      pdfData: null,
      search: '',
      services: [],
      reasons: [],
      selectedCancellationReason: null,
      showOtherReason: false,
      showCancellationForm: false,
      isReasonEmpty: false,
      cancellationReason: '',
      otherReason: '',
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      taskRequest: [],
      selectedTaskId: null,
      workers: [],
      selectedWorkers: [],
      taskAssignees: [],
      addAssignee: false,
      handleDeleteTaskConfirmation: false,
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
      statusOptions: ['In Progress', 'Pending'],
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
      deleteTip: false,
      previewReason: false,
      selectedReason: {
        reason: '',
        description: ''
      }
    }
  },
  computed: {
    formattedDate() {
      if (this.task.inspection_date) {
        const date = new Date(this.task.inspection_date)
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
        return date.toLocaleDateString('en-US', options)
      }
      return null
    },
    filteredTask() {
      const searchTerm = this.search.toLowerCase().trim()
      const today = new Date()

      const sortedTasks = this.taskRequest.sort((a, b) => {
        const statusOrder = {
          Pending: 1,
          'In Progress': 2,
          Completed: 3,
          Cancelled: 4
        }

        const statusA = a.status
        const statusB = b.status

        if (statusOrder[statusA] < statusOrder[statusB]) return -1
        if (statusOrder[statusA] > statusOrder[statusB]) return 1

        const dateA = new Date(a.schedule_date)
        const dateB = new Date(b.schedule_date)
        const isVisitedA = a.isVisited
        const isVisitedB = b.isVisited

        const timeDiffA = Math.abs(dateA - today)
        const timeDiffB = Math.abs(dateB - today)

        if (dateA < today) return -1
        if (dateB < today) return 1

        if (timeDiffA < timeDiffB && !isVisitedA) return -1
        if (timeDiffA < timeDiffB && !isVisitedB) return 1

        if (timeDiffA === timeDiffB && !isVisitedA) return -1
        if (timeDiffA === timeDiffB && !isVisitedB) return 1

        return 0
      })

      return sortedTasks.filter((task) => {
        return (
          task.fullName.toLowerCase().includes(searchTerm) ||
          task.mobileNumber.toLowerCase().includes(searchTerm) ||
          task.service.toLowerCase().includes(searchTerm) ||
          task.status.toLowerCase().includes(searchTerm) ||
          task.location.toLowerCase().includes(searchTerm) ||
          task._id.toLowerCase().includes(searchTerm) ||
          task.type.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedTask() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredTask.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredTask.length / this.itemsPerPage)
    },
    task: {
      get() {
        let taskId = null
        const urlSearchParams = new URLSearchParams(window.location.search)

        if (urlSearchParams.has('_id')) {
          taskId = urlSearchParams.get('_id')
        } else if (this.selectedTaskId) {
          taskId = this.selectedTaskId
        }

        if (taskId) {
          return this.getTaskById(taskId)
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
    const today = new Date()
    today.setDate(today.getDate())

    this.inspection_date = today.toISOString().substr(0, 10)

    this.checkURLForTaskId()
  },
  created() {
    this.fetchServices()
    this.fetchReasons()
    this.getAllTasks()
    this.updateIsVisited()
    this.getTaskById()
    this.getAllWorkers()
      .then(() => {
        if (this.hasIdParam) {
          const urlSearchParams = new URLSearchParams(window.location.search)
          const id = urlSearchParams.get('_id')
          this.openTaskDetails(id)
        } else {
          this.selectedWorkers = []
        }
      })
      .catch((error) => {
        console.error(error)
      })
  },
  methods: {
    async addAssignees() {
      try {
        const taskId = this.selectedTaskId
        const data = this.selectedWorkers.map((worker) => ({
          worker_id: worker._id
        }))

        const res = await addAssigneeByTaskId(taskId, data)

        this.showPopupMessage(
          'success',
          'Assignees Added',
          'Assignees have been successfully added. All selected workers are now assigned to the task.'
        )

        this.addAssignee = false
      } catch (error) {
        console.log(error)
      }
    },
    async handleDeleteTask() {
      try {
        await deleteTaskAssigneesById(this.selectedTaskId)
        await deleteTask(this.selectedTaskId)
        this.handleDeleteTaskConfirmation = false
        this.updateTaskDetails(null)
        this.getAllTasks()
      } catch (error) {
        console.log(error)
        this.showPopupMessage('error', 'Error', error)
      }
    },
    updateInspectionDate() {
      const selectedDate = new Date(this.selectedDate)
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(selectedDate.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      this.task.inspection_date = formattedDate
      this.showDatePicker = false
    },
    openTaskDetails(_id) {
      this.selectedTaskId = _id
      this.task = this.getTaskById(this.selectedTaskId)
      this.updateTaskDetails(this.selectedTaskId)
      this.fetchAssigneesByTaskId(this.selectedTaskId)
    },
    async openCompleteTaskDialog() {
      if (this.task.status === 'Cancelled') {
        const failedMessage =
          'The task has been cancelled. Update the status to In Progress in order to Complete the task.'
        this.showPopupMessage('error', 'Failed to Complete', failedMessage)
        return
      }

      if (!this.task.isVisited) {
        const failedMessage = `Please visit the location "${this.task.location}" before completing the task.`
        this.showPopupMessage('error', 'Failed to Complete', failedMessage)
        return
      }

      this.showCompleteTaskDialog = true
    },
    closeCompleteTaskDialog() {
      this.showCompleteTaskDialog = false
      this.errorAmount = false
    },
    async completeTask() {
      try {
        if (!this.total_amount || parseFloat(this.total_amount) === 0) {
          this.errorAmount = true
          return
        }

        await completeTask(this.selectedTaskId, this.total_amount)
        this.closeCompleteTaskDialog()
        this.getAllTasks()
        this.showPopupMessage('success', 'Task Completed', 'Task has been successfully completed.')
      } catch (error) {
        console.error(error)
        this.showPopupMessage('error', 'Error', error.message)
      }
    },
    async fetchAssigneesByTaskId(taskId) {
      try {
        this.loading = true
        const response = await getAssigneesByTaskId(taskId)
        const assignees = response.assignees.data[0]?.assignees || []

        const selectedWorkerIds = assignees.map((assignee) => assignee.worker_id)
        this.selectedWorkers = this.workers.filter((worker) =>
          selectedWorkerIds.includes(worker._id)
        )
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async getAllWorkers() {
      try {
        this.loading = true
        const response = await getAllWorkers()
        this.workers = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
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
    async getAllTasks() {
      try {
        this.isLoading = true
        const response = await getAllTask()
        this.taskRequest = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchReasons() {
      try {
        this.loading = true
        const response = await getAllReason()
        this.reasons = response.data.map((reason) => ({
          id: reason._id,
          reason: reason.reason
        }))
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    submitCancellation() {
      if (
        !this.selectedCancellationReason ||
        (this.selectedCancellationReason.reason === 'Other Reason' &&
          this.otherReason.trim() === '')
      ) {
        this.isReasonEmpty = true
        return
      }

      this.isReasonEmpty = false

      let reasonId = null
      let reason = null

      if (this.selectedCancellationReason.reason === 'Other Reason') {
        reasonId = this.selectedCancellationReason.id
        reason = this.otherReason.trim()
      } else {
        reasonId = this.selectedCancellationReason.id
      }

      const updateTaskPromise = this.task.isVisited
        ? Promise.resolve()
        : updateTaskIsVisited(this.selectedTaskId, true)

      updateTaskPromise
        .then(() => cancelTask(this.selectedTaskId, reasonId, reason))
        .then((response) => {
          this.task = response.data
          const successMessage = 'Cancellation request has been successfully submitted. Thank you.'
          this.showPopupMessage('success', 'Cancellation Completed', successMessage)
          this.getAllTasks()
        })
        .catch((error) => {
          console.error(error)
          const errorMessage = this.task.isVisited
            ? 'Failed to submit cancellation request. Please try again.'
            : 'Failed to update task visited status. Please try again.'
          this.showPopupMessage(
            'error',
            this.task.isVisited ? 'Cancellation Failed' : 'Update Failed',
            errorMessage
          )
        })

      this.showCancellationForm = false
      this.cancellationReason = ''
      this.otherReason = ''
    },
    itemPropsForReason(item) {
      return {
        title: item.reason
      }
    },
    cancelCancellation() {
      this.showCancellationForm = false
      this.cancellationReason = ''
      this.otherReason = ''
      this.cancelFormManuallyClosed = true
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
    checkURLForTaskId() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const urlId = urlSearchParams.get('id')

      if (urlId && urlId !== this.selectedTaskId) {
        this.openTaskDetails(urlId)
      }
    },
    closeTaskDetails() {
      this.selectedTaskId = null
      this.updateTaskDetails(null)
      // TODO: check if there are changes before closing
      this.editingEnabled = false

      const panelElement = document.querySelector('.task-details-panel')
      panelElement.classList.add('slide-leave')
      panelElement.classList.add('slide-leave-to')
      panelElement.classList.add('slide-leave-active')
    },
    updateTaskDetails(id) {
      const url = new URL(window.location.href)
      const params = url.searchParams

      this.selectedTaskId = id
      id ? params.set('id', id) : params.delete('id')

      const watchParams = [
        { prop: 'previewDetails', param: 'preview-task-details' },
        { prop: 'addAssignee', param: 'add-assignee' },
        { prop: 'previewReason', param: 'preview-cancelled-reason' },
        { prop: 'showCompleteTaskDialog', param: 'complete-task' },
        { prop: 'editingEnabled', param: 'editing-task' }
      ]

      watchParams.forEach(({ prop, param }) => {
        this.$watch(prop, (newValue) => {
          newValue ? params.set(param, 'true') : params.delete(param)
          history.pushState(null, null, url.toString())
        })
      })

      history.pushState(null, null, url.toString())
    },
    getTaskById(_id) {
      return this.taskRequest.find((task) => task._id === _id)
    },
    handleCancelTask() {
      this.handleNotVisited = false
      if (this.task.status === 'Cancelled') {
        this.showCancellationErrorMessage()
        return
      }

      this.showCancellationForm = true
    },
    cancelTask() {
      if (this.task.status === 'Cancelled') {
        this.showCancellationErrorMessage()
        return
      }

      if (!this.task.isVisited) {
        this.handleNotVisited = true
        return
      }

      this.showCancellationForm = true
    },
    showCancellationErrorMessage() {
      const failedMessage = 'The task has already been cancelled. You cannot cancel it again.'
      this.showPopupMessage('error', 'Failed to Cancel', failedMessage)
    },
    cancelComplete() {
      this.addCompleteForm = false
    },
    editTask() {
      this.editingEnabled = true
    },
    cancelEdit() {
      if (this.editingEnabled) {
        this.getAllTasks()
        this.editingEnabled = false
      }
    },
    async saveEdit() {
      if (
        this.task.fullName.trim() === '' ||
        this.task.email.trim() === '' ||
        this.task.service.trim() === '' ||
        this.task.location.trim() === '' ||
        this.task.type.trim() === '' ||
        this.task.mobileNumber.trim() === ''
      ) {
        const errorMessage = 'Please fill in all the required fields.'
        this.showPopupMessage('error', 'Update Failed', errorMessage)
        return
      }

      try {
        const taskId = this.selectedTaskId
        const updatedData = {
          fullName: this.task.fullName,
          email: this.task.email,
          service: this.task.service,
          location: this.task.location,
          type: this.task.type,
          status: this.task.status,
          mobileNumber: this.task.mobileNumber,
          note: this.task.note
        }

        const statusResponse = await checkTaskStatus(taskId)

        switch (statusResponse.data) {
          case 'Cancelled':
            updatedData.isCancelled = false
            updatedData.reasonId = null
            updatedData.otherReason = null
            updatedData.isVisited = false
            updatedData.date_started = null
            break
          case 'Completed':
            updatedData.isCompleted = false
            updatedData.total_amount = null
            updatedData.date_completed = null
            break
          case 'Pending':
            updatedData.isVisited = true
            updatedData.date_started = new Date()
            break
          case 'In Progress':
            updatedData.isVisited = false
            updatedData.date_started = null
            break
        }

        await updateTask(taskId, updatedData)

        const successMessage =
          'The task has been successfully updated. All changes have been saved and recorded in the system.'
        this.showPopupMessage('success', 'Update Successful', successMessage)

        this.editingEnabled = false
        this.getAllTasks()
      } catch (error) {
        console.error(error)
        const errorMessage = 'Failed to update the task. Please try again.'
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
        case 'In Progress':
          return '#3498db'
        case 'Completed':
          return '#28a745'
        case 'Cancelled':
          return '#f10000'
        case 'Pending':
          return '#ffa500'
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
    resetTask() {
      this.task = null
      this.selectedWorkers = []
      this.task404 = true
    },
    async updateIsVisited() {
      if (!this.selectedTaskId) {
        return
      }

      try {
        const taskStatus = await checkTaskStatus(this.selectedTaskId)
        const status = taskStatus.data
        if (status === 'Pending') {
          await updateTask(this.selectedTaskId, { status: 'In Progress', date_updated: new Date() })
        }

        const task = await getTaskById(this.selectedTaskId)
        const currentDate = new Date()
        const formattedDate = currentDate.toLocaleDateString('en-US')
        const formattedTime = currentDate.toLocaleTimeString('en-US')
        const location = task.data.location

        const visitUpdateMessage = `Location Visit Update: Date: ${formattedDate}, Time: ${formattedTime}, Location: ${location}. Thank you for visiting the location and updating the status. The visit has been recorded successfully.`

        await updateTaskIsVisited(this.selectedTaskId, true)

        this.showPopupMessage('success', 'Visit Update', visitUpdateMessage)
        this.task.isVisited = true

        this.getAllTasks()
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    previewTask() {
      this.previewDetails = true
      this.updateTaskDetails(this.selectedTaskId)
    },
    handleClosePreview() {
      this.previewDetails = false
      this.updateTaskDetails(this.selectedTaskId)
    },
    async handleDownloadTask() {
      try {
        const response = await getAllTask()
        const tasks = response.data
        console.log('Fetched tasks:', tasks)
        this.generatePDF(tasks)
      } catch (error) {
        console.error('Error occurred while fetching tasks:', error)
      }
    },
    generatePDF(tasks) {
      const docDefinition = {
        content: [
          { text: 'Task Data', style: 'header' },
          '\n',
          {
            table: {
              headerRows: 1,
              layout: 'fullwidth',
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Task ID', style: 'tableHeader' },
                  { text: 'Full Name', style: 'tableHeader' },
                  { text: 'Mobile Number', style: 'tableHeader' },
                  { text: 'Service', style: 'tableHeader' },
                  { text: 'Location', style: 'tableHeader' },
                  { text: 'Email', style: 'tableHeader' },
                  { text: 'Status', style: 'tableHeader' }
                ],
                ...tasks.map((task) => [
                  { text: task._id, style: 'tableValue' },
                  { text: task.fullName, style: 'tableValue', width: 'auto' },
                  { text: task.mobileNumber, style: 'tableValue' },
                  { text: task.service, style: 'tableValue' },
                  { text: task.location, style: 'tableValue' },
                  { text: task.email, style: 'tableValue' },
                  { text: task.status, style: 'tableValue' }
                ])
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 5]
          },
          tableHeader: {
            fontSize: 9,
            bold: true,
            alignment: 'left',
            margin: [0, 2, 0, 2]
          },
          tableValue: {
            fontSize: 8,
            alignment: 'left',
            margin: [0, 2, 0, 2]
          }
        }
      }

      const pdfDocGenerator = pdfMake.createPdf(docDefinition)
      pdfDocGenerator.getBuffer((buffer) => {
        const blob = new Blob([buffer], { type: 'application/pdf' })
        saveAs(blob, `tasks-data.pdf`)
      })
    },
    async handleViewReason(reasonId) {
      try {
        const response = await getReasonById(reasonId)
        if (!response.error && response.data) {
          this.selectedReason = response.data
          this.previewReason = true
        } else {
          console.error('Failed to retrieve reason:', response.error)
        }
      } catch (error) {
        console.error('Failed to retrieve reason:', error)
      }
    }
  }
}
</script>

<style scoped>
.dashboard-title {
  font-size: 24px;
  font-weight: 700;
}
.task_request {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.new-task-card {
  flex-grow: 1;
}
.add-assignee {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
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
.status-completed {
  color: #28a745;
}
.status-onGoing {
  color: #3498db;
}
.status-cancelled {
  color: #f10000;
}
.status-pending {
  color: #ffa500;
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
