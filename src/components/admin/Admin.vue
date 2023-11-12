<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item :prepend-avatar="admin[0].avatar" :title="admin[0].fullname" :subtitle="admin[0].role" nav>
      <template v-slot:append>
        <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in menuItems" :key="item.value" :title="item.title" :value="item.value"
        :active="activeItem === item.value" @click="handleMenuItemClick(item)">
        <template v-slot:prepend>
          <v-tooltip bottom v-if="rail">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" :color="activeItem === item.value ? 'blue darken-2' : 'black'">
                {{ item.icon }}
              </v-icon>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>
          <v-icon v-if="!rail" :color="activeItem === item.value ? 'blue darken-2' : 'black'">
            {{ item.icon }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <section class="container">
    <component :is="activeItemComponent"></component>
    <v-dialog v-model="logoutDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">Logout Confirmation</v-card-title>
        <v-card-text>Are you sure you want to logout?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="logoutDialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="logout">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script scoped>
import Dashboard from './DashboardDetails.vue'
// import Client from './ClientDetails.vue'
import Booking from './BookingRequest.vue'
import Setting from './SettingsDetails.vue'
import Task from './TaskDetails.vue'
import Worker from './WorkerDetails.vue'
import Project from './ProjectDetails.vue'
import { admin } from '../../dataUtils/userData'

export default {
  data() {
    return {
      admin: admin,
      drawer: true,
      rail: true,
      activeItem: 'dashboard',
      menuItems: [
        { title: 'Dashboard', value: 'dashboard', icon: 'mdi-view-dashboard-outline' },
        { title: 'Booking Request', value: 'request', icon: 'mdi-calendar-check-outline' },
        { title: 'Task', value: 'task', icon: 'mdi-checkbox-multiple-outline' },
        { title: 'Project', value: 'projects', icon: 'mdi-folder-outline' },
        // { title: 'Clients', value: 'clients', icon: 'mdi-account-group-outline' },
        { title: 'Workers', value: 'workers', icon: 'mdi-account-multiple-outline' },
        { title: 'Settings', value: 'setting', icon: 'mdi-cog-outline' },
        { title: 'Logout', value: 'logout', icon: 'mdi-logout' }
      ],
      logoutDialog: false
    }
  },
  computed: {
    activeItemComponent() {
      switch (this.activeItem) {
        case 'dashboard':
          return Dashboard
        case 'clients':
          return Client
        case 'request':
          return Booking
        case 'materials':
          return Material
        case 'projects':
          return Project
        case 'workers':
          return Worker
        case 'task':
          return Task
        case 'feedback':
          return Feedback
        case 'setting':
          return Setting
        default:
          return DashboardDetails
      }
    }
  },
  created() {
    const currentRoute = this.$route.name
    const menuItem = currentRoute === 'admin' ? this.$route.params.menuItem : ''
    this.activeItem = menuItem || 'dashboard'
  },
  methods: {
    handleMenuItemClick(item) {
      if (item.value === 'logout') {
        this.logoutDialog = true;
        return;
      }

      this.activeItem = item.value;

      const currentState = history.state;
      const url = this.$router.resolve({
        name: 'admin',
        params: { menuItem: this.activeItem }
      }).href;

      history.replaceState(currentState, '', url);

      this.$router.push({ name: 'admin', params: { menuItem: this.activeItem } });
    },
    logout() {
      window.location.href = '/'
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
}
</style>
