import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(2)
  const doubleCount = () => {
    count.value *= 2
  }
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
