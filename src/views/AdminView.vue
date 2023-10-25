<template>
  <SystemHeader />
  <Admin />
</template>

<script scoped>
import SystemHeader from '../components/SystemHeader.vue'
import Admin from '../components/admin/Admin.vue'

export default {
  components: {
    SystemHeader,
    Admin
  }
}
</script>
