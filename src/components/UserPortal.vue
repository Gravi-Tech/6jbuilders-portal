<template>
  <div class="d-flex">
    <div class="left">
      <v-container>
        <div class="align-center justify-center content">
          <div class="mb-6 txt">
            <h1 class="app-title">Welcome to 6J Builders Portal</h1>
            <p class="app-description">Login to get started</p>
          </div>
        </div>
      </v-container>
    </div>
    <div class="right">
      <div class="login-box">
        <v-img src="/images/logo.png" max-height="100" alt="Logo"></v-img>
        <div class="login-buttons">
          <v-card-title class="text-center">USER PORTAL</v-card-title>
          <v-card-text>
            <v-form v-model="form" style="width: 450px">
              <v-text-field
                density="compact"
                prepend-inner-icon="mdi-account-box-outline"
                variant="outlined"
                label="Mobile Number"
                v-model="userNumber"
                :readonly="loading"
                :rules="[required]"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-lock-outline"
                @click:append-inner="visible = !visible"
                v-model="userPassword"
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
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-space-around">
            <v-btn
              color="success"
              variant="tonal"
              :loading="loading"
              @click="loginAsUser"
              style="width: 300px"
              size="large"
              >Sign In</v-btn
            >
          </v-card-actions>
          <v-btn
            v-if="!showAdminPortal"
            variant="text"
            color="primary"
            size="small"
            @click="showAdminModal = true"
          >
            <span>Admin Login</span>
          </v-btn>

          <span class="mt-5"
            >Doesn't have account?
            <v-btn variant="text" color="primary" size="small" @click="navTo('register')">
              Register</v-btn
            ></span
          >
        </div>
        <v-btn class="mt-6" size="small" variant="outlined" @click="navTo('home')"
          >Back to Homepage</v-btn
        >
        <v-dialog persistent v-model="showAdminModal" max-width="600">
          <v-card class="card-dialog">
            <v-card-title class="text-center">ADMIN PORTAL</v-card-title>
            <v-card-text>
              <v-form v-model="form" @submit.prevent="onSubmit">
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
                  hint="Enter your password to access this website"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-space-around">
              <v-btn text @click="showAdminModal = false">Cancel</v-btn>
              <v-btn color="success" variant="tonal" :loading="loading" @click="loginAsAdmin"
                >Sign In</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
  <v-snackbar v-model="isSnackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import { login } from '@/apirequests/admin'
import { userLogin } from '@/apirequests/users'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  data() {
    return {
      showAdminPortal: false,
      showAdminModal: false,
      isSnackbarVisible: false,
      snackbarColor: '',
      snackbarMessage: '',
      snackbarTimeout: 3000,
      errorMessage: null,
      userNumber: null,
      userPassword: null,
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
    showSnackbar(color, message) {
      this.snackbarColor = color
      this.snackbarMessage = message
      this.isSnackbarVisible = true
    },
    async loginAsUser() {
      try {
        const response = await userLogin(this.userNumber, this.userPassword)
        const id = response.id
        sessionStorage.setItem('userId', id)
        this.showSnackbar('success', 'Login successfully.')
        setTimeout(() => {
          this.$router.push('/6jbuilders')
        }, 3000)
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Invalid Credentials'
        } else {
          this.errorMessage = 'An error occurred. Please try again.'
        }
      }
    },
    async loginAsAdmin() {
      try {
        const response = await login(this.adminId, this.adminPassword)
        const accessToken = response.accessToken
        const id = response.id

        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        const adminStore = useAuthStore()
        adminStore.setAdminId(id)
        adminStore.setAccessToken(accessToken)

        sessionStorage.setItem('accessToken', accessToken)
        sessionStorage.setItem('adminId', id)

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
    }
    // initiatePasswordRecovery() {
    //   this.$router.push('/6jbuilders/password-recovery')
    // }
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
