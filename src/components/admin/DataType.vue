<template>
  <div>
    <header class="header">
      <h1 class="dashboard-title">Data Subjects</h1>
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
        <v-btn @click="handleAddPosition" color="primary">Add Data Type</v-btn>
      </div>
      <table class="table">
        <thead style="font-size: 13px">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Short Title</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px">
          <template v-if="displayedType.length > 0">
            <tr v-for="position in displayedType" :key="position._id">
              <td>{{ position._id }}</td>
              <td>{{ position.title }}</td>
              <td>{{ position.description }}</td>
              <td>{{ formatDate(position.date_created) }}</td>
              <td>{{ formatDate(position.date_updated) }}</td>
              <td>
                <v-btn
                  size="small"
                  @click="handleEditType(position._id)"
                  color="secondary"
                  flat
                  class="mr-6"
                  >Edit</v-btn
                >
                <v-btn
                  size="small"
                  @click="handleDeleteType(position._id)"
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
              <td colspan="6" class="not-found">Not Data type found</td>
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
            <span class="headline">Add Data Type</span>
          </v-card-title>
          <v-card-text>
            <v-alert
              class="mb-4"
              type="info"
              color="#2196F3"
              theme="dark"
              icon="mdi-information"
              text="Please provide the necessary details for adding a new data type. The data type
              represents the specific category or classification of data."
              variant="tonal"
              prominent
            ></v-alert>
            <v-text-field
              v-model="newType.title"
              label="Title *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              hint="Enter the title for the data type"
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="newType.description"
              label="Short Title"
              variant="outlined"
              hint="Enter a short title (optional)"
              dense
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="addType">Create</v-btn>
            <v-btn @click="showAddDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="showDeleteConfirmation" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Delete Data Type</span>
          </v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete the following data type?</p>
            <p><strong>Title:</strong> {{ deleteTypeData.title }}</p>
            <p><strong>Short Title:</strong> {{ deleteTypeData.description }}</p>
            <v-alert class="mt-4" type="warning" variant="tonal" outlined dense>
              Deleting this data type will permanently remove all associated data and cannot be
              undone.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="confirmDeleteType">Continue</v-btn>
            <v-btn @click="showDeleteConfirmation = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="showEditDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Position</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editTypeData.title"
              label="Title *"
              variant="outlined"
              dense
              :error-messages="titleErrorMessage"
              required
            ></v-text-field>
            <v-text-field
              class="mt-4"
              v-model="editTypeData.description"
              label="Short Title"
              variant="outlined"
              dense
            ></v-text-field>
            <v-textarea
              class="mt-4"
              v-model="editTypeData.job_description"
              label="Short Title"
              variant="outlined"
              rows="5"
              row-height="50"
              dense
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveEditedType">Save</v-btn>
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
import { addType, getAllTypes, updateType, deleteType } from '../../apirequests/data_type'

export default {
  data() {
    return {
      search: '',
      types: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newType: {
        title: '',
        description: ''
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deleteTypeData: {
        id: null,
        title: '',
        description: ''
      },
      showEditDialog: false,
      editTypeData: {
        id: null,
        title: '',
        description: '',
        date_updated: null
      }
    }
  },
  computed: {
    filteredTypes() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.types.filter((type) => {
        return (
          type.title.toLowerCase().includes(searchTerm) ||
          type.description.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedType() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredTypes.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredTypes.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchTypes()
  },
  methods: {
    async fetchTypes() {
      try {
        this.isLoading = true
        const response = await getAllTypes()
        this.types = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    handleAddPosition() {
      this.newType.title = ''
      this.newType.description = ''
      this.titleErrorMessage = ''
      this.showAddDialog = true
    },
    async addType() {
      const titleExists = this.types.some((position) => position.title === this.newType.title)
      if (titleExists) {
        this.titleErrorMessage = 'Title already exists. Please use another title.'
        return
      }
      try {
        await addType(this.newType)

        this.showPopupMessage('success', 'Created', 'Data type added successfully.')

        this.fetchtypes()
      } catch (error) {
        console.error(error)
      } finally {
        this.showAddDialog = false
      }
    },
    async handleEditType(typeId) {
      const typeToEdit = this.types.find((type) => type._id === typeId)

      this.editTypeData = {
        id: typeId,
        title: typeToEdit.title,
        description: typeToEdit.description,
        job_description: typeToEdit.job_description,
        date_updated: typeToEdit.date_updated
      }

      this.showEditDialog = true
    },
    async saveEditedType() {
      const typeIndex = this.types.findIndex((type) => type._id === this.editTypeData.id)

      if (typeIndex !== -1) {
        const existingType = this.types.find(
          (type, index) =>
            type.title.toLowerCase() === this.editTypeData.title.toLowerCase() &&
            index !== typeIndex
        )
        if (existingType) {
          this.titleErrorMessage = 'Title already exists. Please use another title.'
          return
        }

        this.types[typeIndex].title = this.editTypeData.title
        this.types[typeIndex].description = this.editTypeData.description
        this.types[typeIndex].date_updated = new Date()
      }

      try {
        await Promise.all([
          updateType(this.editTypeData.id, {
            title: this.editTypeData.title,
            description: this.editTypeData.description
          })
        ])

        await this.fetchTypes()
      } catch (error) {
        console.error(error)
      } finally {
        this.showEditDialog = false
        this.showPopupMessage('success', 'Updated', 'Data type updated successfully.')
      }
    },
    async handleDeleteType(typeId) {
      try {
        const typeToDelete = this.types.find((type) => type._id === typeId)
        this.deleteTypeData = {
          id: typeId,
          title: typeToDelete.title,
          description: typeToDelete.description
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteType() {
      try {
        await deleteType(this.deleteTypeData.id)
        this.types = this.types.filter((type) => type._id !== this.deleteTypeData.id)
        const successMessage = 'The data type has been successfully deleted.'
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
