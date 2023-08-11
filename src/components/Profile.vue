<template>
    <v-menu offset-y>
        <template v-slot:activator="{ props }">
            <v-btn size="large" color="blue" icon="mdi-account" v-bind="props">
            </v-btn>
        </template>
        <v-list>
            <v-list-item>
                <v-list-item-title>Guest</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
  
<script>
export default {
    name: "Profile",
};
</script>
  