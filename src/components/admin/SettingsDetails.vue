<template>
  <div class="profile-settings">
    <h1 class="profile-settings-title">Profile Settings</h1>
    <v-card variant="flat" class="w-100">
      <div class="profile-settings-form">
        <div class="profile-avatar">
          <img :src="profile.avatar" alt="Profile Avatar">
        </div>
        <div class="profile-details">
          <div class="profile-name">
            <span v-if="!editing">{{ getFullName(profile) }}</span>
            <span v-else>
              <div class="d-flex">
                <v-text-field variant="outlined" density="compact" v-model="profile.firstname" required></v-text-field>
                <v-text-field class="ml-4" variant="outlined" density="compact" v-model="profile.middlename"
                  required></v-text-field>
                <v-text-field class="ml-4" variant="outlined" density="compact" v-model="profile.lastname"
                  required></v-text-field>
              </div>
            </span>
          </div>
          <div class="profile-role">
            <span v-if="!editing">{{ profile.role }}</span>
            <span v-else>
              <v-text-field variant="outlined" density="compact" v-model="profile.role" readonly required></v-text-field>
            </span>
          </div>
          <div class="profile-email">
            <span v-if="!editing"><b>Email:</b> {{ profile.email }}</span>
            <span v-else>
              <v-text-field variant="outlined" density="compact" v-model="profile.email" required></v-text-field>
            </span>
          </div>
          <div class="profile-number">
            <span v-if="!editing"><b>Contact:</b> {{ profile.phone }}</span>
            <span v-else>
              <v-text-field variant="outlined" density="compact" v-model="profile.phone" required></v-text-field>
            </span>
          </div>
          <div class="profile-address">
            <span v-if="!editing"><b>Address:</b> {{ profile.address }}</span>
            <span v-else>
              <v-text-field variant="outlined" density="compact" v-model="profile.address" required></v-text-field>
            </span>
          </div>
          <v-btn color="primary" size="small" @click="editing ? saveProfile() : toggleEdit()">
            {{ editing ? 'Save Profile' : 'Edit Profile' }}
          </v-btn>
        </div>
      </div>
    </v-card>
    <v-alert class="popup-message" v-if="showPopup" variant="tonal" :type="popupType" :title="popupTitle" :value="true"
      dismissible @input="hidePopupMessage">
      {{ popupMessage }}
    </v-alert>
  </div>
</template>

<script>
import { admin } from '../../dataUtils/userData'
export default {
  data() {
    return {
      editing: false,
      showPopup: false,
      popupType: '',
      popupTitle: '',
      popupMessage: '',
      profile: { ...admin[0] }
    }
  },
  methods: {
    getFullName(user) {
      return `${user.firstname} ${user.middlename} ${user.lastname}`;
    },
    saveProfile() {
      if (
        this.profile.firstname.trim() === '' ||
        this.profile.lastname.trim() === '' ||
        this.profile.email.trim() === '' ||
        this.profile.phone.trim() === '' ||
        this.profile.address.trim() === ''
      ) {
        const errorMessage = 'Please fill in all required fields.'
        this.showPopupMessage('error', 'Empty.', errorMessage)
      } else {
        const successMessage = 'The profile has been successfully updated.'
        this.showPopupMessage('success', 'Updated', successMessage)


        this.editing = false;
      }
    },
    toggleEdit() {
      this.editing = true;
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

.profile-details .profile-name {
  font-size: 28px;
}

.profile-settings-title {
  font-size: 24px;
}

.profile-settings-form {
  display: flex;
  margin-top: 30px;
  padding: 20px
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

.profile-role {
  color: #666;
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