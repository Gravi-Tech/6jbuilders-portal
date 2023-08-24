<template>
    <v-app-bar color="blue" :elevation="0">
        <v-img src="/src/assets/logo.png" max-height="60" alt="Logo"></v-img>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent location="left" @click="rail = false">
        <v-list-item prepend-avatar="/src/assets/images/user-default.png" title="Juspher Balangyao" nav>
            <template v-slot:append>
                <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home-city" title="Personal Information" value="personal"></v-list-item>
            <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
            <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-main style="height: 250px"></v-main>
</template>
<script>
export default {
    data() {
        return {
            drawer: true,
            rail: true,
        }
    },
}
</script>