<template>
    <div class="about-us">
        <v-parallax src="https://th.bing.com/th/id/OIP.1fnhZ9plz0-a9Hx-tGTNDQHaEU?w=297&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
            height="350">
            <v-row class="fill-height ma-0 text-white">
                <v-col cols="12" class="text-center white--text align-self-center">
                    <h1 class="text-h4 font-weight-thin mb-4">About Us</h1>
                    <h4 class="subheading">Get to know our story</h4>
                </v-col>
            </v-row>
        </v-parallax>

        <v-container class="my-12">
            <v-row class="flex-row">
                <v-col cols="12" sm="4">
                    <h2 class="headline text-center mb-6">Mission</h2>
                    <p class="text-center">
                        Our mission is to provide high-quality construction services that exceed our clients' expectations,
                        ensuring their projects are delivered on time and within budget.
                    </p>
                </v-col>

                <v-col cols="12" sm="4">
                    <h2 class="headline text-center mb-6">Vision</h2>
                    <p class="text-center">
                        Our vision is to be a leading construction company recognized for innovation, excellence, and
                        commitment
                        to building sustainable and remarkable structures.
                    </p>
                </v-col>

                <v-col cols="12" sm="4">
                    <h2 class="headline text-center mb-6">Our Goals</h2>
                    <p class="text-center">
                        We aim to establish lasting relationships with our clients based on trust and integrity. We strive
                        to
                        continuously improve our processes, invest in our team, and contribute positively to the communities
                        we serve.
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
  
<script>
export default {
    name: 'AboutUs',
};
</script>
  
<style scoped>
.flex-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.v-col {
    flex: 0 1 100%;
    margin: 0 8px;
}</style>
  