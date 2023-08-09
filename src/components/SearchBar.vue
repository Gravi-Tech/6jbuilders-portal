<template>
    <v-card-text>
        <v-text-field :loading="loading" density="compact" variant="underlined" label="Search here..."
            append-inner-icon="mdi-magnify" single-line hide-details @click:append-inner="onClick"></v-text-field>
    </v-card-text>
</template>
  
<script setup>
import { ref } from 'vue';

const loading = ref(false);

const onClick = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 2000);
}
</script>
  