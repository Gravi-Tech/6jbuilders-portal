<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      boilerplate
      type="list-item-avatar, list-item-title, list-item-subtitle, card, chip"
    ></v-skeleton-loader>
    <template v-else>
      <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list-item>
          <div class="flex-container">
            <div class="avatar">
              <v-list-item-avatar>
                <v-avatar size="x-small" :color="getAvatarColor(admin.firstname)">
                  <span class="white--text">{{ getInitials(admin.firstname) }}</span>
                </v-avatar>
              </v-list-item-avatar>
            </div>
            <div class="fullname">
              <v-list-item-content>
                <v-list-item-title>{{ getFullName(admin) }}</v-list-item-title>
                <v-list-item-subtitle>{{ admin.role }}</v-list-item-subtitle>
              </v-list-item-content>
            </div>
            <div class="actions">
              <v-list-item-action>
                <v-btn variant="text" icon @click.stop="rail = !rail">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
              </v-list-item-action>
            </div>
          </div>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="item in menuItems"
            :key="item.value"
            :title="item.title"
            :value="item.value"
            :active="activeItem === item.value"
            @click="handleMenuItemClick(item)"
          >
            <template v-slot:prepend>
              <v-tooltip bottom v-if="rail">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :color="activeItem === item.value ? 'blue darken-2' : 'black'"
                  >
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
  </div>
</template>

<script scoped>
import Dashboard from './DashboardDetails.vue'
import Service from './Service.vue'
import Booking from './BookingRequest.vue'
import Setting from './SettingsDetails.vue'
import Task from './TaskDetails.vue'
import Worker from './WorkerDetails.vue'
import Project from './ProjectDetails.vue'
import { getAdmin } from '../../apirequests/admin'

export default {
  data() {
    return {
      admin: null,
      loading: true,
      drawer: true,
      rail: true,
      activeItem: 'dashboard',
      menuItems: [
        { title: 'Dashboard', value: 'dashboard', icon: 'mdi-view-dashboard-outline' },
        { title: 'Booking Request', value: 'request', icon: 'mdi-calendar-check-outline' },
        { title: 'Task', value: 'task', icon: 'mdi-checkbox-multiple-outline' },
        { title: 'Project', value: 'projects', icon: 'mdi-folder-outline' },
        { title: 'Service', value: 'services', icon: 'mdi-wrench' },
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
        case 'services':
          return Service
        case 'workers':
          return Worker
        case 'task':
          return Task
        case 'feedback':
          return Feedback
        case 'setting':
          return Setting
        default:
          return Dashboard
      }
    }
  },
  created() {
    this.fetchAdminData()
    const currentRoute = this.$route.name
    const menuItem = currentRoute === 'admin' ? this.$route.params.menuItem : ''
    this.activeItem = menuItem || 'dashboard'
  },
  methods: {
    handleMenuItemClick(item) {
      if (item.value === 'logout') {
        this.logoutDialog = true
        return
      }

      this.activeItem = item.value

      const currentState = history.state
      const url = this.$router.resolve({
        name: 'admin',
        params: { menuItem: this.activeItem }
      }).href

      history.replaceState(currentState, '', url)

      this.$router.push({ name: 'admin', params: { menuItem: this.activeItem } })
    },
    async fetchAdminData() {
      try {
        const adminId = localStorage.getItem('id')
        const adminData = await getAdmin(adminId)
        this.admin = adminData.data
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    getFullName(admin) {
      let fullName = ''
      if (admin.firstname) {
        fullName += admin.firstname
      }
      if (admin.middlename) {
        fullName += ' ' + admin.middlename
      }
      if (admin.lastname) {
        fullName += ' ' + admin.lastname
      }
      return fullName.trim()
    },
    getInitials(firstname) {
      return firstname ? firstname.charAt(0).toUpperCase() : ''
    },
    getAvatarColor(firstname) {
      const colors = ['blue', 'green', 'red', 'orange', 'purple']
      const index = firstname ? firstname.charCodeAt(0) % colors.length : 0
      return colors[index]
    },
    logout() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('id')
      window.location.href = '/6jbuilders/login'
    }
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container {
  padding: 20px;
}

.white--text {
  font-weight: bold;
}
</style>
