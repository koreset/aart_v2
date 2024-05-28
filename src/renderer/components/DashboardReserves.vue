<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="rounded-lg" elevation="3">
          <v-card-title class="header-title accent white--text"
            >{{ variableChartTitle }} Graph</v-card-title
          >
          <v-divider class="title-divider"></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="4" class="d-inline-flex">
                <v-select
                  v-model="selectedJob"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a Valuation Run"
                  :items="runJobs"
                  item-title="run_name"
                  item-value="id"
                  return-object
                  @update:model-value="getProducts"
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="selectedProduct"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a Product"
                  :items="jobProducts"
                  item-title="product_code"
                  item-value="id"
                  @update:model-value="getReserves"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="selectedJob">
              <v-col>
                <Chart class="chart" :options="chartOptions" :updateArgs="updateArgs"></Chart>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ValuationService from '../api/ValuationService'
import ProductService from '../api/ProductService'
import { Chart } from 'highcharts-vue'
import { ref, onMounted } from 'vue'
// data
const selectedJob: any = ref(null)
const selectedProduct: any = ref(null)
const runJobs: any = ref([])
const jobProducts: any = ref([])
const updateArgs: any = ref([true, true, { duration: 1000 }])
const chartOptions: any = ref({
  credits: {
    enabled: false
  },
  chart: {
    type: 'spline'
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: [],
    title: { text: 'Projection Month' }
  },
  yAxis: {
    title: {
      text: 'Reserves'
    }
  },
  series: []
})
const variableChartTitle: any = ref('Reserves')
const recentJob: any = ref(null)

// methods
const getJobs = () => {
  ProductService.getValuationJobs().then((response) => {
    runJobs.value = response.data
  })
}

const getProducts = () => {
  jobProducts.value = []
  jobProducts.value = selectedJob.value.products
}

const getReserves = () => {
  const payload: any = {}
  payload.jobProductIds = [selectedProduct.value]
  payload.monthRange = 400
  payload.jobIds = true
  payload.variable = 'reserves'
  getRecentJob(payload)
}

const getRecentJob = (payload: any) => {
  ValuationService.getReserves(payload).then((response) => {
    recentJob.value = response.data
    const allReserves = response.data.all_aggregated_reserves

    if (allReserves != null) {
      chartOptions.value.series = []
      allReserves.forEach((reserves: any) => {
        if (reserves.aggregated_reserves != null) {
          const chartSeries: any = {}
          chartSeries.data = []
          chartOptions.value.xAxis.categories = []
          reserves.aggregated_reserves.forEach((elem: any) => {
            if (chartOptions.value.xAxis.categories.indexOf(elem.projection_month) === -1) {
              chartOptions.value.xAxis.categories.push(elem.projection_month)
            }
            chartSeries.data.push(elem.reserves)
          })
          chartSeries.name = reserves.projection_job.product_code
          chartSeries.color = '#' + Math.floor(Math.random() * 16777213).toString(16)
          chartOptions.value.series.push(chartSeries)
        }
      })
    }
  })
}

onMounted(() => {
  getJobs()
})
</script>

<style></style>
