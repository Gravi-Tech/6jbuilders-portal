<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <sidebarUI />
    </v-navigation-drawer>

    <v-app-bar color="blue" flat>
      <v-app-bar-nav-icon @click="drawerAction(!drawer)"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import sidebarUI from './components/sidebarUI.vue';
const drawer = ref(null)
const drawerAction = (val) => {
  drawer.value = val
}

</script>