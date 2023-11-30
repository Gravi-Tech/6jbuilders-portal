<template>
  <div>
    <div v-if="dataLoaded">
      <Doughnut :data="chartData" :options="chartOptions"></Doughnut>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { getAllTask } from '@/apirequests/task'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  components: {
    Doughnut
  },
  data() {
    return {
      chartData: {
        labels: ['Pending', 'In Progress', 'Completed', 'To Be Visited', 'Visited', 'Cancelled'],
        datasets: [
          {
            backgroundColor: ['#FFCE56', '#36A2EB', '#4BC0C0', '#FF9F40', '#9966FF', '#FF6384'],
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
  async mounted() {
    try {
      const response = await getAllTask()
      const tasks = response.data

      const statusCounts = {
        Pending: 0,
        'In Progress': 0,
        Completed: 0,
        'To Be Visited': 0,
        Visited: 0,
        Cancelled: 0
      }

      tasks.forEach((task) => {
        if (task.status === 'Cancelled') {
          statusCounts.Cancelled++
        } else if (task.status === 'Completed') {
          statusCounts.Completed++
        } else if (task.status === 'Pending') {
          statusCounts.Pending++
        } else if (task.status === 'In Progress') {
          statusCounts['In Progress']++
        }

        if (task.isVisited) {
          statusCounts.Visited++
        } else {
          statusCounts['To Be Visited']++
        }
      })

      const dataValues = Object.values(statusCounts)
      this.chartData.datasets[0].data = dataValues
      this.dataLoaded = true
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
