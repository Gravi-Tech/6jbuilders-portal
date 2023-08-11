<template>
    <div class="login-container">
        <div class="login-box">
            <h1 class="app-title">6 JBUILDERS PORTAL</h1>
            <p class="app-description">Log in to get started</p>

            <div class="login-buttons">
                <vue3-google-login client-id="94901716497-5e4cor5er6mbn82s8lv7vtup83hfrv0i.apps.googleusercontent.com"
                    @login-success="onLoginSuccess" @login-error="onLoginError">
                    <v-btn block rounded="sm" size="x-large" class="google-login-button">
                        <img src="../assets/images/google-icon.png" alt="Google Logo" />
                        <span>Log in with Google</span>
                    </v-btn>
                </vue3-google-login>
                <span>or</span>
                <v-facebook-login app-id="" variant="text" class="facebook-login-button" @login-success="onLoginSuccess"
                    @login-error="onLoginError" @click="onFacebookLogin">
                    <span>Log in with Facebook</span>
                </v-facebook-login>
                <v-btn v-if="!showAdminPortal" variant="text" size="x-small" color="success" @click="showAdminModal = true">
                    <span>Admin?</span>
                </v-btn>
            </div>
        </div>
    </div>

    <v-dialog v-model="showAdminModal" max-width="400">
        <v-card>
            <v-card-title class="text-center">ADMIN PORTAL</v-card-title>
            <v-card-text>
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <v-text-field density="compact" prepend-inner-icon="mdi-account-box-outline" variant="outlined"
                        label="Admin ID" v-model="adminId" :readonly="loading" :rules="[required]" clearable
                        placeholder="Enter Admin ID" v-validate="'required'"></v-text-field>
                    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-end">
                        <router-link to="/6jbuilders/password-recovery" class="text-caption text-decoration-none text-blue"
                            @click="initiatePasswordRecovery">
                            Forgot password?
                        </router-link>
                    </div>
                    <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'" variant="outlined" density="compact"
                        placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline"
                        @click:append-inner="visible = !visible" v-model="adminPassword" :readonly="loading"
                        :rules="[required]" clearable label="Password" type="password"
                        v-validate="'required'"></v-text-field>
                    <v-card class="mb-12" color="surface-variant" variant="tonal">
                        <v-card-text class="text-medium-emphasis text-caption">
                            Warning: After 3 consecutive failed login attempts, your account will be temporarily locked for
                            three hours.
                            If you must login now, you can also click "Forgot login password?" below to reset the login
                            password.
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-space-around">
                <v-btn text @click="showAdminModal = false">Go Back</v-btn>
                <v-btn color="success" variant="tonal" :loading="loading" @click="loginAsAdmin">Sign In</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { required } from 'vuelidate';
// import VFacebookLogin from 'vue-facebook-login-component';
// import { Vue3GoogleLogin } from 'vue3-google-login';
export default defineComponent({
    components: {
        // Vue3GoogleLogin,
        // VFacebookLogin
    },
    data() {
        return {
            showAdminPortal: false,
            showAdminModal: false,
            adminId: null,
            adminPassword: null,
            form: {},
            loading: false,
            visible: false,
        };
    },
    methods: {
        onLoginSuccess(response) {
            console.log("Logged in with:", response);
        },
        onLoginError(error) {
            // Handle login error
            console.error("Login error:", error);
        },
        onFacebookLogin() {
            // Handle Facebook login
            console.log("Logged in with Facebook");
        },
        loginAsAdmin() {
            // Handle admin login logic here
            const id = this.adminId;
            const password = this.adminPassword;
            console.log("Logging in as Admin:", id, password);
            // Close the modal after logging in
            this.showAdminModal = false;

        },
        async onFacebookLogin(response) {
            try {
                const fbResponse = await this.$facebook.login();
                if (fbResponse.authResponse) {
                    console.log("Logged in with Facebook:", fbResponse);
                    // Handle here
                } else {
                    console.error("Facebook login failed:", fbResponse);
                }
            } catch (error) {
                console.error("Facebook login error:", error);
            }
        },
        required(v) {
            return !!v || 'Field is required'
        },
        initiatePasswordRecovery() {
            this.$router.push('/6jbuilders/password-recovery');
        },
    },
});
</script>
  
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-box {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 400px;
    margin: 50px;
}

.app-title {
    font-size: 24px;
    margin-bottom: 10px;
}

.app-description {
    color: #808080;
    margin-bottom: 30px;
}

.login-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.google-login-button,
.facebook-login-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    margin: 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.3s, color 0.3s;
    width: 100%;
}

.google-login-button img,
.facebook-login-button img {
    width: 56px;
    height: 56px;
    margin-right: 10px;
}

.google-login-button {
    background-color: #ffffff;
    color: #000;
}

.facebook-login-button {
    color: #0961b9;
    font-size: 12px !important;
}
</style>
