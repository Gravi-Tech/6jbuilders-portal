<template>
    <div class="d-flex">
        <div class="left">
            <div class="align-center justify-center content">
                <div class="mb-6 txt">
                    <h1 class="app-title">Welcome to 6J Builders Portal</h1>
                    <p class="app-description">Log in to get started</p>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="forgot-box">
                <v-img src="/src/assets/logo.png" max-height="100" alt="Logo"></v-img>
                <h4 class="d-flex justify-start header">Forgot Password</h4>
                <span class="d-flex justify-start sub-header">Email Address</span>
                <v-form v-model="form" @reset.prevent="resetPassword">
                    <v-text-field v-model="adminIdentifier" prepend-inner-icon="mdi-email-outline" label="Email Address" dense variant="outlined" required
                        :rules="adminIdentifierRules">
                    </v-text-field>
                    <v-btn class="mt-3 rst-btn" color="red" type="reset" variant="flat">Reset Password</v-btn>
                    <v-btn class="mt-6 rst-btn" variant="outlined" size="small" @click="navTo('login')">Go Back to Login</v-btn>
                </v-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {},
            adminIdentifier: '',
            adminIdentifierRules: [
                (v) => !!v || 'Email is required',
                (v) => isValidEmail(v) || 'Valid email is required',
            ],
        };
    },
    methods: {
        navTo(to) {
            this.$router.push({ name: to });
        },
    },
};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
</script>

<style scoped>

.header {
    font-weight: 700;
    margin-bottom: 10px;
}

.sub-header {
    font-size: 12px;
    margin-bottom: 5px;
    font-weight: 500;
}
.left {
    background-color: #efefef;
    object-fit: cover;
    flex: 1;
    overflow: hidden;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
}
.app-title {
    font-size: 24px;
}
.app-description {
    color: #808080;
    margin-bottom: 30px;
}
.right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.rst-btn {
    font-size: 12px;
    width: 100%
}
.forgot-box {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    width: 400px;
    margin: 50px;
}
</style>
