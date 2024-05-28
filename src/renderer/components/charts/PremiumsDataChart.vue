<template>
  <v-card v-if="mainChartOptions" class="rounded-lg" elevation="3">
    <v-card-title class="header-title accent white--text">{{ mainChartTitle }}</v-card-title>
    <v-divider class="title-divider"></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="3">
          <v-select
            v-model="selectedGraph"
            variant="outlined"
            density="compact"
            class="dashboard-select"
            :items="items"
            label="Choose a graph"
            @update:model-value="changeGraph"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <Chart class="chart" :options="mainChartOptions" :update-args="updateArgs" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { Chart } from 'highcharts-vue'
import { onMounted, ref } from 'vue'

const updateArgs = ref([true, true, { duration: 1000 }])
const items = ref(['Premiums', 'Premium Income Per Year', 'Claims', 'Number Of Claims'])

const selectedGraph = ref('Premiums')
const mainChartOptions: any = ref(null)
const mainChartTitle = ref('')

onMounted(() => {
  changeGraph()
})

const changeGraph = () => {
  console.log(selectedGraph)
  const premiumChartTitle = 'Business Metrics - Premium Income Per Month'
  const premiumIncomePerYearTitle = 'Business Metrics - Premium Income Per Year'
  const claimsChartTitle = 'Business Metrics - Claims Per Month'
  const claimsPerYearTitle = 'Business Metrics - Number of Claims'

  const premiumChartOptions = {
    credits: {
      enabled: false
    },
    chart: { type: 'spline' },
    title: { text: '' },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      title: { text: 'Month' }
    },
    yAxis: { title: { text: "R'm" } },
    series: [
      { name: '2019', color: '#edc356', data: [13, 7, 10, 16, 14, 7, 15, 12, 14, 15, 10, 15] },
      { name: '2018', color: '#777777', data: [20, 8, 10, 12, 9, 9, 15, 9, 12, 13, 8, 11] },
      { name: '2017', color: '#777eda', data: [14, 7, 10, 20, 10, 10, 14, 9, 12, 12, 6, 12] }
    ]
  }
  const claimsPerYearChartOptions = {
    credits: {
      enabled: false
    },
    chart: { type: 'spline' },
    title: { text: '' },
    xAxis: {
      categories: ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'],
      title: { text: 'Year' }
    },
    yAxis: { title: { text: 'Count' } },
    series: [{ name: '', color: '#edc356', data: [30, 216, 743, 768, 889, 827, 1008, 368] }]
  }

  const premiumPerYearChartOptions = {
    credits: {
      enabled: false
    },
    chart: { type: 'spline' },
    title: { text: '' },
    xAxis: {
      categories: ['2014', '2015', '2016', '2017', '2018', '2019'],
      title: { text: 'Year' }
    },
    yAxis: { title: { text: 'R (million)' } },
    series: [{ name: '', color: '#edc356', data: [132, 159, 130, 137, 137, 149] }]
  }

  const claimsChartOptions = {
    credits: {
      enabled: false
    },
    chart: { type: 'spline' },
    title: { text: '' },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
      title: { text: 'Month' }
    },
    yAxis: { title: { text: "R'm" } },
    series: [
      { name: '2019', color: '#edc356', data: [1, 2, 4, 2, 6, 2, 3, 2, 1, 6, 2, 1] },
      { name: '2018', color: '#777777', data: [3, 4, 3, 2, 1, 2, 3, 3, 1, 3, 5, 5] },
      { name: '2017', color: '#777eda', data: [4, 2, 2, 3, 4, 3, 5, 7, 4, 4, 0, 3] }
    ]
  }

  if (selectedGraph.value === 'Premiums') {
    mainChartOptions.value = premiumChartOptions
    mainChartTitle.value = premiumChartTitle
  } else if (selectedGraph.value === 'Claims') {
    mainChartOptions.value = claimsChartOptions
    mainChartTitle.value = claimsChartTitle
  } else if (selectedGraph.value === 'Premium Income Per Year') {
    mainChartOptions.value = premiumPerYearChartOptions
    mainChartTitle.value = premiumIncomePerYearTitle
  } else {
    mainChartOptions.value = claimsPerYearChartOptions
    mainChartTitle.value = claimsPerYearTitle
  }
}
</script>
<style></style>
