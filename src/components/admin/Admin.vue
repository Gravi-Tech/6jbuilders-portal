<template>
  <div>
    <div v-if="loading">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="24"
        :width="3"
      ></v-progress-circular>
    </div>
    <template v-else>
      <v-navigation-drawer :width="320" v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list-item>
          <div class="flex-container">
            <div class="avatar mr-2">
              <v-avatar size="x-small" :color="getAvatarColor(admin.firstname)">
                <span class="white--text">{{ getInitials(admin.firstname) }}</span>
              </v-avatar>
            </div>
            <div class="fullname">
              <v-list-item-title>{{ getFullName(admin) }}</v-list-item-title>
              <v-list-item-subtitle>{{ admin.role }}</v-list-item-subtitle>
            </div>
            <div class="actions">
              <v-btn variant="text" icon @click.stop="rail = !rail">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
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

<script>
import Dashboard from './DashboardDetails.vue'
import Service from './Service.vue'
import Booking from './BookingRequest.vue'
import Profile from './Profile.vue'
import Task from './TaskDetails.vue'
import Employees from './Employees.vue'
import Records from './Records.vue'
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
        { title: 'Booking Request', value: 'request', icon: 'mdi-calendar-clock' },
        { title: 'Task', value: 'task', icon: 'mdi-checkbox-marked-circle-outline' },
        { title: 'Project', value: 'projects', icon: 'mdi-folder-multiple-outline' },
        { title: 'Records', value: 'records', icon: 'mdi-text-box-outline' },
        { title: 'Services', value: 'services', icon: 'mdi-hammer-wrench' },
        { title: 'Employees', value: 'employees', icon: 'mdi-account-group-outline' },
        { title: 'Profile', value: 'profile', icon: 'mdi-account-cog-outline' },
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
          case 'records':
          return Records
        case 'services':
          return Service
        case 'employees':
          return Employees
        case 'task':
          return Task
        case 'feedback':
          return Feedback
        case 'profile':
          return Profile
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

      // setTimeout(() => {
      //   this.rail = true
      // }, Math.floor(Math.random() * 1000) + 3000)
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
