<script setup>
import { onMounted } from 'vue'
import { getUsers } from '../apirequests/users'
onMounted(async () => {
  const users = await getUsers()
  console.log("🚀 ~ file: HomeView.vue:6 ~ onMounted ~ users:", users)
  if (users.error) {
    console.log('Something went wrong')
  }
  const names = await users.data.map(user => {
    return { name: `${user.fname} ${user.lname}` }
  })
  console.log("🚀 ~ file: HomeView.vue:10 ~ names ~ names:", names)
})
</script>

<template>
  <main>
    <h1>homes</h1>
  </main>
</template>

<style></style>
