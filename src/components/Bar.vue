<template>
  <Bar :data="chartData" :options="chartOptions" />
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default {
  data: () => ({
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
          backgroundColor: ['#35495E', '#E46651', '#00D8FF', '#DD1B16'],
          data: [40, 20, 80, 10, 60, 50, 30, 40, 30, 20, 50, 100]
        }
      ]
    },
    chartOptions: {
      responsive: true
    }
  }),
  components: {
    Bar
  }
}
</script>

<Style></Style>
