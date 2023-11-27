<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
    <ScrollBack />
  </v-app>
</template>

<script>
import ScrollBack from './components/ScrollBack.vue';

export default {
  components: {
    ScrollBack,
  },
};
</script>

<style>
.v-toolbar__content {
  display: block !important;
}
</style>
