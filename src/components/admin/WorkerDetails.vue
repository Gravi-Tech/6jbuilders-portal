<template>
  <div>
    <div class="loading-container" v-if="isLoading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="44"
        :width="4"
      ></v-progress-circular>
    </div>
    <v-card v-else flat>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="workers">
          <v-icon start> mdi-format-list-bulleted </v-icon>
          list of Workers
        </v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item value="workers">
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
            <v-btn @click="handleAddService" color="primary">Add Worker</v-btn>
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
          <v-card class="new-booking-card">
            <div class="sub-header">
              <!-- <div class="filter-container">
                <v-autocomplete
                  chips
                  v-model="selectedFilter"
                  label="Filter By Position"
                  :items="positionTypes"
                  variant="solo"
                  class="filter-select"
                ></v-autocomplete>
              </div> -->
            </div>
          </v-card>
          
          <table class="table">
            <thead style="font-size: 13px">
              <tr>
                <th>ID</th>
                <th>Fullname</th>
                <th>Position</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Experience (mos)</th>
                <th>Updated On</th>

              </tr>
            </thead>
            <tbody style="font-size: 13px">
              <template v-if="displayedServices.length > 0">
                <tr v-for="worker in displayedServices" :key="worker._id">
                  <td>{{ worker._id }}</td>
                  <td>{{ worker.fullname }}</td>
                  <td>{{ worker.position }}</td>
                  <td>{{ worker.contact }}</td>
                  <td>{{ worker.address }}</td>
                  <td>{{ worker.experience}}</td>
                  <td>{{ formatDate(worker.created_date) }}</td>
                  <td>{{ formatDate(worker.updated_date) }}</td>
                  <td>  
                    <v-btn
                      size="small"
                      @click="handleEditService(worker._id)"
                      color="secondary"
                      flat
                      class="mr-6"
                      >Edit</v-btn
                    >
                    <v-btn
                      size="small"
                      @click="handleDeleteService(worker._id)"
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
                  <td colspan="6" class="not-found">No worker found</td>
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
        </v-window-item>
      </v-window>
    </v-card>
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Worker</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newService.fullname"
            label="Fullname *"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
         <v-select
            class="mt-4"
            v-model="editServiceData.position"
            label="Position"
            :items="['Manager', 'Foreman', 'General Worker', 'Painter', 'Electrician' ,'Plumber']"
            variant="outlined"
            dense
          ></v-select>
          <v-text-field
            class="mt-4"
            v-model="newService.contact"
            label="Contact Number"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newService.address"
            label="Home Address"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newService.experience"
            label="Experience(mos)"
            variant="outlined"
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createService">Add</v-btn>
          <v-btn @click="cancelAddService">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteConfirmation" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Delete Worker</span>
        </v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete the following worker's information?</p>
          <p><strong>Fullname:</strong> {{ deleteServiceData.fullname }}</p>
          <p><strong>Position:</strong> {{ deleteServiceData.position }}</p>
          <p><strong>Contact:</strong> {{ deleteServiceData.contact }}</p>
          <p><strong>Address:</strong> {{ deleteServiceData.address }}</p>
          <p><strong>Experience(mos):</strong> {{ deleteServiceData.experience }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmDeleteService">Continue</v-btn>
          <v-btn @click="cancelDeleteService">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Service</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editServiceData.fullname"
            label="Fullname *"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-select
            class="mt-4"
            v-model="editServiceData.position"
            label="Position"
            :items="['Manager', 'Foreman', 'General Worker', 'Painter', 'Electrician' ,'Plumber']"
            variant="outlined"
            dense
          ></v-select>
          <v-text-field
            class="mt-4"
            v-model="editServiceData.address"
            label="Home Address"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="editServiceData.contact"
            label="Contact Number"
            variant="outlined"
            dense
          ></v-text-field>
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
      tab: 'workers',
      search: '',
      workers: [],
      itemsPerPage: 5,
      currentPage: 1,
      options: [5,10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newService: {
        fullname: '',
        position: '',
        contact: '',
        address: '',
        experience: '',
        updated_date: null
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deleteServiceData: {
        id: null,
        fullname: '',
        position: '',
        contact: '',
        address: '',
        experience: '',
      },
      showEditDialog: false,
      editServiceData: {
        id: null,
        fullname: '',
        position: '',
        contact: '',
        address: '',
        experience: '',
        updated_date: null
      }
    }
  },
  computed: {
    filteredServices() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.services.filter((service) => {
        return (
          service.title.toLowerCase().includes(searchTerm) ||
          service.short_title.toLowerCase().includes(searchTerm)
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
      this.newService.fullname = ''
      this.newService.position = ''
      this.newService.address = ''
      this.newService.contact = ''
      this.newService.experience = ''
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
          fullname: serviceToDelete.fullname,
          position: serviceToDelete.position,
          contact: serviceToDelete.contact,
          address: serviceToDelete.address,
          experience: serviceToDelete.experience,
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteService() {
      try {
        await deleteService(this.deleteServiceData.id)
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

.booking_request {
  display: flex;
  flex-direction: row; /* Change the flex direction to row */
  height: 100%;
}

.new-booking-card {
  margin-top: 20px;
  flex-grow: 1;
  
}

.sub-header {
  display: flex;
  justify-content: space-between; /* Align items in a row */
  align-items: center;
}

.filter-container {
  padding: 20px;
  width: 20%;
}
</style>
