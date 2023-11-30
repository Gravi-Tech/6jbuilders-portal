<template>
  <div>
    <header class="header">
      <h1 class="dashboard-title">Position</h1>
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
        <v-btn @click="handleAddPosition" color="primary">Add Position</v-btn>
      </div>
      <table class="table">
        <thead style="font-size: 13px">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Short Title</th>
            <th>Job Description</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px">
          <template v-if="displayedPosition.length > 0">
            <tr v-for="position in displayedPosition" :key="position._id">
              <td>{{ position._id }}</td>
              <td>{{ position.title }}</td>
              <td>{{ position.short_title }}</td>
              <td>{{ position.job_description }}</td>
              <td>{{ formatDate(position.date_created) }}</td>
              <td>{{ formatDate(position.date_updated) }}</td>
              <td>
                <v-btn
                  size="small"
                  @click="handleEditPosition(position._id)"
                  color="secondary"
                  flat
                  class="mr-6"
                  >Edit</v-btn
                >
                <v-btn
                  size="small"
                  @click="handleDeletePosition(position._id)"
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
              <td colspan="6" class="not-found">Not Position found</td>
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
            <span class="headline">Add Position</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newPosition.title"
              label="Title *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              hint="Enter the title for the position."
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="newPosition.short_title"
              label="Short Title"
              variant="outlined"
              hint="Enter a short title (optional)"
              dense
            ></v-text-field>
            <v-textarea
              class="mt-4"
              v-model="newPosition.job_description"
              label="Job Description"
              variant="outlined"
              hint="Enter a job description (optional)"
              dense
            ></v-textarea>
            <v-card-actions>
              <v-btn color="primary" @click="createPosition">Create</v-btn>
              <v-btn @click="this.showAddDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="showDeleteConfirmation" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Delete Position</span>
          </v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete the following position?</p>
            <p><strong>Title:</strong> {{ deletePositionData.title }}</p>
            <p><strong>Short Title:</strong> {{ deletePositionData.short_title }}</p>
            <p><strong>Job Description:</strong> {{ deletePositionData.job_description }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="confirmDeletePosition">Continue</v-btn>
            <v-btn @click="this.showDeleteConfirmation = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="showEditDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Data Type</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editPositionData.title"
              label="Title *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="editPositionData.short_title"
              label="Short Title"
              variant="outlined"
              dense
            ></v-text-field>
            <v-textarea
              class="mt-4"
              v-model="editPositionData.job_description"
              label="Job Description"
              variant="outlined"
              rows="5"
              row-height="50"
              dense
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveEditedPosition">Save</v-btn>
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
import {
  createPosition,
  getAllPositions,
  updatePosition,
  deletePosition
} from '../../apirequests/position'

export default {
  data() {
    return {
      search: '',
      positions: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newPosition: {
        title: '',
        short_title: '',
        job_description: ''
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deletePositionData: {
        id: null,
        title: '',
        short_title: '',
        job_description: ''
      },
      showEditDialog: false,
      editPositionData: {
        id: null,
        title: '',
        short_title: '',
        job_description: '',
        date_updated: null
      }
    }
  },
  computed: {
    filteredPositions() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.positions.filter((position) => {
        return (
          position.title.toLowerCase().includes(searchTerm) ||
          position.short_title.toLowerCase().includes(searchTerm) ||
          position._id.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedPosition() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredPositions.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredPositions.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchPositions()
  },
  methods: {
    async fetchPositions() {
      try {
        this.isLoading = true
        // await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
        const response = await getAllPositions()
        this.positions = response.data
      } catch (error) {
        console.error(error)
        // Handle error
      } finally {
        this.isLoading = false
      }
    },
    handleAddPosition() {
      this.newPosition.title = ''
      this.newPosition.short_title = ''
      this.job_description = ''
      this.titleErrorMessage = ''

      this.showAddDialog = true
    },
    async createPosition() {
      const titleExists = this.positions.some(
        (position) => position.title === this.newPosition.title
      )
      if (titleExists) {
        this.titleErrorMessage = 'Title already exists. Please use another title.'
        return
      }
      try {
        await createPosition(this.newPosition)

        this.showPopupMessage('success', 'Created', 'Position added successfully.')

        this.fetchPositions()
      } catch (error) {
        console.error(error)
      } finally {
        this.showAddDialog = false
      }
    },
    async handleEditPosition(positionId) {
      const positionToEdit = this.positions.find((position) => position._id === positionId)

      this.editPositionData = {
        id: positionId,
        title: positionToEdit.title,
        short_title: positionToEdit.short_title,
        job_description: positionToEdit.job_description,
        date_updated: positionToEdit.date_updated
      }

      this.showEditDialog = true
    },
    async saveEditedPosition() {
      const positionIndex = this.positions.findIndex(
        (position) => position._id === this.editPositionData.id
      )

      if (positionIndex !== -1) {
        const existingPosition = this.positions.find(
          (position, index) =>
            position.title.toLowerCase() === this.editPositionData.title.toLowerCase() &&
            index !== positionIndex
        )
        if (existingPosition) {
          this.titleErrorMessage = 'Title already exists. Please use another title.'
          return
        }

        this.positions[positionIndex].title = this.editPositionData.title
        this.positions[positionIndex].short_title = this.editPositionData.short_title
        this.positions[positionIndex].job_description = this.editPositionData.job_description
        this.positions[positionIndex].date_updated = new Date()
      }

      try {
        await Promise.all([
          updatePosition(this.editPositionData.id, {
            title: this.editPositionData.title,
            short_title: this.editPositionData.short_title,
            job_description: this.editPositionData.job_description
          })
        ])

        await this.fetcPositions()
      } catch (error) {
        console.error(error)
      } finally {
        this.showEditDialog = false
        this.showPopupMessage('success', 'Updated', 'Position updated successfully.')
      }
    },
    async handleDeletePosition(positionId) {
      try {
        const positionToDelete = this.positions.find((position) => position._id === positionId)
        this.deletePositionData = {
          id: positionId,
          title: positionToDelete.title,
          short_title: positionToDelete.short_title,
          job_description: positionToDelete.job_description
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeletePosition() {
      try {
        await deletePosition(this.deletePositionData.id)
        this.positions = this.positions.filter(
          (position) => position._id !== this.deletePositionData.id
        )
        const successMessage = 'The position has been successfully deleted.'
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
