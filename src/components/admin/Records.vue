<template>
  <div class="mb-8">
    <Data />
  </div>
  <div class="mb-8">
    <Reason />
  </div>
</template>

<script>
import Data from './DataType.vue'
import Reason from './Reason.vue'
export default {
  components: {
    Data,
    Reason
  }
}
</script>
