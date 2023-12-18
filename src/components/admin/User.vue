<template>
  <div>
    <header class="header">
      <h1 class="dashboard-title">Users</h1>
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
        <v-btn @click="handleAdduser" color="primary">Add user </v-btn>
      </div>
      <table class="table">
        <thead style="font-size: 13px">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style="font-size: 13px">
          <template v-if="displayedUsers.length > 0">
            <tr v-for="user in displayedUsers" :key="user._id">
              <td>{{ user._id }}</td>
              <td>{{ user.first_name }}</td>
              <td>{{ user.middle_name }}</td>
              <td>{{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.mobile_number }}</td>
              <td>{{ user.address }}</td>
              <td>{{ user.status }}</td>
              <td>{{ formatDate(user.created_date) }}</td>
              <td>{{ formatDate(user.updated_date) }}</td>
              <td>
                <v-btn
                  size="small"
                  @click="handleEdituser(user._id)"
                  color="secondary"
                  flat
                  class="mr-6"
                  >Edit</v-btn
                >
                <v-btn
                  size="small"
                  @click="handledeleteUser(user._id)"
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
              <td colspan="6" class="not-found">No user found</td>
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
          <span class="headline">Add User</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newUser.first_name"
            label="First name *"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.middle_name"
            label="Middle name (Optional)"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.last_name"
            label="Last name *"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newUser.address"
            label="Address *"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newUser.email"
            label="Email *"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newUser.mobile_number"
            label="Mobile Number *"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="newUser.password"
            label="Password *"
            variant="outlined"
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="createUser">Add</v-btn>
          <v-btn @click="this.showAddDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDeleteConfirmation" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Delete User</span>
        </v-card-title>
        <v-card-text>
          <p>Are you sure you want to delete the following user's information?</p>
          <p><strong>First Name:</strong> {{ deleteUserData.first_name }}</p>
          <p><strong>Middle Name:</strong> {{ deleteUserData.middle_name }}</p>
          <p><strong>Last Name:</strong> {{ deleteUserData.last_name }}</p>
          <p><strong>Mobile Number:</strong> {{ deleteUserData.mobile_number }}</p>
          <p><strong>Address:</strong> {{ deleteUserData.address }}</p>
          <p><strong>email:</strong> {{ deleteUserData.email }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmDeleteUser">Continue</v-btn>
          <v-btn @click="this.showDeleteConfirmation = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit User</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editUserData.first_name"
            label="first_name"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-text-field
            v-model="editUserData.middle_name"
            label="first_name"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-text-field
            v-model="editUserData.last_name"
            label="first_name"
            variant="outlined"
            dense
            :error-messages="titleErrorMessage"
            required
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="editUserData.address"
            label="Home Address"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="editUserData.mobile_number"
            label="mobile_number Number"
            variant="outlined"
            dense
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="editUserData.email"
            label="email (mos)"
            variant="outlined"
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEditeduser">Save</v-btn>
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
import { createUser, getAllUsers, updateUser, deleteUser } from '../../apirequests/users'
import { getAllPositions } from '../../apirequests/position'

export default {
  data() {
    return {
      search: '',
      users: [],
      itemsPerPage: 10,
      currentPage: 1,
      options: [10, 20, 50, 100],
      isLoading: true,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      showAddDialog: false,
      newUser: {
        first_name: '',
        mobile_number: '',
        address: '',
        email: '',
        updated_date: null
      },
      titleErrorMessage: '',
      showDeleteConfirmation: false,
      deleteUserData: {
        first_name: '',
        position: '',
        mobile_number: '',
        address: ''
      },
      showEditDialog: false,
      editUserData: {
        first_name: '',
        position: '',
        mobile_number: '',
        address: '',
        updated_date: null
      }
    }
  },
  computed: {
    filteredUsers() {
      const searchTerm = this.search.toLowerCase().trim()
      return this.users.filter((user) => {
        return (
          user.first_name.toLowerCase().includes(searchTerm) ||
          user.last_name.toLowerCase().includes(searchTerm) ||
          user.address.toLowerCase().includes(searchTerm) ||
          user.mobile_number.toLowerCase().includes(searchTerm) ||
          user._id.toLowerCase().includes(searchTerm)
        )
      })
    },
    displayedUsers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredUsers.slice(startIndex, endIndex)
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage)
    }
  },
  mounted() {
    this.fetchusers()
    this.Positions()
  },
  methods: {
    async fetchusers() {
      try {
        this.isLoading = true
        // await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
        const response = await getAllUsers()
        this.users = response.data
      } catch (error) {
        console.error(error)
        // Handle error
      } finally {
        this.isLoading = false
      }
    },
    async Positions() {
      try {
        const response = await getAllPositions()
        this.positionOptions = response.data
      } catch (error) {
        console.error(error)
      }
    },
    handleAdduser() {
      this.newUser.first_name = ''
      this.newUser.address = ''
      this.newUser.mobile_number = ''
      this.newUser.email = ''
      this.titleErrorMessage = ''

      this.showAddDialog = true
    },
    async createUser() {
      const titleExists = this.users.some((user) => user.first_name === this.newUser.first_name)
      if (titleExists) {
        this.titleErrorMessage = 'Title already exists. Please use another title.'
        return
      }
      try {
        await createUser(this.newUser)

        this.showPopupMessage('success', 'Created', 'A new user added successfully.')

        this.fetchusers()
      } catch (error) {
        console.error(error)
      } finally {
        this.showAddDialog = false
      }
    },
    async handleEdituser(userId) {
      const userToEdit = this.users.find((user) => user._id === userId)

      this.editUserData = {
        id: userId,
        first_name: userToEdit.first_name,
        position: userToEdit.position,
        address: userToEdit.address,
        mobile_number: userToEdit.mobile_number,
        email: userToEdit.email,
        created_date: userToEdit.created_date,
        updated_date: userToEdit.updated_date
      }

      this.showEditDialog = true
    },
    async saveEditeduser() {
      const userIndex = this.users.findIndex((user) => user._id === this.editUserData.id)

      if (userIndex !== -1) {
        const existinguser = this.users.find(
          (user, index) =>
            user.first_name.toLowerCase() === this.editUserData.first_name.toLowerCase() &&
            index !== userIndex
        )
        if (existinguser) {
          this.titleErrorMessage = 'user already exists. Please input other name.'
          return
        }

        this.users[userIndex].first_name = this.editUserData.first_name
        this.users[userIndex].middle_name = this.editUserData.middle_name
        this.users[userIndex].last_name = this.editUserData.last_name
        this.users[userIndex].mobile_number = this.editUserData.mobile_number
        this.users[userIndex].address = this.editUserData.address
        this.users[userIndex].email = this.editUserData.email
        this.users[userIndex].updatedDate = new Date()
      }

      try {
        await Promise.all([
          updateUser(this.editUserData.id, {
            first_name: this.editUserData.first_name,
            middle_name: this.editUserData.middle_name,
            last_name: this.editUserData.last_name,
            address: this.editUserData.address,
            mobile_number: this.editUserData.mobile_number,
            email: this.editUserData.email
          })
        ])

        await this.fetchusers()
      } catch (error) {
        console.error(error)
      } finally {
        this.showEditDialog = false
        this.showPopupMessage('success', 'Updated', 'A user updated successfully.')
      }
    },
    async handledeleteUser(userId) {
      try {
        const userToDelete = this.users.find((user) => user._id === userId)
        this.deleteUserData = {
          id: userId,
          first_name: userToDelete.first_name,
          position: userToDelete.position,
          mobile_number: userToDelete.mobile_number,
          address: userToDelete.address,
          email: userToDelete.email
        }
        this.showDeleteConfirmation = true
      } catch (error) {
        console.error(error)
      }
    },
    async confirmDeleteUser() {
      try {
        await deleteUser(this.deleteUserData.id)
        this.users = this.users.filter((user) => user._id !== this.deleteUserData.id)
        const successMessage = 'A user has been successfully deleted.'
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
