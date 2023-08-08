<script setup>
import { onMounted, ref } from 'vue'
import { getJson } from '../apirequests/users'
import { useCounterStore } from '../stores/counter'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const counter = useCounterStore()
onMounted(async () => {
  const users = await getJson()
  console.log('🚀 ~ file: HomeView.vue:6 ~ onMounted ~ users:', users)
  if (users.error) {
    console.log('Something went wrong')
  }
  const names = await users.data.map(user => {
    return { name: `${user.fname} ${user.lname}` }
  })
  console.log("🚀 ~ file: HomeView.vue:10 ~ names ~ names:", names)
})

const coffeeShop = ['Cafe namoo', 'Starbucks', 'Bean Leaf', 'Coffee aby']

const timeofday = ''

const username = ref('redgie')
const handleUsername = () => {
  username.value = 'Jasper'
}

const password = ref('redgie')
const handlePassword = () => {
  password.value = 'Jasper'
}

const firstanme = ref('redgie')
const lastname = ref('redgie')

const submit = () => {
  counter.doubleCount()
}
</script>

<template>
  <main>
    <Header />
    <h1 class="text-uppercase text-red">homes: {{ username }} {{ counter.count }}</h1>
    <br />
    <v-btn size="large" class="rounded-e-pill" block>hello</v-btn>
    <br /><br />
    <v-btn prepend-icon="mdi-phone" variant="tonal"> Button </v-btn>
    <div>
      <ol>
        <template v-for="(shop, i) in coffeeShop" :key="i">
          <li v-if="shop != 'Starbucks'">
            {{ shop }}
          </li>
        </template>
      </ol>
    </div>

    <v-card width="500" class="pa-4">
      <div>
        <div v-if="timeofday === 'morning'">Good morning</div>
        <div v-else-if="timeofday === 'afternoon'">Good afternoon</div>
        <div v-else>Good evening</div>
      </div>
      <br />
      <v-text-field v-model="username" label="Label" variant="outlined" class="full-width"></v-text-field>

      <v-btn @click="submit" variant="outlined">double</v-btn>
    </v-card>
    <Footer />
  </main>
</template>

<style></style>
