<template>
  <div class="project_request">
    <header class="header">
      <h1 class="project_request-title">Project</h1>
    </header>
    <v-card class="new-project-card">
      <div class="sub-header">
        <div class="filter-container">
          <v-select chips v-model="selectedFilter" label="Filter By Service" :items="serviceTypes" variant="solo"
            class="filter-select"></v-select>
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
                  <a @click="openProjectDetails(row.id)" style="color: blue">{{
                    shortenId(row.id)
                  }}</a>
                </template>
                <template v-else-if="column.key === 'task_id'">
                  <a :href="getDetailsPageUrl(row.task_id)" style="color: blue">{{
                    shortenId(row.task_id)
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
            :disabled="selectedFilter === 'All Service'">
            <option v-for="rowFilterOption in rowFilterOptions" :key="rowFilterOption.value"
              :value="rowFilterOption.value">
              {{ rowFilterOption.label }}
            </option>
          </select>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { taskData } from '../../utils/tableData'
import { projects } from '../../utils/projectData'
import { serviceTypes } from '../../utils/serviceType'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

export default {
  components: {
    VDatePicker
  },
  data() {
    return {
      task: taskData,
      editingEnabled: false,
      showDatePicker: false,
      projectRequest: [],
      originaltask: {},
      serviceTypes: serviceTypes,
      selectedFilter: 'All Service',
      selectedRowFilter: 'all',
      alertTimeout: null,
      tableColumns: [
        { key: 'id', label: 'ID', maxLength: 8 },
        { key: 'task_id', label: 'Task ID', maxLength: 8 },
        { key: 'title', label: 'Title', maxLength: 8 },
        { key: 'service', label: 'Service', maxLength: 8 },
        { key: 'location', label: 'Property Address', maxLength: 20 },
        { key: 'date', label: 'Date Finish', maxLength: null },
      ],
      selectedProjectId: null,
      projectId: null,
    }
  },
  computed: {
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
        return this.projectRequest
      }

      const searchText = this.selectedFilter.toLowerCase()

      let filteredData = this.projectRequest.filter((row) => {
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
    project: {
      get() {
        let projectId = null
        const urlSearchParams = new URLSearchParams(window.location.search)

        if (urlSearchParams.has('id')) {
          projectId = urlSearchParams.get('id')
        } else if (this.selectedProjectId) {
          projectId = this.selectedProjectId
        }

        if (projectId) {
          return this.getProjectId(projectId)
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

    this.checkURLForProjectId()
  },
  methods: {
    refreshPage() {
      location.reload()
    },
    getDetailsPageUrl(task_id) {
      return '/6jbuilders/admin/task?id=' + task_id
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
    checkURLForProjectId() {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const urlId = urlSearchParams.get('id')

      if (urlId && urlId !== this.selectedProjectId) {
        const panelElement = document.querySelector('.project-detail-panel')
        panelElement.classList.remove('slide-leave')
        panelElement.classList.remove('slide-leave-to')
        panelElement.classList.remove('slide-leave-active')

        this.closeProjectDetails()
        this.openTaskDetails(urlId)
      }
    },
    openProjectDetails(id) {

    },
    updateProjectDetails(task_id) {
      this.selectedProjectId = task_id

      const urlSearchParams = new URLSearchParams(window.location.search)
      if (task_id) {
        urlSearchParams.set('task_id', task_id)
      } else {
        urlSearchParams.delete('task_id')
      }

      const newUrl = `${window.location.origin}${window.location.pathname
        }?${urlSearchParams.toString()}`
      history.pushState(null, null, newUrl)
    },
    getProjectId(task_id) {
      return this.projectRequest.find((project) => project.task_id === task_id)
    },
    applyRowFilter() {
      this.showAlert = true
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.showAlert = false
      }, 3000)
    },
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
    this.projectRequest = projects

    if (this.hasIdParam) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      const id = urlSearchParams.get('task_id')
      this.openTaskDetails(task_id)
      this.selectedWorkers = this.getInitialSelectedWorkers(task_id)
    } else {
      this.selectedWorkers = []
    }
  }
}
</script>

<style scoped>
.project_request {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  background-color: #007bff;
  padding: 10px;
}

.project_request-title {
  color: #ffffff;
  margin: 0;
}

.new-project-card {
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

.project-detail-panel {
  position: fixed;
  top: 60px;
  right: 0;
  bottom: 0;
  width: 95%;
  background-color: white;
  z-index: 999;
  overflow-y: auto;
}

.project-detail-panel::-webkit-scrollbar {
  display: none;
}

.project-detail-content {
  margin: 10px;
}

.project-detail {
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
  width: 88%;
}

.detail p,
.note p,
.cost p {
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

.project-detail-close {
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

.search-project {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.search-project .task {
  width: 500px;
}

.search-project .filter-status {
  width: 200px;
}
</style>
