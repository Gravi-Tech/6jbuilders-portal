<template>
  <div class="mb-8">
    <Worker />
  </div>
  <div class="mb-8">
    <Position />
  </div>
</template>

<script>
import Worker from './Worker.vue'
import Position from './Position.vue'
export default {
  components: {
    Worker,
    Position
  }
}
</script>
