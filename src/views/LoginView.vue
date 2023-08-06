<template>
    <div class="login-container">
        <div class="login-box">
            <h1 class="app-title">6 JBUILDERS PORTAL</h1>
            <p class="app-description">Log in to get started</p>

            <div class="login-buttons">
                <vue3-google-login client-id="94901716497-5e4cor5er6mbn82s8lv7vtup83hfrv0i.apps.googleusercontent.com"
                    @login-success="onLoginSuccess" @login-error="onLoginError">
                    <v-btn block rounded="sm" size="x-large" class="google-login-button">
                        <img src="../assets/google-icon.png" alt="Google Logo" />
                        <span>Log in with Google</span>
                    </v-btn>
                </vue3-google-login>
                <span>or</span>
                <v-facebook-login app-id="" variant="text" class="facebook-login-button"
                    @login-success="onLoginSuccess" @login-error="onLoginError" @click="onFacebookLogin">
                    <span>Log in with Facebook</span>
                </v-facebook-login>
                <v-btn v-if="!showAdminPortal" variant="text" size="x-small" color="primary" @click="showAdminModal = true">
                    <span>Admin?</span>
                </v-btn>
            </div>
        </div>
    </div>

    <div v-if="showAdminModal" class="admin-modal">
        <div class="modal-content">
            <h2 class="app-title">ADMIN PORTAL</h2>
            <v-form v-model="form" @submit.prevent="onSubmit">
                <v-text-field label="Admin ID" v-model="adminId" :readonly="loading" :rules="[required]" clearable
                    placeholder="Enter Admin ID" variant="outlined" v-validate="'required'"></v-text-field>
                <v-text-field v-model="adminPassword" :readonly="loading" :rules="[required]" clearable label="Password"
                    type="password" v-validate="'required'"></v-text-field>

                <div class="modal-buttons">
                    <v-btn variant="text" @click="showAdminModal = false">Go Back</v-btn>
                    <v-btn :loading="loading" @click="loginAsAdmin">Sign In</v-btn>
                </div>
            </v-form>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { required } from 'vuelidate';
// import VFacebookLogin from 'vue-facebook-login-component';
import { Vue3GoogleLogin } from 'vue3-google-login';
export default defineComponent({
    components: {
        Vue3GoogleLogin,
        VFacebookLogin
    },
    data() {
        return {
            showAdminPortal: false,
            showAdminModal: false,
            adminId: null,
            adminPassword: null,
            form: false,
            loading: false,
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

.admin-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 400px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}
</style>
