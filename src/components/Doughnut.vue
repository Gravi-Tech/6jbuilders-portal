<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>
<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)
export default {
  data: () => ({
    chartData: {
      labels: ['pending', 'on going', 'completed', 'to be visit'],
      datasets: [
        {
          backgroundColor: ['#00D8FF', '#E46651', '#35495E', '#DD1B16'],
          data: [40, 20, 80, 10]
        }
      ]
    },
    chartOptions: {
      responsive: true
    }
  }),
  components: {
    Doughnut
  }
}
</script>
<style></style>
