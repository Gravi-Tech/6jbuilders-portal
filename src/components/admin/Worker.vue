<template>
  <div>
    <header class="header">
      <h1 class="dashboard-title">Workers</h1>
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
        <v-btn @click="handleAddWorker" color="primary">Add Worker </v-btn>
      </div>
      <table class="table">
        <thead style="font-size: 13px">
          <tr>
            <th>ID</th>
            <th>Fullname</th>
            <th>Position</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Experience (mos)</th>
            <th>Created At</th>
            <th>Updated On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px">
          <template v-if="displayedWorkers.length > 0">
            <tr v-for="worker in displayedWorkers" :key="worker._id">
              <td>{{ worker._id }}</td>
              <td>{{ worker.fullName }}</td>
              <td>{{ worker.position }}</td>
              <td>{{ worker.contact }}</td>
              <td>{{ worker.address }}</td>
              <td>{{ worker.experience }}</td>
              <td>{{ formatDate(worker.created_date) }}</td>
              <td>{{ formatDate(worker.updated_date) }}</td>
              <td>
                <v-btn
                  size="small"
                  @click="handleEditWorker(worker._id)"
                  color="secondary"
                  flat
                  class="mr-6"
                  >Edit</v-btn
                >
                <v-btn
                  size="small"
                  @click="handleDeleteWorker(worker._id)"
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
    </v-card>
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Worker</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newWorker.fullName"
            label="Fullname *"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-select
            class="mt-4"
            v-model="newWorker.position"
            label="Select Position *"
            :items="['Manager', 'Foreman', 'General Worker', 'Painter', 'Electrician', 'Plumber']"
            variant="outlined"
            dense
          ></v-select>
          <v-text-field
            class="mt-4"
            v-model="newWorker.contact"
            label="Contact Number"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newWorker.address"
            label="Home Address"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newWorker.experience"
            label="Experience(mos)"
            variant="outlined"
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createWorker">Add</v-btn>
          <v-btn @click="this.showAddDialog = false">Cancel</v-btn>
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
          <p><strong>Fullname:</strong> {{ deleteWorkerData.fullName }}</p>
          <p><strong>Position:</strong> {{ deleteWorkerData.position }}</p>
          <p><strong>Contact:</strong> {{ deleteWorkerData.contact }}</p>
          <p><strong>Address:</strong> {{ deleteWorkerData.address }}</p>
          <p><strong>Experience(mos):</strong> {{ deleteWorkerData.experience }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmDeleteWorker">Continue</v-btn>
          <v-btn @click="this.showDeleteConfirmation = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Worker</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editWorkerData.fullName"
            label="Fullname"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-select
            class="mt-4"
            v-model="editWorkerData.position"
            label="Position"
            :items="['Manager', 'Foreman', 'General Worker', 'Painter', 'Electrician', 'Plumber']"
            variant="outlined"
            dense
          ></v-select>
          <v-text-field
            class="mt-4"
            v-model="editWorkerData.address"
            label="Home Address"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="editWorkerData.contact"
            label="Contact Number"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="editWorkerData.experience"
            label="Experience (mos)"
            variant="outlined"
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEditedWorker">Save</v-btn>
          <v-btn @click="this.showEditDialog = false">Cancel</v-btn>
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
import { createWorker, getAllWorkers, updateWorker, deleteWorker } from '../../apirequests/workers'
export default {
  data() {
    return {
      search: '',
      workers: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newWorker: {
        fullName: '',
        position: '',
        contact: '',
        address: '',
        experience: '',
        updated_date: null
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deleteWorkerData: {
        fullName: '',
        position: '',
        contact: '',
        address: '',
        experience: ''
      },
      showEditDialog: false,
      editWorkerData: {
        fullName: '',
        position: '',
        contact: '',
        address: '',
        experience: '',
        updated_date: null
      }
    }
  },
  computed: {
    filteredWorkers() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.workers.filter((worker) => {
        return (
          worker.fullName.toLowerCase().includes(searchTerm) ||
          worker.position.toLowerCase().includes(searchTerm) ||
          worker.address.toLowerCase().includes(searchTerm) ||
          worker.contact.toLowerCase().includes(searchTerm) ||
          worker.experience.toLowerCase().includes(searchTerm) ||
          worker._id.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedWorkers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredWorkers.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredWorkers.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchWorkers()
  },
  methods: {
    async fetchWorkers() {
      try {
        this.isLoading = true
        // await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
        const response = await getAllWorkers()
        this.workers = response.data
      } catch (error) {
        console.error(error)
        // Handle error
      } finally {
        this.isLoading = false
      }
    },
    handleAddWorker() {
      this.newWorker.fullName = ''
      this.newWorker.position = ''
      this.newWorker.address = ''
      this.newWorker.contact = ''
      this.newWorker.experience = ''
      this.titleErrorMessage = ''

      this.showAddDialog = true
    },
    async createWorker() {
      const titleExists = this.workers.some((worker) => worker.fullName === this.newWorker.fullName)
      if (titleExists) {
        this.titleErrorMessage = 'Title already exists. Please use another title.'
        return
      }
      try {
        await createWorker(this.newWorker)

        this.showPopupMessage('success', 'Created', 'A new worker added successfully.')

        this.fetchWorkers()
      } catch (error) {
        console.error(error)
      } finally {
        this.showAddDialog = false
      }
    },
    async handleEditWorker(workerId) {
      const workerToEdit = this.workers.find((worker) => worker._id === workerId)

      this.editWorkerData = {
        id: workerId,
        fullname: workerToEdit.fullName,
        position: workerToEdit.short_title,
        address: workerToEdit.address,
        contact: workerToEdit.contact,
        experience: workerToEdit.experience,
        created_date: workerToEdit.created_date,
        updated_date: workerToEdit.updated_date
      }

      this.showEditDialog = true
    },
    async saveEditedWorker() {
      const workerIndex = this.workers.findIndex((worker) => worker._id === this.editWorkerData.id)

      if (workerIndex !== -1) {
        const existingWorker = this.workers.find(
          (worker, index) =>
            worker.fullName.toLowerCase() === this.editWorkerData.fullName.toLowerCase() &&
            index !== workerIndex
        )
        if (existingWorker) {
          this.titleErrorMessage = 'Title already exists. Please use another title.'
          return
        }

        this.workers[workerIndex].fullName = this.editWorkerData.fullName
        this.workers[workerIndex].position = this.editWorkerData.position
        this.workers[workerIndex].contact = this.editWorkerData.contact
        this.workers[workerIndex].address = this.editWorkerData.address
        this.workers[workerIndex].experience = this.editWorkerData.experience
        this.workers[workerIndex].updatedDate = new Date()
      }

      try {
        await Promise.all([
          updateWorker(this.editWorkerData.id, {
            fullName: this.editWorkerData.fullName,
            position: this.editWorkerData.position,
            address: this.editWorkerData.address,
            contact: this.editWorkerData.contact,
            experience: this.editWorkerData.experience
          })
        ])

        await this.fetchWorkers()
      } catch (error) {
        console.error(error)
      } finally {
        this.showEditDialog = false
        this.showPopupMessage('success', 'Updated', 'A worker updated successfully.')
      }
    },
    async handleDeleteWorker(workerId) {
      try {
        const workerToDelete = this.workers.find((worker) => worker._id === workerId)
        this.deleteWorkerData = {
          id: workerId,
          fullName: workerToDelete.fullName,
          position: workerToDelete.position,
          contact: workerToDelete.contact,
          address: workerToDelete.address,
          experience: workerToDelete.experience
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteWorker() {
      try {
        await deleteWorker(this.deleteWorkerData.id)
        this.workers = this.workers.filter((worker) => worker._id !== this.deleteWorkerData.id)
        const successMessage = 'A worker has been successfully deleted.'
        this.showPopupMessage('success', 'Deleted', successMessage)
      } catch (error) {
        console.error(error)
      } finally {
        this.showDeleteConfirmation = false
      }
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
