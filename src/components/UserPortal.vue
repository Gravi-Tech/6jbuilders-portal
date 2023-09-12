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
                    <v-btn block rounded="sm" size="x-large" class="google-login-button" @click="login">
                        <img src="../assets/images/google-icon.png" alt="Google Logo" />
                        <span>Log in with Google</span>
                    </v-btn>
                    <span>or</span>
                    <v-facebook-login app-id="" variant="text" class="facebook-login-button" @click="onFacebookLogin">
                        <span>Log in with Facebook</span>
                    </v-facebook-login>
                    <v-btn v-if="!showAdminPortal" variant="text" size="x-small" color="success"
                        @click="showAdminModal = true">
                        <span>Admin?</span>
                    </v-btn>
                    <v-btn class="mt-6" size="small" variant="outlined" @click="navTo('home')">Back to Homepage</v-btn>
                </div>
            </div>
        </div>
    </div>

    <v-dialog v-model="showAdminModal" max-width="600">
        <v-card class="card-dialog">
            <v-card-title class="text-center">ADMIN PORTAL</v-card-title>
            <v-card-text>
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <v-text-field density="compact" prepend-inner-icon="mdi-account-box-outline" variant="outlined"
                        label="Admin ID" v-model="adminId" :readonly="loading" :rules="[required]"
                        placeholder="Enter Admin ID" v-validate="'required'"></v-text-field>
                    <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-lock-outline" @click:append-inner="visible = !visible"
                        v-model="adminPassword" :readonly="loading" :rules="[required]" label="Password" type="password"
                        v-validate="'required'" hint="Enter your password to access this website">
                    </v-text-field>
                    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center mb-1">
                        <router-link to="/6jbuilders/password-recovery" class="text-caption text-decoration-none text-blue"
                            @click="initiatePasswordRecovery">
                            Forgot password?
                        </router-link>
                    </div>
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
import { useRouter } from 'vue-router';
import { defineComponent } from "vue";
import { googleTokenLogin } from "vue3-google-login";

const router = useRouter()

export default defineComponent({
    data() {
        return {
            showAdminPortal: false,
            showAdminModal: false,
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
        };
    },
    methods: {
        login() {
            googleTokenLogin().then((response) => {
                this.userData.avatar = response.profileObj.imageUrl;
                this.userData.fullName = response.profileObj.name;
                this.userData.email = response.profileObj.email;
                this.$router.push('/6jbuilders/');
            });
        },
        navTo(to) {
            this.$router.push({ name: to });
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
.left {
    background-color: #efefef;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    object-fit: cover;
    flex: 1;
    overflow: hidden;
    width: 800px;
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
    font-size: 24px;
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
