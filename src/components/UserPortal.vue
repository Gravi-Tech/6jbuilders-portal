<template>
  <div class="d-flex">
    <div class="left">
      <v-container>
        <div class="align-center justify-center content">
          <div class="mb-6 txt">
            <h1 class="app-title">Welcome to 6J Builders Portal</h1>
            <p class="app-description">Log in to get started</p>
          </div>
        </div>
      </v-container>
    </div>
    <div class="right">
      <div class="login-box">
        <v-img src="/src/assets/logo.png" max-height="100" alt="Logo"></v-img>
        <div class="login-buttons">
          <v-card-title class="text-center">ADMIN PORTAL</v-card-title>
          <v-card-text>
            <v-form v-model="form">
              <v-text-field
                density="compact"
                prepend-inner-icon="mdi-account-box-outline"
                variant="outlined"
                label="Admin ID"
                v-model="adminId"
                :readonly="loading"
                :rules="[required]"
                placeholder="Enter Admin ID"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-outline"
                @click:append-inner="visible = !visible"
                v-model="adminPassword"
                :readonly="loading"
                :rules="[required]"
                label="Password"
                type="password"
                v-validate="'required'"
              >
              </v-text-field>
              <div class="errorMessage" v-if="errorMessage">
                <p>{{ errorMessage }}</p>
              </div>
              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center mb-1">
                <router-link
                  to="/6jbuilders/password-recovery"
                  class="text-caption text-decoration-none text-blue"
                  @click="initiatePasswordRecovery"
                >
                  Forgot password?
                </router-link>
              </div>
              <v-card class="mb-12" color="surface-variant" variant="tonal">
                <v-card-text class="text-medium-emphasis text-caption">
                  Warning: After 3 consecutive failed login attempts, your account will be
                  temporarily locked for three hours. If you must login now, you can also click
                  "Forgot login password?" below to reset the login password.
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-space-around">
            <v-btn color="success" variant="tonal" :loading="loading" @click="handleLogin"
              >Sign In</v-btn
            >
          </v-card-actions>
          <v-btn class="mt-6" size="small" variant="outlined" @click="navTo('home')"
            >Back to Homepage</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import { login } from '@/apirequests/admin'

export default defineComponent({
  data() {
    return {
      showAdminPortal: false,
      showAdminModal: false,
      errorMessage: null,
      adminId: null,
      adminPassword: null,
      form: {},
      loading: false,
      visible: false,
      userData: {
        avatar: '',
        fullName: '',
        email: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await login(this.adminId, this.adminPassword)

        const accessToken = response.accessToken
        const id = response.id

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('id', id)
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        this.$router.push('/6jbuilders/admin/dashboard')
      } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid Credentials'
        } else {
          this.errorMessage = 'An error occurred. Please try again.'
        }
      }
    },
    navTo(to) {
      this.$router.push({ name: to })
    },
    required(v) {
      return !!v || 'Field is required'
    },
    initiatePasswordRecovery() {
      this.$router.push('/6jbuilders/password-recovery')
    }
  }
})
</script>

<style scoped>
.left {
  background-color: #3e9af0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  object-fit: cover;
  flex: 1;
  overflow: hidden;
  width: 800px;
}

.errorMessage {
  color: white;
  background-color: red;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  background-color: #ffffff;
  text-align: center;
}

.card-dialog {
  padding: 20px;
}

.app-title {
  font-size: 36px;
  font-weight: 700;
}

.app-description {
  color: #ffffff;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 18px;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
}
</style>
