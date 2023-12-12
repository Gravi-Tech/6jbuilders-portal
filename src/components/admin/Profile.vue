<template>
  <div class="profile-settings">
    <div class="header">
      <h1 class="profile-settings-title">Account Settings</h1>
      <div>
        <v-row justify="space-around">
          <v-col cols="auto">
            <v-dialog persistent transition="dialog-top-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn variant="flat" color="grey" v-bind="props">change password</v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-card-title>Update Password</v-card-title>
                  <v-card-text class="pa-12">
                    <v-text-field
                      v-model="currentPassword"
                      label="Current Password"
                      variant="outlined"
                      :type="showPassword ? 'text' : 'password'"
                    ></v-text-field>
                    <v-text-field
                      v-model="newPassword"
                      label="New Password"
                      variant="outlined"
                      :type="showPassword ? 'text' : 'password'"
                    ></v-text-field>
                    <v-text-field
                      v-model="verifyPassword"
                      label="Verify New Password"
                      variant="outlined"
                      :error-messages="titleErrorMessage"
                      :type="showPassword ? 'text' : 'password'"
                    ></v-text-field>
                    <v-checkbox
                      v-model="showPassword"
                      label="Show Password"
                      color="primary"
                    ></v-checkbox>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
                    <v-btn variant="text" color="primary" @click="handleUpdatePassword"
                      >Update</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
          <!-- <v-col v-if="admin.role === 'superadmin'" cols="auto">
            <v-dialog persistent transition="dialog-top-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn variant="flat" color="primary" v-bind="props" @click="addAdmin"
                  >Add Admin</v-btn
                >
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-container>
                    <v-card-title>Add admin</v-card-title>
                    <v-card-text class="pa-12">
                      <div class="d-flex-1">
                        <v-select
                          v-model="newAdmin.role"
                          :items="roleOptions"
                          label="Set Role *"
                          variant="outlined"
                          density="compact"
                        ></v-select>
                        <v-text-field
                          label="First Name *"
                          variant="outlined"
                          density="compact"
                          v-model="newAdmin.firstname"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Middle Name (Optional)"
                          variant="outlined"
                          density="compact"
                          v-model="newAdmin.middlename"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Last Name *"
                          variant="outlined"
                          density="compact"
                          v-model="newAdmin.lastname"
                          required
                        >
                        </v-text-field>
                        <v-text-field
                          label="Email Address *"
                          variant="outlined"
                          density="compact"
                          v-model="newAdmin.email"
                          required
                        >
                        </v-text-field>
                        <v-text-field
                          label="Home Address *"
                          variant="outlined"
                          density="compact"
                          v-model="newAdmin.address"
                          required
                        >
                        </v-text-field>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn variant="text" @click="isActive.value = false">Close</v-btn>
                      <v-btn variant="text" color="primary" @click="addAdmin">Add</v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card>
              </template>
            </v-dialog>
          </v-col> -->
        </v-row>
      </div>
    </div>
    <v-card variant="flat" class="w-100">
      <div class="profile-settings-form">
        <div class="profile-avatar">
          <v-list-item-avatar>
            <v-avatar :size="100" :color="getAvatarColor(admin.firstname)">
              <span class="white--text">{{ getInitials(admin.firstname) }}</span>
            </v-avatar>
          </v-list-item-avatar>
        </div>
        <div class="profile-details">
          <span v-if="editing">Note: with "*" is required feilds</span>
          <div class="profile__group mt-4">
            <div class="detail">
              <span v-if="!editing" class="profile-adnum">{{ admin.accountNumber }}</span>
              <span v-else>
                <v-text-field
                  label="Account Number *"
                  variant="outlined"
                  density="compact"
                  :value ="admin.accountNumber"
                  :readonly="this.admin.role !== 'superadmin'"
                ></v-text-field>
              </span>
            </div>
            <div class="detail">
              <v-chip variant="outlined" color="primary">{{ admin.role }}</v-chip>
              <v-chip variant="outlined" color="success">{{ admin.status }}</v-chip>
            </div>
          </div>
          <div class="profile-name">
            <span v-if="!editing">{{ getFullName(admin) }}</span>
            <span v-else>
              <div class="d-flex">
                <v-text-field
                  label="First Name *"
                  variant="outlined"
                  density="compact"
                  v-model="admin.firstname"
                  required
                ></v-text-field>
                <v-text-field
                  label="Middle Name (Optional)"
                  class="ml-4"
                  variant="outlined"
                  density="compact"
                  v-model="admin.middlename"
                  required
                ></v-text-field>
                <v-text-field
                  label="Last Name *"
                  class="ml-4"
                  variant="outlined"
                  density="compact"
                  v-model="admin.lastname"
                  required
                ></v-text-field>
              </div>
            </span>
          </div>
          <div class="profile-email">
            <span v-if="!editing"><b>Email:</b> {{ admin.email }}</span>
            <span v-else>
              <v-text-field
                label="Email *"
                variant="outlined"
                density="compact"
                v-model="admin.email"
                required
              ></v-text-field>
            </span>
          </div>
          <div class="profile-number">
            <span v-if="!editing"><b>Contact:</b> {{ admin.phone }}</span>
            <span v-else>
              <v-text-field
                label="Contact *"
                variant="outlined"
                density="compact"
                v-model="admin.phone"
                required
              ></v-text-field>
            </span>
          </div>
          <div class="profile-address">
            <span v-if="!editing"><b>Address:</b> {{ admin.address }}</span>
            <span v-else>
              <v-text-field
                label="Address *"
                variant="outlined"
                density="compact"
                v-model="admin.address"
                required
              ></v-text-field>
            </span>
          </div>

          <div class="actions">
            <v-btn color="primary" variant="flat" @click="editing ? saveProfile() : toggleEdit()">
              {{ editing ? 'Save Profile' : 'Edit Profile' }}
            </v-btn>
            <v-btn v-if="editing" color="red" variant="outlined" @click="cancelEdit">cancel</v-btn>
          </div>
        </div>
      </div>
    </v-card>

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
    <v-snackbar v-model="snackbar">{{ snackbarMessage }}</v-snackbar>
  </div>
</template>

<script>
import {
  addAdmin,
  getAdmin,
  updateAdmin,
  checkAccountNumber,
  updatePassword
} from '../../apirequests/admin'

export default {
  data() {
    return {
      editing: false,
      snackbar: false,
      showPopup: false,
      adminAdded: false,
      snackbarMessage: '',
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      admin: {
        id: null,
        accountNumber: '',
        role: '',
        status: '',
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        update_date: null
      },
      oldEmail: '',
      currentPassword: '',
      newPassword: '',
      verifyPassword: '',
      showPassword: false,
      titleErrorMessage: '',
      // newAdmin: {
      //   role: 'admin',
      //   status: '',
      //   firstname: '',
      //   middlename: '',
      //   lastname: '',
      //   email: '',
      //   phone: '',
      //   address: '',
      //   update_date: null
      // },
      // roleOptions: ['superadmin', 'admin']
    }
  },
  created() {
    this.fetchAdminData()
  },
  methods: {
    async fetchAdminData() {
      try {
        const adminId = sessionStorage.getItem('adminId')
        const adminData = await getAdmin(adminId)
        this.admin = adminData.data
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    async handleUpdatePassword() {
      if (this.newPassword !== this.verifyPassword) {
        this.titleErrorMessage = 'New password and verify password do not match'
        return
      }

      try {
        const adminId = sessionStorage.getItem('adminId')
        await updatePassword(adminId, this.currentPassword, this.newPassword)
        this.snackbarMessage = 'The password has been successfully updated.'
        this.snackbar = true
        this.currentPassword = ''
        this.newPassword = ''
        this.verifyPassword = ''
        this.fetchAdminData()
        this.isActive.value = false
      } catch (error) {
        this.snackbarMessage = 'Invalid current account.'
        this.snackbar = true
      }
    },
    getFullName(admin) {
      let fullName = ''
      if (admin.firstname) {
        fullName += admin.firstname
      }
      if (admin.middlename) {
        fullName += ' ' + admin.middlename
      }
      if (admin.lastname) {
        fullName += ' ' + admin.lastname
      }
      return fullName.trim()
    },
    // async addAdmin() {
    //   if (this.admin.role === 'superadmin') {
    //     try {
    //       const response = await addAdmin(this.newAdmin)

    //       console.log("admin data:", response)

    //       if (response && response.error === true) {
    //         this.adminAdded = true
    //         this.showPopupMessage('success', 'Admin Added', 'Admin has been added successfully.')

    //         this.resetAdminForm()
    //       } else {
    //         this.adminAdded = false
    //         this.showPopupMessage('error', 'Error', 'Failed to add admin. Please try again.')
    //       }
    //     } catch (error) {
    //       this.adminAdded = false
    //       this.showPopupMessage('error', 'Error', 'Failed to add admin. Please try again.')
    //     }
    //   } else {
    //     this.showPopupMessage(
    //       'error',
    //       'Permission Denied',
    //       'You do not have permission to add an admin.'
    //     )
    //   }
    // },
    // resetAdminForm() {
    //   this.newAdmin.firstname = ''
    //   this.newAdmin.middlename = ''
    //   this.newAdmin.lastname = ''
    //   this.newAdmin.role = 'admin'
    //   this.newAdmin.email = ''
    //   this.newAdmin.phone = ''
    //   this.newAdmin.address = ''
    // },
    saveProfile() {
      if (
        this.admin.firstname.trim() === '' ||
        this.admin.lastname.trim() === '' ||
        this.admin.email.trim() === '' ||
        this.admin.phone.trim() === '' ||
        this.admin.address.trim() === '' ||
        this.admin.accountNumber.trim() === ''
      ) {
        const errorMessage = 'Please fill in all required fields.'
        this.showPopupMessage('error', 'Empty.', errorMessage)
      } else {
        const adminId = sessionStorage.getItem('adminId')
        checkAccountNumber(this.admin.accountNumber)
          .then((response) => {
            if (response.exists) {
              this.titleErrorMessage = 'Account number is already exists.'
              return
            } else {
              this.admin.update_date = new Date()
              updateAdmin(adminId, { ...this.admin, oldEmail: this.oldEmail })
                .then((response) => {
                  const successMessage = 'The profile has been successfully updated.'
                  this.showPopupMessage('success', 'Updated', successMessage)
                  this.editing = false
                  console.log(response)
                })
                .catch((error) => {
                  console.error('Failed to update admin profile:', error)
                })
            }
          })
          .catch((error) => {
            console.error('Failed to check account number uniqueness:', error)
          })
      }
    },
    getInitials(firstname) {
      return firstname ? firstname.charAt(0).toUpperCase() : ''
    },
    getAvatarColor(firstname) {
      const colors = ['blue', 'green', 'red', 'orange', 'purple']
      const index = firstname ? firstname.charCodeAt(0) % colors.length : 0
      return colors[index]
    },
    toggleEdit() {
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
      this.fetchAdminData()
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
.v-text-field {
  width: 300px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.profile-settings {
  align-items: center;
  margin-top: 50px;
}

.profile-details {
  max-width: 700px;
  width: 100%;
}
.profile-details .profile-name {
  font-size: 28px;
}

.profile-settings-title {
  font-size: 24px;
}

.profile-settings-form {
  display: flex;
  margin-top: 30px;
  padding: 20px;
  align-items: center;
}

.profile-avatar {
  margin-right: 30px;
}

.profile-avatar img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
}

.profile-email,
.profile-number,
.profile-address {
  margin-top: 5px;
  margin-bottom: 10px;
}

.profile-role,
.profile-adnum {
  color: #a8a8a8;
}

.profile__group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detail .v-chip {
  margin-left: 10px;
}

.actions .v-btn {
  width: 200px;
  margin-right: 14px;
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

.white--text {
  font-size: 54px;
}
</style>
