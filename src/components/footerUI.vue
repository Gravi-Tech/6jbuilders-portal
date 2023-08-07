<template>
    <section class="bg-blue">
        <div class="d-flex flex-column">
            <div class="bg-blue-lighten-1 d-flex w-100 align-center px-4">
                <strong>Get connected with us on social networks!</strong>
                <v-spacer></v-spacer>
                <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="text" size="small"></v-btn>
            </div>
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About Us</h3>
                    <p><span style="font-weight: 600;">6J Builders.</span><br>Lorem ipsum dolor sit amet. Ut quod consequatur ut cupiditate sint sed aspernatur
                        impedit et eveniet aperiam.</p>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p><v-icon>mdi-map-marker</v-icon> Canduman, Mandaue Cebu City</p>
                    <p><v-icon>mdi-phone</v-icon> 0912-345-2134</p>
                    <p><v-icon>mdi-email</v-icon> 6jbuildersph@gmail.com</p>
                    <p><v-icon>mdi-calendar-clock</v-icon> Mon-Fri 7:00 am - 7:00 pm</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <v-btn v-for="link in quickLinks" :key="link" color="white" variant="text" class="mx-1" rounded="xl">
                        {{ link }}
                    </v-btn>
                </div>
            </div>
        </div>
        <v-row no-gutters>
            <v-col class="text-center mt-4" cols="12">
                Copyright ©{{ new Date().getFullYear() }} All Rights Reserved | 6J Builders Cebu Philippines
            </v-col>
        </v-row>
    </section>
</template>
  
<script>
export default {
    data: () => ({
        quickLinks: [
            'Home',
            'About Us',
            'Contact',
            'Terms of Condition',
            'Privacy Policy',
        ],
        icons: [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ],
    }),
};
</script>
  
<style>
p{
    padding: 5px;
}
.footer-content {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;
}

.footer-section {
    flex: 1;
    padding: 0 20px;
}
</style>  