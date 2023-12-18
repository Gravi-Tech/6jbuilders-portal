<template>
  <div class="d-flex">
    <div class="left">
      <v-container>
        <div class="align-center justify-center content">
          <div class="mb-6 txt">
            <h1 class="app-title">Welcome to 6J Builders Portal</h1>
            <p class="app-description">Register to get started</p>
          </div>
        </div>
      </v-container>
    </div>
    <div class="right">
      <div class="login-box">
        <v-img src="/images/logo.png" max-height="100" alt="Logo"></v-img>
        <div class="login-buttons">
          <v-card-title class="text-center">REGISTRATION</v-card-title>
          <v-card-text>
            <v-form v-model="form" style="width: 450px">
              <v-text-field
                density="compact"
                variant="outlined"
                label="First Name *"
                v-model="newUser.first_name"
                :rules="[required]"
                placeholder="Enter your first name"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                density="compact"
                variant="outlined"
                label="Middle Name (Optional)"
                v-model="newUser.middle_name"
                :rules="[required]"
                placeholder="Enter your middle name"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                density="compact"
                variant="outlined"
                label="Last Name *"
                v-model="newUser.last_name"
                :rules="[required]"
                placeholder="Enter your last name"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                density="compact"
                variant="outlined"
                label="Mobile Number *"
                v-model="newUser.mobile_number"
                :rules="[required]"
                placeholder="Enter your address"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                density="compact"
                variant="outlined"
                label="Email *"
                v-model="newUser.email"
                :rules="[required]"
                placeholder="Enter your email"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                density="compact"
                variant="outlined"
                label="Address (Optional)"
                v-model="newUser.address"
                placeholder="Enter your address"
                v-validate="'required'"
              ></v-text-field>
              <v-text-field
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                @click:append-inner="visible = !visible"
                v-model="newUser.password"
                :readonly="loading"
                :rules="[required, validatePassword]"
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
          <div class="justify-space-around">
            <v-btn color="primary" @click="RegisterAsUser" style="width: 300px" size="large"
              >Register</v-btn
            >
          </div>
          <span class="mt-5"
            >Already have an account?
            <v-btn variant="text" color="primary" size="small" @click="navTo('login')"
              >Login</v-btn
            ></span
          >
        </div>
        <v-btn class="mt-6" size="small" variant="outlined" @click="navTo('home')"
          >Back to Homepage</v-btn
        >
      </div>
    </div>
  </div>
  <v-snackbar v-model="isSnackbarVisible" :color="snackbarColor" :timeout="snackbarTimeout">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script>
import { defineComponent } from 'vue'
import { createUser } from '@/apirequests/users'

export default defineComponent({
  data() {
    return {
      errorMessage: null,
      form: {},
      loading: false,
      visible: false,
      isSnackbarVisible: false,
      snackbarColor: '',
      snackbarMessage: '',
      snackbarTimeout: 3000,
      newUser: {
        first_name: '',
        middle_name: '',
        last_name: '',
        mobile_number: '',
        password: '',
        address: '',
        email: ''
      }
    }
  },
  methods: {
    navTo(to) {
      this.$router.push({ name: to })
    },
    required(v) {
      return !!v || 'Field is required'
    },
    validatePassword(v) {
      if (!v) {
        return 'Field is required'
      }
      if (v.length < 6) {
        return 'Password should be at least 6 characters long'
      }
      if (!/[!@#$%^&*(),.?":{}|<>_]/.test(v)) {
        return 'Password should contain at least one special character'
      }
      return true
    },
    async RegisterAsUser() {
      try {
        await createUser(this.newUser)
        this.showSnackbar('success', 'User registered successfully.')
        this.resetAdminForm()
      } catch (error) {
        console.error(error)
        this.showSnackbar('error', 'Failed to register user.')
      }
    },
    showSnackbar(color, message) {
      this.snackbarColor = color
      this.snackbarMessage = message
      this.isSnackbarVisible = true
    },
    resetAdminForm() {
      this.newUser.first_name = ''
      this.newUser.middle_name = ''
      this.newUser.last_name = ''
      this.newUser.email = ''
      this.newUser.mobile_number = ''
      this.newUser.password = ''
      this.newUser.address = ''
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
  height: 120vh;
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
