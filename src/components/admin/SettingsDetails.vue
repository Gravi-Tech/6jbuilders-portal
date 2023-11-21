<template>
  <div class="profile-settings">
    <h1 class="profile-settings-title">Profile Settings</h1>
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
                  v-model="admin.accountNumber"
                  readonly
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
            <!-- <v-btn color="primary" variant="flat">Update Password</v-btn> -->
            <v-btn color="primary" variant="flat" @click="editing ? saveProfile() : toggleEdit()">
              {{ editing ? 'Save Profile' : 'Edit Profile' }}
            </v-btn>
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
  </div>
</template>

<script>
import { getAdmin, updateAdmin, checkAccountNumber } from '../../apirequests/admin'

export default {
  data() {
    return {
      editing: false,
      showPopup: false,
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
      }
    }
  },
  created() {
    this.fetchAdminData()
  },
  methods: {
    async fetchAdminData() {
      try {
        const adminId = localStorage.getItem('id')
        const adminData = await getAdmin(adminId)
        this.admin = adminData.data
        this.loading = false
      } catch (error) {
        console.error(error)
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
        const adminId = localStorage.getItem('id')
        checkAccountNumber(this.admin.accountNumber)
          .then((response) => {
            if (response.exists) {
              this.titleErrorMessage = 'Account number is already exists.'
              return
            } else {
              this.admin.update_date = new Date()
              updateAdmin(adminId, this.admin)
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

.profile-settings {
  align-items: center;
  margin-top: 50px;
}

.profile-details {
  max-width: 500px;
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
