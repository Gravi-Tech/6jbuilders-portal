<template>
  <div class="project_request">
    <header class="header">
      <h1 class="project_request-title">Project</h1>
    </header>
    <v-card class="new-project-card">
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
      <div class="sub-header">
        <div class="filter-container">
          <v-btn @click="handleAddProject" variant="tonal" color="primary">ADD PROJECT</v-btn>
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
                    row.task_id
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
  <div class="overlay" v-if="addProject">
    <div class="modal-card">
      <v-card theme="dark" variant="text" class="mt-12">
        <v-card-title>Project Details</v-card-title>
        <v-card-text>
          <div class="proj-details">
            <div class="project-task">
              <p>Task ID *:</p>
              <v-text-field v-model="taskID" variant="outlined" density="compact"></v-text-field>
            </div>
            <div class="project-task">
              <p>Project Title *:</p>
              <v-text-field v-model="title" variant="outlined" density="compact"></v-text-field>
            </div>
          </div>
          <div class="project-task">
            <p>Background Image *:</p>
            <v-file-input v-model="bg_project_img" chips color="primary" density="compact"
              accept="image/png, image/jpeg, image/bmp, image/jpg" label="Upload Background Image"
              prepend-icon="mdi-camera" variant="outlined"></v-file-input>
          </div>
          <div class="project-task">
            <p>Project Images *:</p>
            <v-file-input v-model="project_imgs" color="primary" density="compact" counter label="Upload Project Images"
              multiple prepend-icon="mdi-camera" variant="outlined" accept="image/png, image/jpeg, image/bmp, image/jpg"
              :show-size="1000">
              <template v-slot:selection="{ fileNames }">
                <template v-for="(fileName, index) in fileNames" :key="fileName">
                  <v-chip v-if="index < 2" color="primary" label size="small" class="me-2">
                    {{ fileName }}
                  </v-chip>
                  <span v-else-if="index === 2" class="text-overline text-grey-darken-3 mx-2">
                    +{{ project_imgs.length - 2 }} File(s)
                  </span>
                </template>
              </template>
            </v-file-input>
          </div>
          <p class="description">Description *:</p>
          <v-textarea v-model="description" variant="outlined" density="compact"></v-textarea>
        </v-card-text>
        <v-card-actions class="actions">
          <v-btn variant="tonal" color="red" @click="handleProjectCancel">Cancel</v-btn>
          <v-btn variant="tonal" color="blue" @click="handleProjectAdd">Add</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
  <transition name="slide">
    <div v-if="selectedProjectId || hasIdParam" class="project-detail-panel">
      <div class="project-details-close" @click="closeProjectDetails">
        <v-icon>mdi-close</v-icon>
      </div>

      <div class="project-details-content">
        <div class="request-details">
          <div class="details">
            <div class="header-details">
              <div>
                <v-breadcrumbs>
                  <v-icon size="large" color="blue-lighten-1" icon="mdi-label"></v-icon>
                  <a href="/6jbuilders/admin/request" style="text-decoration: none; color: black">
                    <v-breadcrumbs-item>
                      <h4>Project</h4>
                    </v-breadcrumbs-item>
                  </a>
                  <v-icon icon="mdi-chevron-right"></v-icon>
                  <v-breadcrumbs-item>
                    <h4>Details</h4>
                  </v-breadcrumbs-item>
                  <v-icon icon="mdi-chevron-right"></v-icon>
                  <v-breadcrumbs-item>
                    <h4>{{ project.id }}</h4>
                  </v-breadcrumbs-item>
                </v-breadcrumbs>
              </div>
              <div class="actions">
                <v-btn class="edit-btn" prepend-icon="mdi-pencil" color="#FFC107" variant="tonal"
                  @click="handleEditProject">Edit Details</v-btn>
                <v-btn prepend-icon="mdi-trash-can-outline" color="red" variant="tonal"
                  @click="handleDeleteProject">Delete
                  project</v-btn>

              </div>
            </div>
            <v-card variant="text">
              <v-card-text>
                <v-container>
                  <div class="btn-mode">
                    <v-chip variant="outlined">{{ mode }}</v-chip>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
            <div class="group-details">
              <div class="detail">
                <p>Project ID</p>
                <v-text-field variant="outlined" density="compact" :value="project.id" readonly></v-text-field>
              </div>
              <div class="detail">
                <p>Task ID</p>
                <v-text-field variant="outlined" density="compact" v-model="project.task_id" readonly
                  :value="project.task_id"></v-text-field>
              </div>
              <div class="detail">
                <p>Project Title</p>
                <v-text-field variant="outlined" density="compact" v-model="project.title" :value="project.title"
                  :readonly="!editingEnabled"></v-text-field>
              </div>

            </div>
            <div class="group-details">
              <div class="detail">
                <p>Location</p>
                <v-text-field variant="outlined" density="compact" v-model="project.location" :value="project.location"
                  :readonly="!editingEnabled"></v-text-field>
              </div>
              <div class="detail">
                <p>Date Finish</p>
                <v-text-field variant="outlined" density="compact" v-model="project.date_completed"
                  :value="project.date_completed"></v-text-field>
              </div>
              <div class="detail">
                <p>Service</p>
                <v-text-field variant="outlined" density="compact" v-model="project.service" :value="project.service"
                  :readonly="!editingEnabled"></v-text-field>
              </div>
            </div>
            <div class="group-details">
              <div class="description">
                <p>Project Description</p>
                <v-textarea variant="outlined" density="compact" v-model="project.description"
                  :value="project.description" :readonly="!editingEnabled"></v-textarea>
              </div>
            </div>
            <v-card variant="text">
              <v-container>
                <v-card-text class="d-flex justify-center">
                  <div class="project-image">
                    <p>Project Background</p>
                    <img :src="project.bg_project_img" alt="Project Background">
                  </div>
                  <div class="p-img">
                    <p>Project Images</p>
                    <div class="project-images">
                      <div v-for="image in project.project_imgs" :key="image">
                        <img :src="image" alt="Project Image">
                      </div>

                    </div>
                  </div>
                </v-card-text>
              </v-container>
            </v-card>
            <v-card variant="text">
              <v-container>
                <v-card-text>
                  <div v-if="editingEnabled" class="edit-actions">
                    <v-row justify="end">
                      <div class="form-actions-btn">
                        <v-btn density="compact" prepend-icon="mdi-close" variant="tonal" size="large"
                          color="red-lighten-1" @click="handleCancelEdit">Cancel</v-btn>
                        <v-btn density="compact" prepend-icon="mdi-content-save" variant="tonal" size="large"
                          color="blue-lighten-1" @click="handleSaveEdit">Save</v-btn>
                      </div>
                    </v-row>
                  </div>
                </v-card-text>
              </v-container>
            </v-card>
          </div>
        </div>
        <v-alert class="popup-message" v-model="deleteConfirmation" type="warning" dismissible>
          <h3>Are you sure you want to delete this project?</h3>
          <div class="actions">
            <v-btn color="error" variant="text" @click="deleteProject">Delete</v-btn>
            <v-btn variant="text" @click="cancelDelete">Cancel</v-btn>
          </div>
        </v-alert>
      </div>
      <v-alert class="popup-message" v-if="showPopup" variant="tonal" :type="popupType" :title="popupTitle" :value="true"
        dismissible @input="hidePopupMessage">
        {{ popupMessage }}
      </v-alert>
    </div>
  </transition>
  <v-alert class="popup-message" v-if="showPopup" variant="tonal" :type="popupType" :title="popupTitle" :value="true"
    dismissible @input="hidePopupMessage">
    {{ popupMessage }}
  </v-alert>
</template>

<script>
import { taskData } from '../../dataUtils/tableData'
import { projects } from '../../dataUtils/projectData'
import { serviceTypes } from '../../dataUtils/serviceType'
import { VDatePicker } from 'vuetify/labs/VDatePicker'
import { v4 as uuidv4 } from 'uuid';

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
      originalProject: {},
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
        { key: 'date_completed', label: 'Date Finish', maxLength: null },
      ],
      selectedProjectId: null,
      projectId: null,
      addProject: false,
      taskID: '',
      title: '',
      bg_project_img: '',
      project_imgs: [],
      description: '',
      toProjectDB: [],
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      deleteConfirmation: false
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
      this.selectedProjectId = id
      this.project = this.getProjectId(this.selectedProjectId)
      this.updateProjectDetails(this.selectedProjectId)
    },

    closeProjectDetails() {
      this.selectedProjectId = null
      this.updateProjectDetails(null)

      const panelElement = document.querySelector('.project-detail-panel')
      panelElement.classList.add('slide-leave')
      panelElement.classList.add('slide-leave-to')
      panelElement.classList.add('slide-leave-active')

      // this.refreshPage()
    },

    updateProjectDetails(id) {
      this.selectedProjectId = id

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
    getProjectId(id) {
      return this.projectRequest.find((project) => project.id === id)
    },
    applyRowFilter() {
      this.showAlert = true
      clearTimeout(this.alertTimeout)
      this.alertTimeout = setTimeout(() => {
        this.showAlert = false
      }, 3000)
    },
    handleEditProject() {
      this.editingEnabled = true
      this.originalProject = { ...this.project }
    },

    handleDeleteProject() {
      this.deleteConfirmation = true;
    },
    deleteProject() {
      // Perform the delete operation, e.g., make an API request

      // Reset the project data or navigate to a different page if needed
      const successMessage = 'The project has been successfully deleted.';
      this.showPopupMessage('success', 'Deleted', successMessage);
      this.deleteConfirmation = false;
      this.editingEnabled = false;
    },
    cancelDelete() {
      this.deleteConfirmation = false;
    },
    handleAddProject() {
      this.addProject = true
    },
    handleCancelEdit() {
      Object.assign(this.project, {
        title: this.originalProject.title,
        service: this.originalProject.service,
        location: this.originalProject.location,
        description: this.originalProject.description,
      })

      this.editingEnabled = false
    },
    handleSaveEdit() {
      if (this.project.title === '' || this.project.service === '' || this.project.location === '' || this.project.description === '') {
        const errorMessage = 'Please fill in all fields';
        this.showPopupMessage('error', 'Incomplete Fields', errorMessage);
        return;
      }

      // Perform the save operation, e.g., make an API request
      const successMessage = 'Changes saved successfully.'
      this.showPopupMessage('success', 'Success', successMessage)
      this.editingEnabled = false;
    },

    handleProjectCancel() {
      this.addProject = false
      this.taskID = '';
      this.title = '';
      this.bg_project_img = '';
      this.project_imgs = [];
      this.description = '';
    },
    handleProjectAdd() {
      if (!this.taskID || !this.title || !this.bg_project_img || this.project_imgs.length === 0 || !this.description) {
        const errorMessage = 'Please fill in all fields';
        this.showPopupMessage('error', 'Incomplete Fields', errorMessage);
        return;
      }

      const existingProject = projects.find((project) => project.id === this.taskID);

      if (existingProject) {
        const errorMessage = 'Project already exists for the task ID';
        this.showPopupMessage('error', 'Cannot Create', errorMessage);
        return;
      }

      const task = taskData.find((task) => task.id === this.taskID);

      if (!task) {
        const errorMessage = 'Task not found!';
        this.showPopupMessage('error', 'Not Found', errorMessage);
        return;
      }

      if (task.status !== 'Completed') {
        const errorMessage = 'Task must be completed';
        this.showPopupMessage('error', 'Unable to Create', errorMessage);
        return;
      }

      const { location, date_completed, service } = task;
      const projectImageURLs = [];

      for (const file of this.project_imgs) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          const mimeType = reader.result.split(',')[0].split(':')[1].split(';')[0];
          const fileURL = `data:${mimeType};base64,${base64String}`;
          projectImageURLs.push(fileURL);
        };
        reader.readAsDataURL(file);
      }

      const projectCreated = {
        id: uuidv4(),
        task_id: this.taskID,
        title: this.title,
        bg_project_img: this.bg_project_img,
        project_imgs: projectImageURLs,
        date: date_completed,
        description: this.description,
        location: location,
        service: service
      };

      this.toProjectDB.push(projectCreated);

      this.taskID = '';
      this.title = '';
      this.bg_project_img = '';
      this.project_imgs = [];
      this.description = '';
      const successMessage = 'The project has been successfully created';
      this.showPopupMessage('success', 'Created', successMessage);
      this.addProject = false;
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
      const id = urlSearchParams.get('id')
      this.openProjectDetails(id)
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

.btn-mode {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 30px;
}

.project-details-close {
  text-align: end;
  margin: 10px;
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

.description {
  width: 71%;
}

.detail p,
.description p,
.cost,
.project-task p,
.project-image p,
.p-img p,
.description {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.proj-details {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.proj-details .project-task {
  width: 360px;
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
  width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.group-details {
  display: flex;
  justify-content: center;
  align-items: center;
}

.project-image {
  margin-right: 20px;
}

.project-image img {
  width: 100%;
  max-width: 480px;
  height: auto;
  margin-bottom: 10px;
}

.project-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 480px;
}

.project-images img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>