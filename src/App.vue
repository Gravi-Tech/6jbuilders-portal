<script setup>
import footerUI from './components/footerUI.vue'
import navUI from './components/navUI.vue'
</script>

<template>
  <v-app id="inspire">
    <v-app-bar color="blue darken-2" app height="150" class="pb-1 pt-1">
      <v-navigation>
        <navUI />
      </v-navigation>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer>
      <footerUI />
    </v-footer>
  </v-app>
</template>

<style>
.v-toolbar__content {
  display: block !important;
}
</style>