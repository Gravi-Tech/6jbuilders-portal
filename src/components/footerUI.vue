<template>
    <section class="bg-blue">
        <div class="d-flex flex-column">
            <div class="bg-blue-lighten-1 d-flex w-100 align-center px-4">
                <strong>Get connected with us on social networks!</strong>

                <v-spacer></v-spacer>

                <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="text" size="small"></v-btn>
            </div>
        </div>
        <v-row no-gutters>
            <v-btn v-for="link in links" :key="link" color="white" variant="text" class="mx-2" rounded="xl">
                {{ link }}
            </v-btn>
            <v-col class="text-center mt-4" cols="12">
                {{ new Date().getFullYear() }} — <strong>6 JBUILDERS</strong>
            </v-col>
        </v-row>
    </section>
</template>

<script>
export default {
    data: () => ({
        links: [
            'Home',
            'About Us',
            'Services',
            'Contact Us',
        ],
        icons: [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ],
    }),
}
</script>