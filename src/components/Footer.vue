<template>
    <section class="footer-container">
        <div class="d-flex flex-column">
            <div class="bg-blue-lighten-1 d-flex w-100 align-center px-4">
                <strong>Get connected with us on social networks!</strong>
                <v-spacer></v-spacer>
                <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="text" size="small"></v-btn>
            </div>
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About Us</h3>
                      <p>
                <span style="font-weight: 600">Looking for a quality and
                affordable constructor for your home?</span><br />6JBuilders.<br>
                An organization that was started by the most
                skilled and most experienced individuals who actively and diligently assist their
                clients with matters pertaining to home building and repair. They proactively and
                artistically provide insight on certain services in order to satisfy their clients.
            </p>
                </div>
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p><v-icon>mdi-map-marker</v-icon> Canduman, Mandaue Cebu City</p>
                    <p><v-icon>mdi-phone</v-icon> 0926 123 7672</p>
                    <p><v-icon>mdi-email</v-icon> 6jbrothers.construction@gmail.com</p>
                    <p><v-icon>mdi-calendar-clock</v-icon> Mon-Fri 7:00 am - 7:00 pm</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <p v-for="link in quickLinks" :key="link" class="quick-link">
                        <router-link :to="getLinkRoute(link)" class="no-text-decoration">{{ link }}</router-link>
                    </p>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <v-row no-gutters>
                <v-col class="text-center mt-4" cols="12">
                    Copyright ©{{ new Date().getFullYear() }} All Rights Reserved | 6J Builders Cebu Philippines
                </v-col>
            </v-row>
        </div>
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
        icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'],
    }),
    methods: {
        getLinkRoute(link) {
            if (link === 'Terms of Condition' || link === 'Privacy Policy') {
                const routeName = link === 'Terms of Condition' ? 'terms-of-service' : 'privacy-policy';
                return { name: 'legal', params: { page: routeName } };
            } else {
                const formattedRoute = link.toLowerCase().replace(/\s+/g, '-');
                return { name: formattedRoute };
            }
        },
    },
};
</script>
  
<style>
.footer-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #2196F3;
    color: white;
    margin-top: auto;
}

.footer-bottom {
    flex-shrink: 0;
}

.no-text-decoration {
    text-decoration: none;
    color: white;
}

p {
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

.mx-1 {
    margin: 0.2rem;
}
@media only screen and (max-width: 320px) {
.footer-content {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
}
.footer-container{
    font-size:  12px ;
    grid-row:auto;
}
}
</style>  
