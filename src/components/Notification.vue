<template>
    <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
            <v-btn size="large" icon="mdi-bell-ring-outline" v-bind="props">
            </v-btn>
        </template>
        <v-list max-height="500" max-width="250">

            <v-list lines="two">
                <v-list-subheader>Today's Notification</v-list-subheader>

                <v-list-item prepend-avatar="/src/assets/images/user-default.png" title="Brunch this weekend?">
                    <template v-slot:subtitle>
                        <span class="font-weight-bold">Ali Connors</span> &mdash; I'll be in your neighborhood doing
                        errands this weekend. Do you want to hang out?
                    </template>
                </v-list-item>

                <v-divider inset></v-divider>

                <v-list-item prepend-avatar="/src/assets/images/user-default.png">
                    <template v-slot:title>
                        Summer BBQ <span class="text-grey-lighten-1">4</span>
                    </template>

                    <template v-slot:subtitle>
                        <span class="font-weight-bold">to Alex, Scott, Jennifer</span> &mdash; Wish I could come,
                        but I'm out of town this weekend.
                    </template>
                </v-list-item>

                <v-divider inset></v-divider>

                <v-list-item prepend-avatar="/src/assets/images/user-default.png" title="Oui oui">
                    <template v-slot:subtitle>
                        <span class="font-weight-bold">Sandra Adams</span> &mdash; Do you have Paris
                        recommendations? Have you ever been?
                    </template>
                </v-list-item>
            </v-list>
        </v-list>
    </v-menu>
</template>
  
<script>
export default {
    name: "Notification",
};
</script>  