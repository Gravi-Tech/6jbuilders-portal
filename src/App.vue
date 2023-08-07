<template>
  <v-app id="inspire">
    <v-app-bar color="blue darken-2" app height="150" class="pb-1 pt-1">
      <v-navigation>
        <NavUI />
      </v-navigation>
    </v-app-bar>

    <v-main>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-main>

    <!-- <v-footer>
      <FooterUI />
    </v-footer> -->
  </v-app>
</template>

<script setup>
// import FooterUI from './components/footerUI.vue'
import NavUI from './components/navUI.vue'
</script>

<style>
.v-toolbar__content {
  display: block !important;
}
</style>