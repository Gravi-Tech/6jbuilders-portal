<template>
  <v-app id="inspire">

    <v-main>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-main>

    <!-- <v-footer>
      <Footer />
    </v-footer> -->
  </v-app>
</template>

<script setup>
// import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
</script>

<style>
.v-toolbar__content {
  display: block !important;
}
</style>