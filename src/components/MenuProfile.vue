<template>
    <v-menu offset-y>
        <template v-slot:activator="{ props }">
            <v-btn size="large" color="blue" icon="mdi-account" v-bind="props"></v-btn>
        </template>
        <v-list>
            <v-list-item style="width: 120px;" @click="navTo('profile')">
                <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="navTo('settings')">
                <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout">
                <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
  
<script>
export default {
    name: "Profile",
    methods: {
        navTo(to) {
            this.$router.push({ name: to });
        },
        logout() {
        },
    },
};
</script>
  