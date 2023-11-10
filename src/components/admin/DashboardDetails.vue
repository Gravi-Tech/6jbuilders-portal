<template>
  <div class="dashboard">
    <header class="header">
      <h1 class="dashboard-title">Dashboard</h1>
    </header>
    <div class="card-row">
      <v-card class="overview-card">
        <v-icon start icon="mdi-label" color="blue" size="x-large"></v-icon>
        <v-card-title>Total Booking</v-card-title>
        <v-card-text>
          <div class="total">{{ totalRequests }}</div>
        </v-card-text>
      </v-card>
      <v-card class="overview-card">
        <v-icon start icon="mdi-label" color="blue" size="x-large"></v-icon>
        <v-card-title>Clients</v-card-title>
        <v-card-text>
          <div class="total">{{ totalClients }}</div>

        </v-card-text>
      </v-card>
      <v-card class="overview-card">
        <v-icon start icon="mdi-label" color="blue" size="x-large"></v-icon>
        <v-card-title>Remaining Task</v-card-title>
        <v-card-text>
          <div class="total">{{ totalRemainingTasks }}</div>

        </v-card-text>
      </v-card>
      <v-card class="overview-card">
        <v-icon start icon="mdi-label" color="blue" size="x-large"></v-icon>
        <v-card-title>Workers</v-card-title>
        <v-card-text>
          <div class="total">{{ totalWorkers }}</div>

        </v-card-text>
      </v-card>
      <!-- <v-card class="overview-card">
        <v-icon start icon="mdi-label" color="blue" size="x-large"></v-icon>
        <v-card-title>Revenue (PHP)</v-card-title>
        <v-card-text>
          <div style="display: flex; justify-content: center; align-items: center">
            <div class="total revenue">{{ totalRevenue }}</div>
          </div>
        </v-card-text>
      </v-card> -->
    </div>
    <div class="sub-cards">
      <v-card class="new-booking-card">
        <v-container>
          <div class="head">
            <v-icon color="blue" size="large">mdi-calendar-check</v-icon>
            <v-card-title class="table-header"> Newly Requested </v-card-title>
          </div>

          <v-card-text>
            <table class="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Full Name</th>
                  <th>Mobile Number</th>
                  <th>Service</th>
                  <th>Created On</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in latestBookings" :key="row.id">
                  <td>
                    <a :href="getDetailsPageUrl(row.id)" style="color: blue">{{
                      shortenId(row.id)
                    }}</a>
                  </td>
                  <td>{{ row.fullName }}</td>
                  <td>{{ row.mobileNumber }}</td>
                  <td>{{ row.service }}</td>
                  <td>{{ row.createdDate }}</td>
                  <td>{{ row.location }}</td>
                  <td :class="getStatusClass(row.status)">{{ row.status }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-container>
      </v-card>

      <v-card class="new-notification-card">
        <v-container>
          <div class="head">
            <v-icon color="blue" size="large">mdi-bell</v-icon>
            <v-card-title class="table-header">To Visit Location</v-card-title>
          </div>
          <template v-for="(notification, index) in displayedNotifications" :key="index">
            <v-card variant="tonal" class="notification-card">
              <v-card-text>
                <div>
                  <h5>{{ notification.message }}</h5>
                </div>
                <v-divider :thickness="2" class="border-opacity-100" color="info"></v-divider>
                <div class="notification-footer">
                  <v-chip prepend-icon="mdi-eye" size="small" variant="outlined" color="info"
                    @click="viewDetails(notification)">View Details</v-chip>
                  <v-chip prepend-icon="mdi-calendar" size="small" variant="outlined" color="success">
                    {{ notification.createdDate }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import { requestData, taskData, workersData } from '../../dataUtils/tableData'

export default {
  data() {
    return {
      bookingRequests: requestData,
      task: taskData,
      // materials: materialData,
      workers: workersData,
      selectedFilter: 'All Service',
      selectedRowFilter: 'all',
      showAlert: false,
      alertTimeout: null,
      displayedNotifications: [],
      maxDisplayCount: 4
    }
  },
  mounted() {
    this.updateDisplayedNotifications()
  },
  computed: {
    totalRequests() {
      return this.task.length + this.bookingRequests.length
    },
    totalClients() {
      return this.bookingRequests.length
    },
    totalRemainingTasks() {
      const ongoingTasks = this.task.filter((task) => task.status === 'In Progress')
      return ongoingTasks.length
    },
    totalWorkers() {
      return this.workers.length
    },
    // totalRevenue() {
    //   const completedTasks = this.task.filter((task) => task.status === 'Completed')
    //   const revenue = completedTasks.reduce((total, task) => {
    //     const amount = parseFloat(task.total_amount.replace(',', ''))
    //     return total + amount
    //   }, 0)
    //   return revenue.toFixed(2)
    // },
    latestBookings() {
      const sortedBookings = this.bookingRequests.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      )
      return sortedBookings.slice(0, 12)
    }
  },
  methods: {
    shortenId(id) {
      return id.substring(0, 8)
    },
    getDetailsPageUrl(id) {
      return '/6jbuilders/admin/request?id=' + id
    },
    getStatusClass(status) {
      switch (status) {
        case 'Pending':
          return 'status status--pending'
        case 'Accepted':
          return 'status status--accepted'
        case 'Rejected':
          return 'status status--rejected'
        default:
          return 'status'
      }
    },
    updateDisplayedNotifications() {
      const currentDate = new Date()

      const filteredRequests = this.bookingRequests
        .filter((request) => {
          const scheduleDate = new Date(request.scheduleDate)
          return scheduleDate >= currentDate && !request.isVisited
        })
        .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))

      this.displayedNotifications = filteredRequests
        .slice(0, this.maxDisplayCount)
        .map((request) => ({
          id: request.id,
          scheduleDate: request.scheduleDate,
          selectedTimeRange: request.selectedTimeRange,
          location: request.location,
          createdDate: request.createdDate,
          message: `The pending request with ID ${request.id} is scheduled for inspection on ${request.scheduleDate} ${request.selectedTimeRange} at ${request.location}.`
        }))
    },
    viewDetails(request) {
      const id = request.id
      console.log(id)
      const detailsPageUrl = this.getDetailsPageUrl(id)
      window.location.href = detailsPageUrl
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
}

.header {
  margin-bottom: 24px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
}

.card-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.overview-card {
  flex: 1;
}

.sub-cards {
  display: flex;
}

.head {
  display: flex;
  align-items: center;
}

.new-booking-card {
  width: 900px;
  margin: 0 10px 24px 0;
}

.new-notification-card {
  width: 410px;
  margin: 0 0 24px 10px;
}

.new-booking-card,
.new-notification-card {
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(43, 146, 249, 0.958);
  font-weight: 700;
  font-size: 18px;
}

.filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-select {
  width: 400px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-align: left;
}

.table th {
  font-weight: bold;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  color: #fff;
}

.status {
  font-size: 14px;
}

.status--pending {
  color: orange;
}

.status--rejected {
  color: red;
}

.status--accepted {
  color: green;
}

.total {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  padding: 20px;
}

.revenue {
  color: green;
}

.link {
  display: flex;
  justify-content: center;
  align-items: center;
}

.notification-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
}

.notification-card {
  margin-bottom: 10px;
}
</style>
