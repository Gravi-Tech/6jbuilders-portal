<template>
  <div>
    <div v-if="dataLoaded">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { getAllBooking } from '@/apirequests/bookings'
import { getAllTask } from '@/apirequests/task'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  data() {
    return {
      chartData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        datasets: [
          {
            label: 'Rejected Booking',
            backgroundColor: '#E46651',
            data: []
          },
          {
            label: 'Pending Booking',
            backgroundColor: '#FFA500',
            data: []
          },
          {
            label: 'Completed Task',
            backgroundColor: '#00D8FF',
            data: []
          },
          {
            label: 'Pending Task',
            backgroundColor: '#FFC154',
            data: []
          },
          {
            label: 'Task In Progress',
            backgroundColor: '#36A2EB',
            data: []
          },
          {
            label: 'Total Visited',
            backgroundColor: '#4CAF50',
            data: []
          },
          {
            label: 'Total Tasks',
            backgroundColor: '#35495E',
            data: []
          },
          {
            label: 'Total Bookings',
            backgroundColor: '#FF6384',
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true
      },
      dataLoaded: false
    }
  },
  components: {
    Bar
  },
  async mounted() {
    try {
      const bookingResponse = await getAllBooking()
      const bookings = bookingResponse.data
      const taskResponse = await getAllTask()
      const tasks = taskResponse.data

      const currentYear = new Date().getFullYear()
      const monthlyBookingRejections = Array(12).fill(0)
      const monthlyTaskCompletions = Array(12).fill(0)
      const monthlyTaskPending = Array(12).fill(0)
      const monthlyTaskInProgress = Array(12).fill(0)
      const monthlyTotalTasks = Array(12).fill(0)
      const monthlyIsVisited = Array(12).fill(0)
      const monthlyTotalBookings = Array(12).fill(0)
      const monthlyBookingPending = Array(12).fill(0)

      bookings.forEach((booking) => {
        const bookingDate = new Date(booking.date_created)
        if (bookingDate.getFullYear() === currentYear) {
          const monthIndex = bookingDate.getMonth()
          monthlyTotalBookings[monthIndex]++
          if (booking.isRejected) {
            monthlyBookingRejections[monthIndex]++
          }
          if (booking.status === 'Pending') {
            monthlyBookingPending[monthIndex]++
          }
        }
      })

      tasks.forEach((task) => {
        const taskDate = new Date(task.date_created)
        if (taskDate.getFullYear() === currentYear) {
          const monthIndex = taskDate.getMonth()
          if (task.isCompleted) {
            monthlyTaskCompletions[monthIndex]++
          }
          if (task.isVisited) {
            monthlyIsVisited[monthIndex]++
          }
          if (task.status === 'Pending') {
            monthlyTaskPending[monthIndex]++
          }
          if (task.status === 'In Progress') {
            monthlyTaskInProgress[monthIndex]++
          }
          monthlyTotalTasks[monthIndex]++
        }
      })

      this.chartData.datasets[0].data = monthlyBookingRejections
      this.chartData.datasets[1].data = monthlyBookingPending
      this.chartData.datasets[2].data = monthlyTaskCompletions
      this.chartData.datasets[3].data = monthlyTaskPending
      this.chartData.datasets[4].data = monthlyTaskInProgress
      this.chartData.datasets[5].data = monthlyIsVisited
      this.chartData.datasets[6].data = monthlyTotalTasks
      this.chartData.datasets[7].data = monthlyTotalBookings
      this.dataLoaded = true
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
