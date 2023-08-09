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
  const names = await users.data.map((user) => {
    return { name: `${user.fname} ${user.lname}` }
  })
  console.log('🚀 ~ file: HomeView.vue:10 ~ names ~ names:', names)
})

// const coffeeShop = ['Cafe namoo', 'Starbucks', 'Bean Leaf', 'Coffee aby']

// const timeofday = ''

// const username = ref('redgie')
// const handleUsername = () => {
//   username.value = 'Jasper'
// }

// const password = ref('redgie')
// const handlePassword = () => {
//   password.value = 'Jasper'
// }

// const firstanme = ref('redgie')
// const lastname = ref('redgie')

// const submit = () => {
//   counter.doubleCount()
// }
</script>

<template>
  <main>
    <Header />
    <!-- <h1 class="text-uppercase text-red">homes: {{ username }} {{ counter.count }}</h1>
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
    </v-card> -->
    

    <div id="banner" class="d-flex w-100 h-100 mt-12">
      <div class="d-flex w-50 pa-2">
        <div id="captivated" class="d-block">
          <p id="tag" class="ml-10 mt-12">
            We <span id="build" class=""> BUILD </span> and
            <span id="build" class=""> REPAIR </span> your Home
          </p>
          <p class="ml-10">
            Provide construction and repair services,<br />attaining excellent quality works, timely
            timetable and cost efficient services.
          </p>
        </div>
      </div>
      <div class="d-flex w-50">
        <v-img
          id="background"
          class="rounded-ts-pill"
          src="..//src/assets/images/6jbuilders-bg.jpg"
          width="50%"
        ></v-img>
      </div>
    </div>
    <v-container class="">
    <v-row no-gutters>
      <v-col>
        <v-sheet id="" class="pa-2 ma-6">
          Looking for a quality and affordable constructor for your home?
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          <v-row justify="center">
            <v-col cols="4">
        <v-btn block rounded="lg" size="x-large">Get a Qoute</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block rounded="lg" size="x-large">Check our Projects</v-btn>
      </v-col>
        </v-row>
        </v-sheet>
      </v-col>
    
    </v-row>
    </v-container>

    <Footer />
  </main>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Calistoga&display=swap');

#tag {
  font-family: 'Calistoga', cursive;
  font-size: 3rem;
 
}
#build {
  color:#039BE5;
  font-size: 3rem;
}
p {
  align-items: center;
}

#banner{
  background-image: linear-gradient(#FBC02D,#FFFF, #039BE5);
  border-radius: 95% 0% 0% 0%;
}
</style>
