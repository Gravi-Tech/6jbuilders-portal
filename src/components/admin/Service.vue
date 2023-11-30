<template>
  <div>
    <header class="header">
      <h1 class="dashboard-title">Services</h1>
    </header>
    <div class="loading-container" v-if="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="44"
        :width="4"
      ></v-progress-circular>
    </div>
    <v-card v-else flat>
      <div class="sub__headers">
        <div class="items-per-page">
          <label class="items-per-page__label" for="itemsPerPage">Items per Page:</label>
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
            label="Search"
            single-line
            flat
            hide-details
            variant="solo-filled"
          ></v-text-field>
        </div>
      </div>
      <div class="mb-6 mr-8 text-end">
        <v-btn @click="handleAddService" color="primary">Add Service</v-btn>
      </div>
      <table class="table">
        <thead style="font-size: 13px">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Short Title</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px">
          <template v-if="displayedServices.length > 0">
            <tr v-for="service in displayedServices" :key="service._id">
              <td>{{ service._id }}</td>
              <td>{{ service.title }}</td>
              <td>{{ service.short_title }}</td>
              <td>{{ formatDate(service.createdDate) }}</td>
              <td>{{ formatDate(service.updatedDate) }}</td>
              <td>{{ service.status }}</td>
              <td>
                <v-btn
                  size="small"
                  @click="handleEditService(service._id)"
                  color="secondary"
                  flat
                  class="mr-6"
                  >Edit</v-btn
                >
                <v-btn
                  size="small"
                  @click="handleDeleteService(service._id)"
                  color="error"
                  variant="outlined"
                  flat
                  >Delete</v-btn
                >
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="6" class="not-found">Not Service found</td>
            </tr>
          </template>
        </tbody>
      </table>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="handlePageChange"
        class="mt-4"
      ></v-pagination>
      <v-dialog persistent v-model="showAddDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Service</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newService.title"
              label="Title *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="newService.short_title"
              label="Short Title"
              variant="outlined"
              dense
            ></v-text-field>
            <v-card-actions>
              <v-btn color="primary" @click="createService">Create</v-btn>
              <v-btn @click="cancelAddService">Cancel</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="showDeleteConfirmation" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Delete Service</span>
          </v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete the following service?</p>
            <p><strong>Title:</strong> {{ deleteServiceData.title }}</p>
            <p><strong>Short Title:</strong> {{ deleteServiceData.short_title }}</p>
            <v-alert class="mt-4" type="warning" variant="tonal" outlined dense>
              Deleting this service will permanently remove all associated data and cannot be
              undone.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="confirmDeleteService">Continue</v-btn>
            <v-btn @click="cancelDeleteService">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="showEditDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Service</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editServiceData.title"
              label="Title *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="editServiceData.short_title"
              label="Short Title"
              variant="outlined"
              dense
            ></v-text-field>
            <v-select
              class="mt-4"
              v-model="editServiceData.status"
              label="Status"
              :items="['available', 'soon', 'unavailable']"
              variant="outlined"
              dense
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveEditedService">Save</v-btn>
            <v-btn @click="cancelEditService">Cancel</v-btn>
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
    </v-card>
  </div>
</template>

<script>
import {
  addService,
  getAllServices,
  updateService,
  deleteService,
  updateServiceStatus
} from '../../apirequests/service'

export default {
  data() {
    return {
      search: '',
      services: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newService: {
        title: '',
        short_title: ''
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deleteServiceData: {
        id: null,
        title: '',
        short_title: ''
      },
      showEditDialog: false,
      editServiceData: {
        id: null,
        title: '',
        short_title: '',
        status: '',
        updatedDate: null
      }
    }
  },
  computed: {
    filteredServices() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.services.filter((service) => {
        return (
          service.title.toLowerCase().includes(searchTerm) ||
          service.short_title.toLowerCase().includes(searchTerm) ||
          service._id.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedServices() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredServices.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchServices()
  },
  methods: {
    async fetchServices() {
      try {
        this.isLoading = true
        // await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
        const response = await getAllServices()
        this.services = response.data
      } catch (error) {
        console.error(error)
        // Handle error
      } finally {
        this.isLoading = false
      }
    },
    handleAddService() {
      this.newService.title = ''
      this.newService.short_title = ''
      this.titleErrorMessage = ''

      this.showAddDialog = true
    },
    async createService() {
      const titleExists = this.services.some((service) => service.title === this.newService.title)
      if (titleExists) {
        this.titleErrorMessage = 'Title already exists. Please use another title.'
        return
      }
      try {
        await addService(this.newService)

        this.showPopupMessage('success', 'Created', 'Service added successfully.')

        this.fetchServices()
      } catch (error) {
        console.error(error)
      } finally {
        this.showAddDialog = false
      }
    },
    cancelAddService() {
      this.showAddDialog = false
    },
    async handleEditService(serviceId) {
      const serviceToEdit = this.services.find((service) => service._id === serviceId)

      this.editServiceData = {
        id: serviceId,
        title: serviceToEdit.title,
        short_title: serviceToEdit.short_title,
        status: serviceToEdit.status,
        updatedDate: serviceToEdit.updatedDate
      }

      this.showEditDialog = true
    },
    async saveEditedService() {
      const serviceIndex = this.services.findIndex(
        (service) => service._id === this.editServiceData.id
      )

      if (serviceIndex !== -1) {
        const existingService = this.services.find(
          (service, index) =>
            service.title.toLowerCase() === this.editServiceData.title.toLowerCase() &&
            index !== serviceIndex
        )
        if (existingService) {
          this.titleErrorMessage = 'Title already exists. Please use another title.'
          return
        }

        this.services[serviceIndex].title = this.editServiceData.title
        this.services[serviceIndex].short_title = this.editServiceData.short_title
        this.services[serviceIndex].status = this.editServiceData.status
        this.services[serviceIndex].updatedDate = new Date()
      }

      try {
        await Promise.all([
          updateService(this.editServiceData.id, {
            title: this.editServiceData.title,
            short_title: this.editServiceData.short_title
          }),
          updateServiceStatus(this.editServiceData.id, this.editServiceData.status)
        ])

        await this.fetchServices()
      } catch (error) {
        console.error(error)
      } finally {
        this.showEditDialog = false
        this.showPopupMessage('success', 'Updated', 'Service updated successfully.')
      }
    },
    cancelEditService() {
      this.showEditDialog = false
    },
    async handleDeleteService(serviceId) {
      try {
        const serviceToDelete = this.services.find((service) => service._id === serviceId)
        this.deleteServiceData = {
          id: serviceId,
          title: serviceToDelete.title,
          short_title: serviceToDelete.short_title
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteService() {
      try {
        await deleteService(this.deleteServiceData.id)
        this.fetchServices()
        this.services = this.services.filter((service) => service._id !== this.deleteServiceData.id)
        const successMessage = 'The service has been successfully deleted.'
        this.showPopupMessage('success', 'Deleted', successMessage)
      } catch (error) {
        console.error(error)
      } finally {
        this.showDeleteConfirmation = false
      }
    },
    cancelDeleteService() {
      this.showDeleteConfirmation = false
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    handleItemsPerPageChange() {
      this.currentPage = 1
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
.dashboard-title {
  font-size: 24px;
  font-weight: 700;
}
.headline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.sub__headers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
}

.search {
  width: 300px;
}
.items-per-page {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.items-per-page__label {
  margin-right: 0.5rem;
  font-weight: 600;
  font-size: 10px;
}

.items-per-page__select select {
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  padding: 5px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.table th {
  font-weight: bold;
}

.table tr:hover {
  background-color: #f5f5ff;
}

.table td:last-child {
  white-space: nowrap;
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
