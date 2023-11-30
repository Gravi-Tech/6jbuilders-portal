<template>
  <div>
    <header class="header">
      <h1 class="dashboard-title">Cancellation Reasons</h1>
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
        <v-btn @click="handleAddPosition" color="primary">Add cancellation reason</v-btn>
      </div>
      <table class="table">
        <thead style="font-size: 13px">
          <tr>
            <th>ID</th>
            <th>Reason</th>
            <th>Description</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px">
          <template v-if="displayedType.length > 0">
            <tr v-for="position in displayedType" :key="position._id">
              <td>{{ position._id }}</td>
              <td>{{ position.reason }}</td>
              <td>{{ position.description }}</td>
              <td>{{ formatDate(position.date_created) }}</td>
              <td>{{ formatDate(position.date_updated) }}</td>
              <td>
                <v-btn
                  size="small"
                  @click="handleEditReason(position._id)"
                  color="secondary"
                  flat
                  class="mr-6"
                  >Edit</v-btn
                >
                <v-btn
                  size="small"
                  @click="handleDeleteReason(position._id)"
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
              <td colspan="6" class="not-found">Not Reason found</td>
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
      <v-dialog v-model="showAddDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Cancellation</span>
          </v-card-title>
          <v-card-text>
            <v-alert
              class="mb-4"
              type="info"
              color="#2196F3"
              theme="dark"
              icon="mdi-information"
              text="Please provide the necessary details for adding a new reason. The reason will be added as an option in the list of reasons when cancelling a task."
              variant="tonal"
              prominent
            ></v-alert>
            <v-text-field
              v-model="newReason.reason"
              label="Reason *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              hint="Enter the reason for the reason"
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="newReason.description"
              label="Description *"
              variant="outlined"
              dense
              hint="Enter a description for the reason"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="addReason">Create</v-btn>
            <v-btn @click="showAddDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showDeleteConfirmation" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Delete Reason</span>
          </v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete the following reason?</p>
            <p><strong>Reason:</strong> {{ deleteReasonData.reason }}</p>
            <p><strong>Description:</strong> {{ deleteReasonData.description }}</p>
            <v-alert class="mt-3" type="warning" variant="tonal" dense>
              Deleting this reason will remove all associated tasks that were cancelled with this
              reason.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="confirmDeleteReason">Continue</v-btn>
            <v-btn @click="showDeleteConfirmation = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="showEditDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Cancellation</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editReasonData.reason"
              label="Reason *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              required
            ></v-text-field>
            <v-textarea
              class="mt-4"
              v-model="editReasonData.description"
              label="Description"
              variant="outlined"
              rows="5"
              row-height="50"
              dense
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveEditedReason">Save</v-btn>
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
    </v-card>
  </div>
</template>

<script>
import { addReason, getAllReason, updateReason, deleteReason } from '../../apirequests/reason'

export default {
  data() {
    return {
      search: '',
      reasons: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newReason: {
        title: '',
        description: ''
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deleteReasonData: {
        id: null,
        title: '',
        description: ''
      },
      showEditDialog: false,
      editReasonData: {
        id: null,
        title: '',
        description: '',
        date_updated: null
      }
    }
  },
  computed: {
    filteredreasons() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.reasons.filter((reason) => {
        return (
          reason.reason.toLowerCase().includes(searchTerm) ||
          reason.description.toLowerCase().includes(searchTerm) ||
          reason._id.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedType() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredreasons.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredreasons.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchReasons()
  },
  methods: {
    async fetchReasons() {
      try {
        this.isLoading = true
        const response = await getAllReason()
        this.reasons = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    handleAddPosition() {
      this.newReason.title = ''
      this.newReason.description = ''
      this.titleErrorMessage = ''

      this.showAddDialog = true
    },
    async addReason() {
      const titleExists = this.reasons.some((position) => position.title === this.newReason.title)
      if (titleExists) {
        this.titleErrorMessage = 'Title already exists. Please use another title.'
        return
      }
      try {
        await addReason(this.newReason)

        this.showPopupMessage('success', 'Created', 'Data type added successfully.')

        this.fetchReasons()
      } catch (error) {
        console.error(error)
      } finally {
        this.showAddDialog = false
      }
    },
    async handleEditReason(typeId) {
      const typeToEdit = this.reasons.find((type) => type._id === typeId)

      this.editReasonData = {
        id: typeId,
        reason: typeToEdit.reason,
        description: typeToEdit.description,
        job_description: typeToEdit.job_description,
        date_updated: typeToEdit.date_updated
      }

      this.showEditDialog = true
    },
    async saveEditedReason() {
      const reasonIndex = this.reasons.findIndex((reason) => reason._id === this.editReasonData.id)

      if (reasonIndex !== -1) {
        const existingReason = this.reasons.find(
          (reason, index) =>
            reason.reason.toLowerCase() === this.editReasonData.reason.toLowerCase() &&
            index !== reasonIndex
        )
        if (existingReason) {
          this.reasonErrorMessage = 'Reason already exists. Please use another reason.'
          return
        }

        this.reasons[reasonIndex].reason = this.editReasonData.reason
        this.reasons[reasonIndex].description = this.editReasonData.description
        this.reasons[reasonIndex].date_updated = new Date()
      }

      try {
        await Promise.all([
          updateReason(this.editReasonData.id, {
            reason: this.editReasonData.reason,
            description: this.editReasonData.description
          })
        ])

        await this.fetchreasons()
      } catch (error) {
        console.error(error)
      } finally {
        this.showEditDialog = false
        this.showPopupMessage('success', 'Updated', 'Cancellation reason updated successfully.')
      }
    },
    async handleDeleteReason(reasonId) {
      try {
        const reasonToDelete = this.reasons.find((reason) => reason._id === reasonId)
        this.deleteReasonData = {
          id: reasonId,
          reason: reasonToDelete.reason,
          description: reasonToDelete.description
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteReason() {
      try {
        await deleteReason(this.deleteReasonData.id)
        this.reasons = this.reasons.filter((type) => type._id !== this.deleteReasonData.id)
        const successMessage = 'The reason for cancellation has been successfully deleted.'
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
</style>
