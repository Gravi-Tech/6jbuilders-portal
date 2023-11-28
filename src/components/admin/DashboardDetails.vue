<template>
  <div class="dashboard">
    <header class="header">
      <h1 class="dashboard-title">Dashboard</h1>
    </header>
    <div class="card-row">
      <v-card class="overview-card" v-for="(card, index) in overviewCards" :key="index">
        <v-container class="text-center">
          <v-icon class="icon" color="blue" size="40">{{ card.icon }}</v-icon>
          <v-card-title class="card-title">{{ card.title }}</v-card-title>
          <v-card-text>
            <div v-if="isLoadingData[index]" class="loading-container">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else class="total">{{ card.value }}</div>
          </v-card-text>
        </v-container>
      </v-card>
    </div>
    <v-row class="mt-8 mb-8">
      <v-col cols="12" sm="4" class="mt-n4">
        <v-card class="new-notification-card" height="100%">
          <v-container>
            <div class="head">
              <v-icon color="blue" size="large">mdi-check-circle</v-icon>
              <v-card-title class="table-header">Upcoming Site Visits</v-card-title>
            </div>
            <template v-for="(notification, index) in displayedNotifications" :key="index">
              <template v-if="isLoadingData[index]">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </template>
              <template v-else>
                <v-card variant="tonal" class="notification-card">
                  <v-card-text>
                    <div>
                      <h5>{{ notification.message }}</h5>
                    </div>
                    <v-divider :thickness="2" class="border-opacity-100" color="info"></v-divider>
                    <div class="notification-footer">
                      <v-chip
                        prepend-icon="mdi-eye"
                        size="small"
                        variant="outlined"
                        color="info"
                        @click="viewDetails(notification)"
                      >
                        View Details
                      </v-chip>
                      <v-chip
                        prepend-icon="mdi-calendar"
                        size="small"
                        variant="outlined"
                        color="success"
                      >
                        {{ formatDate(notification.date_created) }}
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </template>
            </template>
          </v-container>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8" class="mt-n4">
        <v-card class="mx-auto" height="100%">
          <v-card-item title="Monthly Analysis">
            <Bar class="mt-n1" />
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <div class="sub-cards">
      <v-card class="new-booking-card" height="100%">
        <v-container>
          <div class="head">
            <v-icon color="blue" size="large">mdi-calendar-clock</v-icon>
            <v-card-title class="table-header">Incoming Booking Request</v-card-title>
          </div>
          <v-card-text>
            <table class="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Full Name</th>
                  <th>Mobile Number</th>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in latestBookings" :key="row._id">
                  <td>
                    <a :href="getDetailsPageUrl(row._id)" style="color: blue">{{
                      shortenId(row._id)
                    }}</a>
                  </td>
                  <td>{{ row.first_name }} {{ row.middle_name }} {{ row.last_name }}</td>
                  <td>{{ row.mobile_number }}</td>
                  <td>{{ row.service }}</td>
                  <td>{{ row.location }}</td>
                  <td>{{ row.status }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-container>
      </v-card>

      <v-col cols="12" sm="4" class="mt-n3">
        <v-card class="mx-auto" height="100%">
          <v-card-item title="Task">
            <Doughnut />
          </v-card-item>
        </v-card>
      </v-col>
    </div>
  </div>
</template>

<script>
import { getAllWorkers } from '../../apirequests/workers'
import { getAllTask } from '../../apirequests/task'
import { getAllServices } from '../../apirequests/service'
import { getAllBooking } from '../../apirequests/bookings'

import Doughnut from '../Doughnut.vue'
import Bar from '../Bar.vue'

export default {
  components: {
    Doughnut,
    Bar
  },
  data() {
    return {
      bookingRequests: [],
      task: [],
      workers: [],
      latestBookings: [],
      displayedNotifications: [],
      isLoadingData: [],
      showAlert: false,
      alertTimeout: null,
      maxDisplayCount: 4,
      totalRequests: 0,
      totalTask: 0,
      totalBookRejected: 0,
      mostBookedService: '',
      totalWorkers: 0
    }
  },
  computed: {
    overviewCards() {
      return [
        {
          icon: 'mdi-checkbox-multiple-marked-outline',
          title: 'Total Booking',
          value: this.totalRequests
        },
        {
          icon: 'mdi-format-list-checks',
          title: 'Total Task',
          value: this.totalTask
        },
        {
          icon: 'mdi-alert-circle-outline',
          title: 'Total Book Rejected',
          value: this.totalBookRejected
        },
        {
          icon: 'mdi-star',
          title: 'Most Booked Service',
          value: this.mostBookedService
        },
        {
          icon: 'mdi-account-group',
          title: 'Total Workers',
          value: this.totalWorkers
        }
      ]
    }
  },
  mounted() {
    this.loadData()
    this.loadLatestBookings()
  },
  methods: {
    async loadData() {
      try {
        this.isLoadingData = Array(this.overviewCards.length).fill(true)

        const workersResponse = await getAllWorkers()
        const tasksResponse = await getAllTask()
        const servicesResponse = await getAllServices()
        const bookingsResponse = await getAllBooking()

        this.bookingRequests = bookingsResponse.data
        this.task = tasksResponse.data
        this.workers = workersResponse.data

        this.totalRequests = this.bookingRequests.length
        this.totalTask = this.task.length
        this.totalBookRejected = this.bookingRequests.filter((booking) => booking.isRejected).length
        this.mostBookedService = this.getMostBookedService(
          this.bookingRequests,
          servicesResponse.data
        )
        this.totalWorkers = this.workers.length

        this.updateDisplayedNotifications()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoadingData = Array(this.overviewCards.length).fill(false)
      }
    },
    async loadLatestBookings() {
      try {
        const response = await getAllBooking()
        const bookings = response.data

        const filteredBookings = bookings.filter((booking) => !booking.isRejected)
        filteredBookings.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))

        const latestBookings = filteredBookings.slice(0, 6)

        this.latestBookings = latestBookings

        this.isLoadingData = Array(latestBookings.length).fill(true)

        await new Promise((resolve) => setTimeout(resolve, 2000))

        this.isLoadingData = Array(latestBookings.length).fill(false)
      } catch (error) {
        console.error(error)
      }
    },
    getMostBookedService(bookings) {
      const serviceCounts = {}

      bookings.forEach((booking) => {
        const serviceTitle = booking.service
        if (serviceCounts.hasOwnProperty(serviceTitle)) {
          serviceCounts[serviceTitle]++
        } else {
          serviceCounts[serviceTitle] = 1
        }
      })

      let mostBookedService = ''
      let maxCount = 0

      Object.entries(serviceCounts).forEach(([serviceTitle, count]) => {
        if (count > maxCount) {
          mostBookedService = serviceTitle
          maxCount = count
        }
      })

      return mostBookedService
    },
    formatDate(date) {
      if (date) {
        const formattedDate = new Date(date).toLocaleDateString('en', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        })
        return formattedDate.replace(/\//g, '-')
      }
      return '-'
    },
    updateDisplayedNotifications() {
      const currentDate = new Date()

      const filteredRequests = this.task
        .filter((task) => {
          const schedule_date = new Date(task.schedule_date)
          return schedule_date >= currentDate && !task.isVisited
        })
        .sort((a, b) => new Date(a.schedule_date) - new Date(b.schedule_date))

      this.displayedNotifications = filteredRequests.slice(0, this.maxDisplayCount).map((task) => ({
        id: task._id,
        schedule_date: task.schedule_date,
        location: task.location,
        date_created: task.date_created,
        message: `The pending task with ID ${
          task._id
        } is scheduled for inspection on ${this.formatDate(task.schedule_date)} at ${
          task.location
        }.`
      }))
    },
    shortenId(id) {
      return id.substring(0, 8)
    },
    getDetailsPageUrl(id) {
      return `/6jbuilders/admin/request?id=${id}`
    },

    getTaskDetailsPageUrl(id) {
      return `/6jbuilders/admin/task?id=${id}`
    },
    viewDetails(task) {
      const id = task.id
      const detailsPageUrl = this.getTaskDetailsPageUrl(id)
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
  width: 100%;
  margin-bottom: 12px;
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
.total {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  padding: 20px;
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
